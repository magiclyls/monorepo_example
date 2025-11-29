// 处理键盘弹出时，输入框被遮挡的问题
// 1. ios系统下，监听focusin事件，当输入框被focus时，计算输入框的位置，如果被遮挡，则滚动到可视区域

(function (window, navigator) {
  let currentInput = null
  let timer = null
  // ios情况下
  if (/ OS \d/.test(navigator.userAgent)) {
    window.addEventListener('focusin', focusinPage)
  } else if (/Android/i.test(navigator.userAgent)) {
    window.addEventListener('click', handleAndroidResize)
  }

  function calcScrollTop(visualHeight, scrollObj) {
    scrollObj = scrollObj || window
    let currentInputTop = currentInput.getBoundingClientRect().top
    let currentInputHeight = currentInput.getBoundingClientRect().height
    let yOffset = window.pageYOffset
    if (scrollObj !== window) yOffset = scrollObj.scrollTop
    if (currentInputTop + currentInputHeight > visualHeight) {
      toY = yOffset + currentInputTop - visualHeight / 2 + currentInput.offsetHeight / 2
      scrollObj.scrollTo(0, isMobileSafari() ? toY - 50 : toY)
    }
  }

  function focusinPage(e) {
    if (/^input$/i.test(e.target.tagName) || /^textarea$/i.test(e.target.tagName)) {
      currentInput = e.target
      timer && clearTimeout(timer)
      timer = setTimeout(function () {
        calcScrollTop(window.visualViewport.height)
      }, 600)
    }
  }

  function handleAndroidResize(e) {
    if (/^input$/i.test(e.target.tagName) || /^textarea$/i.test(e.target.tagName)) {
      currentInput = e.target
      timer && clearTimeout(timer)
      timer = setTimeout(function () {
       const scrollObj =   document.querySelector('.tg-dialog-list .scroll-y')
        calcScrollTop(window.innerHeight - 100, scrollObj)
      }, 700)
    }
  }

  function isMobileSafari() {
    const ua = navigator.userAgent
    // IOS系统
    if (/ OS \d/.test(ua)) {
      // 不是Chrome
      if (!~ua.indexOf('CriOS')) {
        // 开头必须为Mozilla
        if (!ua.indexOf('Mozilla')) {
          // 结尾需为：Safari/xxx.xx
          if (/Safari\/[\d\.]+$/.test(ua))
            return true
        }
      }
    }
    return false
  }
}(window, navigator))