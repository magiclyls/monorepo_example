import { createGlobalState } from '@vueuse/core'
import { uniqBy } from 'lodash'
import { ref, watch } from 'vue'

export interface IDiamondsPayoutConfigItem {
  diamonds: string[]
  payoutMultiplier: number
  id: string
  winChance: string
}
/** 各种宝石对应的颜色 */
const diamondsColors: { [k: string]: string } = {
  // 粉
  orange: '#FF69C1',
  // 红
  red: '#FF3659',
  // 紫
  purple: '#874CFB',
  // 黄
  yellow: '#FECF2F',
  // 青
  cyan: '#03D7E0',
  // 绿
  green: '#1CE61D',
  // 蓝
  blue: '#367DF1',
}
const payoutConfig: IDiamondsPayoutConfigItem[] = [
  {
    diamonds: ['match-1', 'match-1', 'match-1', 'match-1', 'match-1'],
    payoutMultiplier: 50,
    id: 'row-1',
    winChance: '0.04',
  },
  {
    diamonds: ['match-1', 'match-1', 'match-1', 'match-1', 'match-0'],
    payoutMultiplier: 5,
    id: 'row-2',
    winChance: '1.25',
  },
  {
    diamonds: ['match-1', 'match-1', 'match-1', 'match-2', 'match-2'],
    payoutMultiplier: 4,
    id: 'row-3',
    winChance: '2.50',
  },
  {
    diamonds: ['match-1', 'match-1', 'match-1', 'match-0', 'match-0'],
    payoutMultiplier: 3,
    id: 'row-4',
    winChance: '12.49',
  },
  {
    diamonds: ['match-1', 'match-1', 'match-2', 'match-2', 'match-0'],
    payoutMultiplier: 2,
    id: 'row-5',
    winChance: '18.74',
  },
  {
    diamonds: ['match-1', 'match-1', 'match-0', 'match-0', 'match-0'],
    payoutMultiplier: 0.1,
    id: 'row-6',
    winChance: '49.98',
  },
  {
    diamonds: ['match-0', 'match-0', 'match-0', 'match-0', 'match-0'],
    payoutMultiplier: 0,
    id: 'row-7',
    winChance: '14.99',
  },
]

export const useMiniGameDiamondsData = createGlobalState(() => {
  /** 匹配颜色1 */
  const activeColor1 = ref('')
  /** 匹配颜色2 */
  const activeColor2 = ref('#367DF1')
  const result = ref(['', '', '', '', ''])
  /** 根据开奖结果自动高亮的行 */
  const activeRowIdAuto = ref('row-7')
  /** 根据鼠标移入高亮的行 */
  const activeRowIdManual = ref('')

  /** 过滤重复的宝石 */
  function getMatchList(result: string[]) {
    const countMap = new Map()
    const arr: string[] = []

    // 统计每个元素出现的次数
    result.forEach((item) => {
      countMap.set(item, (countMap.get(item) || 0) + 1)
    })

    // 找出出现次数大于1的元素
    countMap.forEach((count, item) => {
      if (count > 1)
        arr.push(item)
    })

    return arr
  }
  /** 清空宝石 */
  function clearResult() {
    for (let i = 0; i < 5; i++)
      result.value[i] = ''
  }
  /** 重置颜色 */
  function resetActiveColor() {
    activeColor1.value = ''
    activeColor2.value = '367DF1'
  }

  watch(result, (newResult) => {
    const matchList = getMatchList(newResult).filter(a => !!a)

    if (matchList.length === 1) {
      const arr = uniqBy(newResult).filter((a: string) => a !== matchList[0])
      activeColor1.value = diamondsColors[matchList[0]]
      activeColor2.value = diamondsColors[arr[0]]
      // 只有一组同色
      const count = newResult.filter(a => a === matchList[0]).length
      switch (count) {
        case 2:
          activeRowIdAuto.value = 'row-6'
          break
        case 3:
          activeRowIdAuto.value = 'row-4'
          break
        case 4:
          activeRowIdAuto.value = 'row-2'
          break
        case 5:
          activeRowIdAuto.value = 'row-1'
          break

        default:
          break
      }
    }
    else if (matchList.length === 2) {
      // 有两组同色
      activeColor1.value = diamondsColors[matchList[0]]
      activeColor2.value = diamondsColors[matchList[1]]
      const count = newResult.filter(a => a === matchList[0]).length
      switch (count) {
        case 2:
          activeRowIdAuto.value = 'row-5'
          break
        case 3:
          activeRowIdAuto.value = 'row-3'
          break

        default:
          break
      }
    }

    else {
      activeRowIdAuto.value = 'row-7'
      if (!newResult[0]) {
        resetActiveColor()
      }
      else {
        activeColor1.value = diamondsColors[newResult[0]]
        activeColor2.value = diamondsColors[newResult[1]]
      }
    }
  }, { deep: true })

  return {
    payoutConfig,
    activeColor1,
    activeColor2,
    result,
    activeRowIdAuto,
    activeRowIdManual,
    getMatchList,
    clearResult,
  }
})
