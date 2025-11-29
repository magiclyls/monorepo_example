// 获取当前时间戳（以分钟为单位）
const minuteTimestamp = Math.floor(Date.now() / 60000);
const scriptTag = document.createElement('script')
scriptTag.src = `https://cstaticdun.126.net/load.min.js?t=${minuteTimestamp}`
document.body.appendChild(scriptTag)