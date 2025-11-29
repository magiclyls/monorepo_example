import { AnimatedSprite, Application, Assets, Color, Texture, Ticker } from 'pixi.js'

const canvasWidth = 1800
const canvasHeight = 1200
export const tickerAxis = Ticker.shared
tickerAxis.autoStart = false
tickerAxis.speed = 1
tickerAxis.minFPS = 40
export const globalPixi: any = {
  explosionTextures: [],
  shadowParam: { blur: 10, quality: 3, alpha: 0.44, offset: { x: 0, y: -7 }, color: new Color(0x000000).toRgbArray() },
}
// 背景色
const themeBgc: any = {
  default: '0x0f212e',
}
// 加载 crash 游戏资源
export async function loadCrashAssets(theme: string) {
  if (globalPixi.image_greybg === null || globalPixi.image_greybg === undefined || !globalPixi.image_greybg) {
    globalPixi.app = new Application({ width: canvasWidth, height: canvasHeight, antialias: true, background: themeBgc.default })

    // if (theme === 'green')
    //   globalPixi.image_greybg = await Assets.load('/pixi/crash_grey_base_gb.png')
    // else
    globalPixi.image_greybg = await Assets.load('/pixi/crash_grey_base.png')

    globalPixi.image_currency = await Assets.load(`/pixi/701.webp`)
    await Assets.load('/pixi/boom.json')
    for (let i = 1; i < 8; i++) {
      const framekey = `crash_boom${i}.png`
      const texture = Texture.from(framekey)
      // const time = spritesheet.data.frames[framekey].duration;
      globalPixi.explosionTextures.push({ texture, time: 150 })
    }
    globalPixi.boomAni = new AnimatedSprite(globalPixi.explosionTextures)
    globalPixi.boomAni.loop = false
    globalPixi.boomAni.animationSpeed = 1
    globalPixi.boomAni.scale.set(1)
    globalPixi.boomAni.anchor.set(0.5)
    globalPixi.boomAni.pivot.set(0.5)
    globalPixi.boomAni.onComplete = function () {
      // if (crashApp.value !== null && crashApp.value !== undefined)
      //   crashApp.value.render()
    }
  }
}
