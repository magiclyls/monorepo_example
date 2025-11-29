<script setup lang="ts">
import { antiMoneyLaundering } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { computed, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const setTitle = inject('setTitle', (v: string) => {})

const lang = getLang()

const { t } = useI18n()

const doc = computed(() => {
  return antiMoneyLaundering[lang] ?? antiMoneyLaundering['en-US']
})

onMounted(() => {
  setTitle(t('反洗钱'))
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
            {{ sec.heading }}
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
        </section>
      </article>
    </section>
  </main>
</template>
