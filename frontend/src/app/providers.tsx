import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ThemeProvider } from "@/context/ThemeContext";

/**
 * Provider order matters: theme -> auth -> content (content reads auth to decide between live and
 * built-in data). Ant Design is not here: it is scoped to the lazy admin UI (see features/admin/AntdScope).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>{children}</PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
