/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set only when the API lives on a different origin than the site. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
