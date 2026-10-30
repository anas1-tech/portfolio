import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider, theme as antTheme } from "antd";
import arEG from "antd/locale/ar_EG";
import enUS from "antd/locale/en_US";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

/**
 * Ant Design lives only inside the admin UI. Every admin entry point wraps itself in this,
 * so visitors never download antd. Feeds it the current theme, language and text direction.
 */
export default function AntdScope({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const dark = theme === "dark";

  return (
    // `layer` puts antd's CSS-in-JS into `@layer antd` so Tailwind utilities can override it (see index.css).
    <StyleProvider layer>
      <ConfigProvider
        direction={isAr ? "rtl" : "ltr"}
        locale={isAr ? arEG : enUS}
        theme={{
          algorithm: dark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
          token: {
            colorPrimary: dark ? "#4cc79a" : "#0b6b4f",
            colorBgBase: dark ? "#12110f" : "#ffffff",
            borderRadius: 4,
            fontFamily: "inherit",
          },
        }}
      >
        <AntApp component={false}>{children}</AntApp>
      </ConfigProvider>
    </StyleProvider>
  );
}
