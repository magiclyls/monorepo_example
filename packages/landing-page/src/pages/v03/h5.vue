<script setup>
import { BaseImage } from '@tg/bccomponents'
import { i18n } from '@tg/vue-i18n'
import { computed, ref } from 'vue'
import BaseSkeleton from '../../components/BaseSkeleton.vue'
import { downApp, isDev, useLineData } from '../../hooks'

const { t } = i18n.global
const imgDomain = isDev() ? '/landing-page' : t('域名')
const { domains, loading, getDomainData, csUrl } = useLineData()
getDomainData()
const renderDomains = computed(() => domains.value?.slice(0, 5))
const isModalOpen = ref(false)
const cutArr = ['APE', 'BCH', 'BNB', 'BNB-1', 'BTC', 'BUSD', 'CRO', 'DAI', 'DOGE', 'EOS', 'ETH', 'LINK', 'LTC', 'MATIC', 'SAND', 'SHIB', 'TRX', 'UNI', 'USDC', 'USDT', 'XRP']
const cssPath = ref({
  bgdown: `url(${imgDomain}/webp/diban-20240730.webp)`,
})
function openModal() {
  isModalOpen.value = true
}
function closeModal() {
  isModalOpen.value = false
}
function goURL(url) {
  window.open(url, '_blank')
}
function openKefu() {
  location.href = csUrl.value
}
function getHost(url) {
  return `${url.split(':')[0]}:${url.split(':')[1]}`
}
function getPath(path) {
  return new URL(path, import.meta.url).href
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
function onDownApp(d) {
  const status = downApp(d)
  if (status === false)
    openModal()
}
const randomLoads = ref([])
for (let i = 1; i <= 5; i++)
  randomLoads.value.push({ width: `${getRandomInt(50) + 50}%` })
</script>

<template>
  <div class="w-full h-full">
    <!-- header -->
    <div
      class="header w-full flex justify-between items-center shadow shadow-inner backdrop-blur-[20rem] px-[12rem] h-[60rem]"
    >
      <div class="w-[133rem] left-[34rem]">
        <BaseImage :url="`${imgDomain}/webp/logo.webp`" alt="logo" />
      </div>
      <div
        class="flex-col w-[22rem] justify-start items-start inline-flex"
        @click="openKefu"
      >
        <BaseImage
          class="w-[22rem] h-[22rem]"
          :url="`${imgDomain}/svg/kefu.svg`"
          alt="客服"
        />
      </div>
    </div>
    <!-- banner -->
    <div class="flex item-center justify-center h-[274rem]">
      <BaseImage :url="`${imgDomain}/webp/banner-20240729.webp`" alt="banner" />
    </div>
    <!-- content -->
    <div class="flex flex-col justify-center items-center px-[14rem]">
      <div
        class="w-full flex flex-row justify-between items-center gap-[17rem] mt-[10rem]"
      >
        <div class="w-full">
          <button
            class="w-full bg-[#00E701] px-[14rem] py-[5rem] rounded-[4rem] justify-center items-center font-semibold"
            @click="onDownApp('26')"
          >
            <div class="flex flex-row items-center justify-center gap-[10rem]">
              <BaseImage
                class="w-[52rem] h-[45rem]"
                :url="`${imgDomain}/webp/android.webp`"
                alt="安卓"
              />
              <div class="w-1 h-[37rem] bg-gray-800" />
              <div class="flex flex-col justify-center gap-[5rem]">
                <div class="text-[14rem]">
                  {{ t("安卓版本") }}
                </div>
                <div class="text-[12rem]">
                  {{ t("请点击下载") }}
                </div>
              </div>
            </div>
          </button>
        </div>
        <div class="w-full">
          <button
            class="w-full bg-[#00E701] px-[14rem] py-[5rem] rounded-[4rem] justify-center items-center font-semibold"
            @click="onDownApp('27')"
          >
            <div class="flex flex-row items-center justify-center gap-[10rem]">
              <BaseImage
                class="w-[52rem] h-[45rem]"
                :url="`${imgDomain}/webp/iphone.webp`"
                alt="IOS"
              />
              <div class="w-1 h-[37rem] bg-gray-800" />
              <div class="flex flex-col justify-center gap-5">
                <div class="text-[14rem]">
                  {{ t("IOS版本") }}
                </div>
                <div class="text-[12rem]">
                  {{ t("请点击下载") }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        class="w-full flex flex-col justify-between items-center gap-[16rem] mt-[20rem] bg-[#0F212E] rounded-[8rem] px-[5rem] py-[16rem]"
      >
        <!-- LINK down loading before -->
        <template v-if="loading">
          <div
            v-for="(i, idx) in randomLoads"
            :key="idx"
            class="w-full flex flex-row justify-between items-center gap-[5rem]"
          >
            <div
              class="w-[240rem] shrink-1 text-[14rem] h-[40rem] flex flex-row justify-start items-center text-white font-semibold gap-[20rem]"
            >
              <BaseSkeleton
                :key="idx"
                bg="#B1BAD3"
                height="20rem"
                :width="i.width"
                animated="ani-opacity"
              />
            </div>
            <div class="w-[20rem]">
              <BaseSkeleton
                bg="#B1BAD3"
                height="20rem"
                width="100%"
                animated="ani-opacity"
              />
            </div>
            <div class="w-[65rem]">
              <BaseSkeleton
                bg="#B1BAD3"
                height="20rem"
                width="100%"
                animated="ani-opacity"
              />
            </div>
          </div>
        </template>
        <!-- LINK down loading -->
        <template v-else>
          <div
            v-for="(item, index) in renderDomains"
            :key="index"
            class="w-full flex flex-row justify-between items-center gap-[5rem]"
          >
            <div
              class="w-[240rem] shrink-1 text-[14rem] h-[40rem] bg-down flex flex-row justify-start items-center text-white font-semibold"
            >
              <div class="w-[50rem] flex items-center justify-center">
                {{ domains?.[index]?.delta.toString().slice(0, 2) }}ms
              </div>
              <div class="w-[180rem] flex items-center justify-center">
                {{ getHost(domains?.[index]?.host) }}
              </div>
            </div>
            <div class="shrink-0">
              <BaseImage class="w-[12rem] h-[12rem]" :url="`${imgDomain}/svg/jiantou.svg`" alt="箭头" />
            </div>
            <div class="shrink-0">
              <button
                class="w-full px-[4rem] text-[14rem] py-[8rem] bg-[#00E701] rounded-[4rem] justify-center items-center font-semibold"
                @click="goURL(domains?.[index]?.host)"
              >
                {{ t("进入游戏") }}
              </button>
            </div>
          </div>
        </template>
      </div>
      <!-- 货币列表 -->
      <div
        class="text-center text-white text-[16rem] font-semibold mt-[16rem] mb-[12rem]"
      >
        {{ t("支持币种") }}
      </div>
      <div class="h5-footer-support">
        <BaseImage v-for="item in cutArr" :key="item" class="w-[40rem]" :url="getPath(`${imgDomain}/png/${item}.png`)" alt="货币列表" />
      </div>
    </div>

    <!-- footer -->
    <div class="footer flex flex-col item-center gap-[10rem] justify-center">
      <div class="text-center mx-auto w-[160rem]">
        <BaseImage :url="`${imgDomain}/webp/logo-bottom.webp`" alt="logo-bottom" />
      </div>
      <div class="text-[#b1bad3] font-medium text-center mb-[75rem]">
        &copy;2024 {{ t("版权") }}
      </div>
    </div>
    <!-- 模态框 -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70"
    >
      <div
        class="bg-[#1A2C38] p-[16rem] w-[311rem] flex flex-col items-center justify-center rounded-[4rem] shadow-[4rem]"
      >
        <div class="w-full flex flex-row justify-between items-center">
          <div class="flex flex-row justify-start items-center gap-[8rem]">
            <div>
              <BaseImage class="w-[18rem] h-[18rem]" :url="`${imgDomain}/svg/tishi-icon.svg`" alt="提示图标" />
            </div>
            <div class="text-[18rem] font-semibold text-white">
              {{ t("温馨提示") }}
            </div>
          </div>
          <div>
            <BaseImage
              class="w-[12rem] h-[12rem]"
              :url="`${imgDomain}/svg/close-icon.svg`"
              alt="关闭图标"
              @click="closeModal"
            />
          </div>
        </div>
        <h2
          class="text-[14rem] font-bold mt-[16rem] text-center text-[#B1BAD3]"
        >
          {{ t("暂无下载") }}
        </h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  background-color: rgba(26, 44, 56, 0.88);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.122);
}
.bg-down {
  background-image: v-bind('cssPath.bgdown');
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.footer {
  margin-top: 30rem;
}
.margin-auto {
  margin: auto;
}
.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, #00e701, #00e701);
}
.h5-footer-support {
  width: 100%;
  display: grid;
  grid-gap: 10rem 0;
  grid-template-columns: repeat(7, 34rem);
  justify-content: space-between;
}
</style>

<style>
body {
  background-color: #1a2c38;
  color: #000;
}
</style>
