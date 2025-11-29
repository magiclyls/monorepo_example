<script setup lang="ts">
import { ApiMarketDetail } from '@tg/apis'
import { BaseImage } from '@tg/bccomponents'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { isDev } from '../../utils'
import { getCookie, initFacebook } from '../../utils/hook'

const cdn = 'https://d3lxmpzmffxrcj.cloudfront.net/'

const footerArr = [
  {
    text1: 'Games',
    icon: 'footer1.png',
  },
  {
    text1: 'Apps',
    icon: 'footer2.png',
  },
  {
    text1: 'Movies',
    icon: 'footer3.png',
  },
  {
    text1: 'Books',
    icon: 'footer4.png',
  },
  {
    text1: 'Kids',
    icon: 'footer5.png',
  },
]
const textArr = [
  {
    text1: '4.9 ★',
    text2: '8M reviews',
  },
  {
    text1: '100M +',
    text2: 'Baixando',
  },
  {
    text1: '18+',
    text2: 'Rated for 18+',
  },
]
/* const talkArr = [
  {
    text1: '#1 principais apps gratuitos ação',
  },
  {
    text1: 'Ação',
  },
  {
    text1: 'Jogos de plataforma',
  },
  {
    text1: 'Casual',
  },
  {
    text1: 'Multiplayer',
  },
  {
    text1: 'Estilizado',
  },
] */

const pinglunArr = [
  {
    icon: '/google-play/png/round1.png',
    name: 'Lara Liras',
    date: '5 de setembro de 2024',
    text1: 'O jogo é bom , mais precisa de um incentivo, no geral eu gostei bastante Dá pra pessoa distrair e jogar é muito saudável ! Amei os porquinhos kkk',
    text2: 'Essa avaliação foi marcada como útil por 52 pessoas',
  },
  {
    icon: '/google-play/png/round2.png',
    name: 'Angelita Da Silva',
    date: '19 de agosto de 2024',
    text1: 'Gosto muito, o jogo é super divertido e o jackpot explode todos os dias',
    text2: 'Essa avaliação foi marcada como útil por 22 pessoas',
  },
  {
    icon: '/google-play/png/round3.png',
    name: 'Rubens Vieira dos Santos',
    date: '9 de junho de 2024',
    text1: 'muito divertido e não fica trancando e cheio de anúncios muito bom mesmo',
    text2: 'Essa avaliação foi marcada como útil por 20 pessoas',
  },
]
const xiangsiyouxiArr = [
  {
    icon: '/google-play/png/1.png',
    name: 'Cash Craze: Casino Slots Games',
    text: 'Casual Joy Games',
    score: '4,5',
  },
  {
    icon: '/google-play/png/2.png',
    name: 'Charge Buffalo Slot-TaDa Jogos',
    text: 'FUFAFA TECHNOLOGY LTD CO.',
    score: '4,5',
  },
  {
    icon: '/google-play/png/3.png',
    name: 'Jackpot Magic Slots',
    text: 'Big Fish Games',
    score: '2,6',
  },
  {
    icon: '/google-play/png/4.png',
    name: 'Diamond Slot - Slot Game',
    text: 'International Games System Co., Ltd.',
    score: '3,9',
  },
  {
    icon: '/google-play/png/5.png',
    name: 'Bônus Bingo Cassino-TaDa Jogo',
    text: 'FUFAFA TECHNOLOGY LTD CO.',
    score: '4,4',
  },
  {
    icon: '/google-play/png/6.png',
    name: 'Infinity Slots - Casino Games',
    text: 'Murka Games Limited',
    score: '4,5',
  },
]
let localStorageFbPixelId
try {
  localStorageFbPixelId = JSON.parse(localStorage.getItem('storage_fb_pixel_id') as string)?.value
}
catch (error) {}
const fbPixelId = new URLSearchParams(document.location.search).get('fbPixelId') || localStorageFbPixelId

const origin = window.location.origin.split('//')[1]
let timer: any
// pwa自动安装事件
let deferredPrompt: any

const mainRef = ref()
const activeIndex = ref(-1)
const istop = ref(true)
const downLoadValue = ref(0)
// 用户接受安装pwa
const pwaLoad = ref(false)
// 用户接受安装后的进度
const pwaLoadValue = ref(0)
const pwaArrvel100 = ref(false)
const isLoading = ref(true)
const isShowAdd = ref(false)
const isShowDownload = ref(false)
const isApk = ref(false)
const arrvel100 = ref(false)
const apiData = ref()
/** 可以使用的android地址 */
let androidApkUrl = ''
let iosApkUrl = ''
function countToHundred() {
  // isApk.value = isInstallApk()
  const interval = setInterval(() => {
    downLoadValue.value++
    if (downLoadValue.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        arrvel100.value = true
      }, 100)
    }
  }, 30)
}
function onerror(e: any) {
  const parent = e.target.parentElement
  parent.style.display = 'none'
}
function getPath(path: string) {
  path = isDev() ? path : `/main${path}`
  return new URL(path, import.meta.url).href
}
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

/**
 * 检查当前 url apk 是不是可以下载
 * @param {string} url
 * @returns {boolean}
 */
