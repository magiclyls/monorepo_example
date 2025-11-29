import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import TailwindcssConfig from '@tg/tailwindcss'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig, loadEnv } from 'vite'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueDevTools from 'vite-plugin-vue-devtools'
import WebfontDownload from 'vite-plugin-webfont-dl'
import packageJson from './package.json'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../') as unknown as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
          }),
        },
      }),

      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), '../../icons')],
        symbolId: 'icon-[name]',
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),

      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),

      chunkSplitPlugin({
        strategy: 'default',
        customSplitting: {
          // core1,
          // core2,
          // utils,
          // precompiledMqtt,
          // floatingVue,
        },
        customChunk: (args) => {
          let { file } = args

          // 确保 file 不为 null
          if (!file)
            return null

          if (file.startsWith('src/pages/')) {
            file = file.substring(4)
            file = file.replace(/\.[^.$]+$/, '')
            return file
          }
          if (file.startsWith('src/utils/'))
            return 'src-utils'

          return null
        },
      }),
      vueJsx(),
      TailwindcssConfig.tailwindcss(),
    ],

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi'],
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window', /vue-i18n/],
    },

    server: {
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_HTTP_BASEURL, // 对接a01:'https://a01.uat.today', 对接测试环境：env.VITE_HTTP_BASEURL
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          ws: true,
        },
      },
    },

    build: {
      minify: 'terser',
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        external: /\.md$/,
        output: {
          entryFileNames: 'js/entry-[hash].js',
          chunkFileNames(chunkInfo) {
            const name = chunkInfo.name?.toLowerCase()
            const version = packageJson.version
            if (name.includes('src-utils'))
              return `assets/[name]-[hash]-${version}.js`

            return `js/chunk-[hash]-${version}.js`
          },
          assetFileNames(chunkInfo) {
            const version = packageJson.version

            if (chunkInfo.name?.endsWith('.css'))
              return `css/[hash]-${version}.css`

            const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
            if (imageExtensions.some(ext => chunkInfo.name?.endsWith(ext)))
              return `images/[hash]-${version}.[ext]`

            return `assets/[hash]-${version}.[ext]`
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: `${env.VITE_DROP_CONSOLE}` === 'true',
        },
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        },
      },
    },

    envDir: '../../',

    publicDir: '../../public',
  }
})
