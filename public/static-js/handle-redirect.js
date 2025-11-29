(function () {
  function handleRedirect() {
    const { search, pathname } = window.location
    const isMobile = isMobileFn() || window.innerWidth < 768
    const isInMobilePath = pathname.startsWith('/m')

    // 移动端：跳到 /m/，只保留 query
    if (isMobile && !isInMobilePath) {
      const newUrl = `/m/${search}`
      window.location.replace(newUrl)
    }
    // PC端：跳到根路径 /，只保留 query
    else if (!isMobile && isInMobilePath) {
      const newUrl = `/${search}`
      window.location.replace(newUrl)
    }
  }

  function isMobileFn() {
    // 新标准
    if (navigator.userAgentData) {
      return navigator.userAgentData.mobile
    }

    // 旧标准 UA
    return /Mobile|Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Opera Mini/i.test(
      navigator.userAgent,
    )
  }

  // 初次加载判断
  setTimeout(handleRedirect, 10)

  // 监听窗口变化（防抖）
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(handleRedirect, 300)
  })
})()
