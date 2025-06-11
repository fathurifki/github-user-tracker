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

function App() {
  const env = process.env.GITHUB_TOKEN;

  const [searchQuery, setSearchQuery] = useState(() => {
    const cached = getSessionCache("lastSearchQuery");
    return typeof cached === "string" ? cached : "";
  });
  const [searchResults, setSearchResults] = useState<any[]>(
    () => getSessionCache("lastSearchResults") || []
  );
  const [userRepos, setUserRepos] = useState<Record<string, any[]>>({});
  const [openUserIds, setOpenUserIds] = useState<string[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const favRaw = getSessionCache("favorites");
    return Array.isArray(favRaw) ? favRaw : [];
  });

  useEffect(() => {
    setSessionCache("favorites", favorites);
  }, [favorites]);

  useEffect(() => {
    setSessionCache("lastSearchQuery", searchQuery);
    setSessionCache("lastSearchResults", searchResults);
  }, [searchQuery, searchResults]);

  const fetchingUsers = async (value: string) => {
    setSearchQuery(value);
    const cached = getUserQueryCache(value);
    if (cached) {
      setSearchResults(cached);
      return;
    }

    const params = new URLSearchParams({
      page: "1",
      per_page: "42",
      q: value,
    });

    const response = await apiFetch(
      `https://api.github.com/search/users?${params.toString()}`,
      {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${env}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    setUserQueryCache(value, response.items);
    setSearchResults(response.items);
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

      const response = await apiFetch(
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
      setUserReposCache(username, response);
      setUserRepos((prev) => ({ ...prev, [userId]: response }));
    } finally {
      setIsLoadingRepos(null);
    }
  };

  const addToFavorites = (repo: any) => {
    const payload = {
      id: repo.id,
      username: repo.username,
      name: repo.name,
      forkCount: repo.forks_count,
      openIssues: repo.open_issues,
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

  return (
    <>
      <div className="p-4">
        <SearchInput
          valueSearch={searchQuery}
          onChange={setSearchQuery}
          onSubmit={fetchingUsers}
          placeholder="Search the username..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {searchResults?.map((user) => (
          <div className="relative" key={user.id}>
            <SearchResult
              key={user.id}
              name={user.login}
              role={user.type}
              imageUrl={user.avatar_url}
              onClick={(name) => fetchDetailRepos(name, user.id)}
            />
            {openUserIds.includes(user.id) && (
              <div className="max-h-[500px] overflow-y-auto">
                {isLoadingRepos === user.id ? (
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
                  (userRepos[user.id] || []).map((repo) => (
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
    </>
  );
}

export default App;
