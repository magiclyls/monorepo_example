import type {
  CurrencyCode,
  IBetArgs,
  IBetInfo,
  IBetInfoBack,
  IBetReserveArgs,
  INotNotice,
  IResponseList,
  ISportEventInfo,
  ISportEventList,
  ISportOutrightsInfo,
  ISportsBetListArgs,
  ISportsFollowBetList,
  ISportsInfo,
  ISportsMyBetSlipItem,
} from '@tg/types'
import { getSportsPlatId } from '@tg/utils'
import { httpClient } from './http'

/**
 * 获取所有体育计数
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b9bcba6d-49cf-4de9-a304-cf80caf8f46c
 */
export function ApiSportCount(params: {
  /**
   * 是否取得串关数量
   *
   * 0:全部
   *
   * 1:支援串关
   *
   * 2:不支援串关
   */
  ic: number
}) {
  return httpClient.get<{
    /** count 总数 */
    c: number
    /** 即将开赛总数 */
    nc: number
    list: {
      /** 球种Id */
      si: number
      /** 球种名称 */
      sn: string
      /** todayCount 今日数量 */
      tc: number
      /** liveCount 滚球数量 */
      lc: number
      /** earlyCount 早盘数量 */
      ec: number
      /** 串关数量 */
      cc: number
      /** outrightCount 冠军赛数量 */
      oc: number
      /** 热门赛事数量 */
      ohc: number
      /** 今日赛事数量 */
      otc: number
      /** 虚拟赛事数量 */
      vsc: number
      /** 即将开赛数量 */
      nc: number
      /** count 总数 */
      c: number
      /** 球种图片 */
      spic: string
    }[]
  }>(`/sport/${getSportsPlatId()}/count`, { params })
}

/**
 * 侧边栏列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=c4f949f2-ecca-470e-b7f1-f980bd7fb70c
 */
export function ApiSportSidebar() {
  return httpClient.get<{
    menu: {
      menu_id: number
      name: string
      list: {
        si: number
        sn: string
        spic: string
        list: {
          ci: string
          cn: string
          cpic: string
          pgid: string
          pgn: string
        }[]
      }[]
    }[]
    all: {
      si: number
      sn: string
      spic: string
    }[]
    rbc: number
  }>(`/sport/${getSportsPlatId()}/sidebar`)
}

/**
 * 联赛列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=bb7c74b6-711c-4a6a-88bd-2e131eb95a95
 */
export function ApiSportCompetitionList(params: {
  /** 球种Id */
  si: number
  /**
   * 种类
   *
   * normal:一般赛事
   *
   * outright:冠军赛
   */
  kind: string
}) {
  return httpClient.get<{
    /** 热门联赛列表 */
    hot: {
      /** icon */
      ppic: string
      /** 地区Id */
      pgid: string
      /** 地区名称 */
      pgn: string
      /** count 总数 */
      c: number
      /** 联赛列表 */
      cl: {
        /** 联赛id */
        ci: string
        /** 联赛名称 */
        cn: string
        /** count 总数 */
        c: number
      }[]
    }[]
    /** 联赛列表 */
    list: {
      /** icon */
      ppic: string
      /** 地区Id */
      pgid: string
      /** 地区名称 */
      pgn: string
      /** count 总数 */
      c: number
      cl: {
        /** 联赛id */
        ci: string
        /** 联赛名称 */
        cn: string
        /** count 总数 */
        c: number
      }[]
    }[]
  }>(`/sport/${getSportsPlatId()}/competition/list`, { params })
}

/**
 * 获取赛事列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=51d0dcf6-cfde-4672-884c-81ff05e0c07e
 */
export function ApiSportEventList(params: {
  /** 球种Id */
  si: number | number[]
  /**
   * market
   * 0:取所有
   *
   * 1:早盘
   *
   * 2:今日
   *
   * 3:滚球
   *
   * 4:即将开赛
   *
   * 5:即将开赛及滚球
   *
   * 8: 3小时
   *
   * 9:24小时
   *
   * 10:48小时
   */
  m?: number
  page: number
  page_size: number
  /** 是否热门 */
  hot?: number
  /** 联赛id */
  ci?: string
  /** 地区id */
  pgid?: string
  /** 是否串关 0全部 1仅串关 */
  ic?: number
  /** 是否虚拟赛事 0全部 1是 2否 */
  ivs?: number
}) {
  return httpClient.get<{
    /** 资料更新时间 */
    delta: number
    /** 联赛列表 */
    d: ISportEventInfo[]
    t: number
  }>(`/sport/${getSportsPlatId()}/event/list`, { params })
}

