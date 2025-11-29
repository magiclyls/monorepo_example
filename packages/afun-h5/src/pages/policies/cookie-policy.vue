<script setup lang="ts">
import { cookies } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { computed, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const setTitle = inject('setTitle', (v: string) => {})

const lang = getLang()

const { t } = useI18n()

const doc = computed(() => {
  return cookies[lang] ?? cookies['en-US']
})

onMounted(() => {
  setTitle(t('Cookie政策'))
})
</script>

<template>
  <main class="min-h-screen  px-4 py-6">
    <section class="mx-auto w-full max-w-[920px]">
      <!-- 卡片列表 -->
      <article>
        <section
          v-for="(sec, i) in doc.sections"
          :key="i"
          class="rounded-[4px] bg-[#233846] mb-[8px]"
        >
          <!-- 卡片标题 -->
          <h2 class="text-[14px] font-[700] text-[#fff] px-[16px] py-[8px] min-h-[52px] flex items-center">
            {{ sec.heading || doc.title }}
          </h2>

          <!-- 分割线 -->
          <div class="mt-4 mb-4 h-px bg-[#2f4553] mx-[16px]" />

          <!-- 段落内容 -->
          <div class="space-y-3">
            <p
              v-for="(p, j) in sec.paragraphs"
              :key="j"
              class="text-[#fff] text-[14px] leading-[22px] px-[16px] py-[6px]"
            >
              {{ p }}
            </p>
          </div>
          <!-- 表格（可选） -->
          <div v-if="sec.table" class="overflow-x-auto rounded-lg py-[6px] mx-[16px]">
            <table class="min-w-full text-left">
              <thead class="bg-white/5">
                <tr>
                  <th
                    v-for="(col, cIdx) in sec.table.columns"
                    :key="cIdx"
                    class="px-[4px] py-[3px] text-[14px] font-semibold text-[#fff] whitespace-nowrap"
                  >
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rIdx) in sec.table.rows"
                  :key="rIdx"
                  class="odd:bg-white/[0.04] even:bg-transparent"
                >
                  <td
                    v-for="(cell, k) in row"
                    :key="k"
                    class="px-[4px] py-[3px] align-top text-[14px] leading-[20px] text-[#b1bad3] whitespace-pre-wrap"
                  >
                    {{ cell }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </section>
  </main>
</template>
