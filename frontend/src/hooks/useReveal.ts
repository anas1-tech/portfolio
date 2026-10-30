import { useEffect } from "react";

/**
 * Lets every `[data-reveal]` element rise in once as it scrolls into view (styles in index.css).
 * Motion is only switched on here, so without this script, or with reduced motion, content just shows.
 * Re-runs when `key` changes so content that arrives later (the live API data) is picked up too.
 */
export function useReveal(key: unknown) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("motion-on");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}