/**
 * 获取赛事列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4a7e9957-f7fe-4404-97ef-92840479a803
 */
export function ApiSportEventDelta(params: {
  /** 球种Id */
  si: number
  /** market 1:早盤 */
  m: string
  /** 1198399587 最后更新时间 */
  delta: number
}) {
  return httpClient.get<{
    /** 资料更新时间 */
    delta: number
    list: ISportEventList[]
  }>(`/sport/${getSportsPlatId()}/event/delta`, { params })
}

/**
 * 单场赛事详情
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6238fa9d-1a7e-4daf-a57c-0cc97163fdbb
 */
export function ApiSportEventInfo(params: {
  /** 球种Id */
  si: number
  /** 赛事ID */
  ei: string
}) {
  return httpClient.get<ISportsInfo>(`/sport/${getSportsPlatId()}/event/info`, { params })
}

/**
 * 冠军列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=30bb4469-a21f-4267-b30c-b6e8555a6b89
 */
export function ApiSportOutrightList(params: {
  /** 球种id */
  si: number
  page: number
  page_size: number
  /** 联赛id */
  ci?: string
}) {
  return httpClient.get<IResponseList<ISportOutrightsInfo>>(`/sport/${getSportsPlatId()}/outright/list`, { params })
}

/**
 * 获取收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=bf0538b1-2dae-474d-ad17-1670d56fb8f5
 */
export function ApiSportGetFavoriteList(params: {
  si: number
  cur: string
}) {
  return httpClient.get<{
    /** 资料更新时间 */
    delta: number
    d: ISportEventInfo[]
    t: number
  }>(`/sport/${getSportsPlatId()}/favorite/list`, { params })
}

/**
 * 加入收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=df4beeeb-d4c2-451b-af7f-11ba328e54d3
 * /favorite/add
 */
export function ApiSportAddFavorite(data: {
  si: number
  eis: string[]
  cur: string
}) {
  return httpClient.post(`/sport/${getSportsPlatId()}/favorite/insert`, data)
}

/**
 * 删除收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=fb17c977-b030-46c3-822a-419330f5b893
 * /favorite/add
 */
export function ApiSportDelFavorite(data: {
  si: number
  eis: string[]
  cur: string
}) {
  return httpClient.post(`/sport/${getSportsPlatId()}/favorite/delete`, data)
}

/**
 * 赛事搜索
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=540a58d7-8a27-4123-9074-7a5d7272e09d
 */
export function ApiSportEventSearch(data: { word: string }) {
  return httpClient.post<{
    list: {
      si: number
      sn: string
      c: number
      list: {
        pgid: string
        pgn: string
        ci: string
        cn: string
        ei: string
        ed: number
        htn: string
        atn: string
      }[]
    }[]
  }>(`/sport/${getSportsPlatId()}/event/search`, data)
}

/**
 * 索取投注信息
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=f83af7ce-84be-4ef9-a20e-d76d31e5b418
 */
export function ApiSportPlaceBetInfo(data: {
  /** 0:非串关 1:串关 */
  ic: 0 | 1
  /** 投注内容 */
  bi: IBetInfo[]
  /** 货币 */
  cur: CurrencyCode
}) {
  return httpClient.post<IBetInfoBack>(`/sport/${getSportsPlatId()}/place/betinfo`, data)
}

/**
 * 体育投注
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3285b34f-36a0-4b50-898e-a71ace74f229
 */
export function ApiSportPlaceBet(data: IBetArgs) {
  return httpClient.post<string>(`/sport/${getSportsPlatId()}/place/bet`, data, {
    timeout: 30 * 1000,
  })
}

