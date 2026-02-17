import { serve } from '@hono/node-server'

// Carregar app do build se existir, senão carregar fonte
let app
try {
  // Tentar carregar do build primeiro (produção)
  app = (await import('./.build/app.js')).default
  console.log('📦 Carregando app do build (.build/app.js)')
} catch (error) {
  // Fallback para desenvolvimento (tsx)
  app = (await import('./src/index.tsx')).default
  console.log('🔧 Carregando app da fonte (src/index.tsx)')
}

const port = process.env.PORT || 3000

console.log(`🚀 Servidor iniciando na porta ${port}...`)

serve({
  fetch: app.fetch,
  port: Number(port),
}, (info) => {
  console.log(`✅ Servidor rodando em http://localhost:${info.port}`)
})
