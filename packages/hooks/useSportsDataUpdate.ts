/**
 *
 * @param callback 回调函数
 * @param duration 间隔秒数（默认 120 秒）
 * @param immediate 是否立即调用一次（默认 false）
 * @returns startTimer、stopTimer 方法
 */
export function useSportsDataUpdate(
  callback: () => void,
  duration = 120,
  immediate = false,
) {
  let timer: ReturnType<typeof setInterval> | null = null

  function startTimer() {
    stopTimer()
    if (immediate)
      callback()
    timer = setInterval(() => {
      console.log(`[Timer Triggered] ${new Date().toISOString()}`)
      callback()
    }, duration * 1000)
    console.log(`[Timer Started] Every ${duration}s`)
  }

  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
      console.log('[Timer Stopped]')
    }
  }

  return {
    startTimer,
    stopTimer,
  }
}
