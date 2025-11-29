import type { MiniGamePlinko } from '@tg/types'
import type {
  Ticker,
  TickerCallback,
} from 'pixi.js'
import { Group, Tween } from '@tweenjs/tween.js'
import * as Matter from 'matter-js'
import {
  Application,
  Container,
  Graphics,
  HTMLText,
} from 'pixi.js'
import { useMiniGamePublicPlayMp3 } from '../composables'
import { usePlinkoFunc } from './useMiniGamePlinkoMap'

declare module 'pixi.js' {
  interface Graphics {
    label?: string
  }
  interface Container {
    label?: string
  }
}
const { colors, shadows, resText, probabilities } = usePlinkoFunc()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/bet.mp3')
const { play: playBetEndMusic } = useMiniGamePublicPlayMp3('/audio/basket.mp3')
//   function isMobile() {
//   return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
//     || window.matchMedia('(max-width: 768px)').matches
// }
interface BallParams {
  path: string[]
  start: number
  fir: string
}
interface Pins {
  rows: number
  startY: number
  gap: number
  pinRadius: number
}
export class Plinko {
  id = 1
  canvas: HTMLCanvasElement
  app!: Application
  engine: Matter.Engine
  world: Matter.World
  runner: Matter.Runner
  width!: number
  height!: number
  tickerFn!: TickerCallback<unknown>
  ballParamsMap: Map<number, BallParams> = new Map()
  pinParams: Pins = {} as Pins
  nonCollideGroup = Matter.Body.nextGroup(true)
  ballConfig: { ballRadius: number, frictionAir: number } = {
    ballRadius: 4,
    frictionAir: 0.05,
  }

  popCallback!: (value: boolean, probability?: string) => void
  recordCallback!: (...arg: any) => void
  gameRes: string[] = []
  gameInfo: MiniGamePlinko[] = []

  constructor(container: HTMLDivElement) {
    this.canvas = document.createElement('canvas')
    container.appendChild(this.canvas)
    // this.app = new Application()

    // matter
    this.engine = Matter.Engine.create()
    this.world = this.engine.world
    this.runner = Matter.Runner.create()

    this.engine.positionIterations = 10
    this.engine.velocityIterations = 10
    this.engine.timing.timeScale = 2
  }

  async init(w: number, h: number, bg: string) {
    this.width = w
    this.height = h
    this.canvas.style.width = `${w}px`
    this.canvas.style.height = `${h}px`
    this.stackBox.position.set(this.width - 45, this.height / 4)
    this.app = new Application({
      view: this.canvas,
      width: w,
      height: h,
      background: bg,
      /** todo what's mean */
      antialias: true,
      resolution: window.devicePixelRatio,
    })
    this.app.stage.addChild(this.stackBox)
    // globalThis.__PIXI_APP__ = this.app

    Matter.Runner.run(this.runner, this.engine)
    this.listenCollisions()
  }

  setBallConfig(ballRadius: number, frictionAir: number) {
    this.ballConfig = { ballRadius, frictionAir }
  }

  createBall(path: string[]) {
    playBetMusic()
    const mid = this.width / 2
    const arrR = [mid, mid + this.pinParams.gap]
    const arrL = [mid, mid - this.pinParams.gap]
    const fir = path[0]
    const start = Math.floor(Math.random() * 2)
    const x = fir === 'R' ? arrR[start] : arrL[start]
    const ballBody = Matter.Bodies.circle(x, 0, this.ballConfig.ballRadius, {
      id: this.id++,
      label: 'ball',
      mass: 1,
      restitution: 0,
      friction: 0,
      frictionAir: this.ballConfig.frictionAir,
      collisionFilter: {
        group: this.nonCollideGroup,
      },
    })

    const ballGfx = new Graphics()
    ballGfx.beginFill(0xFF5555)
    ballGfx.drawCircle(0, 0, this.ballConfig.ballRadius)
    ballGfx.endFill()

    ballGfx.position.set(ballBody.position.x, ballBody.position.y)

    Matter.Composite.add(this.world, ballBody)
    this.app.stage.addChild(ballGfx)
    // 更新视图
    const tickerFn = () => {
      ballGfx.position.set(ballBody.position.x, ballBody.position.y)
      ballGfx.rotation = ballBody.angle
      const realHeight = (this.pinParams.rows - 2) * this.pinParams.gap + this.pinParams.gap / 2
      if (ballBody.position.y > realHeight) {
        this.findResultArea(ballBody.position.x)
        Matter.Composite.remove(this.world, ballBody)
        ballGfx.destroy()
        this.app.ticker.remove(tickerFn)
        this.ballParamsMap.delete(ballBody.id)
      }
    }
    this.app.ticker.add(tickerFn)

    const params: BallParams = {
      path,
      start,
      fir,
    }
    this.ballParamsMap.set(ballBody.id, params)
  }

