if (location.search.includes('isFlutterApp')) {
  sessionStorage.setItem('isFlutterApp', '1')
  const flutter_params = new URLSearchParams(document.location.search)
  const flutter_token = flutter_params.get('t')
  const flutter_currency = flutter_params.get('currency')
  const flutter_lang = flutter_params.get('lang')

  if (flutter_token && flutter_token.length) {
    sessionStorage.setItem('flutter_token', flutter_token)
  }
  else {
    sessionStorage.setItem('flutter_token', '')
  }

  if (flutter_currency) {
    sessionStorage.setItem('current_global_currency', flutter_currency)
  }

  // 根据URL参数设置语言
  if (flutter_lang) {
    // 将语言参数存储到localStorage，供vue-i18n使用
    localStorage.setItem('LANGUAGE_VUE_I18N_KEY_VITE', flutter_lang)
  }
}

if (location.search.includes('isFlutterApp')) {
  document.body.classList.add('in-flutter-app')
}