async function checkApkUrl(url: string) {
  return new Promise((resolve) => {
    if (/https/.test(url) || /https/.test('service'))
      resolve(true)
    else
      resolve(null)
  })
}

function isMobileSafari() {
  const ua = navigator.userAgent
  // IOS系统
  if (/ OS \d/.test(ua)) {
    // 不是Chrome
    if (!~ua.indexOf('CriOS')) {
      // 开头必须为Mozilla
      if (!ua.indexOf('Mozilla')) {
        // 结尾需为：Safari/xxx.xx 除去Firefox和Google
        if (/Safari\/[\d.]+$/.test(ua) && !ua.includes('Fxi') && !ua.includes('GSA'))
          return true
      }
    }
  }
  return false
}

function isAndroid() {
  return /android/.test(navigator.userAgent.toLowerCase())
}
function isSupportPwa() {
  return 'serviceWorker' in navigator && Object.prototype.hasOwnProperty.call(window, 'BeforeInstallPromptEvent')
}

// 下载按钮逻辑
function downLoad() {
  if (apiData.value?.fix_type === '1')
    return toHomePage()
  if (isSupportPwa() && deferredPrompt) {
    handleClickPWA()
  }
  else if (isIOS()) {
    if (isMobileSafari()) {
      isShowAdd.value = true
    }
    else {
      downLink() // 苹果除了Safari
    }
  }
  else if (!isIOS()) { // 安卓和pc
    downLink()
  }
}

/**
 * 获取可以使用的Apk下载地址
 */
async function getApkUrl(allApkUrl: string[]): Promise<string | undefined> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let errorIndex = 0
    for (const apkUrl of allApkUrl) {
      if (await checkApkUrl(apkUrl)) {
        resolve(apkUrl)
        break
      }
      else {
        errorIndex++
        if (errorIndex === allApkUrl.length)
          resolve(undefined)
      }
    }
  })
}

async function downLink() {
  const channelDomain = window.location.origin.replace(/\/$/, '')
  const channelCode = new URLSearchParams(document.location.search).get('c')
  const fbp = getCookie('_fbp') || ''
  const fbc = getCookie('_fbc') || ''

  if (isIOS()) {
    const allUrl = [
      apiData.value?.ios,
      apiData.value?.official_ios,
      apiData.value?.official_reserve_ios,
    ]
    iosApkUrl = await getApkUrl(allUrl) || ''
    if ((!iosApkUrl))
      return toHomePage()
    window.DankeX?.download('x9e38809ee057c33', `channelDomain=${channelDomain}&channelCode=${channelCode}&fbp=${fbp}&fbc=${fbc}`)
    setTimeout(() => {
      window.location.href = iosApkUrl
    }, 0)
  }
  else { // 安卓和pc
    const allUrl = [
      apiData.value?.apk,
      apiData.value?.official_apk,
      apiData.value?.official_reserve_apk,
    ]
    androidApkUrl = await getApkUrl(allUrl) || ''
    if ((!androidApkUrl))
      return toHomePage()
    window.DankeX?.download('x9e38809ee057c33', `channelDomain=${channelDomain}&channelCode=${channelCode}&fbp=${fbp}&fbc=${fbc}`)
    setTimeout(() => {
      window.location.href = androidApkUrl
    }, 0)
  }
  console.log(channelDomain, channelCode, androidApkUrl, 'fbp', fbp, 'fbc', fbc)
}

const { runAsync, data: sourceData } = useRequest(id => ApiMarketDetail({ id }), {})

// 请求数据
async function getconfig(id: string | null) {
  const data = await runAsync(id)
  console.log('链接', data)
  apiData.value = data
  apiData.value.icon = cdn + data?.icon
  apiData.value.present = data?.present.replace(/\n/g, '<br>')
  try {
    apiData.value.promo_icon = JSON.parse(data?.promo_icon).map((item: any) => cdn + item)
  }
  catch (error) { }
  document.title = apiData.value?.app_name || setTitle()
  addPWA(id)
  setTimeout(() => {
    isLoading.value = false
  }, 1000)

  // xinstall数据
  // const { api_domain } = await httpClient.get(`/member/brand/detail?tag=${['base', 'regweb', 'third', 'kf', 'pc', 'area', 'bottom', 'amount', 'deposit', 'withdraw', 'reg', 'customer', 'app', 'api_domain'].join(',')}`)
  // XinstallConfig.xi_domain = api_domain.vg_install_domain
  // XinstallConfig.sharetraceKey = api_domain.vg_install_key
  // XinstallConfig.downloadType = api_domain.type
}

// 转跳逻辑
function UCtoChrome() {
  const url = window.location.href.split('//')[1]
  const scheme = window.location.href.split('//')[0].includes('s') ? 'https' : 'http'
  const newURl = `intent://${url}#Intent;scheme=${scheme};package=com.android.chrome;end`
  isAndroid() && isUCBrowser() && setTimeout(() => {
    window.location.href = newURl
  }, 2000)
}
function isUCBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor
  return /UCWEB|UCBrowser/i.test(userAgent)
}
function toHomePage() {
  window.open(window.location.origin + window.location.search)
}

watch(activeIndex, () => {
  clearTimeout(timer)
  nextTick(() => {
    timer = setTimeout(() => {
      activeIndex.value = -1
    }, 350)
  })
})

