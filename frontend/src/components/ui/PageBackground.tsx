import Grainient from "@/components/ui/Grainient/Grainient";
import { useTheme } from "@/context/ThemeContext";

// Sand, mint and apricot: the portrait's backdrop, the green accent and Makkah's evening light.
// Kept pale and close in value so the field is easy on the eyes; every stop keeps text at WCAG AA or better.
const LIGHT = ["#f3f2ef", "#f1e6d2", "#d6ece0", "#f5e0cf", "#cde8da"];
const DARK = ["#141311", "#14231d", "#241c15", "#132e25", "#2b2119"];

/**
 * A slow, softly grainy, living gradient fixed behind the whole page. It follows the pointer and swirls on click.
 * body keeps its flat --bg underneath, so the page looks right without WebGL.
 */
export default function PageBackground() {
  const { theme } = useTheme();
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Grainient
        colors={theme === "dark" ? DARK : LIGHT}
        angle={35}
        speed={0.5}
        flow={0.9}
        scale={1.2}
        silk={0.15}
        grainAmount={0.025}
        saturation={0.9}
        dpr={1}
      />
    </div>
  );
}
