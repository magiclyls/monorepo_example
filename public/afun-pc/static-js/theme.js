var localstorage_theme_variables = localStorage.getItem('storage_theme_variables');

if (localstorage_theme_variables) {
  try {
    var themeVariables = JSON.parse(localstorage_theme_variables);
    document.documentElement.setAttribute('theme', themeVariables.value || '')
  } catch (e) {
    console.log('本地存储的主题变量不是有效的 JSON 字符串')
  }
}