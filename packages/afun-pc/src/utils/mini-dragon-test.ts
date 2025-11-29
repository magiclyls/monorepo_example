import { AnimatedSprite, Application, Assets, Ticker } from 'pixi.js'

const canvasWidth = 1600
const canvasHeight = 720
export const tickerDragonAxis = Ticker.shared
tickerDragonAxis.autoStart = true
tickerDragonAxis.speed = 1
tickerDragonAxis.minFPS = 40
export const globalDragon: any = {}
// 加载 crash 游戏资源
export async function loadDragonAssets() {
  globalDragon.app = new Application({ width: canvasWidth, height: canvasHeight, antialias: true, backgroundAlpha: 0 })
  await Assets.load('/pixi/dragon_sprite_sheet.json')
  const animations = Assets.cache.get('/pixi/dragon_sprite_sheet.json').data.animations
  globalDragon.boomAni = AnimatedSprite.fromFrames(animations['default head'])
  globalDragon.boomAni.loop = true
  globalDragon.boomAni.play()
  globalDragon.boomAni.animationSpeed = 0.5
  globalDragon.boomAni.x = globalDragon.app.renderer.width / 2
  globalDragon.boomAni.y = globalDragon.app.renderer.height / 2
  globalDragon.boomAni.scale.set(1)
  globalDragon.boomAni.anchor.set(0.5)
  globalDragon.boomAni.pivot.set(0.5)
}
