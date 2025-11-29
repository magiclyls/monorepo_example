import CryptoES from 'crypto-es'
import * as fzstd from 'fzstd'
import * as FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import FingerprintJSLocal from '@fingerprintjs/fingerprintjs'
import { copy as copyTest } from 'clipboard'
import type { SendFlutterAppMessage,SendFlutterThirdPartyAppMessage } from './enums'
import type { EnumCurrencyKey } from '@tg/types'
import { type EnumLanguageKeys } from '@tg/types'
import type { FlutterAppMsgType, FlutterAppQueryType } from '~/types'

// import { currencyConfig } from '~/composables/useCurrencyData'

const { VITE_I18N_DEFAULT_LANG, VITE_SITE_NAME } = getEnv()
interface IFormatNumberOptions {
  groupSize?: number
  separator?: string
}

class Application {
  /** 数字货币默认保留小数长度 */
  // #CURRENCY_DEFAULT_DECIMAL = 8

  constructor() {
    console.log('Appliction constructor')
  }

  /**
   * @description 时间戳转换成指定国家的时间
   * @param {number} timestamp 时间戳
   * @param {EnumLanguage} language 语言
   * @returns {string} 格式化后的时间
   */
  timestampToTime(
    timestamp: number,
    language: EnumLanguageKeys = VITE_I18N_DEFAULT_LANG,
  ): string {
    if (timestamp <= 0)
      return '-'
    if (timestamp.toString().length !== 13)
      timestamp = timestamp * 1000
    return new Intl.DateTimeFormat(
      language,
      { dateStyle: 'short', timeStyle: 'medium' },
    ).format(timestamp)
  }

  // /**
  //  * @description 将数字转换为货币
  //  * @param {number} number 数字
  //  * @param {typeof EnumCurrency} language 语言
  //  * @returns {string} 格式化后的货币
  //  */
  // numberToCurrency(number: number, language = EnumCurrency.BTC): string {
  //   // 法定货币列表
  //   const fiatCurrencyList = [
  //     EnumCurrency.BRL,
  //     EnumCurrency.INR,
  //   ]

  //   if (fiatCurrencyList.includes(language)) {
  //     return new Intl.NumberFormat(
  //       EnumCurrency[language],
  //       {
  //         style: 'currency',
  //         currency: EnumCurrency[language],
  //       },
  //     ).format(Number(toFixed(number, 2)))
  //   }

  //   else { return toFixed(number, this.#CURRENCY_DEFAULT_DECIMAL) }
  // }

  copy(str: string, t?: any) {
    /** legacy 兼容http复制 */
    copyTest(str)

    // const { copy: _copy, copied } = useClipboard()
    // _copy(str).then(() => {
    //   console.log('🦺🦺🦺 ~ Application ~ 复制成功')
    // })

    // /** 兼容某些垃圾浏览器 */
    // // 创建一个隐藏的 input 元素
    // const input = document.createElement('input')
    // input.setAttribute('type', 'text')
    // input.setAttribute('value', str)
    // // 设置 input 的样式，使其不可见且不影响布局
    // input.style.position = 'absolute'
    // input.style.left = '-9999px'
    // input.style.opacity = '0'

    // // 将 input 元素添加到文档中
    // document.body.appendChild(input)

    // // 选择 input 中的文本
    // input.select()
    // input.setSelectionRange(0, 99999) // 对移动设备的支持

    // // 执行复制命令
    // document.execCommand('copy')

    // // 复制完成后移除 input 元素
    // document.body.removeChild(input)
  }

