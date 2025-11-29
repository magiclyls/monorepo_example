import type {
  EnumCurrencyKey,
  IBetInfoBack,
  IBetInfoChangeCallback,
  IBetInfoDl,
  IBetInfoStatus,
  ICartInfo,
  ICartInfoData,
  IOutrightDataGroupedByLeague,
  ISportDataGroupedByLeague,
  ISportEventInfo,
  ISportEventInfoMl,
  ISportEventInfoMlMs,
  ISportEventList,
  ISportListToCartData,
  ISportOutrightsInfo,
} from '@tg/types'
import type { Ref } from 'vue'
import { EnumCurrency, EnumsBetSlipBetSlipTabStatus, ESportsToMainPageRoutes } from '@tg/types'
import { cloneDeep, uniqBy } from 'lodash'
import { application } from './main'
import { add, mul, toFixed } from './number'
import { Local, STORAGE_SPORTS_CURRENT_PROVIDER } from './storage'

/**
 * 体育ID
 *
 * 用来替换掉字符串中的体育ID
 */
export const SPORTS_PLAT_ID = 'SPORTS_PLAT_ID'

/**
 * 获取当前体育平台ID
 * @returns {string}
 */
export function getSportsPlatId() {
  return Local.get<string>(STORAGE_SPORTS_CURRENT_PROVIDER)?.value ?? '401'
}

/**
 * 替换字符串中的体育ID
 * @param {string} str
 * @returns {string}
 */
export function replaceSportsPlatId(str: string) {
  return str.replace(SPORTS_PLAT_ID, getSportsPlatId())
}

/**
 * 盘口根据联赛组合方法
 * @param origin 赛事详情数据
 */
export function sportsDataGroupByLeague(origin: ISportEventInfo[]) {
  const arr: ISportDataGroupedByLeague = []
  for (let i = 0; i < origin.length; i++) {
    if (i === 0) {
      arr.push({ ci: origin[i].ci, cn: origin[i].cn, list: [origin[i]] })
      continue
    }

    const index = arr.findIndex(a => a.ci === origin[i].ci)
    if (index > -1)
      arr[index].list.push(origin[i])
    else
      arr.push({ ci: origin[i].ci, cn: origin[i].cn, list: [origin[i]] })
  }
  return arr
}

/**
 * 加载更多的时候盘口根据联赛组合方法
 * @param origin 原已经根据联赛组合的数据
 * @param newData 新赛事数据
 */
export function sportsDataGroupByLeagueLoadMore(
  origin: ISportDataGroupedByLeague,
  newData: ISportEventInfo[],
) {
  const arr: ISportDataGroupedByLeague = cloneDeep(origin)
  for (let i = 0; i < newData.length; i++) {
    const index = arr.findIndex(a => a.ci === newData[i].ci)
    if (index > -1)
      arr[index].list.push(newData[i])
    else
      arr.push({ ci: newData[i].ci, cn: newData[i].cn, list: [newData[i]] })
  }

  // 去重
  return arr.map((a) => {
    return {
      ci: a.ci,
      cn: a.cn,
      list: uniqBy(a.list, 'ei'),
    }
  })
}

/**
 * 盘口根据联赛组合监听mqtt通知更新
 * @param origin
 * @param newData
 */
export function sportsDataGroupedByLeagueUpdateByMqtt(
  origin: ISportDataGroupedByLeague,
  newData: ISportEventList[],
) {
  const arr: ISportDataGroupedByLeague = cloneDeep(origin)
  for (let i = 0; i < newData.length; i++) {
    for (let ii = 0; ii < arr.length; ii++) {
      const index = arr[ii].list.findIndex(a => a.ei === newData[i].ei)
      if (index > -1) {
        if (Array.isArray(newData[i].v))
          arr[ii].list.splice(index, 1, newData[i].v[0])
        else
          arr[ii].list.splice(index, 1)
      }
    }
  }
  return arr
}

/**
 * 赛事数据监听mqtt通知更新
 * @param origin
 * @param newData
 */
