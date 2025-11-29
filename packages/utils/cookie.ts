/**
 * Cookie 操作工具类
 */
export class Cookie {
  /**
   * 获取cookie
   * @param name cookie名称
   */
  static get(name: string): string | undefined {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
    return match ? decodeURIComponent(match[2]) : undefined
  }

  /**
   * 设置cookie
   * @param name cookie名称
   * @param value cookie值
   * @param days 过期天数
   */
  static set(name: string, value: string, days = 7): void {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`
  }

  /**
   * 删除cookie
   * @param name cookie名称
   */
  static remove(name: string): void {
    this.set(name, '', -1)
  }

  /**
   * 获取所有cookie
   */
  static getAll(): Record<string, string> {
    return document.cookie
      .split(';')
      .reduce((cookies: Record<string, string>, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim())
        if (name && value)
          cookies[name] = decodeURIComponent(value)
        return cookies
      }, {})
  }
}