  pinsMatter: Matter.Body[] = []
  pinsGfx: Graphics[] = []
  createPinsAndResultBoxes(pins: Pins) {
    this.clearPinsAndRes()
    this.pinParams = pins
    const { rows, startY, gap, pinRadius } = pins
    for (let row = 2; row < rows; row++) {
      const count = row + 1
      const totalWidth = (count - 1) * gap
      const startX = this.width / 2 - totalWidth / 2

      for (let i = 0; i < count; i++) {
        const x = startX + i * gap
        const y = startY + (row - 2) * gap

        const body = Matter.Bodies.circle(x, y, pinRadius, {
          isStatic: true,
          label: `row-${row - 1}-${i}`,
        })
        const gfx = new Graphics()
        gfx.beginFill(0xFFFFFF)
        gfx.drawCircle(0, 0, pinRadius)
        gfx.endFill()

        gfx.x = x
        gfx.y = y
        this.pinsMatter.push(body)
        this.pinsGfx.push(gfx)
        Matter.Composite.add(this.world, body)
        this.app.stage.addChild(gfx)
      }
    }
    this.createResultBox()
  }

  private dealCollisions(target: Matter.Pair) {
    const { bodyA, bodyB } = target

    const ball = bodyA.label === 'ball' ? bodyA : bodyB.label === 'ball' ? bodyB : null
    const rowLabel = bodyA.label.startsWith('row-')
      ? bodyA.label
      : bodyB.label.startsWith('row-')
        ? bodyB.label
        : null
    const pin = bodyA.label.startsWith('row-')
      ? bodyA
      : bodyB.label.startsWith('row-')
        ? bodyB
        : null
    if (pin)
      this.pinAnimal(pin)
    if (!ball || !rowLabel)
      return

    const ballId = ball.id
    const curRow = Number.parseInt(rowLabel.split('-')[1], 10)
    const params = this.ballParamsMap.get(ballId)
    if (!params)
      return

    const { path, start, fir } = params
    if (!path || !fir || Number.isNaN(curRow))
      return

    if (curRow === 1) {
      const direction = fir === 'R' ? (start === 0 ? 1 : -1) : start === 0 ? -1.2 : 1.2
      this.addXPower(ball, direction)
      return
    }

    const next = path[curRow - 1]
    if (next === 'R')
      this.addXPower(ball, 1.2)
    else if (next === 'L')
      this.addXPower(ball, -1.2)
  }

  resBoxMap: Map<number, Container<any>> = new Map()
  level: 'low' | 'middle' | 'high' = 'low'

  private async createResultBox() {
    const gap = this.pinParams.gap
    const resWidth = gap - 2
    const count = this.pinParams.rows - 1
    // 这个是实际渲染的行数
    const realRow = count - 2
    const startY = this.pinParams.startY + realRow * gap + gap / 2
    const startX = this.width / 2 - (count * gap) / 2
    const rows = this.pinParams.rows - 2

    for (let i = 0; i < count; i++) {
      const x = startX + i * gap + 1

      const box = new Container()
      box.label = `res-${i}` // v6 里 Container 没有 label 选项，需要手动挂属性
      box.interactive = true

      const rect = new Graphics()
      rect.beginFill(this.getBg(rows, i))
      rect.drawRoundedRect(0, 0, resWidth, 16, 2)
      rect.endFill()

      const shadow = new Graphics()
      shadow.beginFill(this.getShadow(rows, i))
      shadow.drawRoundedRect(0, 0, resWidth, 16 + 2, 2)
      shadow.endFill()

      shadow.position.set(0, 0)
      const resTextValue = this.getText(this.level, rows, i) || 0

      const text = new HTMLText(`${resTextValue}`, {
        fill: '#fff',
        fontSize: 20,
        lineHeight: 20,
        align: 'center',
        fontWeight: '700',
        stroke: '#000000', // 描边色（黑色）
        strokeThickness: 4, // 描边粗细
      })

      text.name = `res-text-${i}`
      text.anchor.set(0.5)

      text.position.set(resWidth / 2, 8)
      text.scale.set(0.5)
      box.addChild(shadow)
      box.addChild(rect)
      box.addChild(text)
      box.position.set(x, startY)
      this.resBoxMap.set(i, box)
      this.app.stage.addChild(box)

      box.on('mouseover', () => {
        this.popCallback && this.popCallback(true, this.getProbability(this.pinParams.rows - 2, i).toFixed(4))
      })
      box.on('mouseout', () => {
        this.popCallback && this.popCallback(false)
      })
    }
  }

