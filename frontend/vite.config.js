import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 8086,
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true
      },
      '/h2-console': {
        target: 'http://localhost:8085',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    sourcemap: false
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
