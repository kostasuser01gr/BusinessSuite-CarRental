import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    root: path.resolve(__dirname),
    include: ['test/**/*.{test,spec}.ts', 'client/src/**/*.{test,spec}.tsx'],
    environment: 'node',
    globals: true
  }
})
