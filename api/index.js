const { handle } = require('hono/vercel')
const app = require('../src/index').default

module.exports = handle(app)
