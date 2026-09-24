import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getErrorMessage, http, tokenStore } from "./client";

const originalAdapter = http.defaults.adapter;

const reply = (config: InternalAxiosRequestConfig, status: number, data: unknown = {}): AxiosResponse => ({
  data,
  status,
  statusText: "",
  headers: {},
  config,
});

/** Replaces the network with a function, and records every request that reaches it. */
function fakeNetwork(handler: (config: InternalAxiosRequestConfig) => AxiosResponse) {
  const seen: InternalAxiosRequestConfig[] = [];
  http.defaults.adapter = async (config) => {
    seen.push(config);
    const response = handler(config);
    if (response.status >= 400) throw new AxiosError("failed", "ERR_BAD_REQUEST", config, null, response);
    return response;
  };
  return seen;
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  http.defaults.adapter = originalAdapter;
});

describe("request interceptor", () => {
  it("adds the stored token as an Authorization header", async () => {
    tokenStore.set("abc123");
    const seen = fakeNetwork((c) => reply(c, 200));
    await http.get("/portfolio/");
    expect(seen[0]?.headers.get("Authorization")).toBe("Token abc123");
  });

  it("sends no Authorization header for visitors", async () => {
    const seen = fakeNetwork((c) => reply(c, 200));
    await http.get("/portfolio/");
    expect(seen[0]?.headers.get("Authorization")).toBeFalsy();
  });
});

describe("stale-token handling", () => {
  it("drops a rejected token and retries a GET once as a visitor", async () => {
    tokenStore.set("stale");
    const seen = fakeNetwork((c) => (c.headers.get("Authorization") ? reply(c, 401) : reply(c, 200, { ok: true })));

    const res = await http.get("/portfolio/");

    expect(res.data).toEqual({ ok: true });
    expect(seen).toHaveLength(2);
    expect(tokenStore.get()).toBeNull();
  });

  it("does not retry (or discard the token) when a write is rejected", async () => {
    tokenStore.set("abc");
    const seen = fakeNetwork((c) => reply(c, 401));

    await expect(http.post("/skills/", {})).rejects.toBeInstanceOf(AxiosError);

    expect(seen).toHaveLength(1);
    expect(tokenStore.get()).toBe("abc");
  });

  it("gives up after one retry instead of looping", async () => {
    tokenStore.set("x");
    const seen = fakeNetwork((c) => reply(c, 401));
    await expect(http.get("/portfolio/")).rejects.toBeInstanceOf(AxiosError);
    expect(seen).toHaveLength(2);
  });
});

describe("getErrorMessage", () => {
  it("flattens Django field errors into one line", () => {
    const err = new AxiosError("bad", "ERR_BAD_REQUEST", undefined, null, {
      data: { title_ar: ["This field is required."], image: ["Upload a valid image."] },
      status: 400,
      statusText: "",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });
    expect(getErrorMessage(err)).toBe("This field is required. · Upload a valid image.");
  });

  it("falls back to the error message for other failures", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
    expect(getErrorMessage("weird", "fallback")).toBe("fallback");
  });
});
