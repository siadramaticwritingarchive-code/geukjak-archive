import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react';
          }

          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }

          if (
            id.includes('node_modules/react-hook-form')
            || id.includes('node_modules/@hookform')
            || id.includes('node_modules/zod')
          ) {
            return 'forms';
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }

          return undefined;
        }
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SIA Playwriting Archive',
        short_name: 'SIA Archive',
        description:
          'A premium theatre archive for the Department of Playwriting at Seoul Institute of the Arts.',
        theme_color: '#0b0b0b',
        background_color: '#f7f1e8',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ]
});
