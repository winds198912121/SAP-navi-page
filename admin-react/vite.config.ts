import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',

  server: {
    port: 5173,
    proxy: {
      '/wp-json': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },

  build: {
    sourcemap: true,
  },
})
