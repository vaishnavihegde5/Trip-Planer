import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'static-page-entries',
      enforce: 'post',
      generateBundle(_, bundle) {
        const entry = bundle['index.html']
        for (const page of ['login', 'plan', 'itinerary', 'dashboard']) {
          this.emitFile({ type: 'asset', fileName: page + '/index.html', source: entry.source })
        }
      },
    },
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
