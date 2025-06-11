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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userRepos, setUserRepos] = useState<Record<string, any[]>>({});
  const [openUserIds, setOpenUserIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const favRaw = getSessionCache("favorites");
    return Array.isArray(favRaw) ? favRaw : [];
  });

  useEffect(() => {
    setSessionCache("favorites", favorites);
  }, [favorites]);

  const fetchingUsers = async (value: string) => {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
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
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      }
    );
    setUserReposCache(username, response);
    setUserRepos((prev) => ({ ...prev, [userId]: response }));
  };

  const addToFavorites = (repo: any) => {
    const payload = {
      id: repo.id,
      name: repo.name,
      forkCount: repo.forks_count,
      openIssues: repo.open_issues,
      watchers: repo.watchers,
    };
    setFavorites((prev) =>
      prev.some((fav: any) => fav.id === payload.id)
        ? prev
        : [...prev, payload]
    );
  };

  const removeFromFavorites = (repo: any) => {
    setFavorites((prev) => prev.filter((fav: any) => fav.id !== repo.id));
  };

  const isFavorite = (repoId: number) => favorites.some((fav: any) => fav.id === repoId);
  console.log(favorites);
  return (
    <>
      <div className="p-4">
        <SearchInput
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
                {(userRepos[user.id] || []).map((repo) => (
                  <ProjectResult
                    key={repo.id}
                    name={repo.name}
                    id={isFavorite(repo.id) ? repo.id : undefined}
                    forkCount={repo.forks_count}
                    openIssues={repo.open_issues}
                    watchers={repo.watchers}
                    onSave={() =>
                      isFavorite(repo.id)
                        ? removeFromFavorites(repo)
                        : addToFavorites(repo)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
