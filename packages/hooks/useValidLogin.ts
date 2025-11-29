export function useValidLogin() {
  const emailReg = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  /** 用户名(3-14字符,数字和字母) */
  const usernameReg = /^\w{3,30}$/

  function validLogin(value: string) {
    if (!value)
      return false
    if (value.length < 5 || value.length > 30)
      return false
    return true
  }
  function validEmail(str: string) {
    if (str.match('[^@.a-zA-Z0-9_]'))
      return '用户名含有无效的字符'
    else if (!emailReg.test(str))
      return '请输入正确的电邮地址'
    return ''
  }
  // 待定
  return { valid: validLogin }
}
