import Grainient from "@/components/ui/Grainient/Grainient";
import { useTheme } from "@/context/ThemeContext";

// Paper with faint screens of the two inks: cobalt and terracotta.
// Kept pale and close in value so the field is easy on the eyes; every stop keeps text at WCAG AA or better.
const LIGHT = ["#fafaf7", "#e9e9e5", "#dfe6f7", "#f6e3da", "#e4eaf8"];
const DARK = ["#14161c", "#171d2e", "#24191a", "#162036", "#1d1a22"];

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
