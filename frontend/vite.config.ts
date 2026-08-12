// agent-notes: { ctx: "Vite configuration with WSL/Docker host polling support", deps: ["@vitejs/plugin-react"], state: active, last: "antigravity@2026-08-12" }
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const usePolling = env.VITE_USE_POLLING !== 'false' && env.CHOKIDAR_USEPOLLING !== 'false'
  const pollingInterval = Number(env.VITE_POLL_INTERVAL || env.CHOKIDAR_INTERVAL) || 1000

  return {
    plugins: [react()],
    server: {
      host: env.VITE_HOST || '0.0.0.0',
      port: Number(env.VITE_PORT) || 5173,
      watch: {
        usePolling,
        interval: pollingInterval,
      },
      hmr: {
        overlay: true,
      },
    },
  }
})