onMounted(() => {
  UCtoChrome()
  mainRef.value.addEventListener('scroll', (e: any) => {
    const header = document.querySelector('header')
    const rect1 = header?.getBoundingClientRect().height
    const content = document.querySelector('.scroll-content')
    const rect2 = content?.getBoundingClientRect().top
    if (rect1 && rect2 && rect1 <= rect2) {
      istop.value = true
    }
    else {
      istop.value = false
    }
  })
})

// pwa 逻辑
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  // 保存事件对象，稍后触发
  deferredPrompt = e
})
const params = new URLSearchParams(document.location.search)
const c = params.get('c')
getconfig(c)

async function handleClickPWA() {
  if (deferredPrompt) {
    // 显示安装提示
    deferredPrompt.prompt()
    // 记录用户的选择结果
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('用户接受了PWA安装')
      pwaLoad.value = true
      const interval = setInterval(() => {
        pwaLoadValue.value++
        if (pwaLoadValue.value >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            pwaArrvel100.value = true
          }, 100)
        }
      }, 200)
    }
    else {
      console.log('用户拒绝了PWA安装')
    }
    // 重置 deferredPrompt
    deferredPrompt = null
  }
}

function addPWA(id: string | null) {
  const url = `${location.origin}?c=${id}&fbPixelId=${fbPixelId}`
  const link = document.createElement('link')
  link.rel = 'manifest'
  const obj = {
    background_color: '#1a2c38',
    display: 'standalone',
    prefer_related_applications: false,
    related_applications: [],
    name: apiData.value?.app_name,
    short_name: apiData.value?.app_name,
    start_url: url,
    icons: [
      {
        sizes: 'any',
        src: `${apiData.value.icon}?date=${Date.now()}`,
        type: 'image/webp',
      },
      {
        sizes: '512x512',
        src: `${apiData.value.icon}?date=${Date.now()}`,
        type: 'image/webp',
      },
    ],
  }
  link.href = toDataUrl(obj)
  document.head.appendChild(link)
}
function toDataUrl(obj: any) {
  // 将对象转换为 JSON 字符串
  const jsonString = JSON.stringify(obj)
  // 将 JSON 字符串进行 URI 编码
  const encodedJson = encodeURIComponent(jsonString)
  // 创建 data URL
  const dataUrl = `data:text/json;charset=utf-8,${encodedJson}`
  return dataUrl
}
// 标题
function setTitle() {
  const nameArr = location.host.split('.')
  const title = `${nameArr[1]}.${nameArr[2]}`
  const newTitle = title.charAt(0).toUpperCase() + title.slice(1)
  document.title = newTitle
}

initFacebook(fbPixelId)
</script>

