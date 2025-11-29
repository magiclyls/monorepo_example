import { Local } from './storage'

export type StatisticsType = 'google' | 'facebook' | 'tiktok' | 'kwai'

/**
 * 埋点自定义事件
 */
export enum CustomStatisticsEvent {
  /** 购物（注册） */
  REGISTER = 'register',
  /** 首充（首次充值） */
  FIRST_CHARGE = 'firstrecharge',
  /** 内容浏览（页面刷新） */
  CONTENT_VIEW = 'contentView',
  /** 付款完成 */
  PAY_COMPLETE = 'payComplete',
  /** 添加到购物车 */
  ADD_TO_CART = 'addToCart',
}

/**
 * kwai 事件不能自定义，需要使用官方提供的
 * @see https://docs.qingque.cn/d/home/eZQCNZ1wBFnEpQEAMmOhfoVwI?identityId=1pTerwwOjbg
 */
export const kwaiMap: Record<CustomStatisticsEvent, string> = {
  [CustomStatisticsEvent.REGISTER]: 'completeRegistration',
  [CustomStatisticsEvent.FIRST_CHARGE]: 'firstDeposit',
  [CustomStatisticsEvent.CONTENT_VIEW]: 'contentView',
  [CustomStatisticsEvent.PAY_COMPLETE]: 'purchase',
  [CustomStatisticsEvent.ADD_TO_CART]: 'addToCart',
}

/**
 * TikTok 使用原生事件
 */
export const tikTokMap: Record<CustomStatisticsEvent, string> = {
  [CustomStatisticsEvent.REGISTER]: 'completeRegistration',
  [CustomStatisticsEvent.FIRST_CHARGE]: 'firstDeposit',
  [CustomStatisticsEvent.CONTENT_VIEW]: 'contentView',
  [CustomStatisticsEvent.PAY_COMPLETE]: 'purchase',
  [CustomStatisticsEvent.ADD_TO_CART]: 'addToCart',
}

/**
 * Facebook 使用原生事件
 */
export const facebookMap: Record<CustomStatisticsEvent, string> = {
  [CustomStatisticsEvent.REGISTER]: 'CompleteRegistration',
  [CustomStatisticsEvent.FIRST_CHARGE]: 'Purchase',
  [CustomStatisticsEvent.CONTENT_VIEW]: 'ViewContent',
  [CustomStatisticsEvent.PAY_COMPLETE]: 'Purchase',
  [CustomStatisticsEvent.ADD_TO_CART]: 'InitiateCheckout',
}

function setStatisticsAttr(key: 'fbq' | 'kwaiq' | 'ttq', event: string) {
  const eventDom = document.querySelector('#app-global-statistics')
  eventDom && eventDom.setAttribute(`data-${key}-${dayjs().format('MM-DD-HH:mm:ss')}`, event)
}

/**
 * 统计类
 */
export class Statistics {
  /** 统计对象 */
  o: Record<StatisticsType, string> = {
    google: '',
    facebook: '',
    tiktok: '',
    kwai: '',
  }

