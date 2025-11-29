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