<template>
  <div class="h-full flex flex-col bg-[#F5F6F8]">
    <header class="py-[11.5385rem] px-[19.2308rem] flex justify-between items-center">
      <div class="w-[153.84rem] h-[34.64rem]">
        <BaseImage class="w-[153.84rem]" url="/google-play/png/GooglePlay-left.png" />
      </div>
      <div class=" w-[107.69rem] h-[34rem]">
        <BaseImage class="w-[107.69rem]" url="/google-play/png/GooglePlay-right.png" />
      </div>
    </header>
    <div v-if="!istop" class="bg-[#E5E8ED] h-[1px]" />
    <main ref="mainRef" class="flex-1 overflow-y-auto remove-scrollbor">
      <div class="scroll-content p-[23.0769rem]">
        <!-- 下载按钮 -->
        <div class="flex items-center">
          <div class="mr-[23.0769rem] rounded-[20%] overflow-hidden w-[69.2rem] h-[69.2rem]">
            <img class="w-full" :src="apiData?.icon" alt="">
          </div>
          <div class="flex flex-col">
            <span class="text-t2xl text-[#000]">{{ apiData?.app_name || '&nbsp;' }}</span>
            <span class="text-txl text-[#01875F]">{{ apiData?.author || '&nbsp;' }}</span>
            <span class="text-[11.5385rem] text-[#5F6368]">Verificado pelo aplicativo</span>
          </div>
        </div>
        <div class="my-[22.0769rem] flex items-center">
          <div v-for="(item, i) in textArr" :key="i" class="flex-1 flex flex-col items-center">
            <span class="text-black font-semibold text-[13.4615rem]">{{ item.text1 }}</span>
            <span class="text-txs text-[#5F6368]">{{ item.text2 }}</span>
          </div>
        </div>
        <div
          v-show="apiData?.down_button === '1'"
          class="shiny relative overflow-hidden flex flex-col justify-center items-center bg-[#01875f] cursor-pointer px-[8px] py-[9px] rounded-[8px]"
          @click="isShowDownload = true; countToHundred();"
        >
          <div class="flex items-center">
            <div class="mr-[3.846rem] w-[11.53rem] h-[15.85rem]">
              <BaseImage class="w-full" url="/google-play/png/ic_sd.png" />
            </div>
            <span class="text-tsm text-[#ffe336]">Instalação Rápida</span>
          </div>
          <div class="text-white text-txs">
            Baixe dentro de 15 segundos
          </div>
        </div>
        <div class="flex items-center justify-center my-[23.0769rem] text-tsm text-[#01875f]">
          <div class="mr-[11.5385rem] w-[23.07rem] h-[23.07rem]">
            <BaseImage class="" url="/google-play/png/share.png" />
          </div>
          <div>Share</div>
          <div class="ml-[23.0769rem] w-[23.07rem] h-[23.07rem] mr-[11.5385rem] flex justify-center items-center">
            <BaseImage class="w-[65%]" url="/google-play/png/add.png" />
          </div>
          <div>Add to wishlist</div>
        </div>
        <div class="flex overflow-x-auto">
          <div v-for="item, index in apiData?.promo_icon" :key="index" class="publicUrl">
            <img class="w-full h-full" :src="item" alt="" @error="onerror">
          </div>
        </div>
        <div class="mt-[23.0769rem]">
          <div class="text-[#202124] text-tlg font-bold flex justify-between items-center mb-[11.3846rem]">
            <span>About this app</span>
            <div class="w-[14.42rem] h-[26.92]">
              <BaseImage class="w-full" url="/google-play/png/right.png" />
            </div>
          </div>
          <p class="text-tsm text-[#5F6368]" v-html="apiData?.present" />
        </div>
        <!-- 标签 -->
        <div class="mt-[23.0769rem]">
          <div class="text-[#202124] text-tsm font-bold mb-[7.6923rem]">
            <span>Atualizado em</span>
          </div>
          <p class="text-tsm text-[#5F6368]">
            26 de abril. de 2025
          </p>
          <!-- <div class="flex flex-wrap">
            <div v-for="item in talkArr"
              class="border text-tsm text-[#5F6368] border-[#dadce0] px-[11.5384rem] rounded-[14.4230rem] mt-[9.6153rem] mr-[15.3846rem]">
              {{ item.text1 }}
            </div>
          </div> -->
        </div>
        <div class="mt-[23.0769rem]">
          <div class="text-[#202124] text-tlg font-bold flex justify-between items-center mb-[11.3846rem]">
            <span>Segurança dos dados </span>
            <div class="w-[14.42rem] h-[26.92]">
              <BaseImage class="w-full" url="/google-play/png/right.png" />
            </div>
          </div>
          <p class="text-tsm text-[#5F6368]">
            Sua segurança começa com o entendimento de como os desenvolvedores coletam
            e compartilham seus dados. As práticas de segurança e privacidade de dados podem variar de acordo com o uso,
            a região e a idade. O desenvolvedor forneceu as informações a seguir, que podem ser atualizadas ao longo do
            tempo.
          </p>
        </div>
        <!-- box -->
        <div class="mt-[23.0769rem] border p-[23.0769rem] rounded-[7.6923rem]">
          <div class="flex items-start">
            <div class="mr-[15.3846rem] flex-shrink-0 w-[15.3846rem]">
              <BaseImage class="w-full" url="/google-play/png/box1.png" />
            </div>
            <div class="text-tsm text-[#5F6368]">
              <p>Este app pode compartilhar estes tipos de dados com terceiros</p>
              <p>Local, Informações financeiras e Identificadores do dispositivo e outros</p>
            </div>
          </div>
          <div class="flex items-start mt-[15.3846rem]">
            <div class="mr-[15.3846rem] flex-shrink-0 w-[15.3846rem]">
              <BaseImage class="w-full" url="/google-play/png/box2.png" />
            </div>
            <div class="text-tsm text-[#5F6368]">
              <p>TEste app pode coletar estes tipos de dados Local, Informações pessoais e mais 5</p>
            </div>
          </div>
          <div class="flex items-start mt-[15.3846rem]">
            <div class="mr-[15.3846rem] flex-shrink-0 w-[15.3846rem]">
              <BaseImage class="w-full" url="/google-play/png/box3.png" />
            </div>
            <div class="text-tsm text-[#5F6368]">
              <p>Os dados não são criptografados</p>
            </div>
          </div>
          <div class="flex items-start mt-[15.3846rem]">
            <div class="mr-[15.3846rem] flex-shrink-0 w-[15.3846rem]">
              <BaseImage class="w-full" url="/google-play/png/box4.png" />
            </div>
            <div class="text-tsm text-[#5F6368]">
              <p>Você pode solicitar a exclusão dos dados</p>
            </div>
          </div>
          <div class="flex items-start mt-[15.3846rem] ml-[10rem] text-tsm text-[#3b8562]">
            Mais detalhes
          </div>
        </div>
        <div class="mt-[23.0769rem]">
          <div class="text-[#202124] text-tlg font-bold flex justify-between items-center mb-[11.3846rem]">
            <span>Classificações e revisões </span>
          </div>
          <p class="text-tsm text-[#5F6368]">
            As avaliações e avaliações são verificadas e de pessoas que usam o mesmo
            tipo de dispositivo que você usa Telefone As avaliações e avaliações são verificadas e de pessoas que usam o
            mesmo tipo de dispositivo que você usa Telefone As avaliações e avaliações são verificadas e de pessoas que
            usam o mesmo tipo de dispositivo que você usa Telefone As avaliações e avaliações são verificadas e de
            pessoas que usam o mesmo tipo de dispositivo que você usa Telefone
          </p>
        </div>
        <div class="mt-[23.0769rem] flex flex-wrap text-tsm">
          <div
            class="mr-[15.3846rem] flex items-center border border-[#dadce0] bg-[#e6f3ef] px-[11.3846rem] rounded-[14.4230rem] mt-[9.615375rem] text-[#028760]"
          >
            <div class="w-[12.4999rem] mr-[3.8461rem]">
              <BaseImage class="w-full" url="/google-play/png/divice1.png" />
            </div>
            <span> Telephone</span>
          </div>
          <div
            class="mr-[15.3846rem] flex items-center border border-[#dadce0] px-[11.3846rem] rounded-[14.4230rem] mt-[9.615375rem] text-[#5F6368]"
          >
            <div class="w-[12.4999rem] mr-[3.8461rem]">
              <BaseImage class="w-full" url="/google-play/png/divice2.png" />
            </div>
            <span> Tablet</span>
          </div>
          <div
            class="mr-[15.3846rem] flex items-center border border-[#dadce0] px-[11.3846rem] rounded-[14.4230rem] mt-[9.615375rem] text-[#5F6368]"
          >
            <div class="w-[12.4999rem] mr-[3.8461rem]">
              <BaseImage class="w-full" url="/google-play/png/divice3.png" />
            </div>
            <span> Chromebook</span>
          </div>
        </div>
        <!-- 评分 -->
        <div class="mt-[23.0769rem] flex items-center justify-between">
          <div>
            <div class="text-[#202124] text-[55.7691rem] leading-tight">
              4,9
            </div>
            <div class="flex">
              <BaseImage v-for="(item, i) in 5" :key="i" class="w-[14rem] h-[14rem] mr-[2rem]" url="/google-play/png/start2.png" />
              <!-- <img style="width: 14px; height: 14px; margin-right: 2px;" src="/google-play/start1.png" alt=""> -->
            </div>
            <div class="leading-loose  my-[5.7692rem] text-[#5F6368] text-txs">
              1,91 mil avaliações
            </div>
          </div>
          <div>
            <div class="text-[10.5769rem] flex items-center  leading-[19.23075rem] justify-between">
              <span>5</span>
              <div
                class="flex-1 w-[153.846rem] ml-[13.4615rem] h-[8.6538rem] bg-[#e3e3e3] rounded-[5.769rem] overflow-hidden"
              >
                <p class="h-full  w-[95%] bg-[rgb(2,135,96)]" />
              </div>
            </div>
            <div class="text-[10.5769rem] flex items-center leading-[19.23075rem] justify-between">
              <span>4</span>
              <div
                class="flex-1 w-[153.846rem] ml-[13.4615rem] h-[8.6538rem] bg-[#e3e3e3] rounded-[5.769rem] overflow-hidden"
              >
                <p class="h-full w-[15.3846rem] bg-[rgb(2,135,96)]" />
              </div>
            </div>
            <div class="text-[10.5769rem] flex items-center  leading-[19.23075rem] justify-between">
              <span>3</span>
              <div
                class="flex-1 w-[153.846rem] ml-[13.4615rem] h-[8.6538rem] bg-[#e3e3e3] rounded-[5.769rem] overflow-hidden"
              >
                <p class="h-full  w-[10.3846rem] bg-[rgb(2,135,96)]" />
              </div>
            </div>
            <div class="text-[10.5769rem] flex items-center  leading-[19.23075rem] justify-between">
              <span>2</span>
              <div
                class="flex-1 w-[153.846rem] ml-[13.4615rem] h-[8.6538rem] bg-[#e3e3e3] rounded-[5.769rem] overflow-hidden"
              >
                <p class="h-full  w-[2.3846rem] bg-[rgb(2,135,96)]" />
              </div>
            </div>
            <div class="text-[10.5769rem] flex items-center  leading-[19.23075rem] justify-between">
              <span>1</span>
              <div
                class="flex-1 w-[153.846rem] ml-[13.4615rem] h-[8.6538rem] bg-[#e3e3e3] rounded-[5.769rem] overflow-hidden"
              >
                <p class="w-0 h-full bg-[rgb(2,135,96)]" />
              </div>
            </div>
          </div>
        </div>
        <!-- 评论 -->
        <div v-for="(item, i) in pinglunArr" :key="i" class="mt-[23.0769rem]">
          <div class="flex justify-between">
            <div class="flex items-center">
              <div class="w-[30.7692rem] h-[30.7692rem] rounded-full object-fill overflow-hidden">
                <img class="w-full h-full" :src="getPath(item.icon)" alt="">
              </div>
              <div class="ml-[11.3846rem] text-tsm text-[#5F6368]">
                {{ item.name }}
              </div>
            </div>
            <div class="w-[3.84615rem]">
              <BaseImage class="w-full" url="/google-play/png/icon-more.png" />
            </div>
          </div>
          <div class="flex items-center mt-[15.3846rem]">
            <BaseImage v-for="(item, i) in 5" :key="i" class="w-[11rem] h-[11rem] mr-[2rem]" url="/google-play/png/start2.png" />
            <span class="ml-[7.6923rem] text-[#5F6368] text-txs ">{{ item.date }}</span>
          </div>
          <div class="mt-[11.3846rem] text-tsm text-[#5F6368]">
            {{ item.text1 }}
          </div>
          <div class="mt-[11.3846rem] text-tsm text-[#484b4e]">
            {{ item.text2 }}
          </div>
          <div class="mt-[11.3846rem] text-tsm text-[#484b4e] flex">
            <div class="mr-[24rem]">
              Você achou isso útil?
            </div>
            <div class="border border-[#dadce0] w-[64rem] h-[22rem] text-center mr-[18rem] rounded-[10px] btn-juige">
              Sim
            </div>
            <div class="border border-[#dadce0] w-[64rem] h-[22rem] text-center mr-[18rem] rounded-[10px] btn-juige">
              Não
            </div>
          </div>
        </div>
        <div class="mt-[25.4615rem] ml-[10rem] text-[#3b8562] text-[14rem]">
          Ver todas as avaliações
        </div>
        <div class="mt-[23.0769rem]">
          <div class="text-[#202124] text-tlg font-bold flex justify-between items-center mb-[11.3846rem]">
            <span>O que há de novo  </span>
          </div>
          <p class="text-tsm text-[#5F6368]">
            Olá, fãs de Fortune Tiger Slot!
          </p>
          <p class="text-tsm text-[#5F6368] mt-[4rem]">
            Aqui está uma nova atualização:
          </p>
          <p class="text-tsm text-[#5F6368] mt-[20rem]">
            -Melhorias de desempenho
          </p>
          <p class="text-tsm text-[#5F6368] mt-[20rem]">
            Aproveite e divirta-se!
          </p>
        </div>
        <!-- 相识游戏 -->
        <div class="mt-[23.0769rem]">
          <div class="text-[#202124] text-tlg font-bold flex justify-between items-center mb-[11.3846rem]">
            <span>Jogos semelhantes </span>
            <div class="w-[14.42rem] h-[26.92]">
              <BaseImage class="w-full" url="/google-play/png/right.png" />
            </div>
          </div>
          <div class="flex flex-wrap justify-between">
            <div v-for="(item, i) in xiangsiyouxiArr" :key="i" class="w-[48%] h-[56rem] mb-[12rem]  flex justify-between overflow-hidden" @click="isShowDownload = true; countToHundred();">
              <div class="rounded-[10rem] w-[56rem] h-[56rem] mr-[8rem] flex-shrink-0 overflow-hidden">
                <BaseImage class="w-full h-full" :url="item.icon" />
              </div>
              <div class="flex flex-col justify-between">
                <div class="whitespace-nowrap overflow-hidden text-[#202124] leading-[1.5] text-[14rem]">
                  {{ item.name }}
                </div>
                <div class="whitespace-nowrap overflow-hidden text-[#202124] leading-[1.5] text-[12rem]">
                  {{ item.text }}
                </div>
                <div class="whitespace-nowrap overflow-hidden text-[#5f6368] leading-[1] text-[12rem] flex items-center">
                  <span>{{ item.score }}</span><span class="ml-[1rem] text-[10rem]">★</span>
                </div>
              </div>
            </div>
            <div class="flex items-center mt-[10rem]">
              <BaseImage class="w-[22rem] " url="/google-play/png/Icon_flag.png" />
              <div class="text-[14rem]">
                Sinalizar como impróprio
              </div>
            </div>
          </div>
        </div>
        <div class="h-[1px] bg-[#dadce0] mt-[30rem]" />
        <!-- google play -->
        <div class="mt-[23.0769rem]">
          <div class="font-medium text-tsm text-[#5F6368]">
            Google Play
          </div>
          <div class="mt-[13.4615rem] text-tsm text-[#5F6368]">
            Play Pass
          </div>
          <div class="mt-[13.4615rem] text-tsm text-[#5F6368]">
            Play Points
          </div>
          <div class="mt-[13.4615rem] text-tsm text-[#5F6368]">
            Vales-presente
          </div>
          <div class="mt-[13.4615rem] text-tsm text-[#5F6368]">
            Resgatar
          </div>
          <div class="mt-[13.4615rem] text-tsm text-[#5F6368]">
            Política de reembolso
          </div>
          <div class="mt-[23.0769rem] text-tsm text-[#5F6368] font-medium">
            Crianças e família
          </div>
          <div class="mt-[13.4615rem] text-tsm text-[#5F6368] font-medium">
            Guia para a família
          </div>
          <div class="mt-[13.4615rem] text-tsm text-[#5F6368] font-medium">
            Compartilhamento em família
          </div>
        </div>
        <div class="flex items-center mt-[23.0769rem]">
          <div class="mr-[19.2307rem] text-tsm text-[#5F6368]">
            Termos de Serviço
          </div>
          <div class="mr-[19.2307rem] text-tsm text-[#5F6368]">
            Privacidade
          </div>
        </div>
        <div class="flex items-center mt-[23.0769rem]">
          <div class="mr-[19.2307rem] text-tsm text-[#5F6368]">
            Sobre o Google Play
          </div>
          <div class="mr-[19.2307rem] text-tsm text-[#5F6368]">
            Desenvolvedores
          </div>
        </div>
        <div class="flex items-center mt-[23.0769rem]">
          <div class="mr-[19.2307rem] text-tsm text-[#5F6368]">
            Google Store
          </div>
          <div class="mr-[19.2307rem] text-tsm text-[#5F6368]">
            Todos os preços incluem Tributo
          </div>
        </div>
      </div>
    </main>
    <footer class="footer flex">
      <div
        v-for="item, index in footerArr"
        :key="index"
        class="flex  flex-1 relative flex-col justify-center items-center min-h-[56px] overflow-hidden" @click="activeIndex = index"
      >
        <div class="relative z-10 w-[23.0769rem] mb-[2px]">
          <BaseImage class="w-full" :url="`/google-play/png/footer${index + 1}.png`" />
        </div>
        <span class="relative z-10 text-tsm text-[#5f6368]" :style="{ color: index === 1 ? '#01875f' : '#5f6368' }">
          {{ item.text1 }}
        </span>
        <!-- 动画元素 -->
        <div v-if="index === activeIndex" class="footer-animate" />
      </div>
    </footer>
  </div>
  <!-- 下载对话 -->
  <div v-show="isShowDownload" class="dialog" @click.self="isShowDownload = false">
    <div class="dialog-content">
      <div class="flex items-center">
        <BaseImage class="w-[26.9230rem] mr-[5.7692rem]" url="/google-play/png/ic_raid_install.png" />
        <span class="text-[26.9230rem] text-black">Instalação Rápida</span>
      </div>
      <p
        class="text-tlg text-[#666] border border-[#747475]  px-[11.3846rem] rounded-[2.8846rem] !leading-[1.25] mt-[9.6153rem]"
      >
        6 vezes mais rápido
      </p>
      <div
        class="flex items-center my-[19.2307rem] px-[11.3846rem] bg-[#0287601A] border border-[#028760] rounded-full"
      >
        <BaseImage class="w-[15.3846rem] mr-[5.7692rem]" url="/google-play/png/ic_actived.png" />
        <span class="text-txl text-[#028760] !leading-[1.25]">Ativado</span>
      </div>
      <div
        v-if="!pwaLoad && !arrvel100"
        class="w-[42.3076rem] h-[42.3076rem] flex justify-center items-center relative"
      >
        <div class="w-full h-full absolute">
          <BaseImage class="spin w-full " url="/google-play/round.jpg" />
        </div>
        <div class="relative z-10">
          {{ downLoadValue }}%
        </div>
      </div>
      <div v-else-if="!pwaLoad && arrvel100" class="w-full px-[38.4615rem]">
        <div
          class="flex items-center  justify-center text-white h-[43.2691rem] text-[15.3846rem]  rounded-[7.6923rem] bg-[#01875f]"
          @click="downLoad"
        >
          {{ isApk ? 'Instalar Agora' : 'Instalar' }}
        </div>
      </div>
      <div v-else-if="pwaLoad && !pwaArrvel100" class="w-full px-[38.4615rem]">
        <div
          class="relative overflow-hidden flex items-center  justify-center text-white h-[43.2691rem] text-[15.3846rem]  rounded-[20px] bg-[#000]"
        >
          <span class="relative z-10">{{ pwaLoadValue }}%</span>
          <!-- 进度条 -->
          <div class="bg-[#3f8426] absolute top-0 left-0 bottom-0" :style="{ width: `${pwaLoadValue}%` }" />
        </div>
      </div>
      <div v-else class="w-full px-[38.4615rem]" @click="toHomePage">
        <div
          class="btn-3d relative overflow-hidden flex items-center  justify-center text-white h-[43.2691rem] text-[15.3846rem]  rounded-[20px] bg-[#4CAF50]"
        >
          Iniciar App
        </div>
      </div>
    </div>
  </div>
  <!-- ios添加桌面 -->
  <Transition>
    <div v-show="isShowAdd" class="dialog2">
      <div class="w-full dialog2-content">
        <div class="w-full flex justify-between items-center">
          <span class="text-[15.3846rem] text-black flex-1 font-semibold">Instale o aplicativo</span>
          <BaseImage class="w-[23.07rem] " url="/google-play/close.png" @click="isShowAdd = false" />
        </div>
        <div
          class="w-full p-[19.2307rem]  flex items-center my-[30.7692rem] rounded-[7.6923rem] border border-gray-200"
        >
          <img class="w-[42.3rem] mr-[17.3076rem] rounded-[9.6153rem]" :src="apiData?.icon" alt="">
          <div class="flex flex-col justify-center">
            <span class="font-bold text-tsm mb-[5.7692rem]">{{ apiData?.app_name }}</span>
            <span class="text-txs">{{ origin }}</span>
          </div>
        </div>
        <div class="w-full flex items-center text-tsm">
          <span class="mr-[13.4615rem] text-black font-bold">1.</span>
          <span class="text-[#5F6368]">Toque em</span>
          <svg
            xmlns="http://www.w3.org/2000/svg" style="stroke: #007aff;"
            class="ionicon w-[19.23rem] mx-[7.6923rem] rotate-[270deg]" viewBox="0 0 512 512"
          >
            <path
              d="M320 176v-40a40 40 0 00-40-40H88a40 40 0 00-40 40v240a40 40 0 0040 40h192a40 40 0 0040-40v-40M384 176l80 80-80 80M191 256h273"
              fill="none" stroke-linecap="round" stroke-linejoin="round" class=" ionicon-stroke-width"
            />
          </svg>
          <span class="text-[#5F6368]">na barra do navegador</span>
        </div>
        <div class="w-full flex items-center text-tsm my-[30.7692rem]">
          <span class="mr-[13.4615rem] text-black font-bold">2.</span>
          <span class="text-[#5F6368]">Role e selecione</span>
          <span class="text-[#5F6368] border border-gray-200 rounded px-[3.8461rem] ml-[7.6923rem]">Adicionar à Tela de
            Início</span>
        </div>
        <div class="w-full flex items-center text-tsm ">
          <span class="mr-[13.4615rem] text-black font-bold">3.</span>
          <span class="text-[#5F6368]">Role e selecione</span>
          <img class="w-[23.7rem] rouneded-[5.7692rem] mx-[7.6923rem]" :src="apiData?.icon" alt="">
          <span class="text-[#5F6368]"> na tela inicial</span>
        </div>
      </div>
    </div>
  </Transition>
  <!-- loading -->
  <div v-show="isLoading" class="loading">
    <div class="w-full loading-content">
      <div class=" w-[38.46rem] h-[38.46rem] text-gray-400 relative">
        <svg
          v-for="item, index in 12" :key="index" class="spinner absolute" viewBox="0 0 64 64" style=" animation-duration: 1000ms;"
          :style="{ 'transform': `rotate(${180 + index * 30}deg)`, 'animation-delay': `-${1000 - 1000 / 12 * index}ms` }"
        >
          <line
            transform="translate(32,32)" y1="17" y2="29" style="stroke-linecap: round;
    stroke: currentcolor;stroke-width: 4px;transform-origin: 0px 0px;"
          />
        </svg>
      </div>
      <div class="text-black text-[15.3846rem] mt-[15.3846rem]">
        Carregando...
      </div>
    </div>
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: transform 0.2s ease;
}

