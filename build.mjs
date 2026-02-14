import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: '.build/app.js',
  external: ['hono', 'googleapis', 'google-auth-library'],
  minify: false,
  sourcemap: false,
})

console.log('✅ Build concluído: .build/app.js')