  clearPinsAndRes() {
    for (const body of this.pinsMatter)
      Matter.Composite.remove(this.world, body)

    for (const gfx of this.pinsGfx)
      gfx.destroy()

    this.pinsMatter = []
    this.pinsGfx = []
    this.resBoxMap.forEach((box) => {
      box.destroy()
    })
    this.resBoxMap.clear()
    this.firstY = 0
  }

  private addXPower(target: Matter.Body, x: number) {
    Matter.Body.setVelocity(target, {
      x,
      y: 0,
    })
  }

  getBg(row: number, index: number) {
    return colors[`_${row}`][index]
  }

  getShadow(row: number, index: number) {
    return shadows[`_${row}`][index]
  }

  getText(level: 'low' | 'middle' | 'high', row: number, index: number) {
    return resText[level][`_${row}`][index]
  }

  getProbability(row: number, index: number) {
    const cur = probabilities[`_${row}`]
    return cur[index] * 100
  }

  setPopCb(cb: (value: boolean, pro?: string) => void) {
    this.popCallback = cb
  }

  setRecordClickCb(cb: (...arg: any[]) => void) {
    this.recordCallback = cb
  }

  setLevel(level: 'low' | 'middle' | 'high') {
    this.level = level
    const textArr = resText[level]
    if (!textArr)
      return

    for (const [i, box] of this.resBoxMap) {
      const text = box.getChildByName(`res-text-${i}`) as HTMLText
      const value = resText[level][`_${this.pinParams.rows - 2}`][i]
      text.text = `${value}`
    }
  }

  private findResultArea(ballX: number) {
    for (const [index, box] of this.resBoxMap.entries()) {
      const left = box.x
      const right = box.x + box.width
      if (ballX >= left && ballX <= right) {
        this.resBoxAnimal(box)
        console.log(`Ball hit result box ${index}`)
        console.log(
          `Ball hit result box ${this.gameRes}`,
          this.getBg(this.pinParams.rows - 2, index),
        )
        this.addRecord(
          this.gameRes.shift() || '',
          this.getBg(this.pinParams.rows - 2, index),
          this.gameInfo.shift() as MiniGamePlinko,
        )
        playBetEndMusic()
        this.gameRes.length < 1 && this.gameEndCb && this.gameEndCb()
      }
    }
  }

