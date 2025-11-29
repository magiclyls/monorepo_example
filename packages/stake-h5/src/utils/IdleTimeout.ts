class IdleTimeout {
  private timeout: number
  private onTimeout: () => void
  private events: string[]
  private lastActiveKey = 'lastActiveTime'
  private timer: ReturnType<typeof setTimeout> | null = null
  isRunning = false

  constructor(timeout: number = 30 * 60 * 1000, onTimeout: () => void = () => {}) {
    this.timeout = timeout
    this.onTimeout = onTimeout
    this.events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
  }

  start(): void {
    console.log('时间:::开始计时')
    this.updateLastActiveTime()
    this.addEventListeners()
    this.startTimer()
    this.isRunning = true
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  stop(): void {
    this.removeEventListeners()
    this.clearTimer()
    this.isRunning = false
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private updateLastActiveTime = (): void => {
    // console.log('时间:::更新最后活跃时间')
    localStorage.setItem(this.lastActiveKey, Date.now().toString())
    this.resetTimer() // 任何操作都会重置计时器
  }

  private checkTimeout = (): void => {
    const lastActive = localStorage.getItem(this.lastActiveKey)
    const lastActiveTime = lastActive ? Number.parseInt(lastActive, 10) : 0
    const now = Date.now()

    // console.log('时间:::检查超时', now - lastActiveTime, this.timeout)

    if (now - lastActiveTime >= this.timeout) {
      // console.log('时间:::用户超时未操作，触发回调')
      this.onTimeout()
      this.stop()
    }
  }

  private startTimer(): void {
    this.clearTimer()
    this.timer = setTimeout(() => {
      this.checkTimeout()
    }, this.timeout)
  }

  private resetTimer(): void {
    // console.log('时间:::重制计时器')
    this.clearTimer()
    this.startTimer()
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  private addEventListeners(): void {
    this.events.forEach((event) => {
      window.addEventListener(event, this.updateLastActiveTime)
    })
  }

  private removeEventListeners(): void {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.updateLastActiveTime)
    })
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      // console.log('页面重新可见，检查是否超时')
      this.checkTimeout()
    }
  }
}

export default IdleTimeout
