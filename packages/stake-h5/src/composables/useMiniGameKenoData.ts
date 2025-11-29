import type { OriginalGameKenoTile } from '~/shims'

/** 倍率 */
// 典型
const oddsClassic = [
  [],
  ['0.00', '3.96'],
  ['0.00', '1.90', '4.50'],
  ['0.00', '1.00', '3.10', '10.40'],
  ['0.00', '0.80', '1.80', '5.00', '22.50'],
  ['0.00', '0.25', '1.40', '4.10', '16.50', '36.00'],
  ['0.00', '0.00', '1.00', '3.68', '7.00', '16.50', '40.00'],
  ['0.00', '0.00', '0.47', '3.00', '4.50', '14.00', '31.00', '60.00'],
  ['0.00', '0.00', '0.00', '2.20', '4.00', '13.00', '22.00', '55.00', '70.00'],
  ['0.00', '0.00', '0.00', '1.55', '3.00', '8.00', '15.00', '44.00', '60.00', '85.00'],
  ['0.00', '0.00', '0.00', '1.40', '2.25', '4.50', '8.00', '17.00', '50.00', '80.00', '100.0'],
]
// 低等
const oddsLow = [
  [],
  ['0.70', '1.85'],
  ['0.00', '2.00', '3.80'],
  ['0.00', '1.10', '1.38', '26.00'],
  ['0.00', '0.00', '2.20', '7.90', '90.00'],
  ['0.00', '0.00', '1.50', '4.20', '13.00', '300.0'],
  ['0.00', '0.00', '1.10', '2.00', '6.20', '100.0', '700.0'],
  ['0.00', '0.00', '1.10', '1.60', '3.50', '15.00', '225.0', '700.0'],
  ['0.00', '0.00', '1.10', '1.50', '2.00', '5.50', '39.00', '100.0', '800.0'],
  ['0.00', '0.00', '1.10', '1.30', '1.70', '2.50', '7.50', '50.00', '250.0', '1000'],
  ['0.00', '0.00', '1.10', '1.20', '1.30', '1.80', '3.50', '13.00', '50.00', '250.0', '1000'],
]
// 中等
const oddsMedium = [
  [],
  ['0.40', '2.75'],
  ['0.00', '1.80', '5.10'],
  ['0.00', '0.00', '2.80', '50.00'],
  ['0.00', '0.00', '1.70', '10.00', '100.0'],
  ['0.00', '0.00', '1.40', '4.00', '14.00', '390.0'],
  ['0.00', '0.00', '0.00', '3.00', '9.00', '180.0', '710.0'],
  ['0.00', '0.00', '0.00', '2.00', '7.00', '30.00', '400.0', '800.0'],
  ['0.00', '0.00', '0.00', '2.00', '4.00', '11.00', '67.00', '400.0', '900.0'],
  ['0.00', '0.00', '0.00', '2.00', '2.50', '5.00', '15.00', '100.0', '500.0', '1000'],
  ['0.00', '0.00', '0.00', '1.60', '2.00', '4.00', '7.00', '26.00', '100.0', '500.0', '1000'],
]
// 高等
const oddsHigh = [
  [],
  ['0.00', '3.96'],
  ['0.00', '0.00', '17.10'],
  ['0.00', '0.00', '0.00', '81.50'],
  ['0.00', '0.00', '0.00', '10.00', '259.0'],
  ['0.00', '0.00', '0.00', '4.50', '48.00', '450.0'],
  ['0.00', '0.00', '0.00', '0.00', '11.00', '350.0', '710.0'],
  ['0.00', '0.00', '0.00', '0.00', '7.00', '90.00', '400.0', '800.0'],
  ['0.00', '0.00', '0.00', '0.00', '5.00', '20.00', '270.0', '600.0', '900.0'],
  ['0.00', '0.00', '0.00', '0.00', '4.00', '11.00', '56.00', '500.0', '800.0', '1000'],
  ['0.00', '0.00', '0.00', '0.00', '3.50', '8.00', '13.00', '63.00', '500.0', '800.0', '1000'],
]
const kenoOddsData: {
  [k: string]: string[][]
} = {
  classic: oddsClassic,
  low: oddsLow,
  medium: oddsMedium,
  high: oddsHigh,
}
/** 胜算 */
const winChanceList = [
  [],
  ['75.00000000', '25.00000000'],
  ['55.76923077', '38.46153846', '5.76923077'],
  ['41.09311741', '44.02834008', '13.66396761', '1.21457490'],
  ['29.98686946', '44.42499179', '21.41919247', '3.93916183', '0.22978444'],
  ['21.65718350', '41.64842981', '27.76561987', '7.93303425', '0.95743517', '0.03829741'],
  ['15.46941679', '37.12660028', '32.12878871', '12.69285480', '2.37991027', '0.19695809', '0.00547106'],
  ['10.91958832', '31.84879926', '34.39670320', '17.63933498', '4.57316092', '0.58797783', '0.03379183', '0.00064365'],
  ['7.61062216', '26.47172926', '34.74414465', '22.23625258', '7.48335423', '1.33037409', '0.11878340', '0.00468112', '0.00005851'],
  ['5.23230274', '21.40487483', '33.50328234', '26.05810849', '10.94440557', '2.52563205', '0.31180643', '0.01909019', '0.00049371', '0.00000366'],
  ['3.54446314', '16.87839592', '31.07159249', '28.82002782', '14.71022253', '4.23654409', '0.67893335', '0.05747584', '0.00230930', '0.00003539', '0.00000012'],
]

