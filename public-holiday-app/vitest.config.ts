import { fileURLToPath } from 'node:url'
import { mergeConfig, type UserConfig } from 'vite'
import { defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

const baseConfig =
  typeof viteConfig === 'function'
    ? viteConfig({ mode: 'test', command: 'serve' })
    : viteConfig

export default mergeConfig(
  baseConfig as UserConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
