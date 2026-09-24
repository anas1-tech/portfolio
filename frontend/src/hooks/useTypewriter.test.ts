import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTypewriter } from "./useTypewriter";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useTypewriter", () => {
  it("reveals the text one character at a time", () => {
    const { result } = renderHook(() => useTypewriter("Hello", 50));
    expect(result.current).toBe("");

    act(() => void vi.advanceTimersByTime(100));
    expect(result.current).toBe("He");

    act(() => void vi.advanceTimersByTime(500));
    expect(result.current).toBe("Hello");
  });

  it("restarts when the text changes", () => {
    const { result, rerender } = renderHook(({ text }) => useTypewriter(text, 50), { initialProps: { text: "Hello" } });
    act(() => void vi.advanceTimersByTime(500));
    expect(result.current).toBe("Hello");

    rerender({ text: "Bye" });
    expect(result.current).toBe("");
    act(() => void vi.advanceTimersByTime(500));
    expect(result.current).toBe("Bye");
  });

  it("stays empty for empty text", () => {
    const { result } = renderHook(() => useTypewriter(""));
    act(() => void vi.advanceTimersByTime(1000));
    expect(result.current).toBe("");
  });
});