  listenCollisions() {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      for (const pair of event.pairs)
        this.dealCollisions(pair)
    })
  }

  pinAnimal(body: Matter.Body) {
    const graphics = new Graphics()
    graphics.position.set(body.position.x, body.position.y)
    this.app.stage.addChild(graphics)

    const rMin = 0
    const rMax = 10
    const duration = 400 // 动画持续时间（毫秒）
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const r = rMin + (rMax - rMin) * progress
      const alpha = 0.9 * (1 - progress)

      graphics.clear()
      const circleRadius = body.circleRadius ?? 4
      graphics.beginFill(0x000000, alpha) // 颜色 + 透明度
      graphics.drawCircle(0, 0, circleRadius * 1.2 + r)
      graphics.endFill()

      if (progress < 1)
        requestAnimationFrame(animate)
      else
        graphics.destroy()
    }

    requestAnimationFrame(animate)
  }

  firstY = 0
  private resBoxAnimal(target: Container<any>) {
    const oriY = target.position.y
    if (!this.firstY)
      this.firstY = oriY
    const offset = 4
    const duration = 150
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      target.position.y = oriY + offset * progress

      if (progress < 1)
        requestAnimationFrame(animate)
      else
        target.position.y = this.firstY
    }

    requestAnimationFrame(animate)
  }

  // 结果动画
  tweenGroup = new Group()
  recordArr: Container[] = []
  maxCount = 4
  boxWidth = 26
  boxHeight = 26
  stackBox = new Container()
  recordCount = 0

  setGameRes(value: string, params: MiniGamePlinko) {
    this.gameRes.push(value)
    this.gameInfo.push(params)
  }

  createRoundedRect(index: number, bg: number, mask?: boolean): Graphics {
    const alpha = mask ? 0.3 : 1
    const gfx = new Graphics()
    gfx.label = String(bg)

    const color = bg
    gfx.beginFill(color, alpha)

    const w = this.boxWidth
    const h = this.boxHeight

    // 四个角半径
    let tl = 0
    let tr = 0
    let br = 0
    let bl = 0
    if (index === 0) {
      tl = 4
      tr = 4
    }
    else if (index === this.maxCount - 1) {
      bl = 4
      br = 4
    }

    // 手动绘制圆角矩形
    gfx.moveTo(0 + tl, 0)
    gfx.lineTo(w - tr, 0)
    if (tr)
      gfx.arcTo(w, 0, w, tr, tr)
    gfx.lineTo(w, h - br)
    if (br)
      gfx.arcTo(w, h, w - br, h, br)
    gfx.lineTo(bl, h)
    if (bl)
      gfx.arcTo(0, h, 0, h - bl, bl)
    gfx.lineTo(0, tl)
    if (tl)
      gfx.arcTo(0, 0, tl, 0, tl)

    gfx.endFill()
    return gfx
  }

  addRecord(label: string, bg: number, target: MiniGamePlinko) {
    const newBox = new Container()
    newBox.interactive = true

    newBox.position.set(0, -this.boxHeight)
    const rect = this.createRoundedRect(this.recordCount, bg)
    const text = new HTMLText(`${label}`, {
      fill: '#fff',
      fontSize: 20,
      lineHeight: 20,
      align: 'center',
      fontWeight: '700',
      stroke: '#000000',
      strokeThickness: 4,
    })
    text.scale.set(0.5)
    text.anchor.set(0.5)

    text.position.x = this.boxWidth / 2
    text.position.y = this.boxHeight / 2

    newBox.addChild(rect)
    newBox.addChild(text)
    // 添加新 box 到 container 顶部
    this.stackBox.addChild(newBox)
    this.recordArr.unshift(newBox)
    let mask: Graphics | null
    newBox.on('mouseover', () => {
      mask = this.createRoundedRect(this.recordCount, 0x000000, true)
      newBox.addChild(mask)
    })
    newBox.on('mouseout', () => {
      if (!mask)
        return
      newBox.removeChild(mask)
      mask?.destroy()
      mask = null
    })
    newBox.on('pointertap', () => {
      this.recordCallback && this.recordCallback(target)
    })

    this.recordCount++
    if (this.recordCount === 4)
      this.recordCount = 1

    this.recordArr.forEach((b, index) => {
      const targetY = index * this.boxHeight
      if (this.recordArr.length > 1) {
        const curContainer = this.recordArr[index]
        const removed = curContainer.removeChild(curContainer.children[0]) as any
        const removedBg = removed.label
        removed.destroy()
        this.recordArr[index].addChild(this.createRoundedRect(index, Number(removedBg)))
        this.recordArr[index].children.reverse()
      }
      new Tween(b.position, this.tweenGroup).to({ y: targetY }, 200).start()
    })
    const moveTween: any = (ticker: Ticker) => {
      this.tweenGroup.update(ticker.lastTime)
    }
    if (this.recordArr.length > this.maxCount) {
      const removed = this.recordArr.pop()
      new Tween(removed as any, this.tweenGroup)
        .to({ alpha: 0 }, 150)
        .onComplete(() => {
          this.app.ticker.remove(moveTween)
          this.stackBox.removeChild(removed!)
          removed?.destroy()
        })
        .start()
    }

    this.app.ticker.add(moveTween)
  }

  removeRecord() {
    this.stackBox.children.length = 0
    this.recordArr.length = 0
    this.recordCount = 0
  }

  gameEndCb!: () => void
  setGameEndCb(cb: () => void) {
    this.gameEndCb = cb
  }
}
