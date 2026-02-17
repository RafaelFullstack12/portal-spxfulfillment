import { serve } from '@hono/node-server'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const buildPath = join(__dirname, '.build', 'app.js')

// Verificar se build existe
if (!existsSync(buildPath)) {
  console.error('❌ Erro: Arquivo .build/app.js não encontrado!')
  console.error('Execute: npm run build')
  process.exit(1)
}

// Adicionar timestamp para evitar cache do Node
const timestamp = Date.now()
const { default: app } = await import(`${buildPath}?v=${timestamp}`)

console.log('📦 App carregado do build (.build/app.js)')

const port = process.env.PORT || 3000

console.log(`🚀 Servidor iniciando na porta ${port}...`)

serve({
  fetch: app.fetch,
  port: Number(port),
}, (info) => {
  console.log(`✅ Servidor rodando em http://localhost:${info.port}`)
})
