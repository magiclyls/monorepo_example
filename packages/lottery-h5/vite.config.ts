import TailwindcssConfig from '@tg/tailwindcss'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig, loadEnv } from 'vite'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import VueDevTools from 'vite-plugin-vue-devtools'
import WebfontDownload from 'vite-plugin-webfont-dl'
import { VitePluginAutoCss } from '../utils/auto-import-css'
import { VitePluginAutoImports } from '../utils/transform-import'
import packageJson from './package.json'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../') as unknown as ImportMetaEnv

  return {
    base: '/lottery/',
    plugins: [
      VitePluginAutoCss({
        projectName: 'ph-h5',
      }),
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
          }),
        },
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
      }),
      vueJsx(),
      TailwindcssConfig.tailwindcss(),
      VitePluginAutoImports({
        packages: ['@tg/icons', '@tg/bccomponents'],
      }),
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
      proxy: {
        '/api': {
          target: env.VITE_HTTP_BASEURL, // 对接a01:'https://a01.168pn.com/', 对接测试环境：env.VITE_HTTP_BASEURL
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          ws: true,
        },
      },
    },

    build: {
      sourcemap: false,
      minify: false,
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        external: /\.md$/,
        output: {
          entryFileNames: 'js/entry-[hash].js',
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