export function sportsEventInfoListUpdateByMqtt(
  origin: ISportEventInfo[],
  newData: ISportEventList[],
) {
  const arr: ISportEventInfo[] = cloneDeep(origin)
  for (let i = 0; i < newData.length; i++) {
    const index = arr.findIndex(a => a.ei === newData[i].ei)
    if (index > -1) {
      if (Array.isArray(newData[i].v))
        arr.splice(index, 1, newData[i].v[0])
      else
        arr.splice(index, 1)
    }
  }
  return arr
}

/**
 * 冠军盘口根据联赛组合方法
 * @param origin 赛事详情数据
 */
export function outrightDataGroupByLeague(origin: ISportOutrightsInfo[]) {
  const arr: IOutrightDataGroupedByLeague = []
  for (let i = 0; i < origin.length; i++) {
    if (i === 0) {
      arr.push({ ci: origin[i].ci, cn: origin[i].cn, list: [origin[i]] })
      continue
    }

    const index = arr.findIndex(a => a.ci === origin[i].ci)
    if (index > -1)
      arr[index].list.push(origin[i])
    else
      arr.push({ ci: origin[i].ci, cn: origin[i].cn, list: [origin[i]] })
  }
  return arr
}

/**
 * 加载更多的时候盘口根据联赛组合方法
 * @param origin 原已经根据联赛组合的数据
 * @param newData 新赛事数据
 */
export function outrightDataGroupByLeagueLoadMore(
  origin: IOutrightDataGroupedByLeague,
  newData: ISportOutrightsInfo[],
) {
  const arr: IOutrightDataGroupedByLeague = cloneDeep(origin)
  for (let i = 0; i < newData.length; i++) {
    const index = arr.findIndex(a => a.ci === newData[i].ci)
    if (index > -1)
      arr[index].list.push(newData[i])
    else
      arr.push({ ci: newData[i].ci, cn: newData[i].cn, list: [newData[i]] })
  }

  // 去重
  return arr.map((a) => {
    return {
      ci: a.ci,
      cn: a.cn,
      list: uniqBy(a.list, 'ei'),
    }
  })
}

/**
 * 冠军盘口根据地区组合方法
 * @param origin 冠军盘口数据
 */
export function sportsOutrightsGroupByRegion(origin: ISportOutrightsInfo[]): {
  pgid: string
  pgn: string
  list: {
    ci: string
    cn: string
    list: ISportOutrightsInfo[]
  }[]
}[] {
  // 组合地区
  const arr1 = []
  for (let i = 0; i < origin.length; i++) {
    if (i === 0) {
      arr1.push({ pgid: origin[i].pgid, pgn: origin[i].pgn, list: [origin[i]] })
      continue
    }

    const index = arr1.findIndex(a => a.pgid === origin[i].pgid)
    if (index > -1)
      arr1[index].list.push(origin[i])
    else
      arr1.push({ pgid: origin[i].pgid, pgn: origin[i].pgn, list: [origin[i]] })
  }

  // 组合联赛
  const arr2: {
    pgid: string
    pgn: string
    list: {
      ci: string
      cn: string
      list: ISportOutrightsInfo[]
    }[]
  }[] = []
  for (let i = 0; i < arr1.length; i++) {
    const list = cloneDeep(arr1[i].list)
    const leagueArr = []
    for (let ii = 0; ii < list.length; ii++) {
      if (ii === 0) {
        leagueArr.push({ ci: list[ii].ci, cn: list[ii].cn, list: [list[ii]] })
        continue
      }
      const index = leagueArr.findIndex(a => a.ci === list[ii].ci)
      if (index > -1)
        leagueArr[index].list.push(list[ii])
      else
        leagueArr.push({ ci: list[ii].ci, cn: list[ii].cn, list: [list[ii]] })
    }
    arr2.push({ pgid: arr1[i].pgid, pgn: arr1[i].pgn, list: leagueArr })
  }
  return arr2
}

/**
 * 收藏数据根据球种组合方法
 * @param origin 赛事详情
 */
export function sportsDataGroupBySport(origin: ISportEventInfo[]) {
  const arr = []
  for (let i = 0; i < origin.length; i++) {
    if (i === 0) {
      arr.push({ si: origin[i].si, sn: origin[i].sn, list: [origin[i]] })
      continue
    }

    const index = arr.findIndex(a => a.si === origin[i].si)
    if (index > -1)
      arr[index].list.push(origin[i])
    else
      arr.push({ si: origin[i].si, sn: origin[i].sn, list: [origin[i]] })
  }
  return arr
}

