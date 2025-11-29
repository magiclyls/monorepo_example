declare module 'jsdom'

/** 显示类型详细值 */
type Prettify<T> = {
  [P in keyof T]: T[P]
}

declare global {
  interface Window {
    onTokenExpired?: () => void
  }
}

export {}
