export interface IStorageValue<T = any> {
  value: T
}

/**
 * @description: 本地存储的key
 */
export type LocalKey =
  'STORAGE_TOKEN_KEY' |
  'STORAGE_USER_INFO_KEY'

export type SessionKey =
  'STORAGE_TEST_KEY'

export class Local {
  static set<T>(key: LocalKey, value: any) {
    if (!key.trim())
      return
    const _value: IStorageValue<T> = {
      value,
    }

    if (_value.value === null || _value.value === undefined) {
      localStorage.removeItem(key)
      return
    }

    localStorage.setItem(key, JSON.stringify(_value))
  }

  static get<T>(key: LocalKey): IStorageValue<T> | null {
    if (!key.trim())
      return null

    const value = localStorage.getItem(key)

    if (value) {
      try {
        return JSON.parse(value)
      }
      catch (error) {
        console.error('Local Get error:', error)
        return null
      }
    }

    return null
  }

  static remove(key: LocalKey) {
    if (!key.trim())
      return

    localStorage.removeItem(key)
  }

  static clear(key?: LocalKey[]) {
    if (key) {
      for (const item of key)
        this.remove(item)
    }
    else {
      localStorage.clear()
    }
  }
}

export class Session {
  static set<T>(key: SessionKey, value: any) {
    if (!key.trim())
      return

    const _value: IStorageValue<T> = {
      value,
    }

    sessionStorage.setItem(key, JSON.stringify(_value))
  }

  static get<T>(key: SessionKey): IStorageValue<T> | null {
    if (!key.trim())
      return null

    const value = sessionStorage.getItem(key)

    if (value) {
      try {
        return JSON.parse(value)
      }
      catch (error) {
        console.error('Session Get error:', error)
        return null
      }
    }

    return null
  }

  static remove(key: SessionKey) {
    if (!key.trim())
      return

    sessionStorage.removeItem(key)
  }

  static clear(key?: SessionKey[]) {
    if (key) {
      for (const item of key)
        this.remove(item)
    }
    else {
      sessionStorage.clear()
    }
  }
}