/**
 * 盘口数据组合面包屑
 * @param data 赛事详情 ｜ 冠军盘口数据
 */
export function sportsDataBreadcrumbs(data: ISportEventInfo | ISportOutrightsInfo) {
  const sport = {
    label: data.sn,
    value: `${data.si}`,
    path: `/sports/${data.si}`,
    data: {
      name: ESportsToMainPageRoutes.SPORT,
      data: {
        si: data.si,
      },
    },
  }
  const area = {
    label: data.pgn,
    value: `${data.pgid}`,
    path: `/sports/${data.si}/${data.pgid}?${application.objectToUrlParams({ sn: data.sn, pgn: data.pgn })}`,
    data: {
      name: ESportsToMainPageRoutes.REGION,
      data: {
        si: data.si,
        pgid: data.pgid,
        query: application.objectToUrlParams({ sn: data.sn, pgn: data.pgn }),
      },
    },
  }
  const league = {
    label: data.cn,
    value: `${data.ci}`,
    path: `/sports/${data.si}/${data.pgid}/${data.ci}?${application.objectToUrlParams({ sn: data.sn, pgn: data.pgn, cn: data.cn })}`,
    data: {
      name: ESportsToMainPageRoutes.LEAGUE,
      data: {
        si: data.si,
        pgid: data.pgid,
        ci: data.ci,
        query: application.objectToUrlParams({ sn: data.sn, pgn: data.pgn, cn: data.cn }),
      },
    },
  }
  return [sport, area, league]
}

/**
 * 获取购物车需要的对象
 * @param infoList1 info 接口 list[0] 对象
 * @param mlObject infoList1.ml 对象
 * @param msObject infoList1.ml.ms 对象
 */
export function getCartObject(
  mlObject: ISportEventInfoMl,
  msObject: ISportEventInfoMlMs,
  infoList1: ISportEventInfo,
): ICartInfo {
  let sn = ''
  // 让分盘
  if (mlObject.bt === 1)
    sn = `${msObject.sn} (${msObject.hdp})`
  // 总分
  else if (mlObject.bt === 2)
    sn = `${msObject.sn} ${msObject.hdp}`
  // 获胜以及其它
  else
    sn = msObject.sn

  return {
    mlid: mlObject.mlid,
    mll: mlObject.mll,
    pid: mlObject.pid,
    bt: mlObject.bt,
    btn: mlObject.btn,
    wid: msObject.wid,
    ov: msObject.ov,
    hdp: msObject.hdp,
    sid: msObject.sid,
    sn,
    ic: infoList1.ic,
    pgid: infoList1.pgid,
    ci: infoList1.ci,
    ap: infoList1.ap,
    hp: infoList1.hp,
    ed: infoList1.ed,
    m: infoList1.m,
    ei: infoList1.ei,
    si: infoList1.si,
    homeTeamName: infoList1.htn,
    awayTeamName: infoList1.atn,
    rei: mlObject.rei ?? '',
    sp: msObject.sp ?? '',
    cn: infoList1.cn,
  }
}

/**
 * 体育购物车类
 */
export class SportsCart {
  /** 购物车数据 */
  dataList: ICartInfoData[] = []

  /** 货币类型 */
  currency: EnumCurrencyKey = EnumCurrency[0] as EnumCurrencyKey

  /** 整个投注列表是否有赔率变化 */
  ovIsChange = false

  /** 是否有更低的赔率 */
  ovIsLower = false

  /** 复式下的金额最小值 */
  multiMia = 0

  /** 复式下的金额最大值 */
  multiMaa = 0

  /** 是否支持当前货币 */
  isSupportCurrency = true

  /** 输入金额是否只支持两位小数 */
  isOnlyTwoDecimal = true

  /** 输入金额是否要10的倍数 */
  isTenMultiple = true

  /** 输入金额是否支持小数点后五位 */
  isFiveDecimal = false

  /**
   * 默认选中的选项
   * @type {EnumsBetSlipBetSlipTabStatus}
   */
  defaultBetSlipBetSlipTabStatus = EnumsBetSlipBetSlipTabStatus.single

