import { useEffect, useState } from "react";

/** Reveals `text` one character at a time. Restarts whenever the text changes. */
export function useTypewriter(text: string, speedMs = 55): string {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);
    if (!text) return;
    const id = setInterval(() => {
      setLength((n) => {
        if (n + 1 >= text.length) clearInterval(id);
        return n + 1;
      });
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);

  return text.slice(0, length);
}
