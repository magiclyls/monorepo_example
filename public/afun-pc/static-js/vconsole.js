if (location.search.includes('vconsole')) {
  var script = document.createElement('script')
  script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js'
  script.onload = function () {
    var vConsole = new window.VConsole()
  }
}