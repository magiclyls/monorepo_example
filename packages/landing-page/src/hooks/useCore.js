// import zhCN from '../locales/zh-CN'

/**
 * 检查字符串是否只包含 Base64 字符
 */
export function checkIsBase64(str) {
  const base64Pattern = /^([A-Z0-9+/=]{4})*$/i
  return base64Pattern.test(str)
}

/**
 * 解码 Base64
 */
export function base64DecodeUnicode(str) {
  // 解码 Base64
  const decodedStr = atob(str)
  // 将解码后的字符串转为 UTF-8 字符串
  const uint8Array = new Uint8Array(decodedStr.length)
  for (let i = 0; i < decodedStr.length; i++) {
    uint8Array[i] = decodedStr.charCodeAt(i)
  }
  // 使用 TextDecoder 将 Uint8Array 转为字符串
  const decodedText = new TextDecoder('utf-8').decode(uint8Array)
  return decodedText
}

/**
 * 解码数据，如果是base64
 */
export function encodeBase64String(str) {
  const isBase64 = checkIsBase64(str)
  return isBase64 ? base64DecodeUnicode(str) : str
}

/**
 * 转换多语言
 */
/* export function customT(key) {
  const dataStr = zhCN[key] || key
  return encodeBase64String(dataStr)
} */

/**
 * 是否开发环境
 */
export function isDev() {
  return import.meta.env.DEV
}
/**
 * 是否移动端
 * @returns boolean
 */
export function isMobile() {
  return window.innerWidth <= 768
}
