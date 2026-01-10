import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
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
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]'
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/ui/test/setupTests.js'
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
