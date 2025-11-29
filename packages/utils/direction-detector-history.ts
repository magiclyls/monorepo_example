import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric, Router } from 'vue-router'
import { defineComponent, h } from 'vue'

// direction-detector-history.ts
export type Direction = 'back' | 'forward' | 'replace' | 'enter' | 'unknown'

interface StateWithIdx { idx: number, [k: string]: any }

export function setupHistoryDirection(onDirection: (d: Direction) => void) {
  const KEY = '__nav_idx__'

  // 读取或初始化当前 idx（会话级别）
  let currentIdx = Number(sessionStorage.getItem(KEY))
  if (!Number.isFinite(currentIdx))
    currentIdx = 0

  // 确保当前条目有 idx
  const ensureStateIdx = (idx: number) => {
    const s = (history.state ?? {}) as StateWithIdx
    if (s.idx !== idx)
      history.replaceState({ ...s, idx }, document.title, location.href)
  }
  ensureStateIdx(currentIdx)
  sessionStorage.setItem(KEY, String(currentIdx))
  onDirection('enter')

  // 包装 pushState / replaceState，自动维护 idx
  const _push = history.pushState.bind(history)
  history.pushState = (data: any, title: string, url?: string | URL | null) => {
    currentIdx += 1
    sessionStorage.setItem(KEY, String(currentIdx))
    _push({ ...(data ?? {}), idx: currentIdx }, title, url ?? null)
  }

  const _replace = history.replaceState.bind(history)
  history.replaceState = (data: any, title: string, url?: string | URL | null) => {
    _replace({ ...(data ?? {}), idx: currentIdx }, title, url ?? null)
  }

  // 监听 popstate 判定方向
  window.addEventListener('popstate', (e) => {
    const nextIdx = (e.state as StateWithIdx | null)?.idx
    if (typeof nextIdx !== 'number') {
      onDirection('unknown')
      return
    }
    const dir: Direction = nextIdx < currentIdx
      ? 'back'
      : nextIdx > currentIdx
        ? 'forward'
        : 'replace'
    currentIdx = nextIdx
    sessionStorage.setItem(KEY, String(currentIdx))
    onDirection(dir)
  })

  window.addEventListener('CustomVueRouterPush', (e) => {
    onDirection('forward')
  })

  // 处理 bfcache：从缓存恢复不会触发 popstate
  window.addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted) {
      // 恢复时同步 idx
      const s = (history.state ?? {}) as StateWithIdx
      if (typeof s.idx === 'number') {
        currentIdx = s.idx
        sessionStorage.setItem(KEY, String(currentIdx))
      }
    }
  })
}

export function setupVueRouterPush(router: Router) {
  const oldPush = router.push.bind(router)

  router.push = (to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric) => {
    window.dispatchEvent(new CustomEvent('CustomVueRouterPush', {
      detail: to,
    }))
    return oldPush(to)
  }
}

export function withName(component: any, newName: string) {
  return defineComponent({
    name: newName,
    setup(props, { attrs, slots }) {
      return () => h(component, attrs, slots)
    },
  })
}
