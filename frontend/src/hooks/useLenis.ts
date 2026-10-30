import Lenis from "lenis";
import { useEffect } from "react";

// Matches the floating navbar's height plus its gap, so a section's title lands just below it.
const NAV_OFFSET = -96;

/**
 * Smooth, eased page scrolling with Lenis, including the in-page #section links.
 * Skipped for visitors who ask for reduced motion: they keep the browser's native scroll.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      anchors: { offset: NAV_OFFSET },
      // Let modals and other inner scroll areas (the admin forms) scroll on their own.
      prevent: (node) => node.closest(".ant-modal-wrap, [data-lenis-prevent]") !== null,
    });
    return () => lenis.destroy();
  }, []);
}
