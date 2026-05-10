import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    /** ngrok / Cloudflare Tunnel 等子域会变，开发联机时允许任意 Host（勿用于不信任的公网暴露） */
    allowedHosts: true,
    /**
     * 与 `VITE_BGIO_THROUGH_VITE=true` 配合：浏览器只访问 Vite 公网地址，
     * Lobby `/games` 与 Socket.IO `/socket.io` 转发到本机 `npm run server`（默认 8000）。
     */
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/games': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})