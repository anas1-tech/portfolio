import axios, { isAxiosError, type AxiosError, type InternalAxiosRequestConfig } from "axios";

const TOKEN_KEY = "token";

/** Storage can throw (private mode, blocked cookies), so every access is guarded. */
export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null): void {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore: the session just won't survive a reload */
    }
  },
};

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 15_000,
});

http.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// A stale token makes even public reads fail with 401. Drop it and retry once as a visitor.
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const isStaleTokenRead =
      error.response?.status === 401 && config && !config._retried && config.method?.toLowerCase() === "get" && tokenStore.get();
    if (isStaleTokenRead) {
      tokenStore.set(null);
      config._retried = true;
      config.headers.delete("Authorization");
      return http(config);
    }
    return Promise.reject(error);
  },
);

/** Turns any failed request into one readable line (Django field errors are flattened). */
export function getErrorMessage(error: unknown, fallback = "Request failed"): string {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (data && typeof data === "object") {
      const parts = Object.values(data as Record<string, unknown>).flat().map(String);
      if (parts.length) return parts.join(" · ");
    }
    return error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
