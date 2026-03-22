import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const lambdaTarget = 'https://obeo6mf6wgez53kqen5bcjfyou0pfmem.lambda-url.eu-north-1.on.aws/'

export default defineConfig(({ command }) => ({
  base: command === 'build' && process.env.VITE_BUILD_TARGET !== 'docker' ? '/PublicHoliday/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/holiday': {
        target: lambdaTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/holiday/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
            proxyReq.removeHeader('referer')
          })
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
}))