import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3002,
    host: '0.0.0.0'
  },
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ],
  build: {
    minify: 'esbuild',
    sourcemap: false,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        compact: true
      },
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false
      }
    }
  },
  optimizeDeps: {
    exclude: ['googleapis']
  }
})
