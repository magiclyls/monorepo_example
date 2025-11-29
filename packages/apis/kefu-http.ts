import { AesUtils, getKefuToken, Local, STORAGE_KEFU_TOKEN_KEY } from '@tg/utils'
import { HttpClient } from 'feie-ui'
import { showChatError } from '../chat-h5/src/utils/chatToast'

// 类型定义
interface ApiResponse<T = any> {
  code: number
  msg?: string
  message?: string
  data: T
}

// 请求拦截器 - 设置 token 和加密
async function requestInterceptorWithToken(config: any) {
  // 设置 token
  const token = getKefuToken()
  config.headers.Authorization = token
  return config
}

// 请求拦截器 - 加密处理
function requestInterceptorWithEncryption(config: any) {
  // // 加密逻辑
  if (config.data && Object.keys(config.data).length > 0) {
    const encryptJson = JSON.parse(AesUtils.encrypt(JSON.stringify(config.data)))
    if (config.url.match(/\/hy/g)) {
      config.headers.i = encryptJson.iv
      config.headers.s = encryptJson.s
      config.data = encryptJson.ct
    }
  }

  if (config.params && Object.keys(config.params).length > 0) {
    const encryptJsonParams = JSON.parse(AesUtils.encrypt(JSON.stringify(config.params)))
    if (config.url.match(/\/hy/g) && config.method?.toLowerCase() === 'get') {
      config.headers.i = encryptJsonParams.iv
      config.headers.s = encryptJsonParams.s
      config.params = { ct: encryptJsonParams.ct }
    }
  }

  return config
}

// 响应拦截器 - 解密处理
function responseInterceptorWithDecryption(response: any) {
  // // 解密逻辑
  const responseData = response.data
  if (response.config.url.match(/\/hy/g) && responseData) {
    console.log('响应数据:', responseData)
    console.log('响应头 i:', response.headers.i)
    console.log('响应头 s:', response.headers.s)

    try {
      if (typeof responseData === 'object' && responseData.ct) {
        console.log('使用对象格式解密')
        response.data = AesUtils.decrypt(JSON.stringify(responseData))
      }
      else {
        console.log('使用字符串格式解密')
        const needDecryptJson = {
          ct: responseData,
          iv: response.headers.i,
          s: response.headers.s,
        }
        response.data = AesUtils.decrypt(JSON.stringify(needDecryptJson))
      }
      console.log('解密成功:', response.data)
    }
    catch (error) {
      console.warn('Decrypt failed:', error)
    }
  }
  return response
}

// 响应拦截器 - 错误处理
function responseInterceptorWithErrorHandler(response: any) {
  const data = response.data
  if (data && typeof data === 'object') {
    const code = (data as ApiResponse).code
    const message = (data as ApiResponse).msg ?? (data as ApiResponse).message
    if (code === 401) {
      Local.remove(STORAGE_KEFU_TOKEN_KEY)
    }
    if (code != null && code !== 0 && code !== 200) {
      showChatError(message ?? '未知錯誤')
    }
  }
  // 错误处理
  /* if (data) {
    if (((data.code === -1 || data.code === 500) && data.msg) || response.code === 500) {
      showModalCommonHint(data.msg || data.message, 5000)
    }
    else if (
      data.code === 401
      && !httpState.isTryingUpdateToken
      && httpState.retryUpdateToken < httpState.maxRetryUpdateToken
    ) {
      httpState.retryUpdateToken++
      httpState.isTryingUpdateToken = true
      // 触发 token 刷新
      if (typeof (window as any).onTokenExpired === 'function') {
        (window as any).onTokenExpired()
      }
    }
  } */

  return response
}

// 错误处理
function responseErrorHandle(error: any) {
  console.error('HTTP Error:', error)
  /* if (error.response?.status === 403 || error.response?.status === 404) {
    handle404Error()
  } */
  return Promise.reject(error)
}

// 创建 HttpClient 实例
export const httpClient = new HttpClient({
  baseURL: process.env.NODE_ENV === 'production' ? '' : '/api',
  timeout: 10000,
  isEncryption: false, // 使用自定义加密逻辑
  isSign: false,
  showConsole: process.env.NODE_ENV !== 'production',
  postCborUrlList: [], // 根据需要配置
  requestInterceptors: [
    requestInterceptorWithToken,
    requestInterceptorWithEncryption,
  ],
  responseInterceptors: [
    responseInterceptorWithDecryption,
    responseInterceptorWithErrorHandler,
  ],
  responseErrorHandle,
})
