import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/api/endpoints";
import type { EntityItem, EntityKind, Portfolio, SiteSettings } from "@/types/api";

export type LoadStatus = "loading" | "ready" | "error";
export type EditorState = { kind: EntityKind; item: EntityItem | null } | null;

export interface PortfolioValue {
  data: Portfolio;
  status: LoadStatus;
  reload: () => Promise<void>;
  /** Which item the admin form is editing (null = form closed). */
  editor: EditorState;
  openEditor: (kind: EntityKind, item?: EntityItem | null) => void;
  closeEditor: () => void;
}

export const PortfolioContext = createContext<PortfolioValue | null>(null);

const EMPTY_SETTINGS: SiteSettings = {
  hero_title_ar: "", hero_title_en: "", hero_subtitle_ar: "", hero_subtitle_en: "",
  about_text_ar: "", about_text_en: "", address_ar: "", address_en: "",
  email: "", whatsapp: "", twitter: "", linkedin: "", github: "",
};

export const EMPTY_PORTFOLIO: Portfolio = { settings: EMPTY_SETTINGS, experiences: [], skills: [], courses: [], projects: [] };

/** Holds the site content, plus the "what is being edited" state used by the admin form. */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Portfolio>(EMPTY_PORTFOLIO);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [editor, setEditor] = useState<EditorState>(null);

  const reload = useCallback(async () => {
    try {
      setData(await api.portfolio());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo<PortfolioValue>(
    () => ({
      data,
      status,
      reload,
      editor,
      openEditor: (kind, item = null) => setEditor({ kind, item }),
      closeEditor: () => setEditor(null),
    }),
    [data, status, reload, editor],
  );
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): PortfolioValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return ctx;
}
