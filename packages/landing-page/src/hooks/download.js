import { ApiMemberBrandAppVersion, ApiMemberMarketDetail } from '@tg/apis'
import { getBrandInfo } from '@tg/utils'
import * as fzstd from 'fzstd'
import { getCurrentSiteConfig } from '../config/site'
import { encodeBase64String } from './index'

const c = new URLSearchParams(window.location.search)?.get('c')?.replace(/\//g, '')
function getpackageName1() {
  const site = window.site
  const siteData = getCurrentSiteConfig()
  if (site && siteData[site]) {
    return encodeBase64String(siteData[site].domains).split(',')[0]
  }
  else {
    console.error('getpackageName1')
  }
}

let downloadType = ''
let sharetraceKey = ''
let xi_domain = ''
const packageName1 = getpackageName1()

function getDevice() {
  const isMobile = window.innerWidth <= 768
  if (isMobile)
    return 25
  else return 24
}

export function getconfig() {
  const api_domain = getBrandInfo('app.api_domain')
  xi_domain = api_domain?.vg_install_domain
  sharetraceKey = api_domain?.vg_install_key
  downloadType = api_domain?.type
  ApiMemberBrandAppVersion()
    .then((d) => {
      const iosDownload_url = d?.ios?.link?.primary
      iosDownload_url && sessionStorage.setItem('downloadIosLink', iosDownload_url)
      const androidDownload_url = d?.android?.link?.primary
      androidDownload_url && sessionStorage.setItem('downloadAndroidLink', androidDownload_url)
      console.log('链接', iosDownload_url)
    })
  ApiMemberMarketDetail(c)
    .then((d) => {
      console.log('渠道链接', d)
      //  /** 渠道apk */ apk: string  /** 官方apk */  official_apk: string  /** 官方备用apk */
      const { apk, official_apk, official_reserve_apk, channel_id } = d
      apk && sessionStorage.setItem('downloadapk', apk)
      official_apk && sessionStorage.setItem('downloadofficial_apk', official_apk)
      official_reserve_apk && sessionStorage.setItem('downloadofficial_reserve_apk', official_reserve_apk)
      channel_id && sessionStorage.setItem('downloadchannel_id', channel_id)
    })
}

let androidApkUrl

export async function downApp() {
  androidApkUrl = await getApkUrl()
  if (
    (isIOS() && !sessionStorage.downloadIosLink)
    || (!isIOS() && !sessionStorage.downloadAndroidLink && !sessionStorage.downloadapk && !sessionStorage.downloadofficial_apk && !sessionStorage.downloadofficial_reserve_apk)
  ) {
    getconfig()
    return false
  }

  // window.ShareTrace?.download()
  window.DankeX?.download('x3cf5c98b5803d63', `channelDomain=${packageName1}&channelCode=${c}`)
  downLink()
}

function downLink(d) {
  isIOS()
    ? setTimeout(() => { window.location.href = sessionStorage.downloadIosLink }, 0)
    : setTimeout(() => { window.location.href = androidApkUrl }, 0)
}

export function isIOS() {
  const u = navigator.userAgent
  return (
    !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    || u.includes('iPhone')
    || u.includes('iPad')
    || u.includes('Macintosh')
  )
}

export function isAndroid() {
  const o = navigator.userAgent
  return (
    o.includes('Android')
    || o.includes('Adr')
    || o.includes('Linux')
  )
}

/** 解密zstd */
function decompressZstd(response) {
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

  return response
}

/**
 * 获取可以使用的Apk下载地址
 */
async function getApkUrl() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let errorIndex = 0
    const allApkUrl = [
      sessionStorage.downloadapk,
      sessionStorage.downloadofficial_apk,
      sessionStorage.downloadofficial_reserve_apk,
      sessionStorage.downloadAndroidLink,
    ].filter(Boolean)
    if (allApkUrl.length === 0)
      resolve(undefined)
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

async function checkApkUrl(url) {
  return new Promise((resolve) => {
    if (isExternal(url) && url.includes('.apk'))
      resolve(true)
    else
      resolve(null)
  })
}
function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.search.substr(1).match(reg)
  if (r !== null)
    return decodeURIComponent(r[2])
  return null
}
