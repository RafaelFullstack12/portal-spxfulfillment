import { serve } from '@hono/node-server'
import app from './src/index.tsx'

const port = process.env.PORT || 3000

console.log(`🚀 Servidor iniciando na porta ${port}...`)

serve({
  fetch: app.fetch,
  port: Number(port),
}, (info) => {
  console.log(`✅ Servidor rodando em http://localhost:${info.port}`)
})
