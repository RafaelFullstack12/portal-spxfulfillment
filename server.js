import { serve } from '@hono/node-server'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const buildPath = join(__dirname, '.build', 'app.js')

console.log('============================================')
console.log('🚀 Iniciando servidor Railway...')
console.log('============================================')
console.log('📁 Diretório:', __dirname)
console.log('📦 Build path:', buildPath)
console.log('🌍 NODE_ENV:', process.env.NODE_ENV || 'development')
console.log('🔌 PORT:', process.env.PORT || 3000)

// Verificar se build existe
if (!existsSync(buildPath)) {
  console.error('❌ ERRO FATAL: Arquivo .build/app.js não encontrado!')
  console.error('Execute: npm run build')
  process.exit(1)
}

console.log('✅ Build encontrado')

// Carregar app com tratamento de erro
let app
try {
  // Adicionar timestamp para evitar cache do Node
  const timestamp = Date.now()
  const module = await import(`${buildPath}?v=${timestamp}`)
  app = module.default
  
  if (!app || typeof app.fetch !== 'function') {
    throw new Error('App não possui método fetch válido')
  }
  
  console.log('✅ App carregado do build (.build/app.js)')
} catch (error) {
  console.error('❌ ERRO FATAL ao carregar app:', error)
  console.error('Stack:', error.stack)
  process.exit(1)
}

const port = Number(process.env.PORT || 3000)

console.log(`🚀 Iniciando servidor na porta ${port}...`)

// Iniciar servidor com tratamento de erro
try {
  serve({
    fetch: app.fetch,
    port: port,
    hostname: '0.0.0.0' // Importante para Railway/Docker
  }, (info) => {
    console.log('============================================')
    console.log(`✅ Servidor rodando com sucesso!`)
    console.log(`🌐 Porta: ${info.port}`)
    console.log(`🔗 Local: http://localhost:${info.port}`)
    console.log('============================================')
  })
} catch (error) {
  console.error('❌ ERRO FATAL ao iniciar servidor:', error)
  console.error('Stack:', error.stack)
  process.exit(1)
}

// Tratamento de sinais para shutdown gracioso
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM recebido, encerrando servidor...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT recebido, encerrando servidor...')
  process.exit(0)
})

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ ERRO NÃO CAPTURADO:', error)
  console.error('Stack:', error.stack)
  // Não fazer exit aqui para permitir que o servidor continue rodando
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ PROMISE REJEITADA NÃO TRATADA:', reason)
  console.error('Promise:', promise)
  // Não fazer exit aqui para permitir que o servidor continue rodando
})