  async getDeviceNumber(): Promise<string> {
    // const { VITE_FINGERPRINTJS_URL } = getEnv()
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // if (Local.get(STORAGE_FINGERPRINT)) {
      //   const visitorId = Local.get(STORAGE_FINGERPRINT)?.value as string
      //   resolve(visitorId)
      // }
      // else {
      //   const fpPromise = FingerprintJS.load()
      //   const fp = await fpPromise
      //   const visitorId = (await fp.get()).visitorId
      //   console.log('visitorId111', visitorId)
      //   Local.set(STORAGE_FINGERPRINT, visitorId)
      //   resolve(visitorId)
      // }

      if (Local.get(STORAGE_FINGERPRINT)) {
        const visitorId = Local.get(STORAGE_FINGERPRINT)?.value as string
        resolve(visitorId)
      }
      else {
        console.log('用三方付费api请求指纹')
        try {
          const fpPromise = FingerprintJS.load({
            apiKey: '8Pxqx9if0gSGgyleW5Eo',
            endpoint: 'https://fp.a95513.com',
            scriptUrlPattern: 'https://fp.a95513.com/web/v3/8Pxqx9if0gSGgyleW5Eo/loader_v3.11.0.js',
          })
          console.log('fpPromise', fpPromise)
          fpPromise
            .then(fp => fp.get())
            .then((result) => {
              const visitorId = result.visitorId
              console.log('付费设备号', visitorId)
              resolve(visitorId)
              Local.set(STORAGE_FINGERPRINT, visitorId)
            }).catch(async (e) => {
              console.log('获取设备号失败', e)
              const fpPromise = FingerprintJSLocal.load()
              const fp = await fpPromise
              const visitorId = (await fp.get()).visitorId
              console.log('本地设备号', visitorId)
              Local.set(STORAGE_FINGERPRINT, visitorId)
              resolve(visitorId)
            })
        }
        catch (error) {
          console.error('获取设备号失败2:', error)
          resolve('testaaa')
        }
      }
    })
  }

  /**
   * 将Object转换成url参数
   * @param {Record<string, any>} obj
   * @returns {string}
   */
  objectToUrlParams(obj: Record<string, any>) {
    if (Object.keys(obj).length === 0)
      return ''

    const filterObj = Object.entries(obj).filter(([, value]) => {
      if (
        typeof value === 'object'
        || Array.isArray(value)
        || value === void 0
        || value === null
        || value === ''
      )
        return false
      return true
    })

    const params = new URLSearchParams(filterObj)
    return params.toString()
  }

  /**
   * 将url参数转换成Object
   * @param {string} url
   * @returns {Record<string, any>}
   */
  urlParamsToObject(url: string) {
    const params = new URLSearchParams(url)
    const obj = Object.fromEntries(params)
    return obj
  }

  /**
   * 异步函数，Promise.allSettled
   * @param {Promise<any>[]} promises
   * @returns {Promise<any[]>}
   */
  async allSettled(promises: Promise<any>[]) {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     Promise.allSettled(promises).then((result) => {
    //       resolve(result)
    //     })
    //   }, 300)
    // })
    const result = await Promise.allSettled(promises)
    return result
  }

  /**
   * 获取图片完整服务器地址
   * @param url  图片地址
   * @returns {string}
   */
  getImgUrl(url: string) {
    if (url.startsWith('http'))
      return url

    const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
    const _url = `${url.startsWith('/') ? '' : '/'}${url}`
    return `${VITE_CASINO_IMG_CLOUD_URL}${_url}`
  }

  /**
   * 加载图片
   * @param url 图片地址
   * @returns {Promise<boolean>}
   */
  async loadImage(url: string) {
    const _url = this.getImgUrl(url)
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = _url
      img.onload = () => {
        setTimeout(() => {
          resolve(true)
        }, 220)
      }
      img.onerror = () => {
        reject(new Error(`load image error: ${_url}`))
      }
    })
  }

  /**
 * 将数字根据地区格式化
 * @param {number} number 数字
 * @returns {string} 格式化后的数字
 */
  numberToLocaleString(
    number: number,
    curLang?: EnumLanguageKeys,
    _decimal = 2,
  ) {
    const _num = Number(toFixed(number, _decimal))
    return _num.toLocaleString(curLang)
    // // 需要处理的国家
    // const countryList: EnumLanguageKeys[] = ['vi-VN']

    // const _number = toFixed(number, _decimal) // 123234.4958

    // let amount = ''

    // // 判断有没有小数点
    // if (_number.includes('.')) {
    //   const [_integerPart, _decimalPart] = _number.split('.')
    //   const integerPart = this.formatNumber(_integerPart, { groupSize: 3, separator: ',' })
    //   amount = `${integerPart}.${_decimalPart}`
    // }
    // else {
    //   amount = this.formatNumber(_number, { groupSize: 3, separator: ',' })
    // }

    // if (countryList.includes(curLang))
    //   return amount.replace('.', ',').replace(',', '.')
    // else
    //   return amount
  }

  /**
   * 通过指定的分隔符分割字符串
   * @param {string} numberStr 数字
   * @param {IFormatNumberOptions} options 选项
   * @returns {string}
   */
  formatNumber(numberStr: string, options: IFormatNumberOptions = {}) {
    const _options = Object.assign({
      groupSize: 3,
      separator: ',',
    }, options)

    const { groupSize, separator } = _options
    // 分割整数和小数部分
    const parts = numberStr.split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1] || ''

    // 添加分隔符到整数部分
    if (groupSize > 0 && separator.length > 0) {
      const regex = new RegExp(`\\B(?=(\\d{${groupSize}})+(?!\\d))`, 'g')
      integerPart = integerPart.replace(regex, separator)
    }

    // 拼接整数和小数部分
    if (decimalPart.length > 0)
      return `${integerPart}.${decimalPart}`

    else
      return integerPart
  }

  /**
   * 判断是不是虚拟货币
   * @param {EnumCurrencyKey} currency
   */
  isVirtualCurrency(currency: EnumCurrencyKey) {
    const virtualList: EnumCurrencyKey[] = [
      'USDT',
      'BTC',
      'ETH',
      'BNB',
      'LTC',
      'DOGE',
      'BCH',
      'XRP',
      'EOS',
      'TRX',
      'USDC',
      'APE',
      'BUSD',
      'CRO',
      'DAI',
      'LINK',
      'SAND',
      'SHIB',
      'UNI',
      'MATIC',
    ]
    return virtualList.includes(currency)
  }

  //   /**
  //  * 获取货币后缀长度
  //  * @param {EnumCurrencyKey} currency 货币类型
  //  * @returns {number} 后缀长度
  //  */
  //   getCurrencySuffixLength(currency: EnumCurrencyKey) {
  //     if (this.isVirtualCurrency(currency))
  //       return 6
  //     else
  //       return 2
  //   }

  /**
   * 根据长度截取字符串，或者在后面补0
   * @param {number} val 数字
   * @param {number} suffixLength 小数点后需要的长度
   *
   * @example sliceOrPad(0.2, 2) => 0.20
   * @example sliceOrPad(0.28, 8) => 0.28000000
   */
  sliceOrPad(val: number | string, suffixLength: number) {
    // 转换为字符串，以便处理小数点后的部分
    const valStr = val.toString()

    // 检查是否有小数点
    if (valStr.includes('.')) {
      const [integerPart, decimalPart] = valStr.split('.')

      // 如果小数点后的长度小于指定的长度，则在后面补0
      if (decimalPart.length < suffixLength) {
        const paddedDecimalPart = decimalPart.padEnd(suffixLength, '0')
        return `${integerPart}.${paddedDecimalPart}`
      }
      else {
        // 否则，截取小数点后指定长度的部分
        const slicedDecimalPart = decimalPart.slice(0, suffixLength)
        return `${integerPart}.${slicedDecimalPart}`
      }
    }
    else {
      // 如果没有小数点，则在后面补足指定长度的小数部分
      const paddedDecimalPart = '0'.repeat(suffixLength)
      return `${valStr}.${paddedDecimalPart}`
    }
  }

  /**
   * 去除对象中的空值 null undefined '' NaN
   * @param {Record<string, any>} obj
   * @returns {Record<string, any>}
   */
  removeEmpty(obj: Record<string, any>) {
    const newObj = { ...obj }
    Object.keys(newObj).forEach((key) => {
      const value = newObj[key]
      if (value === null || value === undefined || value === '' || Number.isNaN(value))
        delete newObj[key]
    })
    return newObj
  }

  /**
 * 最小位数2，最大位数maxDecimal 设置小数
 * @param {string | number} num 参数名
 * @returns {string }
 */
  formatNumDecimal(num: string | number, maxDecimal: number, minDecimal?: number, hadnle0 = true) {
    minDecimal = minDecimal ?? 2
    num = Number(num)
    if (hadnle0 && num === 0) {
      return '0.00'
    }
    else {
    // const maxDecimal =  currencyConfig[currency].decimal
      const parts = scientificToString(num).split('.')
      const len = parts.length > 1 ? parts[1].length : 0
      return len > minDecimal ? toFixed(num, len > maxDecimal ? maxDecimal : len) : toFixed(num, minDecimal)
    }
  }

  /**
   * 字符串脱敏 银行卡号等显示头尾各4位中间显示星号
   */
  encryptString(str: string) {
    return str ? `${str.slice(0, 4)}****${str.slice(-4)}` : ''
  }
}

