import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3002,
    host: '0.0.0.0'
  },
  plugins: [
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})
