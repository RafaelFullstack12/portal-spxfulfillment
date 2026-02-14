import { handle } from 'hono/vercel'

// Importar o app compilado
let app
try {
  app = await import('../dist/index.js').then(m => m.default)
  console.log('✅ App importado com sucesso')
} catch (error) {
  console.error('❌ Erro ao importar app:', error)
  throw error
}

export default handle(app)