export const application = new Application()

/**
 * @description 获取环境变量
 * @returns {ImportMetaEnv}
 */
export function getEnv() {
  const _env = import.meta.env
  const lang = navigator.language
  const localLang = JSON.parse(localStorage.getItem('current_language') ?? '{"value": "" }').value
  const siteName = JSON.parse(localStorage.getItem('storage_site_name') ?? '{"value": "" }').value
  const defaultLang = localLang || 'en-US'

  if (siteName)
    _env.VITE_SITE_NAME = siteName

  if (window.langChoosed) {
    _env.VITE_I18N_DEFAULT_LANG = window.langChoosed
  }
  else {
    if (!localLang) {
      const isExist = EnumLanguage
        ? Object.keys(EnumLanguage).map((key) => {
          return key
        }).includes(lang)
        : false

      if (!isExist) {
        const prefixLang = lang.split('-')[0]
        const isPrefixExist = EnumLanguage
          ? Object.keys(EnumLanguage).find((key) => {
            return key.split('-')[0] === prefixLang
          })
          : false

        if (isPrefixExist)
          _env.VITE_I18N_DEFAULT_LANG = isPrefixExist as EnumLanguageKeys
        else
          _env.VITE_I18N_DEFAULT_LANG = defaultLang
      }
      else {
        _env.VITE_I18N_DEFAULT_LANG = lang as EnumLanguageKeys
      }
    }
    else {
      _env.VITE_I18N_DEFAULT_LANG = localLang
    }
  }
  return _env
}