export const useMiniGameKenoData = createGlobalState(() => {
  /** 方块数据 */
  const tilesList = ref<OriginalGameKenoTile[]>([
    { position: 0, num: 1, chosen: false, result: '' },
    { position: 1, num: 2, chosen: false, result: '' },
    { position: 2, num: 3, chosen: false, result: '' },
    { position: 3, num: 4, chosen: false, result: '' },
    { position: 4, num: 5, chosen: false, result: '' },
    { position: 5, num: 6, chosen: false, result: '' },
    { position: 6, num: 7, chosen: false, result: '' },
    { position: 7, num: 8, chosen: false, result: '' },
    { position: 8, num: 9, chosen: false, result: '' },
    { position: 9, num: 10, chosen: false, result: '' },
    { position: 10, num: 11, chosen: false, result: '' },
    { position: 11, num: 12, chosen: false, result: '' },
    { position: 12, num: 13, chosen: false, result: '' },
    { position: 13, num: 14, chosen: false, result: '' },
    { position: 14, num: 15, chosen: false, result: '' },
    { position: 15, num: 16, chosen: false, result: '' },
    { position: 16, num: 17, chosen: false, result: '' },
    { position: 17, num: 18, chosen: false, result: '' },
    { position: 18, num: 19, chosen: false, result: '' },
    { position: 19, num: 20, chosen: false, result: '' },
    { position: 20, num: 21, chosen: false, result: '' },
    { position: 21, num: 22, chosen: false, result: '' },
    { position: 22, num: 23, chosen: false, result: '' },
    { position: 23, num: 24, chosen: false, result: '' },
    { position: 24, num: 25, chosen: false, result: '' },
    { position: 25, num: 26, chosen: false, result: '' },
    { position: 26, num: 27, chosen: false, result: '' },
    { position: 27, num: 28, chosen: false, result: '' },
    { position: 28, num: 29, chosen: false, result: '' },
    { position: 29, num: 30, chosen: false, result: '' },
    { position: 30, num: 31, chosen: false, result: '' },
    { position: 31, num: 32, chosen: false, result: '' },
    { position: 32, num: 33, chosen: false, result: '' },
    { position: 33, num: 34, chosen: false, result: '' },
    { position: 34, num: 35, chosen: false, result: '' },
    { position: 35, num: 36, chosen: false, result: '' },
    { position: 36, num: 37, chosen: false, result: '' },
    { position: 37, num: 38, chosen: false, result: '' },
    { position: 38, num: 39, chosen: false, result: '' },
    { position: 39, num: 40, chosen: false, result: '' },
  ])

  /** 选中个数 */
  const chosenNumberCount = computed(() => tilesList.value.filter(a => a.chosen).length)
  /** 宝石个数 */
  const gemCount = computed(() => tilesList.value.filter(a => a.chosen && !!a.result).length)
  /** 是否已开奖 */
  const gameSettled = computed(() => tilesList.value.filter(a => !!a.result).length > 0)

  /** 自动挑选号码 */
  function getRandomTenNumbers() {
    // 过滤已选号码
    const numbers = tilesList.value.filter(a => !a.chosen).map(b => b.position)

    // Fisher-Yates 洗牌算法打乱数组顺序
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }

    // 返回新的随机号码，总数不超过10
    return numbers.slice(0, 10 - chosenNumberCount.value)
  }
  /** 清空开奖结果 */
  function clearTileResult() {
    tilesList.value.forEach((t) => {
      t.result = ''
    })
  }
  /** 清空选中状态 */
  function clearTileChosen() {
    tilesList.value.forEach((t) => {
      t.chosen = false
    })
  }

  return {
    kenoOddsData,
    winChanceList,
    tilesList,
    chosenNumberCount,
    gemCount,
    gameSettled,
    getRandomTenNumbers,
    clearTileResult,
    clearTileChosen,
  }
})