  /** 金额是否存在超过两位小数的情况 */
  get isExistMoreThanTwoDecimal() {
    return this.dataList.some((item) => {
      const amount = String(item.amount)
      const amountArr = amount.split('.')
      if (amountArr.length > 1 && amountArr[1].length > 2)
        return true
      else
        return false
    })
  }

  /** 金额是否存在不是10的倍数 */
  get isTenMultipleBool() {
    return this.dataList.some((item) => {
      const amount = String(item.amount)

      if (amount === '0' || amount === '' || amount === 'null')
        return false

      const amountArr = amount.split('.')
      // 判断小数点后面是不是0或者undefined
      if (amountArr[1] === void 0 || Number(amountArr[1]) === 0) {
        if (Number(amountArr[0]) % 10 === 0)
          return false
        else
          return true
      }
      else {
        return true
      }
    })
  }

  /** 金额是否存在小数点后五位的情况 */
  get isExistFiveDecimal() {
    return this.dataList.some((item) => {
      const amount = String(item.amount)
      const amountArr = amount.split('.')
      if (amountArr.length > 1 && amountArr[1] && `${amountArr[1]}`.length > 5)
        return true
      else
        return false
    })
  }

  /** 购物车数量 */
  get count() {
    return this.dataList.length
  }

  /** 总投注额 */
  get totalAmount() {
    return this.dataList.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
  }

  /** 预计总盈利 */
  get totalProfit() {
    return this.dataList.reduce((a, b) => {
      return Number(add(a, Number(mul(Number(b.amount), Number(b.ov)))))
    }, 0)
  }

  /** 预计总支付额 */
  get totalPay() {
    return this.dataList.reduce((a, b) => {
      return Number(add(a, Number(b.amount)))
    }, 0)
  }

  /** 总赔率 */
  get totalOv() {
    return this.dataList.reduce((a, b, index) => {
      if (index === 0)
        return Number(b.ov)
      return Number(mul(a, Number(b.ov)))
    }, 0)
  }

  /**
   * 是否显示重新使用投注单
   *
   * 当购物车中数据的result不为undefined时，显示重新使用投注单
   */
  get isShowReuse() {
    if (this.dataList.length === 0)
      return false

    return this.dataList.every(a => a.result !== void 0)
  }

  /**
   * 判断当前是否存在两项有同样的赛事ID（ei）,如果有，返回相同的ei数组
   * @desc 用于串关投注时，判断是否可以投注
   */
  get getExistSameEventIdList(): string[] {
    const seen: Set<string> = new Set()
    const duplicates: Set<string> = new Set()

    for (const item of this.dataList.map(a => a.ei)) {
      if (seen.has(item))
        duplicates.add(item)

      else
        seen.add(item)
    }

    return Array.from(duplicates)
  }

  /**
   * 获取是否有关盘的盘口
   * @desc os 0:关盘 1:开盘 2:不支援串关, ov === 0 也是关盘
   * @returns {boolean}
   */
  get isExistCloseCaps() {
    return this.dataList.some(a => a.os === 0 || (+a.ov) === 0)
  }

  /**
   * 获取没有关盘的盘口
   */
  get getNotCloseCapsList() {
    return this.dataList.filter(a => !(a.os === 0 || (+a.ov) === 0))
  }

  /**
   * 获取关盘的盘口
   */
  get getCloseCapsList() {
    return this.dataList.filter(a => a.os === 0 || (+a.ov) === 0)
  }

  /**
   * 获取不支持串关的 wid 列表
   */
  get getNotSupportWidList() {
    return this.dataList.filter(a => a.os === 2).map(a => a.wid)
  }

  /**
   * os === 3 就代表赔率小于1.1了
   * 赔率小于1.10的投注项不能组合为复式投注
   */
  get getOddsLessThanOnePointOneWidList() {
    return this.dataList.filter(a => a.os === 3).map(a => a.wid)
  }

  /**
   * 获取 是否存在 ic != 1 的盘口
   * @return ic 列表
   */
  get getExistIcList() {
    return this.dataList.filter(a => a.ic !== 1).map(a => a.ic)
  }

  constructor(currency: EnumCurrencyKey) {
    this.currency = currency
  }

