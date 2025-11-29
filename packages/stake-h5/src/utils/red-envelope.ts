import { i18n } from '@tg/vue-i18n'

type TypeRedEnvelope = 'red' | 'dollar' | 'diamond'

function getForLength() {
  const length = window.innerWidth / 100
  return length < 5 ? 5 : length
}
/**
 * 红包
 */
export class RedEnvelope {
  constructor() {
  }
}

const configs = {
  red: {
    imgRatio: 1,
    widths: [144, 86, 50, 71, 64, 62, 82, 86, 50, 71, 64, 62, 82, 144, 86, 50, 71, 64, 62, 82, 71],
    images: '/webp/promotions/dollar_bg.webp',
    rotate: false,
    gapTime: 800,
    offsetX: 20,
  },
  dollar: {
    imgRatio: 154 / 316,
    widths: [18, 22, 25, 28, 30, 33, 36, 38, 40, 18, 22, 25, 28, 30, 33, 36, 38, 40, 18, 22, 25, 28, 30, 33, 36, 38, 40],
    images: '/webp/promotions/brl_bg.webp',
    rotate: true,
    gapTime: 500,
    offsetX: 20,
  },
  diamond: {
    imgRatio: 160 / 430,
    widths: [50, 60, 70, 70, 70, 80, 80, 95],
    images: ['/webp/promotions/crystal-style-1.webp', '/webp/promotions/crystal-style-2.webp', '/webp/promotions/crystal-style-3.webp'],
    rotate: false,
    gapTime: 800,
    offsetX: 20,
  },
}
/**
 * 红包类
 */
export class RedEnvelopeItem {
  name: TypeRedEnvelope
  parentClass: string
  speedList: number[] = [1, 1, 1.2, 1, 1.3, 1, 1.4, 1.7, 1, 1.2, 1, 1.6]
  widths: number[] = [50, 60, 70, 70, 70, 80, 80, 95]
  lastX: number | undefined = undefined
  imgRatio = 315 / 631
  rotate = false
  gapTime = 800
  offsetX = 0
  images
  timerId: number | NodeJS.Timeout | undefined

  maxAttempts = 10
  constructor(name: TypeRedEnvelope, parentClass: string) {
    this.name = name
    this.parentClass = parentClass

    const config = configs[name]
    this.widths = config.widths
    this.imgRatio = config.imgRatio
    this.images = config.images
    this.rotate = config.rotate
    this.gapTime = config.gapTime
    this.offsetX = config.offsetX
  }

  start() {
    if (this.timerId)
      clearInterval(this.timerId)

    const generateBatch = () => {
      for (let i = 0; i < getForLength(); i++)
        this.generate()
    }
    // generateBatch()
    this.timerId = setInterval(generateBatch, this.gapTime)
  }

  pause() {
    if (this.timerId)
      clearInterval(this.timerId)

    this.timerId = undefined
  }

  appendImg(dom: HTMLDivElement, name: TypeRedEnvelope) {
    const img = document.createElement('img')
    const images = this.images
    const randomImg = typeof images === 'string' ? images : images[Math.floor(Math.random() * images.length)]

    img.src = randomImg

    const randomRotate = `transform: rotate(${Math.random() * 360 - 180}deg);`
    // 随机旋转角度
    img.style.cssText = `
      width: 100%;
      height: auto;
      ${this.rotate && randomRotate}
      pointer-events: none; 
      user-select: none; 
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      `
    dom.appendChild(img)
  }

  appendText(dom: HTMLDivElement, name: TypeRedEnvelope, w: number) {
    const { t } = i18n.global

    const span = document.createElement('span')
    const fontSize = 52 * (w / 160)
    const otherFont = 28 * (w / 160)
    const currentFont = getCurrentLanguageForFrontend() === 'zh-CN' ? `${fontSize}px` : `${otherFont}px`
    span.innerText = t('crystal-get') || ''
    span.style.cssText = `
      position: absolute;
      left: 50%;
      bottom: 22%;
      transform: translateX(-50%);
      text-shadow: 0px 1.14px 1.965px rgba(0, 0, 0, 0.62);
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 600;
      line-height: 1.4;
      font-size: ${currentFont};
      background: linear-gradient(90deg, #FFE7BA 0%, #FFC65B 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: brightness(2);
    `
    dom.appendChild(span)
  }

  randomX(w: number) {
    return Math.floor(Math.random() * (window.innerWidth - w)) - this.offsetX
  }

  /**
   * 生成个体
   */
  generate() {
    const width = this.widths[Math.floor(Math.random() * this.widths.length)]
    const speed = this.speedList[Math.floor(Math.random() * this.speedList.length)]

    const height = width / this.imgRatio

    let x
    let validPosition = false
    let attempts = 0
    // 尝试寻找合适位置
    while (!validPosition && attempts < this.maxAttempts) {
      attempts++
      x = this.randomX(width)
      const tooClose = Math.abs(x - (this.lastX ?? 0)) < 8
      if (!tooClose) {
        validPosition = true
        this.lastX = x
        break
      }
    }
    if (!validPosition)
      x = this.randomX(width)

    const div: any = document.createElement('div')

    const transitionDuration = (window.innerHeight / speed) * 0.008

    div.style.cssText = `
      position: absolute;
      top: ${0}px;
      left: ${x}px;
      width: ${width}px;
      height: ${height}px;
      background-size: cover;
      transition: transform ${transitionDuration}s linear;
      transform: translateY(${-height}px);
      display: flex;
      justify-content: center;
      align-items: flex-end;
      pointer-events: auto; 
      user-select: none; 
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    `

    this.appendImg(div, this.name)
    if (this.name === 'diamond')
      this.appendText(div, this.name, width)

    document.querySelector(`.${this.parentClass}`)?.appendChild(div)

    // eslint-disable-next-line no-unused-expressions
    div.clientWidth
    div.style.transform = `translateY(${window.innerHeight}px)`

    div.addEventListener('transitionend', () => {
      div.remove()
    })
  }

  onClose() {
    clearInterval(this.timerId)
    this.timerId = undefined
    this.lastX = undefined
  }
}
