import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setSessionCache(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e: unknown) {
    // console.error('Failed to set session cache:', e);
  }
}

export function getSessionCache<T = unknown>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch (e) {
    // console.error('Failed to get session cache:', e);
    return null;
  }
}

export function setUserQueryCache(query: string, users: any[]) {
  const cache = getSessionCache("userQueryCache") || [];
  const filtered = cache.filter((entry: any) => entry.query !== query);
  filtered.push({ query, users });
  setSessionCache("userQueryCache", filtered);
}

export function getUserQueryCache(query: string) {
  const cache = getSessionCache("userQueryCache") || [];
  const found = cache.find((entry: any) => entry.query === query);
  return found ? found.users : null;
}

export function setUserReposCache(username: string, repos: any[]) {
  const cache = getSessionCache("userReposCache") || [];
  const filtered = cache.filter((entry: any) => entry.username !== username);
  filtered.push({ username, repos });
  setSessionCache("userReposCache", filtered);
}

export function getUserReposCache(username: string) {
  const cache = getSessionCache("userReposCache") || [];
  const found = cache.find((entry: any) => entry.username === username);
  return found ? found.repos : null;
}