/**
 * 是不是test环境
 */
export function isTestEnv() {
  return getEnv().MODE === 'test'
}

/**
 * 是否为 safari浏览器
 */
function isMobileSafari() {
  const ua = navigator.userAgent
  // IOS系统
  if (/ OS \d/.test(ua)) {
    // 不是Chrome
    if (!~ua.indexOf('CriOS')) {
      // 开头必须为Mozilla
      if (!ua.indexOf('Mozilla')) {
        // 结尾需为：Safari/xxx.xx 除去Firefox和Google
        if (/Safari\/[\d\.]+$/.test(ua) && !ua.includes('Fxi') && !ua.includes('GSA'))
          return true
      }
    }
  }
  return false
}
export const isSafari = isMobileSafari() // /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

/**
 * 显示title数据便于调试
 */
export function formatTitleData(data: any) {
  return isTestEnv() ? JSON.stringify(data).replaceAll(',', ',\n').replaceAll('{', '{\n').replaceAll('}', '\n}') : ''
}

/**
 * 滚动内容区域到顶部
 */
export function scrollMainContentToTop(needScrollingXHidden?: boolean) {
  if (window.innerWidth <= 768) {
    // if (isSafari) {
    //   if (needScrollingXHidden)
    //     document.body.classList.add('over-x-hidden')
    //   window.requestAnimationFrame(() => {
    //     setTimeout(() => {
    //       // window.scrollTo({ top: -50, behavior: 'smooth' })
    //       document.querySelector('#tgTopForScroll')?.scrollIntoView({ behavior: 'smooth' })
    //       document.body.classList.remove('over-x-hidden')
    //     }, 0)
    //   })
    // }
    // else {
    //   window.requestAnimationFrame(() => {
    //     window.scrollTo({ top: 0 })
    //   })
    // }
  }
  else {
    const dom = document.getElementById('main-content-scrollable')
    dom && dom.scrollTo({ top: 0 })
  }
}

