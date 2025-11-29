if (location.search.includes('isFlutterApp')) {
  sessionStorage.setItem('isFlutterApp', '1')
  var flutter_params = new URLSearchParams(document.location.search)
  var flutter_token = flutter_params.get('t')
  var flutter_currency = flutter_params.get('currency')
  if (flutter_token && flutter_token.length) {
    sessionStorage.setItem('flutter_token', flutter_token)
  } else {
    sessionStorage.setItem('flutter_token', '')
  }
  if (flutter_currency) {
    sessionStorage.setItem('current_global_currency', flutter_currency)
  }
}

if (location.search.includes('isFlutterApp')) {
  document.body.classList.add('in-flutter-app')
}