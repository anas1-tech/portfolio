import Grainient from "@/components/ui/Grainient/Grainient";
import { useTheme } from "@/context/ThemeContext";

// Sand, mint and apricot: the portrait's backdrop, the green accent and Makkah's evening light.
// Every stop keeps body, muted and accent text at WCAG AA or better.
const LIGHT = ["#f3f2ef", "#f2dfbf", "#c4e8d4", "#f7d3b6", "#b3e3cb"];
const DARK = ["#12110f", "#10291f", "#2b1d12", "#0d3a2b", "#3a2414"];

/**
 * A slow, grainy, living gradient fixed behind the whole page. It follows the pointer and swirls on click.
 * body keeps its flat --bg underneath, so the page looks right without WebGL.
 */
export default function PageBackground() {
  const { theme } = useTheme();
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Grainient
        colors={theme === "dark" ? DARK : LIGHT}
        angle={35}
        speed={0.9}
        flow={1.1}
        scale={1.2}
        silk={0.25}
        grainAmount={0.05}
        saturation={1.15}
        dpr={1}
      />
    </div>
  );
}
