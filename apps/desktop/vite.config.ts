import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const dir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@study-notes/core': path.resolve(dir, '../../packages/core/src/index.ts'),
      '@study-notes/ai': path.resolve(dir, '../../packages/ai/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    fs: {
      // agent-rules/ va content/ (repo ildizi) raw-import uchun ruxsat
      allow: [path.resolve(dir, '../..')],
    },
  },
  build: { outDir: 'dist' },
})