/**
 * 体育预约投注(只能用于单式)
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=83d92de0-fbb7-4854-b048-6f6ef122d4cf#doc-anchor-basic-body
 */
export function ApiSportPlaceReserve(data: IBetReserveArgs) {
  return httpClient.post<string>(`/sport/${getSportsPlatId()}/place/reserve`, data, {
    timeout: 30 * 1000,
  })
}

/*
 * 投注记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=ed6c7a9f-30aa-4cf6-89d7-130fa962a136
 */
export function ApiSportBetList(params: ISportsBetListArgs) {
  return httpClient.get<IResponseList<ISportsMyBetSlipItem>>(
    `/sport/${getSportsPlatId()}/betlist`,
    {
      params,
      timeout: 30 * 1000,
    },
  )
}

/**
 * 投注记录 - 时间筛选
 */
export function ApiSportBetListByTime(params: {
  /** 是否结算，0:未结算 1:已结算 */
  settle: string
  /** 进入货币 */
  cur: CurrencyCode
  page?: number
  page_size?: number
  start_time: number
  end_time: number
}) {
  return httpClient.get<{
    d: ISportsMyBetSlipItem[]
    /** 是否有下一页 0:没有 1:有 */
    has_next_page: 0 | 1
    /** 后端改了数据结构，这个是不能存在的属性，用来欺骗ts的 */
    t: number
    /** 后端改了数据结构，这个是不能存在的属性，用来欺骗ts的 */
    s: number
  }>(
    `/sport/${getSportsPlatId()}/betlist/by/time`,
    {
      params,
      timeout: 30 * 1000,
    },
  )
}

/*
 * 投注单详情
 * @see
 */
export function ApiSportBetInfo(order_no: string) {
  return httpClient.get<ISportsMyBetSlipItem>(
    `/sport/${getSportsPlatId()}/betinfo`,
    {
      params: { order_no },
    },
  )
}

/**
 * 热门赛事
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b4f7b09e-0d3e-420b-8069-a47531f8885f
 */
export function ApiSportsEventHot(params: {
  si: number
  page: 1
  page_size: 10
}) {
  return httpClient.get<IResponseList<{
    ci: string
    cn: string
    ei: string
    htn: string
    atn: string
    atpic: string
    htpic: string
    cpic: string
    pgid: string
    ed: number
  }>>(`/sport/${getSportsPlatId()}/event/hot`, { params })
}

/**
 * 体育首页相关设定
 */
export function ApiSportsHomePageConfig() {
  return httpClient.get<{
    bettype_filter: {
      si: number
      btl: {
        bt: number
        egi: number
        btn: string
      }[]
    }[]
    list_filter: {
      name: string
      icon: string
      icon_hl: string
      type: number
      m: number
      ic: number
      hot: number
      ivs: number
      lfid: number
    }[]
  }>(`/sport/${getSportsPlatId()}/homepage/config`)
}

/**
 * 列表盘口下拉选单
 *
 */
export function ApiSportsBetType() {
  return httpClient.get<{
    d: {
      si: number
      btl: {
        bt: number
        egi: number
        btn: string
      }[]
    }[]
  }>(`/sport/${getSportsPlatId()}/bettype/filter`)
}

/**
 * 体育登录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=112c1038-e403-4678-ad7c-d790cde2b521
 */
export function ApiSportsLogin(data: { cur: CurrencyCode } & INotNotice) {
  return httpClient.post(`/sport/${getSportsPlatId()}/login`, data, { params: { noNotify: true } })
}

/**
 * 首页热门赛事banner
 */
export function ApiSportsHomepageHot() {
  return httpClient.get<{
    d: ISportEventInfo[]
  }>(`/sport/${getSportsPlatId()}/homepage/hot`)
}

/**
 * 跟单数据接口
 * @see https://console-docs.apipost.cn/preview/bd0ddb3d8b8d80b3/b4814984b82d229a?target_id=446dc1a4-0172-488b-9685-b21b0347e4ba
 */
export function ApiSportsFollowBetList(params: { si: number }) {
  return httpClient.get<{
    d: ISportsFollowBetList[]
    t: number
  }>(`/sport/${getSportsPlatId()}/follow/bet/list`, { params })
}