/**
 * 添加url search参数
 * @param {string} url
 * @param {string} search
 * @returns {string}
 */
export function addUrlSearch(url: string, search: string) {
  if (url.includes('?')) {
    if (search.includes('?'))
      return `${url}${search.replace('?', '&')}`

    else if (search.includes('&'))
      return `${url}${search}`

    else
      return `${url}&${search}`
  }
  else {
    if (search.includes('?'))
      return `${url}${search}`

    else
      return `${url}?${search}`
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++)
    binary += String.fromCharCode(bytes[i])

  return window.btoa(binary)
}

export function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++)
    bytes[i] = binary.charCodeAt(i)

  return bytes.buffer
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export function customB64encode(arraybuffer: ArrayBuffer) {
  const bytes = new Uint8Array(arraybuffer)
  let i
  const len = bytes.length
  let base64 = ''
  for (i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2]
    base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)]
    base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)]
    base64 += chars[bytes[i + 2] & 63]
  }
  if (len % 3 === 2)
    base64 = `${base64.substring(0, base64.length - 1)}=`

  else if (len % 3 === 1)
    base64 = `${base64.substring(0, base64.length - 2)}==`

  return base64
}

/**
 * Uint8Array转换成ArrayBuffer
 */
export function uint8ArrayToArrayBuffer(uint8Array: Uint8Array) {
  return uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteLength + uint8Array.byteOffset)
}

/**
 * 阻止滚动
 */
export function preventTMove(e: TouchEvent) {
  e.preventDefault()
}

/**
 * 获取url参数
 * @param {string} name 参数名
 * @returns {string | null}
 */
export function getUrlParam<T>(name: T) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r !== null)
    return decodeURIComponent(r[2])
  return null
}

export function handlePgGameStrToLink(gameStr: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // 将 self.location= 替换成self.pgGameUrl=
    let newGameStr = ''
    if (gameStr.includes('self.location='))
      newGameStr = gameStr.replace('self.location=', 'self.pgGameUrl=')
    else
      newGameStr = gameStr.replace('self.location.href=', 'self.pgGameUrl=')

    const parser = new DOMParser()
    const doc = parser.parseFromString(newGameStr, 'text/html')
    const script = doc.querySelector('script')
    // console.error(script?.textContent)
    // eslint-disable-next-line no-eval
    eval(script?.textContent || '')
    setTimeout(() => {
      if (window.pgGameUrl)
        resolve(window.pgGameUrl || '')
      else
        reject(new Error('pgGameUrl is not exist'))
    }, 1000)
  })
}

type TRequestQueuesQueue = () => Promise<any>

/**
 * 请求队列 - 处理请求并发
 * 应用场景 例：Mines小游戏手动翻牌子时飞速连续点击；接口正常但回调只有一个响应。
 */
class APIRequestQueue {
  queue: TRequestQueuesQueue[]
  isProcessing: boolean

  constructor() {
    this.queue = [] // 存储请求的队列
    this.isProcessing = false // 标记是否正在处理请求
  }

  async addRequest(request: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      // 将请求封装为一个包含 resolve 和 reject 的 Promise
      const wrappedRequest = async () => {
        try {
          const result = await request() // 执行请求
          resolve(result) // 请求成功，resolve Promise
        }
        catch (error) {
          reject(error) // 请求失败，reject Promise
        }
      }

      this.queue.push(wrappedRequest) // 将封装后的请求加入队列
      if (!this.isProcessing)
        this.processQueue() // 如果队列当前没有正在处理的请求，则开始处理队列
    })
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false // 队列为空，设置 isProcessing 为 false
      return // 结束处理
    }

    this.isProcessing = true // 标记当前正在处理请求

    // 从队列中取出第一个请求，并执行
    const request = this.queue.shift()
    request && await request()

    // 继续处理下一个请求
    this.processQueue()
  }
}

