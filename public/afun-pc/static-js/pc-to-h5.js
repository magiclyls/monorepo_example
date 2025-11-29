function isMobileFn() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function setMobileBodyStyle (initWidth = 500) {
  if (isMobileFn()) {
    document.body.style.width = '100%';
  } else {
    document.body.style.width = initWidth + 'px';
  }
}