  #initStatus = {
    google: false,
    facebook: false,
    tiktok: false,
    kwai: false,
  }

  constructor() {
    console.log('Statistics constructor called')
    this.init() // 在构造函数中调用 init
  }

  /**
   * 发送统计事件
   * @param event 事件名称
   * @param customData 自定义数据对象
   */
  static sendStatisticsCustomEvent(event: CustomStatisticsEvent, customData?: Record<string, any>) {
    if (window.fbq) {
      setStatisticsAttr('fbq', event)
      window.fbq('track', facebookMap[event], customData)
    }

    if (window.ttq) {
      setStatisticsAttr('ttq', event)
      window.ttq.track(tikTokMap[event], customData)
    }

    if (window.kwaiq) {
      setStatisticsAttr('kwaiq', event)
      window.kwaiq.track(kwaiMap[event], customData)
    }
  }

  init() {
    console.log('Statistics init called')

    // 从 localStorage 获取 Pixel ID
    const fbPixelId = Local.get(STORAGE_FB_PIXEL_ID)?.value
    // 从 URL 参数获取 Pixel ID
    const fbPixelIdFromUrl = new URLSearchParams(document.location.search).get('fbPixelId')
    console.log('FB Pixel ID from URL:', fbPixelIdFromUrl)

    this.o.google = (Local.get('tggoogleId')?.value as any) ?? ''
    this.o.facebook = fbPixelIdFromUrl || fbPixelId || ((Local.get('tgfacebookId')?.value as any) ?? '')
    this.o.tiktok = (Local.get('tgtiktokId')?.value as any) ?? ''
    this.o.kwai = (Local.get('tgkwaiId')?.value as any) ?? ''

    if (this.o.facebook) {
      Local.set(STORAGE_FB_PIXEL_ID, {
        value: this.o.facebook,
      })
    }

    if (this.o.google && !this.#initStatus.google)
      this.initGoogle(this.o.google)

    if (this.o.facebook && !this.#initStatus.facebook) {
      console.log('Will initialize Facebook with ID:', this.o.facebook)
      this.initFacebook(this.o.facebook)
    }

    if (this.o.tiktok && !this.#initStatus.tiktok)
      this.initTikTok(this.o.tiktok)

    if (this.o.kwai && !this.#initStatus.kwai)
      this.initKwai(this.o.kwai)

    // 缩短通知时间到 3 秒
    setTimeout(() => {
      console.log('Emitting STATISTICS_BUS event with:', this.o)
      appEventBus.emit(EventBusNames.STATISTICS_BUS, this.o)
    }, 3000)
  }

  /**
   * 判断是不是马甲包
   */
  get checkIsApp() {
    const params = new URLSearchParams(document.location.search)
    return params.get('google') || params.get('facebook') || params.get('tiktok') || params.get('kwai')
  }

  /**
   * Google 统计
   * @param id google统计id
   */
  initGoogle(id: string) {
    const tem = `
      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${id}');
      </script>
    `
    this.addDom({
      str: tem,
      className: 'google-class-name',
    })
    this.#initStatus.google = true
  }

  /**
   * Facebook 统计
   * @param id facebook Pixi id
   */
  initFacebook(id: string) {
    console.log('Initializing Facebook Pixel with ID:', id)
    const tem = `
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${id}');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
  `
    this.addDom({
      str: tem,
      className: 'facebook-class-name',
    })
    this.#initStatus.facebook = true
    console.log('Facebook pixel initialization completed, status:', this.#initStatus.facebook)
    console.log('Facebook pixel global object exists:', !!window.fbq)
    // setInterval(() => {
    //   if (window.fbq) {
    //     window.fbq('track', 'InitiateCheckout');
    //     window.fbq('track', 'login');
    //     window.fbq('track', 'register');
    //     window.fbq('track', 'promo');
    //   }
    // }, 3 * 1000)
  }

  /**
   * TikTok 统计
   * @param id tiktok统计id
   */
  initTikTok(id: string) {
    const tem = `
    <script>
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;
        var ttq=w[t]=w[t]||[];
        ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
      )ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;
        e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
      ttq.load('${id}');
      ttq.page();
      ttq.instance_id = '${id}';
    }(window, document, 'ttq');
    </script>`
    this.addDom({
      str: tem,
      className: 'tiktok-class-name',
    })
    this.#initStatus.tiktok = true
  }

  /**
   * 快手 统计
   * @param id 快手统计id
   */
  initKwai(id: string) {
    const tem = `
    <script>
    !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.install=t():e.install=t()}(window,(function(){return function(e){var t={};
    function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};
    return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;
      if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);
      if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";var r=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};!function(e){var t=window;t.KwaiAnalyticsObject=e,t[e]=t[e]||[];var n=t[e];n.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];var o=function(e,t){e[t]=function(){var n=Array.from(arguments),o=r([t],n,!0);e.push(o)}};n.methods.forEach((function(e){o(n,e)})),n.instance=function(e){var t=n._i[e]||[];return n.methods.forEach((function(e){o(t,e)})),t},n.load=function(t,r){n._i=n._i||{},n._i[t]=[],n._i[t]._u="https://s1.kwai.net/kos/s101/nlav11187/pixel/events.js",n._t=n._t||{},n._t[t]=+new Date,n._o=n._o||{},n._o[t]=r||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src="https://s1.kwai.net/kos/s101/nlav11187/pixel/events.js?sdkid="+t+"&lib="+e;var i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(o,i)}}("kwaiq")}])}));
    </script>
    <script>
    kwaiq.load('${id}');
    kwaiq.page();
    kwaiq.instance_id ='${id}'
    </script>
    `
    this.addDom({
      str: tem,
      className: 'kwaiq-class-name',
    })
    this.#initStatus.kwai = true

    setTimeout(() => {
      Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.CONTENT_VIEW, {
        testPageOnLoad: 'testPageOnLoad',
      })
    }, 5000)
  }

  addDom(map: {
    str: string
    className: string
  }) {
    const div = document.createElement('div')
    div.className = map.className
    div.style.width = '0px'
    div.style.height = '0px'
    div.style.display = 'none'
    document.body.appendChild(div)
    const range = document.createRange()
    range.selectNode(div)
    const doc = range.createContextualFragment(map.str)
    div.appendChild(doc)
  }
}

/**
   * 发送统计事件
   * @param event 事件名称
   * @param customData 自定义数据对象
   */

export const statisticsObj = new Statistics()