  /**
   * 添加数据到购物车
   * @param {ICartInfo} data
   */
  async add(data: ICartInfo) {
    // 如果dataList中的object的result有一个不是undefined，就清空购物车
    // 因为不是undefined的话，说明已经投注过了
    if (this.dataList.some(a => a.result !== void 0)) {
      this.removeAll()
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 30)
      })
    }
    // 如果是中文单关最多只能存在1个
    // const sportStore = useSportsStore()
    // if (sportStore.lobbyCurrentEventType !== EnumSportsEventType.CHUAN && languageStore.userLanguage === 'zh-CN')
    //   this.removeAll()

    let suffixLength = 2
    if (application.isVirtualCurrency(this.currency))
      suffixLength = 8

    this.dataList.push({
      ...data,
      amount: null as any,
      // 下面的值是初始化用的，会在 updateAllData 方法中更新
      os: 1,
      maa: 0,
      mia: 0,
      pt: 0,
      hp: data.hp,
      ap: data.ap,
      new_wid: data.wid,
      ovIsChange: false,
      errorMsg: '',
    })
  }

  /**
   * 从购物车删除数据
   * @param {number} index
   */
  remove(wid: string) {
    const index = this.dataList.findIndex(a => a.wid === wid)
    if (index > -1)
      this.dataList.splice(index, 1)
    else
      console.error('购物车中没有该数据')
  }

  /** 从购物车删除所有数据 */
  removeAll() {
    this.dataList = []
  }

  /**
   * 更新所有amount
   * @param {number} amount
   * @param {boolean} forceUpdate 是否强制更新，如果为true，就不管amount有没有值，都更新
   */
  updateAllAmount(amount?: number, forceUpdate = true) {
    let suffixLength = 2
    if (['BTC', 'ETH'].includes(this.currency))
      suffixLength = 8

    this.dataList.forEach((a) => {
      if (amount) {
        if (forceUpdate) {
          a.amount = toFixed(amount, suffixLength) as any
        }
        else {
          if (!a.amount)
            a.amount = toFixed(amount, suffixLength) as any
        }
      }
      else {
        a.amount = null as any
      }
    })
  }

  /** 更新货币 */
  updateCurrency(currency: EnumCurrencyKey) {
    this.currency = currency
    this.updateAllAmount()
  }

  /**
   * 检查wid 是否在购物车中，并且result为undefined
   * @param {string} wid
   */
  checkWid(wid: string) {
    const index = this.dataList.findIndex(a => a.wid === wid)
    const newWidIndex = this.dataList.findIndex(a => a.new_wid === wid)
    if (index > -1 && this.dataList[index].result === void 0) {
      return true
    }
    else {
      if (newWidIndex > -1 && this.dataList[newWidIndex].result === void 0)
        return true

      else
        return false
    }
  }

  /**
   * 通过wid，更新ov，os
   */
  updateOvOs(_data: ISportListToCartData) {
    if (this.isShowReuse)
      return

    const { wid, ov, os } = _data
    const index = this.dataList.findIndex(a => a.wid === wid)

    if (index !== -1) {
      const _ov = Number(this.dataList[index].ov)

      if (ov && this.ovIsChange === false) {
        this.ovIsChange = Number(ov) !== _ov
        this.dataList[index].ovIsChange = Number(ov) !== _ov
      }

      if (ov && this.ovIsLower === false)
        this.ovIsLower = Number(ov) < _ov
    }

    if (index > -1) {
      this.dataList[index].ov = ov
      this.dataList[index].os = os
    }
  }

  /**
   * 将betinfo的 dl 和 wsi 数据转换成购物车需要的数据
   */
  dlStatesToRenderData(dl: IBetInfoDl, status: IBetInfoStatus) {
    this.isSupportCurrency = status !== 3

    // dl 不需要处理为3的情况，因为不支持的币种，使用status来判断
    this.isOnlyTwoDecimal = dl === 4
    this.isTenMultiple = dl === 5
    this.isFiveDecimal = dl === 6
  }

  /**
   * 更新所有数据的赔率，状态等...，通过betinfo接口返回的数据
   * @param {IBetInfoBack} data
   * @param {IBetInfoChangeCallback} fn 回调函数
   */
  updateAllData(data: IBetInfoBack, fn?: IBetInfoChangeCallback, autoAmount = true) {
    if (this.isShowReuse)
      return

    const { wsi, bi, dl, status } = data

    this.dlStatesToRenderData(dl, status)

    if (!bi)
      console.log('bi 不存在')

    let pt = 0

    if (bi) {
      // 复式下的最小赔率
      this.multiMia = bi[0] ? bi[0].mia : 0
      // 复式下的最大赔率
      this.multiMaa = bi[0] ? bi[0].maa : 0
      // 复式下的串关类型
      pt = bi[0] ? bi[0].pt : 0
    }

    /** os和ov有变化的数据 */
    const osOvIsChangeWidList = this.dataList.filter((item) => {
      if (wsi) {
        const _wsi = wsi.find(a => a.wid === item.wid)
        return Number(_wsi?.ov) !== Number(item.ov) || _wsi?.os !== item.os
      }
      return true
    }).map<string>((item) => {
      return item.wid
    })

    if (wsi && this.ovIsChange === false) {
      this.ovIsChange = this.dataList.some((item) => {
        const _wsi = wsi.find(a => a.wid === item.wid)
        return Number(_wsi?.ov) !== Number(item.ov)
      })
    }

    if (wsi && this.ovIsLower === false) {
      this.ovIsLower = this.dataList.some((item) => {
        const _wsi = wsi.find(a => a.wid === item.wid)
        return Number(_wsi?.ov) < Number(item.ov)
      })
    }

    this.dataList.forEach((item) => {
      if (wsi) {
        const _wsiObject = wsi.find(a => a.wid === item.wid)
        if (_wsiObject) {
          item.ov = _wsiObject?.ov
          item.os = _wsiObject?.os
          item.m = _wsiObject?.m
          item.hp = _wsiObject?.hp
          item.ap = _wsiObject?.ap
          item.new_wid = _wsiObject?.new_wid

          // 更新单个赔率是否有变化
          item.ovIsChange = Number(_wsiObject?.ov) !== Number(item.ov)

          // if (item.new_wid !== item.wid)
          //   item.wid = item.new_wid
        }
      }

      if (bi) {
        const _biObject = bi.find(a => a.wid === item.wid)
        if (_biObject) {
          item.maa = _biObject?.maa ?? 0
          item.mia = _biObject?.mia ?? 0
          item.cei = _biObject?.cei ?? ''
          if (autoAmount && item.amount === null && _biObject?.mia)
            item.amount = toFixed(_biObject?.mia, ['BTC', 'ETH'].includes(this.currency) ? 8 : 2) as any
        }
        // 复式下的串关类型，单式不需要管这个值
        item.pt = _biObject?.pt ?? pt
      }
    })

    /**
     * os和ov有变化的数据
     * @desc 用于通知列表更新
     */
    const osOvIsChangeList = this.dataList.filter((item) => {
      return osOvIsChangeWidList.includes(item.wid)
    }).map<ISportListToCartData>((item) => {
      return {
        wid: item.wid,
        mlid: item.mlid,
        ov: item.ov,
        os: item.os,
      }
    })

    if (fn)
      fn({ osOvIsChangeList })
  }

  /**
   * 更新列表的 Result 状态
   * @param {string} wid 唯一值
   * @param {'fulfilled' | 'rejected'} result
   */
  updateListResult(wid: string, result: 'fulfilled' | 'rejected', appointingOv?: number) {
    const index = this.dataList.findIndex(a => a.wid === wid)
    if (index > -1) {
      this.dataList[index].result = result
      if (appointingOv)
        this.dataList[index].appointingOv = appointingOv
    }
  }

  /**
   * 重新使用投注单
   */
  reuse() {
    this.dataList.forEach((item) => {
      item.result = undefined
    })

    this.updateAllAmount()
  }

  /**
   * 设置ovIsChange 和 ovIsLower 值
   * @param {boolean} bool
   * @returns {void}
   */
  setOvIsChangeBool(bool: boolean) {
    this.ovIsChange = bool
    this.ovIsLower = bool

    this.dataList.forEach((item) => {
      item.ovIsChange = bool
    })
  }

  /**
   * 修改单个列表项的赔率变化状态
   * @param {string} wid 唯一值
   * @param {bool} bool
   */
  updateOvIsChangeBool(wid: string, bool: boolean) {
    const index = this.dataList.findIndex(a => a.wid === wid)
    if (index > -1)
      this.dataList[index].ovIsChange = bool

    // 如果全部都没有变化，就设置 整个投注列表 是否有赔率变化 为 false
    if (this.dataList.every(a => a.ovIsChange === false))
      this.setOvIsChangeBool(false)
  }

  /**
   * 根据wid 列表 获取购物车数据中的amount总和
   * @param {string[]} widList
   */
  getAmountByWidList(widList: string[]) {
    return this.dataList.filter(a => widList.includes(a.wid)).reduce((a, b) => {
      return Number(add(a, Number(b.amount)))
    }, 0)
  }

  /**
   * 设置 defaultBetSlipBetSlipTabStatus
   * @param {EnumsBetSlipBetSlipTabStatus} status
   */
  setDefaultBetSlipBetSlipTabStatus(status: EnumsBetSlipBetSlipTabStatus) {
    this.defaultBetSlipBetSlipTabStatus = status
  }
}

