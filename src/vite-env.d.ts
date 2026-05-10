/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BGIO_SERVER?: string;
  /** 为 true 时，Lobby 与 Socket 走当前页 Origin，由 Vite 代理到本机 boardgame.io（单条内网穿透即可联机） */
  readonly VITE_BGIO_THROUGH_VITE?: string;
  readonly VITE_PUBLIC_APP_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
