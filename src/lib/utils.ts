import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setSessionCache(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Optionally handle storage errors
  }
}

export function getSessionCache<T = unknown>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch {
    // Optionally handle parse errors
    return null;
  }
}

export function setUserQueryCache(query: string, users: any[]) {
  const cacheRaw = getSessionCache("userQueryCache");
  const cache = Array.isArray(cacheRaw) ? cacheRaw : [];
  const filtered = cache.filter((entry: any) => entry.query !== query);
  filtered.push({ query, users });
  setSessionCache("userQueryCache", filtered);
}

export function getUserQueryCache(query: string) {
  const cacheRaw = getSessionCache("userQueryCache");
  const cache = Array.isArray(cacheRaw) ? cacheRaw : [];
  const found = cache.find((entry: any) => entry.query === query);
  return found ? found.users : null;
}

export function setUserReposCache(username: string, repos: any[]) {
  const cacheRaw = getSessionCache("userReposCache");
  const cache = Array.isArray(cacheRaw) ? cacheRaw : [];
  const filtered = cache.filter((entry: any) => entry.username !== username);
  filtered.push({ username, repos });
  setSessionCache("userReposCache", filtered);
}

export function getUserReposCache(username: string) {
  const cacheRaw = getSessionCache("userReposCache");
  const cache = Array.isArray(cacheRaw) ? cacheRaw : [];
  const found = cache.find((entry: any) => entry.username === username);
  return found ? found.repos : null;
}
