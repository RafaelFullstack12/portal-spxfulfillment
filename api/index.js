import { handle } from 'hono/vercel'

// Importar dinamicamente o app
const app = await import('../src/index.tsx').then(m => m.default)

export default handle(app)
