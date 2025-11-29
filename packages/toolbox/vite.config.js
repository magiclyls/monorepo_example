import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import runOnFileChangePlugin from './plugins/DevLangToFile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@locator/babel-jsx/dist",
            {
              env: "development",
            },
          ],
        ],
      },
    }),
    tailwindcss(),
    runOnFileChangePlugin({
      watchFile: 'lang-work/all-json.json',
      command: 'yarn',
      args: ['updateLang'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 9001, // 开发服务器端口
    proxy: {
      "/api": {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/lang-api': {
        target: 'http://localhost:3692',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/json/, ''),
      },
    }
  },
})
