<script setup>
import { BaseImage } from '@tg/bccomponents'
import { i18n } from '@tg/vue-i18n'
import { computed } from 'vue'
import BaseSkeleton from '../../components/BaseSkeleton.vue'
import { isDev, useLineData } from '../../hooks'

const { t } = i18n.global
const imgDomain = isDev() ? '/landing-page' : t('域名')
const { domains, loading, getDomainData, csUrl } = useLineData()
getDomainData()
const renderDomains = computed(() => domains.value?.slice(0, 4))
const curArr = [
  'LINK',
  'LTC',
  'MATIC',
  'MXN',
  'PEN',
  'SAND',
  'BTC',
  'CNY',
  'CRO',
  'UNI',
  'BNB',
]
const numberToChinese = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
]
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
</script>

<template>
  <main class="bg-[#223139] flex flex-col min-h-[100vh]">
    <header class="w-full h-[140rem] flex items-center justify-center bg-header">
      <div class="flex flex-col justify-center items-center">
        <BaseImage class="h-[97rem]" :url="`${getPath(`${imgDomain}/png/top-logo.png`)}`" alt="" />
      </div>
    </header>
    <div class="common-border" />
    <section
      class="flex-1 flex justify-end items-center relative h-[645rem] w-full bg-cover overflow-hidden pr-[70rem]"
      :style="{ backgroundImage: `url(${getPath(`${imgDomain}/webp/bg.webp`)})` }"
    >
      <div class="yu absolute bottom-[0%] left-[60rem] w-[772rem]">
        <BaseImage class="w-full h-full" :url="`${getPath(`${imgDomain}/webp/renou.webp`)}`" alt="" />
      </div>
      <div class="flex flex-col justify-center items-center relative z-10">
        <div class="main-text  mt-[24rem]  relative z-10 text-[90rem] font-bold tracking-[4rem] text-[#FFE9C3] text-shadow leading-[1rem]">
          {{ t('永不言休') }}
        </div>
        <div
          class="center-box bg-contain w-[960rem] h-[497rem]  pt-[84rem] bg-no-repeat"
          :style="{ backgroundImage: `url(${getPath(`${imgDomain}/webp/big-border.webp`)})` }"
        >
          <template v-if="loading">
            <div v-for="item, index in 4" :key="index" class="flex justify-between items-center flex-col">
              <div class="w-full flex justify-center items-center mb-[14rem]">
                <div
                  class="flex items-centers justify-center bg-cover  w-[145rem] h-[45rem] rounded-[4rem]"
                  :style="{ backgroundImage: `url(${getPath(`${imgDomain}/png/border.png`)})` }"
                >
                  <div class="text-white font-normal flex justify-between items-center text-[24rem]">
                    <BaseSkeleton bg="#B1BAD3" width="72rem" height="26rem" animated="ani-opacity" />
                  </div>
                </div>
                <div class="mmr text-[32rem] text-[#FFDE32] font-normal leading-[1rem] flex justify-center items-center min-w-[380rem] ml-[50rem] mr-[50rem]">
                  <BaseSkeleton bg="#B1BAD3" width="350rem" height="22rem" animated="ani-opacity" />
                </div>
                <div class="btn-enter text-[24rem]">
                  {{ t('进入') }}
                </div>
              </div>
              <div class="common-border2 mb-[30rem]" />
            </div>
          </template>
          <template v-else>
            <div v-for="item, index in renderDomains" :key="index" class="flex justify-between items-center flex-col">
              <div class="w-full flex justify-center items-center mb-[14rem]">
                <div
                  class="flex items-centers justify-center bg-cover  w-[145rem] h-[45rem] rounded-[4rem]"
                  :style="{ backgroundImage: `url(${getPath(`${imgDomain}/png/border.png`)})` }"
                >
                  <span class="text-white font-normal flex justify-center items-center text-[24rem]">{{ t('线路') + numberToChinese[index] }}</span>
                </div>
                <div class="mmr text-[32rem] text-[#FFDE32] font-normal  leading-[1rem] flex justify-center items-center min-w-[380rem] ml-[50rem] mr-[50rem]">
                  {{ getHost(item.host) ?? '&nbsp;' }}
                </div>
                <div class="btn-enter text-[24rem]" @click="goURL(item.host)">
                  {{ t('进入') }}
                </div>
              </div>
              <div class="common-border2 mb-[30rem]" />
            </div>
          </template>
        </div>
      </div>
    </section>
    <footer class="flex h-[252rem]">
      <div class="flex flex-1 flex-col pt-[16rem]  items-center">
        <div class="text-[#E3A942] text-[45rem] font-normal">
          {{ t('国际品牌') }}
        </div>
        <div class="font-light text-[22rem] text-white text-center mb-[14rem]">
          INTERNATIONAL BRAND
        </div>
        <div class="flex items-center">
          <BaseImage class="h-[50rem] mr-[18rem]" :url="`${imgDomain}/png/heart2.png`" alt="" />
          <span class="text-white font-light text-[32rem] text-center tracking-[4rem]">{{ t('存款无忧') }}</span>
        </div>
      </div>
      <div class="flex flex-1 flex-col pt-[16rem]  items-center">
        <div class="text-[#E3A942] text-[45rem] font-normal">
          {{ t('支持币种') }}
        </div>
        <div class="font-light text-[22rem] text-white text-center mb-[14rem]">
          SUPPORTED CURRENCIES
        </div>
        <div
          class="lg:w-[396rem] w-full grid grid-rows-[auto] justify-items-center items-center  gap-x-[32rem] gap-y-[6rem] pl-[10rem] pr-[10rem]"
          style="grid-template-columns: repeat(auto-fill, minmax(36rem, 1fr))"
        >
          <BaseImage
            v-for="i in curArr" :key="i" class="w-[36rem] h-[36rem]" :url="getPath(`${imgDomain}/png/${i}.png`)"
            alt=""
          />
          <div class="flex items-center  justify-center rounded-[50%] border-[2rem] border-[#D9A62C] border-solid w-[36rem] h-[36rem] text-[#D9A62C]">
            18+
          </div>
        </div>
      </div>
      <div class="flex flex-1 flex-col pt-[16rem]  items-center">
        <div class="text-[#E3A942] text-[45rem] font-normal">
          {{ t('在线客服') }}
        </div>
        <div class="font-light text-[22rem] text-white text-center mb-[14rem]">
          ONLINE CUSTOMER SERVICE
        </div>
        <div class="flex items-center" @click="openKefu">
          <BaseImage class="h-[50rem] mr-[18rem]" :url="`${imgDomain}/png/kefu.png`" alt="" />
          <span class="text-white font-light text-[32rem] text-center tracking-[4rem]">7x24{{ t('在线咨询') }}</span>
        </div>
      </div>
    </footer>
  </main>
