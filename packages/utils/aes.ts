import CryptoES from 'crypto-es'
import { Local, STORAGE_KEFU_TOKEN_EXPIRED, STORAGE_KEFU_TOKEN_KEY, STORAGE_KEFU_VISITER_ID } from './storage'

const key = 'Xp2s5v8y/B?D(G+KbPeShVmYq3t6w9z$'

interface CryptoESAesJsonObject {
  ct: string
  iv?: string
  s?: string
}

const CryptoESAesJson = {
  stringify(cipherParams: any): string {
    const j: CryptoESAesJsonObject = {
      ct: CryptoES.enc.Base64.stringify(cipherParams.ciphertext),
    }
    if (cipherParams.iv) {
      j.iv = cipherParams.iv.toString()
    }
    if (cipherParams.salt) {
      j.s = cipherParams.salt.toString()
    }
    return JSON.stringify(j)
  },

  parse(jsonStr: string): any {
    const j: CryptoESAesJsonObject = JSON.parse(jsonStr)
    const cipherParams = CryptoES.lib.CipherParams.create({
      ciphertext: CryptoES.enc.Base64.parse(j.ct),
    })

    if (j.iv) {
      cipherParams.iv = CryptoES.enc.Hex.parse(j.iv)
    }
    if (j.s) {
      cipherParams.salt = CryptoES.enc.Hex.parse(j.s)
    }
    return cipherParams
  },
}

/**
 * AES 加密工具对象
 */
export const AesUtils = {
  /**
   * 加密
   * @param data 加密数据
   */
  encrypt(data: any): string {
    return CryptoES.AES.encrypt(JSON.stringify(data), key, {
      format: CryptoESAesJson,
    }).toString()
  },

  /**
   * 加密并转换为 Base64
   * @param data 加密数据
   */
  encrypt64(data: any): string {
    const encrypted = this.encrypt(data)
    return CryptoES.enc.Base64.stringify(CryptoES.enc.Utf8.parse(encrypted))
  },

  /**
   * 解密
   * @param data 待解密文本
   */
  decrypt<T = any>(data: string): T {
    try {
      const decrypted = CryptoES.AES.decrypt(data, key, {
        format: CryptoESAesJson,
      })

      const decryptedString = decrypted.toString(CryptoES.enc.Utf8)

      if (!decryptedString) {
        throw new Error('解密失败：结果为空')
      }

      return JSON.parse(decryptedString) as T
    }
    catch (error) {
      throw new Error(`解密失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  },

  /**
   * 从 Base64 解密
   * @param data Base64 编码的加密数据
   */
  decrypt64<T = any>(data: string): T {
    try {
      const decoded = CryptoES.enc.Base64.parse(data).toString(CryptoES.enc.Utf8)
      return this.decrypt<T>(decoded)
    }
    catch (error) {
      throw new Error(`Base64 解密失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  },
}

/**
 * 获取客服token
 * @returns {string | undefined}
 */
export function getKefuToken() {
  return Local.get<string>(STORAGE_KEFU_TOKEN_KEY)?.value
}

/**
 * 设置客服token
 */
export function setKefuToken(token: string) {
  return Local.set(STORAGE_KEFU_TOKEN_KEY, token)
}

/**
 * 获取客服token过期时间
 * @returns {number | undefined}
 */
export function getKefuTokenExpired() {
  return Local.get<string>(STORAGE_KEFU_TOKEN_EXPIRED)?.value
}

export function setKefuTokenExpired(timestamp: number) {
  return Local.set(STORAGE_KEFU_TOKEN_EXPIRED, timestamp.toString())
}

export function getKefuVisiterId() {
  return Local.get<string>(STORAGE_KEFU_VISITER_ID)?.value
}

export function setKefuVisiterId(visiter_id: string) {
  return Local.set(STORAGE_KEFU_VISITER_ID, visiter_id)
}