export const apiRequestQueue = new APIRequestQueue()

/** 是否为flutterApp */
export function isFlutterApp() {
  return getUrlParam<FlutterAppQueryType>('isFlutterApp') === FlutterAppQuery.isFlutterApp || sessionStorage.getItem('isFlutterApp') === FlutterAppQuery.isFlutterApp
}

/**
 * 获取flutterApp token
 * @returns {string | null}
 */
export function getFlutterAppToken() {
  return sessionStorage.getItem('flutter_token') // getUrlParam<FlutterAppQueryType>('t')
}

/**
 * 发送消息到flutterApp
 * @param type 消息类型
 * @param args 消息参数
 */
export function sendMsgToFlutterApp(type: SendFlutterAppMessage, args?: any) {
  if (!window.flutter_inappwebview)
    return
  if (window.flutter_inappwebview.callHandler)
    window.flutter_inappwebview.callHandler('handlerCallbacks', JSON.stringify({ type, args }))
  else
    window.flutter_inappwebview._callHandler('handlerCallbacks', setTimeout(() => { }), JSON.stringify({ type, args }))
}
/**
 * 发送消息到flutter三方App
 * @param type 消息类型
 * @param args 消息参数
 */
export function sendMsgToFlutterThirdPartyApp(type: SendFlutterThirdPartyAppMessage, args = { uid: 0 }) {
  if (window.jsBridge && typeof window.jsBridge.postMessage !== 'undefined') {
      window.jsBridge?.postMessage(type, JSON.stringify(args))
    }
  else if (window.webkit?.messageHandlers?.eventTracker?.postMessage) {
    /* iOS */
    window.webkit?.messageHandlers?.eventTracker?.postMessage({
      eventName: type,
      eventValue: JSON.stringify(args),
    })
  }
}
window.flutterAppCallback = function (p?: string) {
  if (p && p.length) {
    try {
      const param: FlutterAppMsgType = JSON.parse(p)
      appEventBus.emit(EventBusNames.RECEIVE_FLUTTER_APP_MSG, param)
    }
    catch {}
  }
}

export function getCrashPoint(gameHash: string, blockHash: string) {
  const hMac = CryptoES.algo.HMAC.create(CryptoES.algo.SHA256, gameHash)
  hMac.update(blockHash)
  const hexStr = CryptoES.enc.Hex.stringify(hMac.finalize()) //  hMac.digest('hex').slice(0, 8)
  const intVal = new Big(Number(`0x${hexStr.slice(0, 8)}`))

  // 计算崩溃点
  const numerator = new Big(2).pow(32)
  const denominator = intVal.plus(1)
  let crashPoint = numerator.div(denominator)
  crashPoint = crashPoint.times(0.99)

  // 确保最低崩溃点为 1
  if (crashPoint.lt(1))
    crashPoint = new Big(1)

  return [floor(crashPoint, 2).toFixed(2), crashPoint, hexStr, intVal.valueOf()]
}

// console.log(getCrashPoint('275456608a069d789996c03a8fdc901d77693ed7a60e2f4b6497f22785f0aa7c', '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4'))

/**
 * 是否是商户后台加载
 */
export function isAdmin() {
  return getUrlParam('admin') === '1'
}

/** 解密zstd */
export function decompressZstd(response: any) {
  const isZstd = response.headers['content-type'].includes('application/octet-stream')
  if (isZstd) {
    const compressed = new Uint8Array(response.data)
    const decompressed = fzstd.decompress(compressed)
    const result = new TextDecoder().decode(decompressed)
    if (result)
      response.data = JSON.parse(result)
  }
  else {
    const result = new TextDecoder().decode(new Uint8Array(response.data))
    if (result)
      response.data = JSON.parse(result)
  }

  console.groupCollapsed(`请求URL: ${response.config.url}`)
  console.log('请求参数Params:', response.config.params)
  console.log('响应数据Data:', response.config.data)
  console.log('响应数据:', response.data)
  console.groupEnd()

  return response
}

