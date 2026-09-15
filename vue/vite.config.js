import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['.up.railway.app'],
    proxy: {
      '/api': {
        target: 'https://dokonb.up.railway.app',
        changeOrigin: true,
      },
      '/media': {
        target: 'https://dokonb.up.railway.app',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: ['.up.railway.app'],
  },
})
