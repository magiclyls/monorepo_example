window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.installPromptEvent = e
})