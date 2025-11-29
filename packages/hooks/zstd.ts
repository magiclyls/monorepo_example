import * as fzstd from 'fzstd'

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
