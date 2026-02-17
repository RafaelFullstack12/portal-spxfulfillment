import { build } from 'esbuild'
import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/index.js',
  external: ['hono', '@hono/*', 'googleapis', 'google-auth-library'],
  minify: false,
  sourcemap: false,
})

// Copiar pasta public para dist/public
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

copyDir('public', 'dist/public')

// Criar package.json para dist
writeFileSync('dist/package.json', JSON.stringify({
  type: 'module',
  dependencies: {
    '@hono/node-server': '^1.19.9',
    'google-auth-library': '^10.5.0',
    'googleapis': '^171.4.0',
    'hono': '^4.11.9'
  }
}, null, 2))

console.log('✅ Build concluído: dist/index.js')
