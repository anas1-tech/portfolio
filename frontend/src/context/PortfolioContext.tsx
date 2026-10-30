import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/api/endpoints";
import fallback from "@/content/fallback.json";
import { useAuth } from "@/context/AuthContext";
import type { EntityItem, EntityKind, Portfolio, SiteSettings } from "@/types/api";

export type LoadStatus = "loading" | "ready" | "error";
export type EditorState = { kind: EntityKind; item: EntityItem | null } | null;

export interface PortfolioValue {
  data: Portfolio;
  /** State of the live API request. The page never waits on it: built-in content shows meanwhile. */
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

/**
 * Content shipped with the build (src/content/fallback.json). Visitors see it instantly, and search
 * engines and link previews get real text even if the API is slow, asleep or down.
 * The backend can load the same file: `python manage.py import_legacy <path>`.
 */
export const FALLBACK_PORTFOLIO = fallback as Portfolio;

export const hasContent = (p: Portfolio) =>
  Boolean(p.settings.hero_title_ar || p.settings.hero_title_en) ||
  [p.experiences, p.skills, p.courses, p.projects].some((list) => list.length > 0);

/** Holds the site content, plus the "what is being edited" state used by the admin form. */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const [remote, setRemote] = useState<Portfolio | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [editor, setEditor] = useState<EditorState>(null);

  const reload = useCallback(async () => {
    try {
      setRemote(await api.portfolio());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // The admin always edits the real database, even when it is empty. Visitors get the
  // built-in content until the API has answered with something to show.
  const data = remote && (isAdmin || hasContent(remote)) ? remote : FALLBACK_PORTFOLIO;

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
