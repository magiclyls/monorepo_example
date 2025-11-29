<script setup>
import { BaseImage } from '@tg/bccomponents'
import { i18n } from '@tg/vue-i18n'
import { ref } from 'vue'
import BaseSkeleton from '../../components/BaseSkeleton.vue'
import { isDev, useLineData } from '../../hooks'

const { t } = i18n.global
const imgDomain = isDev() ? '/landing-page' : t('域名')
const { domains, loading, getDomainData, csUrl } = useLineData()
getDomainData()
const cssPath = ref({
  bg: `url(${imgDomain}/webp/bg-20240729.webp)`,
  bgcontent: `url(${imgDomain}/webp/bg2-20240729.webp)`,
  beiban: `url(${imgDomain}/webp/beiban.webp)`,
  sudu01: `url(${imgDomain}/webp/sudu01.webp)`,
  sudu02: `url(${imgDomain}/webp/sudu02.webp)`,
  sudu03: `url(${imgDomain}/webp/sudu03.webp)`,
  sudu04: `url(${imgDomain}/webp/sudu04.webp)`,
  sudu05: `url(${imgDomain}/webp/sudu05.webp)`,
})
function goURL(url) {
  window.open(url, '_blank')
}
function openKefu() {
  location.href = csUrl.value
}
</script>

<template>
  <div class="w-full h-full bg-main">
    <!-- header -->
    <div
      class="header w-full flex justify-start items-center shadow shadow-inner backdrop-blur-[20rem] px-[46rem] py-[18rem]"
    >
      <div class="w-[173rem] h-[44rem]">
        <BaseImage :url="`${imgDomain}/webp/logo.webp`" alt="logo" />
      </div>
    </div>
    <!-- content -->
    <div class="bg-content w-[1215rem] mt-[30rem] flex flex-col mx-auto">
      <div
        class="flex w-[918rem] h-[92rem] mx-auto item-center justify-center mt-[460rem]"
      >
        <BaseImage :url="`${imgDomain}/webp/text-no1.webp`" alt="text-no1" />
      </div>
      <!-- line -->
      <div class="flex item-center justify-center gap-[19rem] mt-[25rem]">
        <!-- lines1 -->
        <div
          v-for="(item, index) in 5"
          :key="index"
          class="w-[224rem] h-[288rem] lines flex flex-col justify-start"
          @click="goURL(domains?.[index]?.host)"
        >
          <div
            class="text-center text-white text-[22rem] flex justify-center item-center leading-[148rem] mt-[20rem]"
            :class="`items-round${Math.floor(Math.random() * 5) + 1}`"
          >
            <div
              v-if="loading"
              class="flex h-[148rem] w-[60rem] mt-[44rem] ml-[2rem]"
            >
              <BaseSkeleton
                bg="#B1BAD3"
                height="60rem"
                width="100%"
                animated="ani-opacity"
                rounded="true"
              />
            </div>
            <div v-else>
              {{ domains?.[index]?.delta.toString().slice(0, 2) }}ms
            </div>
          </div>
          <button
            class="w-[86rem] h-[34rem] leading-[28rem] font-semibold bg-slate-900 rounded-[80rem] border-2 border-slate-700 text-center text-[#b1bad3] mt-[30rem]"
          >
            {{ t("线路") }}{{ index + 1 }}
          </button>
          <div
            v-if="loading"
            class="w-[204rem] text-center text-white text-[16rem] font-semibold mt-[14rem]"
          >
            <BaseSkeleton
              bg="#B1BAD3"
              height="20rem"
              width="100%"
              animated="ani-opacity"
              rounded="false"
            />
          </div>
          <div
            v-else
            class="w-[204rem] text-center text-white text-[16rem] font-semibold mt-[14rem]"
          >
            {{ domains?.[index]?.host ?? "&nbsp;" }}
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div class="footer flex flex-col item-center gap-[10rem] justify-center">
      <div class="text-center mx-auto w-[160rem]">
        <BaseImage :url="`${imgDomain}/webp/logo-bottom.webp`" alt="logo-bottom" />
      </div>
      <div class="text-[#b1bad3] font-medium text-center mb-[20rem]">
        &copy;2024 {{ t("版权") }}
      </div>
    </div>
    <!-- 固定在右上角的浮层 -->
    <div class="floating-layer fixed top-[245rem] right-[25rem]">
      <BaseImage
        :url="`${imgDomain}/png/v03-pc-kefu.png`"
        class="w-[169rem] h-[221rem]"
        alt="kefu"
        @click="openKefu"
      />
    </div>
  </div>
</template>

<style scoped>
.bg-main {
  background-image: v-bind('cssPath.bg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.bg-content {
  background-image: v-bind('cssPath.bgcontent');
  background-repeat: no-repeat;
  background-size: revert;
  background-position: center top;
}
.header {
  background-color: rgba(26, 44, 56, 0.88);
  box-shadow:
    0 4rem 6rem -1rem rgba(0, 0, 0, 0.2),
    0 2rem 4rem -1rem rgba(0, 0, 0, 0.122);
}
.lines {
  width: 224rem;
  height: 288rem;
  justify-content: center;
  align-items: center;
  background-image: v-bind('cssPath.beiban');
  background-size: 100%;
}
.items-round1 {
  width: 148rem;
  height: 148rem;
  background-image: v-bind('cssPath.sudu01');
  background-size: 100%;
}
.items-round2 {
  width: 148rem;
  height: 148rem;
  background-image: v-bind('cssPath.sudu02');
  background-size: 100%;
}
.items-round3 {
  width: 148rem;
  height: 148rem;
  background-image: v-bind('cssPath.sudu03');
  background-size: 100%;
}
.items-round4 {
  width: 148rem;
  height: 148rem;
  background-image: v-bind('cssPath.sudu04');
  background-size: 100%;
}
.items-round5 {
  width: 148rem;
  height: 148rem;
  background-image: v-bind('cssPath.sudu05');
  background-size: 100%;
}
.footer {
  margin-top: 30rem;
}
.margin-auto {
  margin: auto;
}
</style>
