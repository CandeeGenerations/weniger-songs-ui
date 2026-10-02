/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_SERVER_URL: string
  readonly REACT_APP_YOUTUBE_URL: string
  readonly REACT_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
