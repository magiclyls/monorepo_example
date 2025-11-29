<script setup>
import { BaseImage } from '@tg/bccomponents'
import { i18n } from '@tg/vue-i18n'
import { computed, ref } from 'vue'
import BaseSkeleton from '../../components/BaseSkeleton.vue'
import { downApp, isDev, useLineData } from '../../hooks'

const { t } = i18n.global
const imgDomain = isDev() ? '/landing-page' : t('域名')
const isModalOpen = ref(false)
const { domains, loading, getDomainData, csUrl } = useLineData()
getDomainData()
const renderDomains = computed(() => domains.value?.slice(0, 4))
const cutArr = ['APE', 'BCH', 'BNB', 'BNB-1', 'BTC', 'BUSD', 'CRO', 'DAI', 'DOGE', 'EOS', 'ETH', 'LINK', 'LTC', 'MATIC', 'SAND', 'SHIB', 'TRX', 'USDC', 'USDT', 'XRP', 'UNI']

function goURL(url) {
  const urlParams = new URLSearchParams(window.location.search)
  const c = urlParams.get('c')?.replace(/\//g, '')
  const newUrl = c ? `${url}/?c=${c}` : url
  window.open(newUrl, '_blank')
}
function getHost(url) {
  return `${url.split(':')[0]}:${url.split(':')[1]}`
}
function getPath(path) {
  return new URL(path, import.meta.url).href
}
function openKefu() {
  location.href = csUrl.value
}

function openModal() {
  isModalOpen.value = true
}
function closeModal() {
  isModalOpen.value = false
}
function onDownApp() {
  const status = downApp()
  if (status === false)
    openModal()
}
</script>

<template>
  <main class="bg-[#223139] flex flex-col">
    <header
      class="relative z-50 h-[60rem] flex items-center justify-between pl-[16rem] pr-[16rem]" style=" border-bottom:1px solid rgba(255, 255, 255, 0.1) ;
      box-shadow:0 4px 5px 0 rgba(0, 0, 0, .24), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 3px 6px 0px rgb(0 0 0 / 90%);"
    >
      <div class="relative top-[4rem] flex items-center">
        <BaseImage class="h-[36rem]" :url="`${imgDomain}/png/top-logo.png`" alt="" />
      </div>
      <div class="relative top-[2rem] flex items-center" @click="onDownApp">
        <BaseImage class="h-[24rem]" :url="`${imgDomain}/png/app.png`" alt="" />
      </div>
    </header>
    <section
      class="relative flex flex-col items-center justify-center flex-1 mb-[20rem] bg-no-repeat"
      :style="{ backgroundImage: `url(${getPath(`${imgDomain}/png/x02-h5-bg.png`)})` }"
    >
      <BaseImage class="w-full absolute top-[0] left-[0rem]" :url="`${imgDomain}/webp/banner2.webp`" alt="" />
      <div class="w-[353rem] h-[23.33rem] flex justify-center relative z-[10]">
        <BaseImage class="w-[353rem]" :url="`${imgDomain}/png/bg2.png`" alt="" />
      </div>
      <div
        class=" relative z-[10] bg-contain bg-[#2d3941] w-[353rem]  bg-no-repeat pt-[10rem] rounded-bl-[10rem] rounded-br-[10rem]"
        style=" background-image: linear-gradient(181deg, #3A454B -30.09%, #021C2B 112.45%);"
      >
        <div
          class="min-h-[298rem] bg-contain  bg-no-repeat"
          :style="{ backgroundImage: `url(${getPath(`${imgDomain}/png/bg2-2.png`)})` }"
          style="background-position: 0 bottom;"
        >
          <div class="w-full flex items-center justify-center mb-[2rem]">
            <BaseImage class="w-[18rem]" :url="`${imgDomain}/svg/san.svg`" alt="" />
            <span class="text-white text-[16rem] font-semibold mr-[17rem] ml-[17rem]">
              {{ t('优质网址线路列表推荐') }}
            </span>
            <BaseImage class="w-[18rem]" :url="`${imgDomain}/svg/san-2.svg`" alt="" />
          </div>
          <div class="text-white text-[12rem] text-center w-full mb-[18rem] opacity-80">
            {{ t('线路值') }}
          </div>
          <template v-if="loading">
            <div v-for="item, index in 4" :key="index" class="flex justify-between items-center pb-[16rem] pl-[14rem] pr-[14rem]">
              <div
                class="bg-no-repear bg-cover w-[235rem] h-[43rem] flex items-center"
                :style="{ backgroundImage: `url(${getPath(`${imgDomain}/png/border2.png`)})` }"
              >
                <div class="text-center text-[14rem] font-medium w-[54rem]">
                  <BaseSkeleton bg="#CBCCD0" height="18rem" width="18rem" animated="ani-opacity" br="2px" />
                </div>
                <div class="flex-1 text-white text-[13rem] font-medium pl-[0rem]">
                  <BaseSkeleton bg="#CBCCD0" height="12rem" width="160rem" animated="ani-opacity" br="2px" />
                </div>
              </div>
              <div class="btn-enter">
                {{ t('进入游戏') }}
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item, index in renderDomains"
              :key="index"
              class="flex justify-between items-center pb-[16rem] pl-[14rem] pr-[14rem]"
            >
              <div
                class="bg-no-repear bg-cover w-[235rem] h-[43rem] flex items-center"
                :style="{ backgroundImage: `url(${getPath(`${imgDomain}/png/x02-h5-border.png`)})` }"
              >
                <span class="text-fill-transparent1 text-center text-[14rem] font-medium w-[54rem]">
                  {{ item.delta.toString().slice(0, 2) }}ms
                </span>
                <span class="flex-1 text-white text-[13rem] font-medium pl-[0rem] text-center">
                  {{ getHost(item.host) }}</span>
              </div>
              <div class="btn-enter" @click="goURL(item.host)">
                {{ t('进入游戏') }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
    <div class="text-center text-white text-[16rem] font-semibold mt-[24rem] mb-[12rem]">
      {{ t('支持币种') }}
    </div>
    <div class="h5-footer-support">
      <BaseImage v-for="item in cutArr" :key="item" class="w-[34rem]" :url="getPath(`${imgDomain}/png/${item}.png`)" />
    </div>
    <!-- footer -->
    <div class="footer flex flex-col item-center justify-center pb-[30rem]">
      <div class="flex items-center w-full justify-center mb-[16rem]">
        <BaseImage class="h-[20rem] mr-[2rem]" :url="`${imgDomain}/svg/logo.svg`" alt="" />
        <BaseImage class="h-[20rem]" :url="`${imgDomain}/svg/title.svg`" alt="" />
      </div>
      <div class="text-[#B1BAD3] text-center text-[13rem]">
        <p>&copy; 2024 {{ t('新葡京') }} | {{ t('版权所有') }}</p>
      </div>
    </div>
    <div class="fixed right-[2rem] top-[310rem] w-[75rem] z-50">
      <BaseImage
        :url="`${imgDomain}/png/kefu2.png`"
        @click="openKefu"
      />
    </div>
  </main>
  <!-- 模态框 -->
  <div
    v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
    style="z-index: 9999;"
  >
    <div class="bg-[#1A2C38] p-[16rem] w-[311rem] flex flex-col items-center justify-center rounded-[4rem] shadow-[4rem]">
      <div class="w-full flex flex-row justify-between items-center">
        <div class="flex flex-row justify-start items-center gap-[8rem]">
          <div>
            <BaseImage :url="`${imgDomain}/svg/tishi-icon.svg`" width="18rem" />
          </div>
          <div class="text-[18rem] font-semibold text-white">
            {{ t("温馨提示") }}
          </div>
        </div>
        <div>
          <BaseImage :url="`${imgDomain}/svg/close-icon.svg`" width="12rem" @click="closeModal" />
        </div>
      </div>
      <h2 class="text-[16rem] font-bold my-[16rem] text-center text-[#B1BAD3]">
        {{ t("暂无下载") }}
      </h2>
    </div>
  </div>
</template>

<style scoped>
.text-fill-transparent1 {
  background-image: linear-gradient(130deg, #ffb800 7.04%, #ff0b0b 101.62%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-enter {
  font-size: 14rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(112.7deg, #e23535 14.75%, #e50d0d 85.25%);
  width: 72rem;
  height: 39rem;
  border-radius: 2rem;
  color: #fff;
  box-shadow:
    0px -4px 6.2rem 0px rgba(210, 0, 0, 0.48) inset,
    0px 4px 7.8rem 0px rgba(255, 253, 253, 0.52) inset;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    height: 1.2rem;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    box-shadow: 0 0 10rem rgba(255, 223, 88, 0.5);
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 1.2rem;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    box-shadow: 0 0 10rem rgba(255, 223, 88, 0.5);
  }
}

.h5-footer-support {
  width: 100%;
  display: grid;
  grid-gap: 17rem 10rem;
  grid-template-columns: repeat(7, 40px);
  justify-content: space-between;
  margin-bottom: 24rem;
  padding: 0 16rem;
}
</style>
