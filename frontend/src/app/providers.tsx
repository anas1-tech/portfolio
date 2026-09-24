import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider, theme as antTheme } from "antd";
import arEG from "antd/locale/ar_EG";
import enUS from "antd/locale/en_US";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

/** Feeds the current theme, language and text direction into Ant Design. */
function AntdConfig({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const dark = theme === "dark";

  return (
    <ConfigProvider
      direction={isAr ? "rtl" : "ltr"}
      locale={isAr ? arEG : enUS}
      theme={{
        algorithm: dark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: dark ? "#8b7cff" : "#5b4bff",
          colorInfo: dark ? "#22d3ee" : "#0891b2",
          colorBgBase: dark ? "#0a0a12" : "#ffffff",
          borderRadius: 12,
          fontFamily: "inherit",
        },
      }}
    >
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}

/** Provider order matters: theme -> antd (needs theme + language) -> auth -> content. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    // `layer` puts antd's CSS-in-JS into `@layer antd` so Tailwind utilities can override it (see index.css).
    <StyleProvider layer>
      <ThemeProvider>
        <AntdConfig>
          <AuthProvider>
            <PortfolioProvider>{children}</PortfolioProvider>
          </AuthProvider>
        </AntdConfig>
      </ThemeProvider>
    </StyleProvider>
  );
}
