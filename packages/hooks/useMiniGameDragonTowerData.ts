import { createGlobalState } from '@vueuse/core'
import * as PIXI from 'pixi.js'

export interface OriginalGameDragonResult {
  rounds: number[][]
  difficulty: string
  current_round: number
  played_rounds: number[][]
  tiles_selected: number[]
}

const multipliers = {
  easy: [1.31, 1.74, 2.32, 3.1, 4.13, 5.51, 7.34, 9.79, 13.05],
  medium: [1.47, 2.21, 3.31, 4.96, 7.44, 11.16, 16.74, 25.11, 37.67],
  hard: [1.96, 3.92, 7.84, 15.68, 31.36, 62.72, 125.44, 250.88, 501.76],
  expert: [2.94, 8.82, 26.46, 79.38, 238.14, 714.42, 2143.26, 6429.78, 19289.34],
  master: [3.92, 15.68, 62.72, 250.88, 1003.52, 4014.08, 16056.32, 64225.28, 256901.12],
}
// const { play: playBgmMusic } = useMiniGamePublicPlayMp3('/audio/dragon_bgm.mp3')
export const useMiniGameDragonTowerData = createGlobalState(() => {
  // Game data
  const dragonWidth = window.innerWidth > 800 ? 1600 : 800
  const dragonHeight = window.innerWidth > 800 ? 720 : 360
  const canvasWidth = window.innerWidth > 800 ? 256 : 128
  const canvasHeight = window.innerWidth > 800 ? 256 : 128
  // Aliases
  /** initDragon */
  async function initAsyncDragon(elementRef: any, App: any, animatedSprite: globalThis.Ref<any>, speed: number, state: string) {
    const Assets = PIXI.Assets
    const Application = PIXI.Application
    const resDragonPath = window.innerWidth > 800 ? '/pixi/dragon_sprite_sheet@1x.png.json' : '/pixi/dragon_sprite_sheet@2x.png.json'
    if (elementRef.value) {
      const app = new Application({
        backgroundAlpha: 0,
        width: dragonWidth,
        height: dragonHeight,
      })
      app.stage.scale.x = 1
      app.stage.scale.y = 1
      App.value = app
      const hasCanvasChild = elementRef.value.querySelector('canvas') === null
      if (hasCanvasChild)
        elementRef.value.appendChild(app.view)

      function setup() {
        const Cache = PIXI.Assets.cache
        const AnimatedSprite = PIXI.AnimatedSprite
        const animationsDra = Cache.get(resDragonPath).data.animations
        animatedSprite.value = AnimatedSprite.fromFrames(animationsDra[state])
        animatedSprite.value.animationSpeed = speed
        animatedSprite.value.x = app.renderer.width / 2
        animatedSprite.value.y = app.renderer.height / 2
        animatedSprite.value.eventMode = 'none'
        animatedSprite.value.anchor.set(0.5)
        animatedSprite.value.loop = true
        animatedSprite.value.play()
        app.stage.addChild(animatedSprite.value)
      }
      function resize() {
        app.renderer.resize(app.renderer.width, app.renderer.height)
        animatedSprite.value.x = app.renderer.width / 2
        animatedSprite.value.y = app.renderer.height / 2
      }
      // 加载资源
      await Assets.load(resDragonPath).then(setup)
      // 处理窗口调整大小
      window.addEventListener('resize', resize)
      // 初始化时调整大小以适应容器
      resize()
    // app.renderer.resize(app.renderer.width, app.renderer.height)
    // playBgmMusic()
    }
  }
  /** reset dragon */
  function resetDragon(app: any, animatedSprite: globalThis.Ref<any>, state: string) {
    const resDragonPath = window.innerWidth > 800 ? '/pixi/dragon_sprite_sheet@1x.png.json' : '/pixi/dragon_sprite_sheet@2x.png.json'
    const Cache = PIXI.Assets.cache
    const animationsDra = Cache.get(resDragonPath).data.animations
    animatedSprite.value.textures = animationsDra[state].map((frame: PIXI.TextureSource | PIXI.TextureSource[]) => PIXI.Texture.from(frame))
    animatedSprite.value.loop = true
    animatedSprite.value.play()
    animatedSprite.value.onComplete = () => {}
    app.value.stage.removeChildren()
    app.value.stage.addChild(animatedSprite.value)
  }
  /** update-ani */
  function updateDragonAni(app: any, animatedSprite: globalThis.Ref<any>, speed: number, start: string, end: string) {
    const resDragonPath = window.innerWidth > 800 ? '/pixi/dragon_sprite_sheet@1x.png.json' : '/pixi/dragon_sprite_sheet@2x.png.json'
    const Cache = PIXI.Assets.cache
    const AnimatedSprite = PIXI.AnimatedSprite
    const animationsDra = Cache.get(resDragonPath).data.animations
    animatedSprite.value = AnimatedSprite.fromFrames(animationsDra[start])
    animatedSprite.value.animationSpeed = speed
    animatedSprite.value.loop = false
    animatedSprite.value.onComplete = () => {
      animatedSprite.value.textures = animationsDra[end].map((frame: PIXI.TextureSource | PIXI.TextureSource[]) => PIXI.Texture.from(frame))
      animatedSprite.value.play()
    }
    animatedSprite.value.play()
    app.value.stage.removeChildren()
    app.value.stage.addChild(animatedSprite.value)
  }
  /** create skull or fire-egg */
  async function showAsyncResult(elementRef: any, animatedSprite: globalThis.Ref<any>, loop: boolean, speed: number, state: string, end?: string) {
    const Assets = PIXI.Assets
    const Cache = PIXI.Assets.cache
    const resSymbolsPath = window.innerWidth > 800 ? '/pixi/symbols_sprite_sheet@1x.png.json' : '/pixi/symbols_sprite_sheet@2x.png.json'

    const AnimatedSprite = PIXI.AnimatedSprite
    if (elementRef.value) {
      const app = new PIXI.Application({
        backgroundAlpha: 0,
        width: canvasWidth,
        height: canvasHeight,
      })
      app.stage.scale.x = 1
      app.stage.scale.y = 1
      const hasCanvasChild = elementRef.value.querySelector('canvas') === null
      if (hasCanvasChild)
        elementRef.value.appendChild(app.view)

      function setup() {
        const animationsSym = Cache.get(resSymbolsPath).data.animations
        animatedSprite.value = AnimatedSprite.fromFrames(animationsSym[state])
        animatedSprite.value.animationSpeed = speed
        animatedSprite.value.x = app.renderer.width / 2
        animatedSprite.value.y = app.renderer.height / 2
        animatedSprite.value.anchor.set(0.5)
        animatedSprite.value.eventMode = 'none'
        animatedSprite.value.loop = loop
        animatedSprite.value.play()
        if (!loop && end && animationsSym[end]) {
          animatedSprite.value.onComplete = () => {
            animatedSprite.value.textures = animationsSym[end].map((frame: PIXI.TextureSource | PIXI.TextureSource[]) => PIXI.Texture.from(frame))
            animatedSprite.value.play()
          }
        }
        app.stage.addChild(animatedSprite.value)
      }
      function resize() {
        app.renderer.resize(app.renderer.width, app.renderer.height)
        animatedSprite.value.x = app.renderer.width / 2
        animatedSprite.value.y = app.renderer.height / 2
      }
      // 加载资源
      await Assets.load(resSymbolsPath).then(setup)
      // 处理窗口调整大小
      window.addEventListener('resize', resize)
      // 初始化时调整大小以适应容器
      resize()
    // app.renderer.resize(app.renderer.width, app.renderer.height)
    }
  }
  return {
    multipliers,
    initAsyncDragon,
    resetDragon,
    updateDragonAni,
    showAsyncResult,
  }
})