/**
 * 设置赛事进行时间
 */
export function getSportsLiveTime(eventTime: Ref<string>, data: {
  rbtt: string
  ts: number
  si: number
  rbts: number
}, _dayjs: any) {
  if (!data.rbtt) {
    eventTime.value = ''
  }
  else {
    const rbttArr = data.rbtt.split(':')
    const ts = data.ts
    const baseMin = rbttArr[0]
    const baseSec = rbttArr[1]

    const diff = _dayjs().diff(ts * 1000, 'second')
    const diffMin = Math.floor(diff / 60)
    const diffSec = diff - (diffMin * 60)
    let sec = 0
    let min = 0

    // 篮球倒计时
    if (data.si === 2) {
      // 暂停倒计时
      if (data.rbts !== 2)
        return

      sec = baseSec ? (+baseSec - diffSec) : 0
      min = +baseMin - diffMin

      if (sec < 0) {
        sec = sec + 60
        min = min - 1
      }
      if (min < 0) {
        min = 0
        sec = 0
      }
    }
    // 其它
    else {
      sec = baseSec ? (+baseSec + diffSec) : 0
      min = +baseMin + diffMin

      if (sec > 59) {
        sec = sec - 60
        min = min + 1
      }
    }

    eventTime.value = `${min < 10 ? `0${min}` : min}${baseSec ? `:${sec < 10 ? `0${sec}` : sec}` : ''}`
  }
}