/**
 * is Ios
 */
export function isIos() {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
}

/**
 * is Android
 */
export function isAndroid() {
  return /android/.test(navigator.userAgent.toLowerCase())
}

/**
 * is 小米浏览器
 */
export function isMiBrowser() {
  return /MiuiBrowser/i.test(navigator.userAgent)
}

/**
 * 是否为Pwa打开
 */
export function isPwa() {
  const isIOS = (window.navigator as Record<string, any>).standalone === true
  const isOtherBrowsers = window.matchMedia('(display-mode: standalone)').matches
  return isIOS || isOtherBrowsers
}

/**
 * 是否为App嵌套
 */
export function isAppNested() {
  return getUrlParam('devicenumber') !== null && getUrlParam('devicenumber') !== void 0
}

/**
 * 判断是不是外部链接
 * @param path
 * @returns {boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 检查当前 url apk 是不是可以下载
 * @param {string} url
 * @returns {boolean}
 */
export async function checkApkUrl(url: string) {
  return new Promise((resolve) => {
    if (isExternal(url) && url.includes('.apk'))
      resolve(true)
      // fetch(url).then((response) => {
      //   if (response.status === 200)
      //     resolve(true)
      //   else
      //     resolve(null)
      // })

    else
      resolve(null)
  })
}

/** 特殊需求，ty 传值修改 */
export function getTy(params: any) {
  if (params && params.ty) {
    if (params.ty && +params.ty === 2)
      params.ty = 4
    else if (params.ty && +params.ty === 3)
      params.ty = 2
  }
  return params
}

/**
 * 获取文件后缀
 * @param filePath
 * @returns
 */
export function getFileExtension(filePath: string) {
  const match = filePath.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1] : null // 如果匹配成功，返回后缀，否则返回 null
}

/**
 * 加载图片
 * @param url 图片地址
 */
export function preloadImage(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      resolve(true)
    }
    img.onerror = () => {
      reject(new Error(`load image error: ${url}`))
    }
  })
}

/**
 * 获取query参数
 * @param name 参数名
 * @returns {string | null}
 */
export function getParamsQuery<T>(name: string): T {
  const params = new URLSearchParams(window.location.search)
  return params.get(name) as T
}

/**
 * 添加或更新 URL 参数的方法
 * @param {string} key 参数名
 * @param {string} value 参数值
 */
export function addUrlParam(key: string, value: string) {
  // 获取当前的 URL
  const currentUrl = new URL(window.location.href)

  // 更新或添加参数
  currentUrl.searchParams.set(key, value)

  // 使用 history API 更新 URL（不刷新页面）
  window.history.replaceState(null, '', currentUrl.toString())
}

/**
 * 监听 添加或更新 URL 参数的方法
 */
function bindEventListener(type: 'pushState' | 'replaceState') {
  const historyEvent = history[type] as (...args: any[]) => any

  return function (this: History, ...args: any[]) {
    const newEvent = historyEvent.apply(this, args)
    const e = new Event(type) as Event & { arguments: any[] }
    e.arguments = args
    window.dispatchEvent(e)
    return newEvent
  }
}
history.pushState = bindEventListener('pushState')
history.replaceState = bindEventListener('replaceState')
/**
 * 锁定body滚动
 * @param {boolean} isLock 是否锁定
 * @param {string} className 锁定时添加的类名
 * @returns {void}
 * @example lockBodyScroll(true, 'lock-scroll')
 * @example lockBodyScroll(false, 'lock-scroll')
 */
export function lockBodyScroll(isLock: boolean, className = 'lock-scroll') {
  const body = document.body
  if (isLock)
    body.classList.add(className)

  else
    body.classList.remove(className)
}

export function checkLogin() {
  const token = Local.get(STORAGE_TOKEN_KEY)?.value
  if (!token) {
    // 显示登录弹窗

    return false
  }
  return true
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
