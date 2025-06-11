import "./App.css";
import { useState, useEffect } from "react";
import SearchInput from "@/components/ui/search-input";
import SearchResult from "./components/ui/search-result";
import { apiFetch } from "./lib/api";
import {
  getSessionCache,
  getUserQueryCache,
  getUserReposCache,
  setSessionCache,
  setUserQueryCache,
  setUserReposCache,
} from "./lib/utils";
import ProjectResult from "./components/ui/project-result";
import type { GithubRateLimit, GithubRepo, GithubUser } from "./types";

function App() {
  const env = process.env.GITHUB_TOKEN;

  const [totalResults, setTotalResults] = useState(() => {
    const cachedTotal = getSessionCache("totalResults");
    return typeof cachedTotal === "number" ? cachedTotal : 0;
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    const cachedQuery = getSessionCache("lastSearchQuery");
    return typeof cachedQuery === "string" ? cachedQuery : "";
  });

  const [searchResults, setSearchResults] = useState<any[]>(
    () => getSessionCache("lastSearchResults") || []
  );

  const [userRepos, setUserRepos] = useState<Record<string, any[]>>(() => {
    const cachedRepos = getSessionCache("userRepos");
    if (
      cachedRepos &&
      typeof cachedRepos === "object" &&
      !Array.isArray(cachedRepos)
    ) {
      return cachedRepos as Record<string, any[]>;
    }
    return {} as Record<string, any[]>;
  });

  const [openUserIds, setOpenUserIds] = useState<string[]>(() => {
    const cachedUserIds = getSessionCache("openUserIds");
    return Array.isArray(cachedUserIds) ? cachedUserIds : [];
  });

  const [isLoadingRepos, setIsLoadingRepos] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const favRaw = getSessionCache("favorites");
    return Array.isArray(favRaw) ? favRaw : [];
  });

  const [visibleCount, setVisibleCount] = useState(() => {
    const cachedVisibleCount = getSessionCache("visibleCount");
    return typeof cachedVisibleCount === "number" ? cachedVisibleCount : 5;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const cachedCurrentPage = getSessionCache("currentPage");
    return typeof cachedCurrentPage === "number" ? cachedCurrentPage : 1;
  });

  const [rateLimit, setRateLimit] = useState({
    isSearchLimit: false,
    isRepoLimit: false,
  });

  const perPage = 100;

  useEffect(() => {
    setSessionCache("favorites", favorites);
  }, [favorites]);

  useEffect(() => {
    setSessionCache("lastSearchQuery", searchQuery);
    setSessionCache("lastSearchResults", searchResults);
    setSessionCache("openUserIds", openUserIds);
    setSessionCache("userRepos", userRepos);
    setSessionCache("totalResults", totalResults);
    setSessionCache("currentPage", currentPage);
    setSessionCache("visibleCount", visibleCount);
    setSessionCache("perPage", perPage);
  }, [
    searchQuery,
    searchResults,
    openUserIds,
    userRepos,
    totalResults,
    currentPage,
    visibleCount,
    perPage,
  ]);

  const apiRateLimit = async () => {
    const response = await apiFetch(`https://api.github.com/rate_limit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return response;
  };

  const apiFetchingUser = async (value: string) => {
    const response = await apiFetch(
      `https://api.github.com/search/users?${value}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return response;
  };

  const fetchingUsers = async (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    const cached = getUserQueryCache(value);
    if (cached) {
      setSearchResults(cached);
      setVisibleCount(5);
      return;
    }

    const params = new URLSearchParams({
      page: "1",
      per_page: perPage.toString(),
      q: value,
    });

    const response = await apiFetchingUser(params.toString());
    const rateLimit = await apiRateLimit();
    if (rateLimit.resources.search.used >= rateLimit.resources.search.limit) {
      setRateLimit((prev) => ({
        ...prev,
        isSearchLimit: true,
      }));
    } else {
      setRateLimit((prev) => ({
        ...prev,
        isSearchLimit: false,
      }));
    }
    setTotalResults(response.total_count);
    setSessionCache("totalResults", response.total_count);
    setUserQueryCache(value, response.items);
    setSearchResults(response.items);
    setVisibleCount(5);
  };

  const loadNextPage = async () => {
    const nextPage = currentPage + 1;
    const params = new URLSearchParams({
      page: nextPage.toString(),
      per_page: perPage.toString(),
      q: searchQuery,
    });
    const response = await apiFetchingUser(params.toString());
    setSearchResults((prev) => [...prev, ...response.items]);
    setCurrentPage(nextPage);
  };

  const fetchDetailRepos = async (username: string, userId: string) => {
    setOpenUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );

    if (userRepos[userId]) return;

    setIsLoadingRepos(userId);

    try {
      const cached = getUserReposCache(username);
      if (cached) {
        setUserRepos((prev) => ({ ...prev, [userId]: cached }));
        return;
      }

      const response = await apiFetch<GithubRepo[]>(
        `https://api.github.com/users/${username}/repos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${env}`,
          },
        }
      );
      const rateLimit: GithubRateLimit = await apiRateLimit();
      if (rateLimit.rate.used >= rateLimit.rate.limit) {
        setRateLimit((prev) => ({
          ...prev,
          isRepoLimit: true,
        }));
      } else {
        setRateLimit((prev) => ({
          ...prev,
          isRepoLimit: false,
        }));
        setIsLoadingRepos(null);
      }
      setUserReposCache(username, response);
      setUserRepos((prev) => ({ ...prev, [userId]: response }));
    } finally {
      setIsLoadingRepos(null);
    }
  };

  const addToFavorites = (repo: {
    id: number;
    username: string;
    name: string;
    forkCount: number;
    openIssues: number;
    watchers: number;
  }) => {
    const payload = {
      id: repo.id,
      username: repo.username,
      name: repo.name,
      forkCount: repo.forkCount,
      openIssues: repo.openIssues,
      watchers: repo.watchers,
    };
    setFavorites((prev) =>
      prev.some((fav: any) => fav.id === payload.id) ? prev : [...prev, payload]
    );
  };

  const removeFromFavorites = (repo: any) => {
    setFavorites((prev) => prev.filter((fav: any) => fav.id !== repo.id));
  };

  const isFavorite = (repoId: number) =>
    favorites.some((fav: any) => fav.id === repoId);

  const handleLoadMore = async () => {
    if (visibleCount < totalResults) {
      if (visibleCount + 5 <= searchResults.length) {
        setVisibleCount((prev) => Math.min(prev + 5, totalResults));
      } else if (searchResults.length < totalResults) {
        await loadNextPage();
        setVisibleCount((prev) => Math.min(prev + 5, totalResults));
      }
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    }
  };

  return (
    <>
      <div className="p-4">
        <SearchInput
          valueSearch={searchQuery}
          onChange={setSearchQuery}
          onSubmit={fetchingUsers}
          placeholder="Search the username..."
          disabled={rateLimit.isSearchLimit}
        />
      </div>

      {rateLimit.isSearchLimit && (
        <div className="text-center text-red-600 font-semibold mb-4">
          <p>
            You have reached the maximum number of requests. Please try again
            later.
          </p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="text-center text-gray-500 mb-4">
          {totalResults} results found
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {searchResults?.slice(0, visibleCount).map((user: GithubUser) => (
          <div className="relative" key={user.id}>
            <SearchResult
              key={user.id}
              name={user.login}
              role={user.type}
              imageUrl={user.avatar_url}
              onClick={(name) => fetchDetailRepos(name, user.id.toString())}
            />
            {openUserIds.includes(user.id.toString()) && (
              <div className="max-h-[500px] overflow-y-auto">
                {rateLimit.isRepoLimit ? (
                  <div className="text-center text-red-600 font-semibold mb-4">
                    <p>
                      You have reached the maximum number of requests. Please
                      try again later.
                    </p>
                  </div>
                ) : isLoadingRepos === user.id.toString() ? (
                  <div className="flex justify-center items-center p-4">
                    <svg
                      className="animate-spin h-6 w-6 text-gray-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span className="text-gray-500">Fetching Repositories</span>
                  </div>
                ) : (userRepos[user.id] || []).length === 0 ? (
                  <div className="text-gray-500 p-4">
                    There is no repository on this user
                  </div>
                ) : (
                  (userRepos[user.id] || []).map((repo: GithubRepo) => (
                    <ProjectResult
                      key={repo.id}
                      name={repo.name}
                      id={isFavorite(repo.id) ? repo.id : undefined}
                      forkCount={repo.forks_count}
                      openIssues={repo.open_issues}
                      watchers={repo.watchers}
                      onSave={() => {
                        const payload = {
                          id: repo.id,
                          username: user.login,
                          name: repo.name,
                          forkCount: repo.forks_count,
                          openIssues: repo.open_issues,
                          watchers: repo.watchers,
                        };
                        return isFavorite(repo.id)
                          ? removeFromFavorites(payload)
                          : addToFavorites(payload);
                      }}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {visibleCount < totalResults && (
        <div className="fixed left-1/2 transform -translate-x-1/2 z-50 flex justify-center bottom-20 md:bottom-8">
          <span
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 text-black font-semibold rounded-full shadow-lg transition-all duration-200 active:scale-95 select-none bg-white"
            onClick={handleLoadMore}
            tabIndex={0}
            role="button"
          >
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Load More
          </span>
        </div>
      )}
    </>
  );
}

export default App;