/**
 * 获取复式投注pt值
 */
export function getSportMultiPtByLength(length: number) {
  switch (length) {
    case 2:
      return 9
    case 3:
      return 10
    case 4:
      return 11
    case 5:
      return 12
    case 6:
      return 13
    case 7:
      return 14
    case 8:
      return 15
    case 9:
      return 16
    case 10:
      return 17
    default:
      return 0
  }
}

/**
 * 根据pt获取串关渲染文字和乘数
 */
export function getSportMultiDataByLength(length: number): Record<string, any>[] {
  switch (length) {
    case 2:
      return [
        {
          text: '2串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
      ]
    case 3:
      return [
        {
          text: '3串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,

        },
        {
          text: '2串1',
          times: '3',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,

        },
        {
          text: '3串4',
          times: '4',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 1,
        },
      ]
    case 4:
      return [
        {
          text: '4串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 11,

        },
        {
          text: '2串1',
          times: '6',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
        {
          text: '3串1',
          times: '4',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,

        },
        {
          text: '4串11',
          times: '11',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 2,
        },
      ]
    case 5:
      return [
        {
          text: '5串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 12,
        },
        {
          text: '2串1',
          times: '10',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
        {
          text: '3串1',
          times: '10',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,
        },
        {
          text: '4串1',
          times: '5',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 11,
        },
        {
          text: '5串26',
          times: '26',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 3,
        },
      ]
    case 6:
      return [
        {
          text: '6串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 13,
        },
        {
          text: '2串1',
          times: '15',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
        {
          text: '3串1',
          times: '20',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,
        },
        {
          text: '4串1',
          times: '15',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 11,
        },
        {
          text: '5串1',
          times: '6',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 12,
        },
        {
          text: '6串57',
          times: '57',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 4,
        },
      ]
    case 7:
      return [
        {
          text: '7串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 14,
        },
        {
          text: '2串1',
          times: '21',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
        {
          text: '3串1',
          times: '35',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,
        },
        {
          text: '4串1',
          times: '35',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 11,
        },
        {
          text: '5串1',
          times: '21',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 12,
        },
        {
          text: '6串1',
          times: '7',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 13,
        },
        {
          text: '7串120',
          times: '120',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 5,
        },
      ]
    case 8:
      return [
        {
          text: '8串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 15,
        },
        {
          text: '2串1',
          times: '28',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
        {
          text: '3串1',
          times: '56',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,
        },
        {
          text: '4串1',
          times: '70',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 11,
        },
        {
          text: '5串1',
          times: '56',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 12,
        },
        {
          text: '6串1',
          times: '28',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 13,
        },
        {
          text: '7串1',
          times: '8',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 14,
        },
        {
          text: '8串247',
          times: '247',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 6,
        },
      ]
    case 9:
      return [
        {
          text: '9串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 16,
        },
        {
          text: '2串1',
          times: '36',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
        {
          text: '3串1',
          times: '84',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,
        },
        {
          text: '4串1',
          times: '126',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 11,
        },
        {
          text: '5串1',
          times: '126',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 12,
        },
        {
          text: '6串1',
          times: '84',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 13,
        },
        {
          text: '7串1',
          times: '36',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 14,
        },
        {
          text: '8串1',
          times: '9',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 15,
        },
        {
          text: '9串502',
          times: '502',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 7,
        },
      ]
    case 10:
      return [
        {
          text: '10串1',
          times: '1',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 17,
        },
        {
          text: '2串1',
          times: '45',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 9,
        },
        {
          text: '3串1',
          times: '120',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 10,
        },
        {
          text: '4串1',
          times: '210',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 11,
        },
        {
          text: '5串1',
          times: '252',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 12,
        },
        {
          text: '6串1',
          times: '210',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 13,
        },
        {
          text: '7串1',
          times: '120',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 14,
        },
        {
          text: '8串1',
          times: '45',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 15,
        },
        {
          text: '9串1',
          times: '10',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 16,
        },
        {
          text: '10串1013',
          times: '1013',
          maa: '0.00',
          mia: '0.00',
          a: '',
          pt: 8,
        },
      ]
    default:
      return []
  }
}

/**
 * 体育路由跳转
 * bc体育用的
 */
export function getSportsRoutePath(config: {
  /** 页面（必传） */
  page: string
  /** 球种 - 用于获取数据 */
  si?: string
  /** 联赛id - 用于获取数据 */
  ci?: string
  /** 联赛名称 - 用于展示联赛图标 */
  cn?: string
  /** 联赛图标 - 用于展示联赛图标 */
  icon?: string
  /** 地区id - 用于筛选对应地区的冠军盘口 */
  pgid?: string
  /** 赛事id */
  ei?: string
  /** 赛事还是冠军 */
  marketType?: EPageDataMarketType
}) {
  // 初始路径，bt-path 是必须的
  const queryParams: Record<string, string> = {
    'bt-path': `${config.page}`,
  }

  // 遍历可选字段，有就加进 queryParams
  const optionalKeys: (keyof typeof config)[] = ['si', 'ci', 'cn', 'icon', 'pgid', 'ei', 'marketType']
  for (const key of optionalKeys) {
    const val = config[key]
    if (val) {
      queryParams[key] = val
    }
  }

  // 构造最终路径
  const queryString = Object.entries(queryParams)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&')

  return `/sports?${queryString}`
}

const themeSuffix: { [t: string]: string } = {
  'themenameforglobalcss-ph-h5': '_queen',
  'themenameforglobalcss-afun-h5': '',
}
/**
 * 改变不同模板的体育icon路径
 * _queen
 * _queen_active
 */
export function sportsIconPathFormatBySite(path: string, isActive?: boolean) {
  const themeName = document.documentElement.dataset.themenameforglobalcss ?? ''

  // 后面多站点的时候再做映射
  let suffix = themeSuffix[themeName] ?? ''
  if (isActive)
    suffix = `${suffix}_active`

  const arr = path.split('.')

  return `${arr[0]}${suffix}` + `.${arr[1]}`
}
