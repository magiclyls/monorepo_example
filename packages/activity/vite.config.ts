import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import TailwindcssConfig from '@tg/tailwindcss'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import VueDevTools from 'vite-plugin-vue-devtools'
import WebfontDownload from 'vite-plugin-webfont-dl'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
          }),
        },
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
      vueJsx(),
      TailwindcssConfig.tailwindcss(),
      dts({
        entryRoot: 'core',
        outDir: 'dist/types',
        cleanVueFileName: true,
        copyDtsFiles: true,
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
      // workaround until they support native ESM
      noExternal: ['workbox-window', /vue-i18n/],
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        },
      },
    },

    build: {
      lib: {
        entry: './core/index.ts',
        name: 'SportsStake',
        fileName: 'index',
        formats: ['es'],
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  }
})