</template>

<style scoped>
@media (min-height: 965px) {
  .main-text {
    margin-top: 50rem;
    margin-bottom: 20rem;
  }
  .yu {
    width: 960rem;
  }
  .center-box {
    width: 1100rem;
    height: 600rem;
    padding-top: 110rem;
  }
  .mmr {
    margin-right: 100rem;
    margin-left: 100rem;
  }
}

@media (max-width: 1918px) {
  .main-text {
    position: relative;
    top: 30rem;
  }
  .center-box {
    position: relative;
    top: 60rem;
    width: 780rem;
    height: 497rem;
    padding-top: 65rem;
  }
  .mmr {
    margin-right: 20rem;
    margin-left: 20rem;
  }
  .common-border2 {
    margin-bottom: 20rem;
  }
}

.common-border2 {
  width: 90%;
  height: 1rem;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(247, 247, 247, 0.774) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  box-shadow: 0 0 10rem rgba(255, 223, 88, 0.5);
}

.bg-header {
  background-image: url(/landing-page/webp/top-bg.webp);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: auto 140rem;
}

.text-shadow {
  text-shadow: 0 0 10rem #995454;
}

.btn-enter {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(112.7deg, #e23535 14.75%, #e50d0d 85.25%);
  width: 140rem;
  height: 44rem;
  border-radius: 2rem;
  color: #fff;
  box-shadow:
    0rem -4rem 6.2rem 0rem rgba(210, 0, 0, 0.48) inset,
    0rem 4rem 7.8rem 0rem rgba(255, 253, 253, 0.52) inset;
  cursor: pointer;
  font-weight: 500;
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0rem;
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
    bottom: 0rem;
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
</style>
