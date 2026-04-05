/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRACK_CONTEXT_API_BASE_URL: string;
  readonly VITE_TRACK_CONTEXT_API_BEARER_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
