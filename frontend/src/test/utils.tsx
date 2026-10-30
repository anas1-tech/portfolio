import { App as AntApp, ConfigProvider } from "antd";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { AuthContext } from "@/context/AuthContext";
import { EMPTY_PORTFOLIO, PortfolioContext, type PortfolioValue } from "@/context/PortfolioContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Portfolio } from "@/types/api";

interface Options {
  portfolio?: Partial<Portfolio>;
  isAdmin?: boolean;
  editor?: PortfolioValue["editor"];
}

/** Renders a component with the theme, fake (but realistic) auth + content contexts, and antd's <App>. */
export function renderWithProviders(ui: ReactElement, { portfolio = {}, isAdmin = false, editor = null }: Options = {}) {
  const value: PortfolioValue = {
    data: { ...EMPTY_PORTFOLIO, ...portfolio },
    status: "ready",
    reload: vi.fn().mockResolvedValue(undefined),
    editor,
    openEditor: vi.fn(),
    closeEditor: vi.fn(),
  };
  const auth = { isAdmin, login: vi.fn().mockResolvedValue(undefined), logout: vi.fn().mockResolvedValue(undefined) };

  const utils = render(
    <ThemeProvider>
      <ConfigProvider>
        <AntApp>
          <AuthContext.Provider value={auth}>
            <PortfolioContext.Provider value={value}>{ui}</PortfolioContext.Provider>
          </AuthContext.Provider>
        </AntApp>
      </ConfigProvider>
    </ThemeProvider>,
  );
  return { ...utils, portfolio: value, auth };
}
