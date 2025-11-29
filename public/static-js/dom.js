function setHtmlFontSize() {
  const htmlWidth = document.documentElement.clientWidth
  const remScreen = 430
  let htmlFontSize = htmlWidth / remScreen * 16

  if (htmlWidth > 640) {
    htmlFontSize = 16
  }

  document.documentElement.style.fontSize = `${htmlFontSize}px`
}

setHtmlFontSize()

window.addEventListener('resize', setHtmlFontSize)
