import { handle } from 'hono/vercel'

// Importar o app compilado
const app = await import('../dist/index.js').then(m => m.default)

export default handle(app)
