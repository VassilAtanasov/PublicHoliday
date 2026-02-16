import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isCapacitor = mode === 'capacitor'
  const base = isCapacitor ? './' : '/PublicHoliday/'
  const pwaBase = isCapacitor ? '' : '/PublicHoliday/'

  return {
    base,
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Public Holiday',
          short_name: 'PublicHoliday',
          description: 'Public Holiday App - Display current public holidays',
          theme_color: '#1a365d',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: isCapacitor ? './' : '/PublicHoliday/',
          icons: [
            {
              src: `${pwaBase}icon-192x192.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: `${pwaBase}icon-512x512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          categories: ['finance', 'productivity', 'business']
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
