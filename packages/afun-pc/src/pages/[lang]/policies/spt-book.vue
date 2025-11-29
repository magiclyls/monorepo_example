<!-- TermsPage.vue -->
<template>
  <main class="min-h-screen p-[16px]">
    <section class="mx-auto max-w-[920px] px-6 py-10 lg:px-10">
      <!-- 标题 -->
      <h1 class="text-[24px] font-semibold text-[#fff]">
        {{ doc.title }}
      </h1>

      <!-- 目录（超链接） -->
      <nav class="toc mt-8 mb-12">
        <ul class="space-y-2">
          <li v-for="(sec, i) in doc.sections" :key="i">
            <a
              :href="'#' + slugify(sec.heading)"
              class="text-[#b1bad3] hover:text-[#fff] text-[16px] my-[4px] inline-block"
            >
              • {{ sec.heading }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- 分节 -->
      <article class="space-y-10">
        <section
          v-for="(sec, i) in doc.sections"
          :key="i"
          class="terms-section"
        >
          <!-- 分节标题（粗体、字号对标设计稿） -->
          <h2
            :id="slugify(sec.heading)"
            class="text-[16px] font-semibold mb-[8px] mt-[32px] text-[#fff]"
          >
            {{ sec.heading }}
          </h2>

          <!-- 副标题（可选） -->
          <p v-if="sec.subtitle" class="text-[#b1bad3] text-[15px] leading-[21px] mb-2">
            {{ sec.subtitle }}
          </p>

          <!-- 段落列表 -->
          <ol class="terms-ol space-y-3">
            <li
              v-for="(p, j) in sec.paragraphs"
              :key="j"
              class="text-[#b1bad3] text-[16px] leading-[21px] mt-[12px] font-normal"
            >
              {{ p }}
            </li>
          </ol>
        </section>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLang } from '@tg/vue-i18n';

const lang = getLang()

const doc = computed(() => {
  return sportsBook[lang] ?? sportsBook['en-US']
})

// 简单 slugify 函数，用于生成锚点 ID
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
}
</script>