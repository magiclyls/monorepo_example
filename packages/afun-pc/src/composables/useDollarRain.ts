import gsap from 'gsap'

// import { Physics2DPlugin } from 'gsap/all'

// https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/Physics2DPlugin.min.js
// gsap.registerPlugin(Physics2DPlugin)
const arr = [119, 60, 44, 57, 66, 37, 60, 44, 57, 66, 37, 119, 60, 44, 57, 66, 37, 60, 44, 57, 66, 37, 119]
const dollarWidth = arr.concat(arr) // 375 屏宽

export function useDollarRain() {
  let ctx: any
  const dollarLength = window.innerWidth <= 768 ? 8 : 50
  const clazz = `dollar-rain-${getUuid()}`
  const dollarGroup = ref([0, 20, 40, 60, 80, 100].map((d, ddx) => Array(dollarLength).fill(0 as any).map((i, idx) => {
    const { w, x, h } = setXAndWidth()
    const sx = d + Math.random() * 20
    return { width: `${w}vw`, x: `${sx}%`, height: `${h}vw`, tl: undefined as any, heightNum: h / 100 * window.innerWidth }
  })))
  const tlCollect = ref(Array(11).fill(0 as any).map(i => Array(dollarLength).fill(0 as any)))
  const tlGroup = ref(Array(dollarLength).fill(0 as any))

  const main = ref()
  const dollarBoxes = ref()

  const { height: mainHeight } = useElementSize(main.value)
  const height = ref(window.innerHeight - 128)

  function setXAndWidth() {
    const w = setWidth()
    let x = Math.floor(Math.random() * 100)
    if (100 - x < w)
      x = 100 - w
    return { w, x, h: w }
  }

  function setWidth() {
    return floor(dollarWidth[Math.floor(Math.random() * dollarWidth.length)] / window.innerWidth, 2) * 100
  }

  function dollar(ddx: number, index: number) {
    const rd = Math.random() * 3
    ctx = gsap.context((self) => {
      dollarGroup.value[ddx][index].tl = gsap
        .timeline({
          repeat: -1,
          repeatDelay: index * 1.8 + rd, // (dollarLength - 1 - index) * 1 + 1 // ((dollarLength - 1) * 0.4 + 3.1) / (dollarLength - 1) * (dollarLength - 1 - index),
          delay: index * 1.2 + rd,
          paused: false,
          defaults: {
            // physics2D: { gravity: 400 },
            ease: 'power1.in',
          },
          onRepeat: () => {
            // window.requestAnimationFrame(() => {
            //   toggleDollar(ddx, index)
            // })
          },
          // onComplete: () => {
          //   window.requestAnimationFrame(() => {
          //     toggleDollar(ddx, index)
          //   })
          // },
        })
        // .to(dollarBoxes.value[ddx * (dollarLength) + index], { opacity: 1, duration: 0.05 })
        .to(`.dollar-item-${ddx}-${index}`, { opacity: 1, y: height.value + 300, duration: 5 }) // dollarBoxes.value[ddx * (dollarLength) + index]
        // .to(dollarBoxes.value[ddx * (dollarLength) + index], { opacity: 0, y: height.value + 200 + 20, duration: 0.05 }, 'exit')
    }, main.value)
  }

  function toggleDollar(ddx: number, index: number) {
    const { w, x, h } = setXAndWidth()
    dollarGroup.value[ddx][index].width = `${w}vw`
    dollarGroup.value[ddx][index].height = `${h}vw`
    dollarGroup.value[ddx][index].x = `${x}%`
  }

  function exitTl(ddx: number, index: number) {
    dollarGroup.value[ddx][index]?.tl.kill()
  }

  onMounted(() => {
    dollarBoxes.value = gsap.utils.toArray(`.${clazz}`)
    dollarGroup.value.forEach((item, ddx) => {
      item.forEach((a, idx) => {
        dollar(ddx, idx)
      })
    })
  })

  onUnmounted(() => {
    ctx?.revert()
  })

  return {
    main,
    clazz,
    toggleDollar,
    mainHeight,
    dollarGroup,
    exitTl,
  }
}

function getUuid() {
  const temp_url = URL.createObjectURL(new Blob())
  const uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}
