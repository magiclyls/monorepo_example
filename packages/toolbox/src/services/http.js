import qs from 'qs';
import { useUserStore } from '@/store';
import {getToken, removeToken} from "@/utils/index.js";
import { message } from '@/utils'

const request = async (url, options = {}) => {

  const { timeout = 80000 } = options
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    if (!options.hiddenLoading) {
    }

    const headers = {
      'Content-type': options.type === 'file' ? 'multipart/form-data' : 'application/json',
    }

    if (getToken()) {
      headers['Authorization'] = `Bearer ${getToken()}`
    }

    const response = await fetch(`${url}`, {
      ...options,
      signal: controller.signal,
      headers,
    })
    let result = await response.json();
    result = result || {}
    // 错误响应拦截至catch, app 打包 api 不需要提示
    if (+result.status !== 0) {
      throw (result.data);
    }
    return [result.data, null, result]
  } catch (e) {
    if (e === 'token') {
      removeToken()
      window.location.href = window.location.origin + '/login'
    } else {
      message.error(e)
    }
    return [null, e];
  } finally {
    clearTimeout(id);
  }
}

const http = {
  get: async (url, data = {}, options = {}) => {
    data = Object.assign({}, data, { t: new Date().valueOf() })
    options = Object.assign({}, options, { method: 'GET' })
    return await request(`${url}?${qs.stringify(data)}`, options)
  },
  delete: async (url, data = {}, options = {}) => {
    data = Object.assign({}, data, { t: new Date().valueOf() })
    options = Object.assign({}, options, { method: 'DELETE' })
    return await request(`${url}?${qs.stringify(data)}`, options)
  },
  post: async (url, data = {}, options = {}) => {
    data = Object.assign({}, data)
    options = Object.assign({}, options,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    )
    return await request(`${url}`, options)
  },
  put: async (url, data = {}, options = {}) => {
    data = Object.assign({}, data, { t: new Date().valueOf() })
    options = Object.assign({}, options,
      {
        method: 'PUT',
        body: JSON.stringify(data)
      }
    )
    return await request(url, options)
  },
  patch: async (url, data = {}, options = {}) => {
    data = Object.assign({}, data, { t: new Date().valueOf() })
    options = Object.assign({}, options,
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      }
    )
    return await request(`${url}?${qs.stringify(data)}`, options)
  }
}

export default http