.v-enter-from .dialog2-content,
.v-leave-to .dialog2-content {
  transform: translate(0, 100%);
}

.text-txs {
  font-size: 11.5385rem;
}

.text-tsm {
  font-size: 13.4615rem;
  line-height: 19.23075rem;
}

.text-tlg {
  font-size: 17.3076rem;
  line-height: 26.923rem;
}

.text-txl {
  font-size: 19.2308rem;
  line-height: 1;
}

.text-t2xl {
  font-size: 23.0769rem;
  line-height: 1;
}

.publicUrl {
  width: 121.1537rem;
  height: 215.38rem;
  flex-shrink: 0;
  margin-right: 7.6923rem;
  background-size: 100% 100%;
}

.footer {
  background: #f5f6f8;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  padding: 11.538rem 19.2307rem;
}

.btn-juige:active {
  opacity: 0.6;
}

.footer-animate {
  left: 50%;
  top: 50%;
  width: 100rem;
  height: 100rem;
  transform: scale(0.65) translate(-50%, -50%);
  transform-origin: 0% 0%;
  position: absolute;
  opacity: 1;
  background: #d3eed8;
  z-index: 1;
  border-radius: 50%;
  animation: big 0.3s;
}

div.shiny:before {
  content: '';
  animation: shiny 6s ease-in-out infinite;
  background: #fff;
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px;
}

