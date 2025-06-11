import { useState, useEffect } from "react";
import ProjectResult from "./components/ui/project-result";
import { getSessionCache, setSessionCache } from "./lib/utils";

function Favorites() {
  const [favorites, setFavorites] = useState<
    {
      id: string;
      name: string;
      forkCount: number;
      openIssues: number;
      watchers: number;
      username: string;
    }[]
  >(() => {
    return (
      getSessionCache<
        {
          id: string;
          name: string;
          forkCount: number;
          openIssues: number;
          watchers: number;
          username: string;
        }[]
      >("favorites") || []
    );
  });

  useEffect(() => {
    setSessionCache("favorites", favorites);
  }, [favorites]);

  type Favorite = {
    id: string;
    username: string;
    name: string;
    forkCount: number;
    openIssues: number;
    watchers: number;
  };

  const handleFavorite = (project: Favorite) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some(
        (favorite) => favorite.id === project.id
      );
      if (exists) {
        return prevFavorites.filter((favorite) => favorite.id !== project.id);
      } else {
        return [...prevFavorites, project];
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Favorites</h2>
      <ul className="space-y-4">
        {favorites.length === 0 ? (
          <li className="text-gray-500 text-lg">No favorites yet.</li>
        ) : (
          favorites.map((favorite) => (
            <ProjectResult
              key={favorite.id}
              id={+favorite.id}
              username={favorite.username}
              name={favorite.name}
              forkCount={favorite.forkCount}
              openIssues={favorite.openIssues}
              watchers={favorite.watchers}
              onSave={() => handleFavorite(favorite)}
            />
          ))
        )}
      </ul>
    </div>
  );
}

export default Favorites;
