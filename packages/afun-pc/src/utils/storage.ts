export interface IStorageValue<T = any> {
  value: T
}

/**
 * @description: 本地存储的key
 */
export const STORAGE_TOKEN_KEY = 'token'
export const STORAGE_REG_PARAMS_KEYWORDS = 'reg_params'
export const STORAGE_SEARCH_KEYWORDS_LIVE = 'search_keywords_live'
export const STORAGE_SEARCH_KEYWORDS_SPORTS = 'search_keywords_sports'
export const STORAGE_MENU_EXPAND_DOMID = 'menu_expand_domid'
export const STORAGE_RIGHT_SIDEBAR_CONTENT = 'right_sidebar_content'
export const STORAGE_SPORTS_PANEL_TYPE_KEY = 'sports_panel_type'
export const STORAGE_SPORTS_ODDS_TYPE_KEY = 'sports_odds_type'
export const STORAGE_CURRENT_GLOBAL_CURRENCY_KEY = 'current_global_currency'
export const STORAGE_HIDE_ZERO_BALANCE_KEY = 'hide_zero_balance'
export const STORAGE_SPORTS_CURRENT_PROVIDER = 'sports_current_provider'
export const STORAGE_SPORTS_BET_ORDER = 'sports_bet_order'
export const STORAGE_SPORTS_LIVE_NAV = 'storage_sports_live_nav'
export const STORAGE_MENU_LEFT_EXPAND = 'storage_menu_left_expand'
export const STORAGE_MENU_ACTIVE_ITEM = 'storage_menu_active_item'
export const STORAGE_CLEAR_LIVE = 'storage_clear_live'
export const STORAGE_CLEAR_SPORTS = 'storage_clear_sports'
export const STORAGE_CASINO_GAME_CURRENCY = 'storage_casino_game_currency'
export const STORAGE_THIRDREG_PARAMS_KEYWORDS = 'storage_thirdreg_params_keywords'
export const STORAGE_NO_MORE_TIP_DAY = 'storage_no_more_tip_day'
export const STORAGE_SPORTS_IS_MAINTAINED = 'storage_sports_is_maintained'
export const STORAGE_READED_NOTICE = 'storage_readed_notice'
export const STORAGE_MINI_GAME_SOUNDS_VOLUME = 'mini_game_sounds_volume'
export const STORAGE_MINI_GAME_SOUNDS_ENABLED = 'mini_game_sounds_enabled'
export const STORAGE_MINI_GAME_HOTKEYS_ENABLED = 'mini_game_hotKeys_enabled'
export const STORAGE_FIAT_CURRENCY_DEPOSIT_URL = 'fiat_currency_deposit_url'
export const STORAGE_CURRENT_LANGUAGE = 'current_language'
export const STORAGE_PROMO_AD_POP_UNLOGIN = 'storage_promo_ad_pop_UNLOGIN'
export const STORAGE_PROMO_AD_POP_LOGIN = 'storage_promo_ad_pop_LOGIN'
export const STORAGE_MINIGAME_MAX_BET = 'STORAGE_MINIGAME_MAX_BET'
export const STORAGE_DEPOSIT_COUNT = 'STORAGE_DEPOSIT_COUNT'
export const STORAGE_MINI_CRASH_RENDER_FRAME = 'STORAGE_MINI_CRASH_RENDER_FRAME'
export const STORAGE_LOGIN_MQTT_ID = 'STORAGE_LOGIN_MQTT_ID'
export const STORAGE_COOKIE = 'storage_cookie'
export const STORAGE_FINGERPRINT = 'storage_fingerprint'
export const STORAGE_SITE_NAME = 'storage_site_name'
export const STORAGE_THEME_NAME = 'storage_theme_name'
export const STORAGE_REDRAIN_LAST_BONUS = 'storage_redrain_last_bonus'
export const STORAGE_REDRAIN_LAST_BONUS_ACCOUNT = 'storage_redrain_last_bonus_account'
export const STORAGE_USER_UID = 'storage_user_uid'
export const STORAGE_THEME_VARIABLES = 'storage_theme_variables'
export const STORAGE_HOME_PAGE = 'storage_home_page'
export const STORAGE_CCCCC = 'storage_ccccc'
export const STORAGE_UUUUU = 'storage_uuuuu'
export const STORAGE_BACK_URL = 'storage_back_url'
export const STORAGE_FROM_URL = 'storage_from_url'
export const STORAGE_FB_PIXEL_ID = 'storage_fb_pixel_id'
export const STORAGE_WALLET_ROUTE = 'storage_wallet_route'
export class Local {
  static set<T>(key: string, value: any) {
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

  static get<T>(key: string): IStorageValue<T> | null {
    if (!key.trim())
      return null

    const value = localStorage.getItem(key)

    if (value) {
      try {
        return JSON.parse(value)
      }
      catch (error) {
        return null
      }
    }

    return null
  }

  static remove(key: string) {
    if (!key.trim())
      return

    localStorage.removeItem(key)
  }

  static clear(key?: string[]) {
    if (key) {
      for (const item of key)
        this.remove(item)
    }
    else {
      localStorage.clear()
    }
  }
    // 新增队列操作方法
  /**
   * 向指定键的数组前排插入1个元素
   * @param {string} key 存储键
   * @param {any} value 要添加的元素
   *  @param {any} limit 限制长度
   */
  static push(key: string, value: any, limit = 10) {
    if (!key.trim())
      return

    const existingData = this.get(key)
    let array = []

    if (existingData && Array.isArray(existingData.value)) {
      array = existingData.value
    }
    array.unshift(value)

    this.set(key, array.slice(0, limit))
  }

  /**
   * 从指定键的数组中弹出第一个元素
   * @param {string} key 存储键
   * @returns {any} 弹出的元素
   */
  static pop(key: string) {
    // router.back执行
    if (!key.trim())
      return null

    const existingData = this.get(key)

    if (!existingData || !Array.isArray(existingData.value) || existingData.value.length === 0) {
      return null
    }
    const array = [...existingData.value]
    const poppedElement = array.shift()

    this.set(key, array)
    const FORWARD_KEY = `${key}_forward`
    if (poppedElement) {
      this.push(FORWARD_KEY, poppedElement)
    }

    return poppedElement
  }

  /**
   * 从前进栈弹出第一个元素，并将其推入历史栈
   * @returns {any} 弹出的元素
   */
  static forward(key: string) {
    // router.forward执行
    const FORWARD_KEY = `${key}_forward`
    const existingData = this.get(FORWARD_KEY)

    if (!existingData || !Array.isArray(existingData.value) || existingData.value.length === 0) {
      return null
    }

    const array = [...existingData.value]
    const poppedElement = array.shift()

    // 保存更新后的前进栈
    this.set(FORWARD_KEY, array)

    // 将弹出的元素推入历史栈
    if (poppedElement) {
      this.push(key, poppedElement)
    }

    return poppedElement
  }
}

export class Session {
  static set<T>(key: string, value: any) {
    if (!key.trim())
      return

    const _value: IStorageValue<T> = {
      value,
    }

    sessionStorage.setItem(key, JSON.stringify(_value))
  }

  static get<T>(key: string): IStorageValue<T> | null {
    if (!key.trim())
      return null

    const value = sessionStorage.getItem(key)

    if (value) {
      try {
        return JSON.parse(value)
      }
      catch (error) {
        return null
      }
    }

    return null
  }

  static remove(key: string) {
    if (!key.trim())
      return

    sessionStorage.removeItem(key)
  }

  static clear(key?: string[]) {
    if (key) {
      for (const item of key)
        this.remove(item)
    }
    else {
      sessionStorage.clear()
    }
  }
}