/* 对话样式 */
.dialog {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  z-index: 0;
  --box-shadow: 0 0 0 rgba(0, 0, 0, 0.4) !important;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
}

.dialog-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 307.692rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 19.2307rem 9.6153rem;
  background: #fff;
  border-radius: 15.3846rem;
}

.dialog2 {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 0;
  --box-shadow: 0 0 0 rgba(0, 0, 0, 0.4) !important;
  background: rgba(0, 0, 0, 0.8);
  z-index: 200;
}

.dialog2-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 26.923rem;
  padding-bottom: 30.7692rem;
  padding-left: 23.0769rem;
  padding-right: 23.0769rem;
  background: #fff;
  border-top-left-radius: 15.3846rem;
  border-top-right-radius: 15.3846rem;
  transition: transform 0.2s ease;
}

.loading {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  z-index: 0;
  --box-shadow: 0 0 0 rgba(0, 0, 0, 0.4) !important;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
}

.loading-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 215.3844rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 19.2307rem 9.615375rem;
  background: #fff;
  border-radius: 15.3846rem;
}

.ionicon-stroke-width {
  stroke-width: 32px;
}

.spin {
  animation: 750ms linear 0s infinite normal none running spin;
}

.spinner {
  animation: 1s linear 0s infinite normal none running spinner;
}

@keyframes big {
  0% {
    opacity: 0.5;
    transform: scale(0.1) translate(-50%, -50%);
  }

  100% {
    transform: scale(0.65) translate(-50%, -50%);
  }
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    transform: scale(0) rotate(45deg);
  }

  81% {
    opacity: 1;
    transform: scale(4) rotate(45deg);
  }

  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.btn-3d {
  background: linear-gradient(145deg, #4caf50, #2e7d32);
  border: none;

  box-shadow:
    4px 4px 10px rgba(0, 0, 0, 0.4),
    -4px -4px 10px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease-in-out;
}
</style>
