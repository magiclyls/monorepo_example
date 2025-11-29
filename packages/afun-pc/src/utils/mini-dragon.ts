import * as PIXI from 'pixi.js'

const dragonWidth = window.innerWidth > 800 ? 1600 : 800
const dragonHeight = window.innerWidth > 800 ? 720 : 360
const canvasWidth = window.innerWidth > 800 ? 256 : 128
const canvasHeight = window.innerWidth > 800 ? 256 : 128
// Aliases
const Application = PIXI.Application
const Assets = PIXI.Assets
const Cache = PIXI.Assets.cache
const AnimatedSprite = PIXI.AnimatedSprite
const resDragonPath = window.innerWidth > 800 ? '/pixi/dragon_sprite_sheet@1x.png.json' : '/pixi/dragon_sprite_sheet@2x.png.json'
const resSymbolsPath = window.innerWidth > 800 ? '/pixi/symbols_sprite_sheet@1x.png.json' : '/pixi/symbols_sprite_sheet@2x.png.json'
/** initDragon */
export async function initDragon(elementRef: any, App: any, animatedSprite: globalThis.Ref<any>, speed: number, state: string) {
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

    // 加载资源
    await Assets.load(resDragonPath).then(setup)

    function setup() {
      const animations = Cache.get(resDragonPath).data.animations
      animatedSprite.value = AnimatedSprite.fromFrames(animations[state])
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
    // 处理窗口调整大小
    window.addEventListener('resize', resize)
    // 初始化时调整大小以适应容器
    resize()
    // app.renderer.resize(app.renderer.width, app.renderer.height)
  }
}
/** reset dragon */
export async function resetDragon(app: any, animatedSprite: globalThis.Ref<any>, state: string) {
  const animations = Cache.get(resDragonPath).data.animations
  animatedSprite.value.textures = animations[state].map((frame: PIXI.TextureSource | PIXI.TextureSource[]) => PIXI.Texture.from(frame))
  animatedSprite.value.loop = true
  animatedSprite.value.play()
  animatedSprite.value.onComplete = () => {}
  app.value.stage.removeChildren()
  app.value.stage.addChild(animatedSprite.value)
}
/** update-ani */
export async function updateDragonAni(app: any, animatedSprite: globalThis.Ref<any>, speed: number, start: string, end: string) {
  const animations = Cache.get(resDragonPath).data.animations
  animatedSprite.value = AnimatedSprite.fromFrames(animations[start])
  animatedSprite.value.animationSpeed = speed
  animatedSprite.value.loop = false
  animatedSprite.value.onComplete = () => {
    animatedSprite.value.textures = animations[end].map((frame: PIXI.TextureSource | PIXI.TextureSource[]) => PIXI.Texture.from(frame))
    animatedSprite.value.play()
  }
  animatedSprite.value.play()
  app.value.stage.removeChildren()
  app.value.stage.addChild(animatedSprite.value)
}
/** create skull or fire-egg */
export async function showResult(elementRef: any, animatedSprite: globalThis.Ref<any>, loop: boolean, speed: number, state: string, end?: string) {
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

    // 加载资源
    await Assets.load(resSymbolsPath).then(setup)
    function setup() {
      const animations = Cache.get(resSymbolsPath).data.animations
      animatedSprite.value = AnimatedSprite.fromFrames(animations[state])
      animatedSprite.value.animationSpeed = speed
      animatedSprite.value.x = app.renderer.width / 2
      animatedSprite.value.y = app.renderer.height / 2
      animatedSprite.value.anchor.set(0.5)
      animatedSprite.value.eventMode = 'none'
      animatedSprite.value.loop = loop
      animatedSprite.value.play()
      if (!loop && end && animations[end]) {
        animatedSprite.value.onComplete = () => {
          animatedSprite.value.textures = animations[end].map((frame: PIXI.TextureSource | PIXI.TextureSource[]) => PIXI.Texture.from(frame))
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
    // 处理窗口调整大小
    window.addEventListener('resize', resize)
    // 初始化时调整大小以适应容器
    resize()
    // app.renderer.resize(app.renderer.width, app.renderer.height)
  }
}
