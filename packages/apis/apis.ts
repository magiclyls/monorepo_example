import type {
  ActivityItem,
  ApiWordCollectionConfigRes,
  ApiWordCollectionRecordRes,
  BankCard,
  BlackJackActionType,
  BlackJackData,
  BrandInfoType,
  CasinoProviderItem,
  CategoryItem,
  CurrencyCode,
  DepositInfo,
  DepositStoryRecordList,
  DollarWavesDataDetail,
  EnumCasinoSortType,
  EnumCurrencyKey,
  ExchangeRateData,
  FixedRechargeActivity,
  GameDetails,
  IApiMemberGameLobbyRes,
  IAuth,
  IAvailableBalance,
  IAvailableCurrency,
  ICasinoBetRecordItem,
  ICasinoGameItem,
  ICasinoProviderGameItem,
  IExchangeRateFromToData,
  IMarqueeItem,
  IMemberBalanceLockerUpdate,
  IMemberDetail,
  IMemberNoticeItem,
  IMemberReg,
  IMemberStationInfoItem,
  IMemberThirdReg,
  INoticeItem,
  INotNotice,
  IOriginalGameDetail,
  IPromotionInviteConfig,
  IPromotionInviteValidMemberData,
  IResponseList,
  IUserInfo,
  IWithdrawBankOrWalletItem,
  IWithdrawTypeItem,
  LoginFixedRechargeActivity,
  LoginWalletPaymentDepositActivity,
  MemberAppreciationDetail,
  MerchantGroup,
  MiniGamePlinko,
  MiniGameSeedDetail,
  MysteryBoxDetail,
  PayInfo,
  PokerColors,
  PokerRank,
  PromoMineClaim,
  PromoMineClaimList,
  PromoMineDetail,
  ProviderItem,
  RechargeActivity,
  SignRewardDataConfig,
  StatisticsType,
  TaskDetail,
  TaskInnerDetail,
  TaskList,
  TaskRecord,
  TCurrencyObject,
  VipConfig,
  VirtualCoin,
  WalletPaymentDepositActivity,
} from '@tg/types'
import type { Ref } from 'vue'
import { application } from '@tg/utils'
import { httpClient } from './http'
/**
 * 用户登录
 */
export function ApiMemberLogin(
  data: {
    username: string
    password: string
    device_number: string
    validate?: string
  },
) {
  return httpClient.post<string>('/member/login', data)
}

/**
 * 用户注册
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b9e7b167-6221-4721-b3f0-dce161b8f522
 */
export function ApiMemberReg(data: IMemberReg) {
  return httpClient.post<string>('/member/reg', data)
}

/**
 * 发送短信或者邮件验证码
 */
export function ApiSmsSend(
  data: {
    tel: string
    flag: 'text' | 'voice'
    ty: 1 | 2
  },
) {
  return httpClient.post<{
    data: string
  }>('/api/v1/home/ip', data)
}

/**
 * 游戏列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=ee80d925-48b5-43e4-aa04-3893dfce1e06
 */
export function ApiMemberGameList(params?: {
  page?: number
  page_size?: number
  /** 游戏类型:1=真人,2=捕鱼,3=电子 */
  game_type?: 1 | 2 | 3
  /** 是否热门 1是 2否 */
  is_hot?: 1 | 2
  /** 是否新游戏 1是 2否 */
  is_new?: 1 | 2
  /** 游戏标签 */
  tag_id?: number
  /** 场馆id（evo真人）（需要转成字符串） */
  platform_id?: string
  /** 排序sorting,en_name,created_at 三个字段支持排序，格式为 sorting:asc sorting:desc */
  sort?: string
  venue_id?: string
}) {
  return httpClient.get<IResponseList<ICasinoProviderGameItem>>('/member/game/list', { params })
}

/**
 * 游戏详情
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2aa03c22-4083-40c9-8a1f-0908901eabfe
 */
export function ApiMemberGameDetail(id: string, pid: string, game_id: string) {
  return httpClient.get<GameDetails>(`/member/game/detail?id=${id}&pid=${pid}&game_id=${game_id}`)
}

/**
 * 启动游戏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b75f9a13-ec49-4eea-bc24-1e7de8bb9e7a
 */
export function ApiGameLunch(params: {
  pid: string
  /* 游戏id */
  code: string
  /* 进入货币 */
  cur: string
  /* 游戏使用币种 */
  wcur: string
}) {
  return httpClient.get<string>(`/game/launch/${params.pid}`, {
    params: {
      code: params.code,
      cur: params.cur,
      wcur: params.wcur,
    },
  })
}

/**
 * 搜索热词
 * @see https://docs.apipost.net/docs/detail/52b4e27a1071000?target_id=28c009323bf010&locale=zh-cn
 */
export function ApiMemberGameHotSearchList() {
  return httpClient.get<{ d: Array<string> }>('/member/game/hot/search/list')
}

/**
 * 搜索游戏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3a3a1a44-450d-40ea-a37e-1e88ed074895
 */
export function ApiMemberGameSearch(params: { w: string, platform_id?: string, venue_id?: string }) {
  return httpClient.get<IResponseList<{
    id: string
    platform_id: string
    name: string
    zh_name: string
    en_name: string
    pt_name: string
    th_name: string
    vn_name: string
    client_type: string
    game_type: number
    game_id: string
    img: string
    online: number
    is_hot: string
    sorting: number
    created_at: number
    is_new: string
    tag_id: string
    currency: string
    lang: string
    is_fav: string
  }>>('/member/game/search', { params })
}

/**
 * 游戏收藏列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=cde927eb-45af-40aa-be78-18426224daf6
 */
export function ApiMemberFavList(
  params?: {
    page?: number
    page_size?: number
  },
) {
  return httpClient.get<IResponseList<ICasinoGameItem>>('/member/fav/list', { params })
}

/**
 * 新增收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=73c0d845-b1b6-4231-ae8e-bd72aefb6242
 */
export function ApiMemberFavInsert(id: string) {
  return httpClient.get(`/member/fav/insert?id=${id}`)
}

/**
 * 删除收藏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=e79ee42a-504c-416a-b4d0-810ee949ede0
 */
export function ApiMemberFavDelete(id: string) {
  return httpClient.get(`/member/fav/delete?id=${id}`)
}

/**
 * 查询场馆是否开启
 *  1在线，2下线
 */
export function ApiMemberPlatformState(pid: string) {
  return httpClient.get<1 | 2>('/member/platform/state', { params: { pid } })
}

/**
 * 查询类别是否开启
 *  1在线，2下线
 */
export function ApiMemberCateState(params: {
  cid: string
  /** ty类型 1类别 2场馆 3厂商 */
  ty: number | string
}) {
  return httpClient.get<1 | 2>('/member/game/cate/state', { params })
}

/**
 * 推荐游戏列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1a5800ea-da6f-466d-bd42-27e3c39c5bf1
 */
export function ApiMemberGameRecList(params?: {
  page?: number
  page_size?: number
  /** 排序sorting,en_name,created_at 三个字段支持排序，格式为 sorting:asc sorting:desc */
  sort?: string
}) {
  return httpClient.get<IResponseList<{
    id: string
    platform_id: string
    name: string
    zh_name: string
    en_name: string
    pt_name: string
    th_name: string
    vn_name: string
    client_type: string
    game_type: number
    game_id: string
    img: string
    online: number
    is_hot: string
    sorting: number
    created_at: number
    is_new: string
    tag_id: string
    currency: string
    lang: string
    is_fav: string
  }>>('/member/game/rec/list', { params })
}

/**
 * 大厅游戏数据
 * ty = 1类别， ty = 2场馆
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=52e8029a-59b0-4669-a6c1-bc2d3c36d4e3
 */
export function ApiMemberGameLobby() {
  return httpClient.get<IApiMemberGameLobbyRes>('/member/game/lobby', { headers: { isZstd: true }, responseType: 'arraybuffer' })
}

/**
 * 游戏类别数据
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=dbde6b56-3f8f-4af4-8477-0ba93841c35a
 */
export function ApiMemberGameCate(params: {
  cid: string
  game_type?: string
  /** ty类型 1类别 2场馆 3厂商 */
  ty: number | string
}) {
  return httpClient.get<{
    id: string
    name: string
    icon: string
    total: number
    sums: {
      platform_id: string
      platform_name: string
      total: number
      icon: string
    }[]
    games: ICasinoGameItem[]
    litems: {
      ty: number
      cid: string
      platform_id: string
      name: string
      icon: string
      total: number
      games: ICasinoGameItem[]
      nav_games: ICasinoGameItem[][]
      /** 一排显示几个 2、3、4，顺序与nav_games对应 */
      item_nums: number[]
    }[]
    lnavs: {
      ty: number
      cid: string
      platform_id: string
      name: string
      icon: string
      total: number
      games: ICasinoGameItem[]
      nav_games: ICasinoGameItem[][]
      /** 一排显示几个 2、3、4，顺序与nav_games对应 */
      item_nums: number[]
    }[]
    venue: {
      h5: ICasinoGameItem[][]
      pc: ICasinoGameItem[][]
    }
    display_num: number
  }>('/member/game/cate', { params, headers: { isZstd: true }, responseType: 'arraybuffer' })
}

/**
 * 游戏类别游戏列表（翻页）
 */
export function ApiMemberGameCateGames(params: {
  cid: string
  page?: number
  page_size?: number
  game_type?: string
  w?: string
  /** ty类型 1类别 2场馆 3厂商 */
  ty: number | string
  sort?: EnumCasinoSortType
}) {
  return httpClient.get<IResponseList<ICasinoGameItem>>('/member/game/cate/games', { params })
}
/**
 * 导航娱乐城体育按钮顺序
 */
export function ApiMemberGameCateIndex() {
  return httpClient.get<{
    id: string
    name: string
  }[]>('/member/game/cate/index')
}

/**
 * 场馆列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=d8e0da7a-92e4-4c67-bc62-8549304bada9
 */
export function ApiMemberPlatformList(params: IAuth<{
  page?: number
  page_size?: number
  game_type: number
}> = { page: 1, page_size: 100, game_type: 0, auth: false },
) {
  return httpClient.get<IResponseList<ProviderItem>>('/member/platform/list', { params })
}

/**
 * 娱乐城场馆列表
 *  /member/platform/venue/list
 */
export function ApiMemberPlatformVenueList(params: {
  page?: number
  page_size?: number
  game_type: number
} = { page: 1, page_size: 100, game_type: 0 },
) {
  return httpClient.get<IResponseList<CasinoProviderItem>>('/member/platform/venue/list', { params })
}

/**
 * 娱乐城投注记录
 * /member/casino/record/list
 */
export function ApiMemberCasinoRecordList(params: {
  page?: number
  page_size?: number
  start_time?: number
  end_time?: number
}) {
  return httpClient.get<IResponseList<ICasinoBetRecordItem>>('/member/casino/record/list', { params })
}

/**
 * 我的投注记录
 * /member/user/bet/list
 */
export function ApiMemberUserBetList(params: {
  page?: number
  page_size?: number
  start_time?: number
  end_time?: number
}) {
  return httpClient.get<IResponseList<ICasinoBetRecordItem>>('/member/user/bet/list', { params })
}

/**
 * 近期游戏记录
 */
export function ApiMemberGameListHistory() {
  return httpClient.get<ICasinoGameItem[]>('/member/game/list/history')
}

/**
 * 虚拟钱包列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b5a4e1b7-5297-4210-9d76-17a6a8efb4b4
 */
export function ApiFinanceWithdrawWallet(
  params: {
    /** 合约类型 */
    contract_type: string
    /** 货币id */
    currency_id: string
    page?: number
    page_size?: number
  },
) {
  return httpClient.get<IResponseList<VirtualCoin>>('/finance/withdraw/wallet', { params })
}

/**
 * 利息宝加减
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=925fc8cb-c68a-4825-aa56-34c425aa8752
 */
export function ApiMemberBalanceLockerUpdate(data: IMemberBalanceLockerUpdate) {
  return httpClient.post('/member/balance/locker/update', data)
}

/**
 * 银行卡列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3b3a818d-668f-41fc-ab45-3a8cbc3b3f40
 */
export function ApiMemberBankcardList(params: {
  page_size?: string
  page?: string
  currency_id: string
}) {
  return httpClient.get<IResponseList<BankCard>>('/member/bankcard/list', { params })
}

/**
 * 辅助数据
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=eef5fa8c-373d-49fb-88cb-5f43d5223d6e
 * level: 001=数字货币分类，002=中国银行列表，
 *        003=越南银行列表，004=支付方式列表，
 *        005=支付类型列表，006=国家列表，
 *        007=币种列表，008=账变类型列表
 *        011=国际电话区号
 */
export function ApiMemberTreeList(params: {
  level: string
}) {
  return httpClient.get<{
    /** 电话号码区号 */
    attr: string
    id: string
    /** 国家地区名称 */
    name: string
    pid: string
    sortlevel: string
  }[]>('/member/tree/list', { params })
}

/**
 * 银行卡添加
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=96b12d9e-536b-4aa3-b6bc-0a8a6fc4d17d
 */
export function ApiMemberBankcardInsert(data: {
  currency_id: string
  open_name: string
  bank_name: string
  bank_account: string
  bank_area_cpf?: string
  phone?: string
  email?: string
  /**
   * 1:是
   *
   * 2:否
   */
  is_default?: number
  pay_password: string
  country: string
  city?: string
  address?: string
  /**
   * 1:谷歌
   *
   * 2:资金密码
   */
  auth_type: 1 | 2
  bank_id?: number
  /** 出款方式id */
  type_id: string
}) {
  return httpClient.post<string>('/member/bankcard/insert', data)
}

/**
 * 添加虚拟币钱包地址
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2d1b9bf2-3557-421d-8f93-b5cfc3637afc
 */
export function ApiMemberWalletInsert(data: {
  /** 合约类型 */
  contract_type: number
  /** 货币id */
  currency_id: string
  /** 钱包地址 */
  address: string
  /** 是否默认：1：是，2否 */
  is_default?: number
  /** 资金密码 */
  pay_password: string
  auth_type: number
}) {
  return httpClient.post<string>('/member/wallet/insert', data)
}

/**
 * 退出登陆
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=714a7e70-5d38-4c04-969d-f251710adf6b
 */
export function ApiMemberLogout() {
  return httpClient.get<string>('/member/logout')
}

/**
 * 修改登录密码
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8099f10a-3710-4854-b933-61068636900f
 */
export function ApiMemberPasswordUpdate(data: {
  /** 原密码 */
  password: string
  /** 新密码 */
  new_password: string
}) {
  return httpClient.post<string>('/member/password/update', data)
}

/**
 * 会员资料详情
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=a7da5a93-3c50-438f-b0aa-c7c9faada194
 */
export function ApiMemberDetail() {
  return httpClient.get<IMemberDetail>('/member/detail')
}

/**
 * 会员资料修改
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4f939a92-0ef0-41fb-b7e7-339b196b6d63
 */
export function ApiMemberUpdate(data: {
  record: {
    email?: string
    real_name?: string
    gender?: string
    nationality?: string
    avatar_url?: string
  } & Partial<IUserInfo>
  uid?: string
  captcha?: string
}) {
  const _data = { ...data }
  delete _data.record.third_id
  delete _data.record.third_type
  delete _data.record.sex
  delete _data.record.is_first_deposit

  return httpClient.post<string>('/member/update', application.removeEmpty(_data))
}

/**
 * 邮箱验证申请
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1114f62c-7a42-4784-8ed8-824d9c196ecb
 */
export function ApiMemberEmailCheckRequest(data: {
  email: string
}) {
  return httpClient.post<string>('/member/email/check/request', data)
}

/**
 * 邮箱验证
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b53f7df8-f7c1-47c7-bf0f-f4d7248d129f
 */
export function ApiMemberEmailCheck(data: {
  email: string
  captcha: string
  uid: string
}) {
  return httpClient.post<string>('/member/email/check', data)
}

/**
 * 设置资金密码
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7f28bcd5-c379-4de4-9027-cf3ce6f23695
 */
export function ApiMemberPayPasswordUpdate(data: {
  /** 1-设置 2-修改 */
  types: 1 | 2
  /** 原资金密码 修改时使用 */
  old_pay_password?: string
  /** 资金密码 */
  pay_password: string
  /** 邮箱验证码 */
  code: string
  /** 1-邮箱验证码 2-手机号验证码 */
  code_type?: 1 | 2
}) {
  return httpClient.post<string>('/member/pay/password/update', data)
}

/**
 * 发送邮箱验证码
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=80a6d16c-b13e-4647-91e1-3a18e73cef4c
 */
export function ApiMemberSendMailCode() {
  return httpClient.get<string>('/member/send/mail/code')
}

/**
 * 会员账号校验
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=954ecf22-c1d5-4ca6-9576-655090e75d18
 */
export function ApiMemberExists(params: {
  /** 1会员名 2邮箱地址 3手机号 */
  ty: 1 | 2 | 3
  /** 会员名或者邮箱地址 */
  val: string
  noNotify?: boolean
} & INotNotice) {
  return httpClient.get<{
    /** true存在 false不存在 */
    exist: boolean
    msg: string
  }>('/member/exists', { params: { ...params, noNotify: true } })
}

/**
 * 忘记密码
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4c8f31ed-b895-4d8a-9bba-1c446b7b891d
 */
export function ApiMemberForgetPassword(params: {
  email: string
}) {
  return httpClient.get<string>('/member/forget/password', { params })
}

/**
 * 会员卡包
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=c2214746-c638-4695-bc43-7332b9906502
 */
export function ApiWalletBankcardList() {
  return httpClient.get<{
    bankcard: {
      [key: string]: BankCard[]
    }
    coin: {
      [key: string]: VirtualCoin[]
    }
  }>('/member/wallet/bankcard/list')
}

/**
 * 双重验证
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4f07bbd4-26b3-4c1b-bf47-87fbb8ac6e09
 */
export function ApiMemberDualVerify(data: {
  password: string
  code: string
}) {
  return httpClient.post<string>('/member/dual/verify', data)
}

/**
 * 会员登陆日记
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=269c1d37-c318-455e-bc06-1e6ea7d5e866
 */
export function ApiMemberFrontLoginLogList(params?: {
  page_size?: string
  page?: string
}) {
  return httpClient.get<IResponseList<{
    id: string
    browser: string
    loginip: string
    ipaddress: string
    created_at: number
  }>>('/member/front/login/log/list', { params })
}

/**
 * 删除钱包地址
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b4d0e4df-e035-41da-8073-de5518b03d5b
 */
export function ApiMemberWalletDelete(data: {
  id: string
  pay_password: string
  auth_type: number
}) {
  return httpClient.post<string>('/member/wallet/delete', data)
}

/**
 * 删除银行卡
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=ef81a01f-6743-404b-a2fa-d4ee172885d6
 */
export function ApiMemberBankcardDelete(data: {
  id: string
  pay_password: string
  auth_type: number
}) {
  return httpClient.post<string>('/member/bankcard/delete', data)
}

/**
 * 支付方式列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=fc432cbb-655f-4eb9-9a4c-4cec7036f261
 */
export function ApiFinanceMethodList(params: {
  currency_id: string
}) {
  return httpClient.get<{
    /** 支付方式id */
    id: string
    /** 优惠标签名称 */
    pname: string
    /** 1001活动 1002赠送 1003热门 1004推荐 */
    ptype: number
    /** 标签值 */
    promo: string
    /** 方式别名 */
    alias: string
    /** 通道名称 */
    name: string
    /** 是否拥有银行选项 */
    bank: boolean
    /** 获取银行id */
    zkId: string
    /** 1-在线⽀付 2-公司⼊款/货币⼊款 */
    payment_type: number
    /** 银行卡id */
    bankcard_id: string
  }[]>('/finance/method/list', { params })
}

/**
 * 支付方式V2版本列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=72347352-853d-461c-85e1-282c525cb69c
 */
export function ApiFinanceMethodListV2(params: {
  currency_id: string
  contract_id?: string
}) {
  return httpClient.get<{
    bank: boolean
    id: string
    zkId: string
    pname: string
    promo: string
    ptype: number
    alias: string
    name: string
    payment_type: number
    merchants: {
      id: string
      name: string
      amount_max: string
      amount_min: string
      amount_type: number
      amount_fixed: string
      often_amount: string
      bankcard_id: string
      method_id: string
      method_name: string
      alias: string
    }[]
    deposit_promo: {
      min: string
      max: string
      ratio: string
      bonus_max: string
    }[]
  }[]>('/finance/method/v2/list', { params })
}

/**
 * 支付方式V2版本列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=fe0e5daa-a735-4c6a-8581-12e546aef701
 */
export function ApiFinanceMethodComboListV2(params?: {
  currency_id?: string
  contract_id?: string
}) {
  return httpClient.get<{
    contract: {
      currency_id: string
      contract_list: {
        value: string
        label: string
      }[]
    }[]
    method: MerchantGroup[]
  }>('/finance/method/v2/combo', { params })
}

/**
 * 虚拟币协议列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3a4e4fe2-f033-45b3-904b-f358f3add0e7
 */
export function ApiFinanceCoinContract() {
  return httpClient.get<{
    /** 货币ID */
    currency_id: string
    contract_list: {
      value: string
      label: string
    }[]
  }[]>('/finance/merchant/coin/contract')
}

/**
 * 虚拟币代收付-取得地址
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=78cf835b-f17a-4519-8baa-3c4ec2767448
 */
export function ApiThirdVirtualGetAddr(params: {
  id: string
  mid: string
  currency_id: string
}) {
  return httpClient.get<string>('/payment/third/virtual/currency/get/addr', { params })
}

/**
 * 支付通道列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6d059119-743a-476b-ba97-19b694216b77
 */
export function ApiFinanceMerchantList(params: {
  id: string
}) {
  return httpClient.get<{
    /** 支付平台id */
    id: string
    /** 通道名称 */
    name: string
    /** 通道最大充值金额 */
    amount_max: string
    /** 通道最小充值金额 */
    amount_min: string
    /** 金额种类:1:固定2:范围 */
    amount_type: number
    /** 固定金额 */
    amount_fixed: string
    /** 常用金额,逗号隔开 */
    often_amount: string
  }[]>('/finance/merchant/list', { params })
}

/**
 * 聊天室 发送消息
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=d45a32fc-e2da-4e64-b1db-3f8788dd6300
 */
export function ApiChatSendMessage(data: {
  /** 发送的消息 */
  c: string
  lang: string
  i: string
  v?: string
}) {
  return httpClient.post<string>(`/member/chat/send?lang=${data.lang}`, { c: data.c, i: data.i, v: data.v })
}

/**
 * 聊天室 获取历史记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=09c65522-62f2-4d99-a9d4-d2d85125487b
 */
export function ApiChatGetHistory(data: {
  lang: string
  page: number
  page_size: number
}) {
  return httpClient.post<IResponseList<{
    /** 消息 id */
    s: string
    /** 消息内容 */
    c: string
    /** 用户id */
    u: string
    /** 用户名称 */
    n: string
    /** 创建时间 */
    t: number
  }>>('/member/chat/history/list', data)
}

/**
 * 三方支付存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b88a28f8-3a76-41e8-bcf0-af00a8bb3452
 */
export function ApiFinanceThirdDeposit(data: DepositInfo) {
  return httpClient.post<string>('/finance/third/deposit', data)
}

/**
 * 三方支付银行列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=9efdb2ee-b7f7-4780-8a7e-6b7b15935935
 */
export function ApiPaymentDepositBankList(params: {
  id: string
}) {
  return httpClient.get<{
    id: string
    name: string
  }[]>('/payment/deposit/bank/list', { params })
}

/**
 * 代付方式-列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=65324c0c-c180-45e7-a0b9-c4780a506132
 */
export function ApiFinanceWithdrawMethodList(params: {
  /** 货币id */
  currency_id: string
  /** 协议id */
  contract_id?: string
}) {
  return httpClient.get<{
    id: string
    /** 方式别名 */
    alias: string
    /** 通道名称 */
    name: string
  }[]>('/finance/withdraw/method/list', { params })
}

/**
 * 代付平台-取款卡(原银行卡列表 使用该接口)
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=c11a2c44-2fc6-4838-a268-489205586e46
 */
export function ApiFinanceWithdrawBankcard(params: {
  currency_id: string
  /** 是否要返回出款方式 1:是 */
  withdraw_type?: '1'
}) {
  return httpClient.get<{
    /** 用户绑定的银行或钱包 */
    b: IWithdrawBankOrWalletItem[]
    /** 用户绑定的卡号 */
    d: BankCard[]
    t: number
    s: number
    /** 出款方式 */
    w: IWithdrawTypeItem[]
    /** 所有的钱包 */
    a: {
      currency_id: string
      id: string
      name: string
      sort_level: string
      country_id: string
      api_file_name: string
      embedded?: number
    }[]
  }>('/finance/withdraw/bankcard', { params })
}

/**
 * 法币取款申请
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=9412e69d-1dcc-463b-bf5e-61b4bbea2d60
 */
export function ApiFinanceWithdraw(data: {
  currency_id: number
  method_id: string
  amount: string
  pay_password: string
  bankcard_id: string
  auth_type: number
  auth_code: string
}) {
  return httpClient.post<string>('/finance/withdraw', data)
}

/**
 * 获取取款次数限额接口
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=79fde42e-8f48-44e6-85f9-ffd107d4e32b
 */
export function ApiFinanceWithdrawFeeInfo(params: {
  currency_id: string
}) {
  return httpClient.get<{
    withdraw_count: number
    withdraw_setting_count: number
    withdraw_fee_rate: string
  }>('/finance/withdraw/fee/info', { params })
}

/**
 * 查询余额 /member/balance
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=9aabea35-99e8-4d35-b58a-abbcb05ba837
 */
export function ApiMemberBalance() {
  return httpClient.get<TCurrencyObject>('/member/balance')
}

/**
 * 虚拟币取款申请
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=92ca9d78-f919-4210-9067-b0204b71f89f
 */
export function ApiFinanceWithdrawCoin(data: {
  /** 货币id */
  currency_id: number
  /** 协议id */
  contract_id: string
  /** 地址id */
  wallet_id: string
  amount: string
  pay_password: string
  auth_type: number
  auth_code: string
  /** 备注,备忘录 */
  memo?: string
}) {
  return httpClient.post<string>('/finance/withdraw/coin', data)
}
/**
 * 建议反馈对话列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=feac25f6-1830-4cbe-bc4b-d547c28ec44f
 */
export function ApiGetFeedbackChatList(data: {
  /** 反馈ID */
  feed_id: string
}) {
  return httpClient.post<Array<{
    images?: string
    description?: string
    content: string
    created_at: number
    feed_id: string
    uid: string
    id: string
  }>>('/member/feedback/chat/list', data)
}

/**
 * 新增反馈消息
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4640e6ab-44d1-4ac5-83dd-093964c5545b
 */
export function ApiAddFeedbackChatMsg(data: {
  /** 反馈ID */
  feed_id: string
  /** 聊天内容 */
  content: string
  /** 来源 1会员 2商户后台 */
  source: number
}) {
  return httpClient.post<string>('/member/feedback/chat/insert', data)
}

/**
 * 反馈对话状态已读更新
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b8bc6fbd-42e4-4100-bf71-7a8fe961cc01
 */
export function ApiMemberFeedbackUpdate(data: {
  id: string
}) {
  return httpClient.post<string>('/member/feedback/update', data)
}

/**
 * 文件上传
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=9d5e6346-ba11-4f4f-8960-82a9c96cf4ed
 */
export function ApiMemberUpload(data: {
  upload_type: number
  upload_file: File
}) {
  return httpClient.post<string>('/member/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 新增建议反馈
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=f92f7729-5149-4a27-b42b-719a3ccf504e
 */
export function ApiMemberFeedbackInsert(data: {
  /** 多个图片用逗号隔开 */
  images: string
  /** 反馈描述 */
  description: string
}) {
  return httpClient.post<string>('/member/feedback/insert', data)
}

/**
 * 建议反馈列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=c46ed809-7302-4046-9ad7-7eac70271c75
 */
export function ApiMemberFeedbackList() {
  return httpClient.post<IResponseList<{
    id: string
    uid: string
    username: string
    /** 消息数量 */
    replys: number
    newest: number
    /** 会员新消息数 */
    newest_m: number
    created_at: number
    updatd_at: number
    images: string[]
    /** 第一条消息 */
    description: string
    /** 操作人 */
    updatd_by: string
    /** 状态 1待处理 2已采纳 3已忽略 */
    state: number
    /** 采纳金 usdt */
    amount: string
    /**  采纳金领取状态 1待领取 2已领取 */
    bonusState: number
  }>>('/member/feedback/list', {})
}

/**
 * 反馈奖励领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=da38bee1-174d-4dad-a31f-9ed84ea77bde
 */
export function ApiMemberFeedbackBonusDraw(data: {
  /** 反馈ID */
  feed_id: string
  /** 币种 */
  cur: CurrencyCode
}) {
  return httpClient.post<string>('/member/feedback/bonus/draw', data)
}

/**
 * 待领取总奖励金额
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=79fde42e-8f48-44e6-85f9-ffd107d4e32b
 */
export function ApiMemberFeedbackBonusAll() {
  return httpClient.get<string>('/member/feedback/bonus/reward')
}

/**
 * 所有会员公告和跑马灯-登陆前调用
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=cca2216f-630e-4c7b-b02c-56393674ef7d
 */
export function ApiMemberNoticeAllList() {
  return httpClient.get<{
    marquee: IMarqueeItem[]
    notice: INoticeItem[]
  }>('/member/notice/all/list')
}

/**
 * 所有会员公告和跑马灯-登陆后调用
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=9dda76e7-05ff-4b80-b536-cdcf1b9da762
 */
export function ApiMemberNoticeList(params: {
  /** 1-公告  2-跑马灯 */
  types: string
  location?: string
  page: number
  page_size: number
}) {
  return httpClient.get<IResponseList<IMemberNoticeItem>>('/member/notice/list', { params })
}

/**
 * 汇率获取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8184892e-c125-49b0-8f8d-e5c60da4fc78
 */
export function ApiMemberExchangeRate() {
  return httpClient.get<ExchangeRateData>('/exchange/rate/list')
}

/**
 * 利息宝余额查询
 * @see null
 */
export function ApiMemberBalanceLocker() {
  return httpClient.get<TCurrencyObject>('/member/balance/locker')
}

/**
 * 会员vip配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=bdd0cb62-0a93-4516-885d-ce714ea52c56
 */
export function ApiMemberVipConfig() {
  return httpClient.get<{
    /** 前台入口展示  1展示 2不展示 */
    front_show: string
    /** 1积分模式 2币种模式 */
    vip_mode: string
    /** 币种模式下币种 */
    currency: CurrencyCode
    /** 统计平台 0所有平台， 101,102,103具体场馆 */
    sum_platform: string
    /** 保级开关 1保级 2不保级 */
    keep_level: string
    /** 打码倍数 */
    multiple: string
    /** 晋级奖金开关 1开 2关 */
    upgrade: string
    /** 日奖金开关 1开 2关 */
    day: string
    /** 周奖金开关 1开 2关 */
    week: string
    /** 月奖金开关 1开 2关 */
    month: string
    vips: {
      [k: string]: VipConfig
    }
  }>('/member/vip/config')
}

/**
 * vip 奖金领取历史
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=96ca75cd-8d54-4ad7-a194-49f24524f1c9
 */
export function ApiMemberVipBonusRecord(params: {
  page: number
  page_size: number
  start_time: number
  end_time: number
  /** 818 vip晋级礼金 819 vip日红包 820 vip周红包 821 vip月红包 822 vip生日礼金 */
  cash_type: string
}) {
  return httpClient.get<IResponseList<{
    amount: string
    cash_type: string
    created_at: number
    currency_id: CurrencyCode
    id: string
    receive_amount: string
    receive_currency_id: CurrencyCode
    updated_at: number
  }>>('/member/vip/bonus/apply/list', { params })
}

/**
 * vip 奖金领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b913c96a-70ba-485c-b1f0-4b3ef8f89769
 */
export function ApiMemberApplyVipBonus(params: {
  /** 选择币种领取 */
  cur: CurrencyCode
  /** 可领取奖励 id */
  id: string | number
}) {
  return httpClient.get<{
    id: number
    uid: string
    username: string
    level_id: number
    vip: number
    top_uid: string
    top_name: string
    parent_uid: string
    parent_name: string
    currency_id: number
    receive_currency_id: number
    amount: number
    receive_amount: number
    cash_type: number
    tester: number
    state: number
    created_at: number
    updated_at: number
  }[]>('/member/vip/bonus/apply', { params })
}

/**
 * vip 可用奖励
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=eab43035-6f7d-408e-b9b9-122e4f745c16
 */
export function ApiMemberVipBonusAvailable(params: {
  /** 奖励类型 */
  cash_type?: number | string
  cur: CurrencyCode
  flag?: string
}) {
  return httpClient.get<{
    id: string
    cash_type: number
    amount: string
    state: number
    vip: string
    /** 已领取金额 */
    receive_amount: string
  }[]>('/member/vip/bonus/available', { params })
}

/**
 * 公司入款存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7b826674-bdb4-4456-b82f-22b640f2b4b5
 */
export function ApiPaymentDepositBankApplication(data: DepositInfo) {
  if (data && data.currency_name && data.currency_name.toLocaleLowerCase() === 'vnd')
    data.currency_name = 'KVND'

  return httpClient.post<{
    id: string
    amount: string
    currency_id: string
    bankcard: {
      id: string
      open_name: string
      bank_id: string
      bank_account: string
      level: string
      client_type: string
      state: number
      bank_area_cpf: string
    }
  }>('/payment/deposit/bank/application', data)
}

/**
 * 虚拟币入款存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=02920906-b9b2-49c9-8095-284e4caf061a
 */
export function ApiPaymentDepositCoinApplication(data: DepositInfo) {
  return httpClient.post<{
    id: string
    amount: string
    currency_id: string
    deposit_coin: {
      id: string
      currency_id: string
      contract_type: string
      currency_name: string
      wallet_address: string
      state: number
      remarks: string
    }
    memo: string
  }>('/payment/deposit/coin/application', data)
}

/**
 * 公司入款存款-我已存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=564020fc-9a00-46f7-b357-c2ea767c451a
 */
export function ApiPaymentDepositBankConfirm(data: {
  /** 订单号 */
  id: string
}) {
  return httpClient.post<boolean>('/payment/deposit/bank/confirm', data)
}

/**
 * 虚拟币入款存款-我已存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=be9c387f-f8f7-4e56-a8a6-4df82c54343f
 */
export function ApiPaymentDepositCoinConfirm(data: {
  /** 订单号 */
  id: string
}) {
  return httpClient.post<string>('/payment/deposit/coin/confirm', data)
}

/**
 * 虚拟币支付通道-列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=360094b9-8633-4379-a464-edb4834db91a
 */
export function ApiFinanceMerchantCoinList(params: {
  /** 货币id */
  currency_id: string
  /** 协议id */
  contract_id: string
}) {
  return httpClient.get<{
    /** 通道id */
    id: string
    /** 通道名称 */
    name: string
    /** 支付方式id */
    method_id: string
    amount_max: string
    amount_min: string
    amount_type: number
    amount_fixed: string
    often_amount: string
    /** 1-在线⽀付 2-公司⼊款/货币⼊款 */
    payment_type: number
  }[]>('/finance/merchant/coin/list', { params })
}

/**
 * 会员站点banner列表v4
 * @see https://doc.apipost.net/docs/detail/4782c595a08d000?target_id=37377cfef58032&locale=zh-cn
 */
export function ApiMemberBannerListV4(params: {
  /** banner位置 1:娱乐城 2:体育 */
  position: 1 | 2
}) {
  return httpClient.get<{
    id: string
    /** 1靠右 2靠左 3自定义 */
    style: 1 | 2 | 3
    /** banner位置 1:娱乐城 2:体育 */
    position: number[]
    aid: string
    /** 客户端 */
    client: string[]
    background: string
    icon: string
    superscript: string
    /** 内容 */
    content: string
    /** 1:显示 2:隐藏 */
    button_state: number
    button_content: string
    /**
     1:"自定义",
    2:"娱乐城",
    3:"体育",
    4:"保险库",
    5:"vip界面",
    6:"联盟计划",
    7:"优惠活动",
    8:"在线客服",
    9:"存款弹框",
    10:"vip返水",
    11:"注册弹框",
    12:"下载app弹框",
    13:"设置联系方式",
    14:"活动链接",
    15:"活动详情页面",
     */
    button_jump_type: number
    button_jump_url: string
    template_style: number
    state: number
    pc_state: number
    mobile_state: number
    sport_pc_state: number
    sport_mobile_state: number
    pc_seq: number
    mobile_seq: number
    sport_pc_seq: number
    sport_mobile_seq: number
    loop_config: {
      img_url: string
      /** 跳转状态 跳转交互 1:开启 2:关闭 */
      jump_state: number
      /**
       1:"自定义",
      2:"娱乐城",
      3:"体育",
      4:"保险库",
      5:"vip界面",
      6:"联盟计划",
      7:"优惠活动",
      8:"在线客服",
      9:"存款弹框",
      10:"vip返水",
      11:"注册弹框",
      12:"下载app弹框",
      13:"设置联系方式",
      14:"活动链接",
      15:"活动详情页面",
       */
      jump_type: number
      /** 图片 */
      jump_url: string
    }
    style_custom_mode: number
    style_custom_img: string
    promo_info: {
      id: string
      start_at: number
      end_at: number
      display_mode: number
    }
  }[]>('/member/banner/v4/list', { params })
}
/**
 * 查询会员 vip 总待领取奖金
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=eab43035-6f7d-408e-b9b9-122e4f745c16
 */
export function ApiMemberVipBonusAmount() {
  return httpClient.get<string>('/member/vip/bonus/amount')
}

/**
 * 三方登录 url - google
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7cc18fc1-9c12-4e47-a8cf-45d30276e674
 */
export function ApiMemberThirdAuthUrl(params: {
  state: string
  type: string
  device_number: string
}) {
  return httpClient.get<string>(`/member/third/auth/${params.type}/url`, {
    headers: {
      state: params.state,
      device_number: params.device_number,
      dnb: params.device_number,
    },
  })
}

/**
 * 三方登录注册
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=81413d60-d816-45c0-8df0-47436a1bd837
 */
export function ApiMemberThirdReg(data: IMemberThirdReg) {
  return httpClient.post<string>('/member/third/register', data, {
    headers: {
      device_number: data.device_number,
    },
  })
}

/**
 * 虚拟币三方支付存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=aa741251-f806-449e-ad2a-20537448feaf
 */
export function ApiFinanceThirdCoinDeposit(data: DepositInfo) {
  return httpClient.post<{
    /** 支付地址，可生成qr code */
    address: string
    /** 实际支付金额 */
    amount: string
  }>('/finance/third/coin/deposit', data)
}

/**
 * 公司入款存款-取消存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=ede3a53b-1f69-4cb5-9c93-7226ce205466
 */
export function ApiPaymentDepositBankCancel(data: {
  /** 订单号 */
  id: string
}) {
  return httpClient.post<string>('/payment/deposit/bank/cancel', data)
}

/**
 * 虚拟币入款存款-取消存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=a4edef45-f839-4f88-9928-5197ffee1ab7
 */
export function ApiPaymentDepositCoinCancel(data: {
  /** 订单号 */
  id: string
}) {
  return httpClient.post<string>('/payment/deposit/coin/cancel', data)
}

/**
 * 会员站内信列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6bdb3b5f-bd0e-40f6-9494-8b89bb001184
 */
export function ApiMemberStationInfoList(params: {
  page: number
  page_size: number
}) {
  return httpClient.get<IResponseList<IMemberStationInfoItem>>('/member/station/info/list', { params })
}

/**
 * 会员站内信修改状态已读
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=dc22d396-50b4-46ee-a01b-2343ac338ced
 */
export function ApiMemberStationInfoDetailUpdateState(data: {
  /** 站内信id */
  id: string
}) {
  return httpClient.post<string>(`/member/station/info/detail/update/state?id=${data.id}`)
}

/**
 * 测试环境下使用，删除三方登录用户数据
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=af64b5e3-b754-4865-aab4-358c59612464
 */
export function ApiDevDeleteThirdAuth(data: {
  email: string
}) {
  return httpClient.post<string>('/member/third/auth/delete', data)
}

/**
 * 会员站点brand信息 member/brand/detail
 *
 * 参数：tag标识
 * base 基础信息
 * deposit:最低存款配置
 * withdraw:最低取款配置
 * reg:注册信息
 * third:三方配置
 * customer:客服配置
 * pc:pc配置
 * area:地区限制配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=93c37e67-0f92-4a55-9adb-4c696a387d5c
 */
export function ApiMemberBrandDetail(params?: {
  // tag: string // IBrandDetailTag[]
  cur?: CurrencyCode
  c?: string
}) {
  return httpClient.get<BrandInfoType>('/member/brand/detail', { params: { ...params, auth: false, tag: ['base', 'regweb', 'third', 'kf', 'pc', 'area', 'bottom', 'amount', 'deposit', 'withdraw', 'reg', 'customer', 'app', 'api_domain'].join(',') } })
}

/**
 * 站点维护信息
 */
export function ApiMemberSiteMaintain() {
  return httpClient.get<{
    maintain: string
    content: string
    state: string
    direct?: boolean
  }>('/member/site/maintain', {})
}

/**
 * 底部品牌
 */
export function ApiBrand(params?: { tag?: string }) {
  return httpClient.get<
    Record<string, { state: boolean, url: string }>
  >('/member/site/brand/detail', { params })
}

/**
 * 交易记录-存款-虚拟币
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=95af1c4c-4a20-487b-96fa-3e86cc18f3a1
 */
export function ApiFinanceRecordDepositCoin(params?: {
  page?: number
  page_size?: number
}) {
  return httpClient.get<IResponseList<PayInfo>>('/finance/record/deposit/coin', { params })
}

/**
 * 交易记录-存款-法币
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=911de451-1aa8-4904-b787-5092d25d0ebc
 */
export function ApiFinancRecordDepositBank(params?: {
  page?: number
  page_size?: number
}) {
  return httpClient.get<IResponseList<PayInfo>>('/finance/record/deposit/bank', { params })
}

/**
 * 交易记录-取款-虚拟币
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=50e762a0-8fb5-47a4-93bc-b6ec34be5a15
 */
export function ApiFinanceRecordWithdrawCoin(params?: {
  page?: number
  page_size?: number
}) {
  return httpClient.get<IResponseList<PayInfo>>('/finance/record/withdraw/coin', { params })
}

/**
 * 交易记录-取款-法币
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8170a1b8-c31e-4003-8ddf-ae198356a635
 */
export function ApiFinanceRecordWithdrawBank(params?: {
  page?: number
  page_size?: number
}) {
  return httpClient.get<IResponseList<PayInfo>>('/finance/record/withdraw/bank', { params })
}

/**
 * 联盟计划-我的佣金 agency/commission
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=500ef9ab-2c8b-4324-89d1-f483fea118cd
 */
export function ApiAgencyCommission(data?: {
  page?: number
  page_size?: number
  start_time?: number
  end_time?: number
}) {
  return httpClient.post<IResponseList<{
    /** id */
    id: string
    /** 会员id */
    uid: string
    /** 会员账号 */
    username: string
    /** 上级uid */
    parent_uid: string
    /** 上级代理 */
    parent_name: string
    /** 开始时间 */
    start_time: number
    /** 结束时间 */
    end_time: number
    /** 佣金等级 */
    commission_level: number
    /** 总人数(贡献人数) */
    sub_user_count: number
    /** 直属人数 */
    direct_user_count: number
    /** 其它人数 */
    other_user_count: number
    /** 总佣金 */
    commission_amount_total: string
    /** 直属佣金 */
    commission_amount_direct: string
    /** 其它佣金 */
    commission_amount_other: string
    /** 总业绩 */
    valid_bet_amount_total: string
    /** 直属业绩 */
    valid_bet_amount_direct: string
    /** 其它业绩 */
    valid_bet_amount_other: string
    /** 币种 */
    currency_id: string
    /** 模式id */
    model_id: string
    /** 模式名称(类型名称) */
    model_name: string
    /** 创建时间 */
    created_at: number
    /** 结算时间 */
    send_time: number
  }>>('/agency/commission', data)
}

/**
 * 联盟计划-所有数据 agency/report/all
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=a5eac8d6-e252-4242-86ac-21ef5c324381
 */
export function ApiAgencyReportAll(data?: {
  page?: number
  page_size?: number
  username?: string
  currency_id?: string
  start_time?: string
  end_time?: string
}) {
  return httpClient.post<IResponseList<{
    /** 会员id */
    uid: string
    /** 会员账号 */
    username: string
    /** 货币ID */
    currency_id: string
    /** 货币名称 */
    currency_name: string
    /** 存款金额 */
    deposit_amount: string
    /** 有效投注 */
    valid_bet_amount: string
    /** 输赢 */
    net_amount: string
    /** vip等级 */
    vip: string
    /** 创建时间 */
    created_at: number
  }>>('/agency/report/all', data)
}

/*
 * 联盟计划-我的推广
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=adf27c0e-0c24-4d01-a5f4-45b93b8244f4
 */
export function ApiMemberAgencyMyPromotion() {
  return httpClient.get<{
    link_url?: string
    commission?: {
      accumulated: string
      received: string
      last_commission: string
    }
    performance?: {
      team_num: number
      direct_num: number
      other_num: number
      performance_amount: string
      direct_amount: string
      other_amount: string
      deposit_num: number
      total_deposit: string
      direct_deposit: string
      other_deposit: string
      deposit_direct_num: number
      deposit_other_num: number
      valid_bet_num: number
      valid_bet_direct_num: number
      valid_bet_other_num: number
      direct_deposit_num: number
      other_deposit_num: number
      performance_num: number
      performance_direct_num: number
      performance_other_num: number
    }
    subordinate?: {
      valid_bet_amount: string
      bet_num: number
      net_amount: string
    }
    todaydata?: {
      total_num?: string | number
      direct_num?: string | number
      other_num?: string | number
      deposit_amt?: string | number
      deposit_num?: string | number
      deposit_direct_amt?: string | number
      deposit_other_amt?: string | number
      valid_bet_amt?: string | number
      valid_bet_direct_amt?: string | number
      valid_bet_other_amt?: string | number
      first_deposit_num?: string | number
      first_deposit_amount?: string
      valid_bet_num?: string | number
      valid_bet_amount?: string
      deposit_direct_num: number
      deposit_other_num: number
      valid_bet_direct_num: number
      valid_bet_other_num: number
    }
  }>('/agency/mypromotion')
}

/**
 * 查询代理余额
 * @see https://console-docs.apipost.cn/preview/9a95d0a3b613d543/29a91c04967ad18b?target_id=cbd0354a-f8e6-40ed-b86c-4aa216b2802b
 */
export function ApiAgencyCommissionBalance() {
  return httpClient.get<{
    balance: string
    level: number
    parent_name: string
    uid: string
    username: string
  }>('/agency/commission/balance')
}
/**
 * 佣金详情场馆(下拉)
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=33325f51-5c7e-4213-9ae8-79115bfa5313
 */
export function ApiAgencyCommissionModelsOptions() {
  return httpClient.get<{
    /** id */
    id: string
    /** 名称 */
    name: string
    all: 0 | 1
  }[]>('/agency/commission/models/options')
}
/**
 * 佣金详情玩家详情对话
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=33325f51-5c7e-4213-9ae8-79115bfa5313
 */
export function ApiAgencyCommissionDetailPop(data: {
  /** id */
  id: string
  page: number
  page_size: number
}) {
  return httpClient.post<any>('/agency/commission/detail/pop', data)
}
/**
 * 佣金模式配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=33325f51-5c7e-4213-9ae8-79115bfa5313
 */
export function ApiAgencyCommissionCfg() {
  return httpClient.get<{
    id: string
    /** 站点ID */
    site_id: string
    /** 前台入口 0:关 1:开 */
    front_entrance: number
    /** 代理模式 1:一级模式 2:无限级差 3:三级分销 */
    mode: number
    /** 佣金配置 1:统一配置 2: 分开配置 */
    type: number
    /** 模式配置 1:真人 2:捕鱼 3:老虎机 4:体育 5:棋牌 8:小游戏 例 1,2 代表真人/捕鱼 3 代表老虎机 */
    platform: string
    /** 发放方式 0:关闭 1:自动发放 2:人工审核 */
    bonus_type: number
    /** 发放币种 701,702等等 */
    bonus_currency: string
    /** 佣金上限 0或空 无限制 */
    bonus_limit: string
    /** 结算周期 1:日 2:周 3:月 */
    bonus_period: number
    /** 活动规则 json */
    rules: string
    /** 佣金等级-直属 */
    cond_direct: string
    /** 佣金等级-团队 */
    cond_team: string
    /** 业绩条件 */
    cond_perform: string
    /** 推广链接 */
    link_url: string
  }>('/agency/commission/cfg')
}

/**
 * 我的业绩
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2150139e-5490-4f79-82fb-773e3674d569
 */
export function ApiAgencyPerformance(data?: {
  page?: number
  page_size?: number
  username?: string
  currency_id?: string
  start_time?: string
  end_time?: string
}) {
  return httpClient.post<IResponseList<{
    /** id */
    id: string
    /** 会员id */
    uid: string
    /** 会员账号 */
    username: string
    /** 上级uid */
    parent_uid: string
    /** 上级代理 */
    parent_name: string
    /** 开始时间 */
    start_time: number
    /** 结束时间 */
    end_time: number
    /** 佣金等级 */
    commission_level: number
    /** 总人数(贡献人数) */
    sub_user_count: number
    /** 直属人数 */
    direct_user_count: number
    /** 其它人数 */
    other_user_count: number
    /** 总佣金 */
    commission_amount_total: string
    /** 直属佣金 */
    commission_amount_direct: string
    /** 其它佣金 */
    commission_amount_other: string
    /** 总业绩 */
    valid_bet_amount_total: string
    /** 直属业绩 */
    valid_bet_amount_direct: string
    /** 其它业绩 */
    valid_bet_amount_other: string
    /** 币种 */
    currency_id: string
    /** 模式id */
    model_id: string
    /** 模式名称(类型名称) */
    model_name: string
    /** 创建时间 */
    created_at: number
    /** 结算时间 */
    send_time: number
  }>>('/agency/performance', data)
}

/**
 * 直属财务
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=c7e29704-cfd7-4e14-ace8-f65fc7562810
 */
export function ApiAgencyReportFinance(data?: {
  page?: number
  page_size?: number
  username?: string
  currency_id?: string
  start_time?: string
  end_time?: string
}) {
  return httpClient.post<IResponseList<{
    /** 会员id */
    uid: string
    /** 会员账号 */
    username: string
    /** 货币ID */
    currency_id: string
    /** 货币名称 */
    currency_name: string
    /** 存款金额 */
    deposit_amount: string
    /** 存款次数 */
    deposit_count: number
    /** 取款金额 */
    withdraw_amount: string
    /** 取款次数 */
    withdraw_count: number
    /** 存取差额 */
    deposit_withdraw_amount: string
    /** 账户余额 */
    balance: string
    /** vip等级 */
    vip: string
    /** 统计日期 */
    time: number
    /** 创建时间 */
    created_at: number
  }>>('/agency/report/finance', data)
}

/**
 * 直属投注
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=98114b7e-3b40-4706-9e58-92f50618dd59
 */
export function ApiAgencyReportBet(data?: {
  page?: number
  page_size?: number
  username?: string
  currency_id?: string
  start_time?: string
  end_time?: string
}) {
  return httpClient.post<IResponseList<{
    /** 会员id */
    uid: string
    /** 会员账号 */
    username: string
    /** 货币ID */
    currency_id: string
    /** 货币名称 */
    currency_name: string
    /** 注单数量 */
    bet_count: number
    /** 总输赢 */
    net_amount: string
    /** 有效投注 */
    valid_bet_amount: number
    /** VIP等级 */
    vip: number
    /** 统计日期 */
    time: number
    /** 创建时间 */
    created_at: number
  }>>('/agency/report/bet', data)
}

/**
 * 直属领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4184dc53-cfd7-4eb6-91ac-5fbff97ea02e
 */
export function ApiAgencyReportReceive(data?: {
  page?: number
  page_size?: number
  username?: string
  currency_id?: string
  start_time?: string
  end_time?: string
}) {
  return httpClient.post<IResponseList<{
    /** 会员id */
    uid: string
    /** 会员账号 */
    username: string
    /** 货币ID */
    currency_id: string
    /** 货币名称 */
    currency_name: string
    /** 优惠金额 */
    gift_amount: string
    /** 代理佣金 */
    commission_amount: string
    /** 总领取 */
    total_receive: string
    /** VIP等级 */
    vip: number
    /** 统计日期 */
    time: number
    /** 创建时间 */
    created_at: number
  }>>('/agency/report/receive', data)
}

/**
 * 直属用户
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=396c93ca-08a3-478c-be95-8df150526caa
 */
export function ApiAgencyReportUser(data?: {
  page?: number
  page_size?: number
  username?: string
  currency_id?: string
  start_time?: string
  end_time?: string
}) {
  return httpClient.post<IResponseList<{
    /** 会员id */
    uid: string
    /** 会员账号 */
    username: string
    /** 1:离线 2:在线 */
    online: '1' | '2'
    /** 存款次数当值大于0标识首存 */
    deposit_count: number
    /** 上次登录时间 */
    last_login_at: number
    /** VIP等级 */
    vip: number
    /** 注册时间 */
    created_at: number
  }>>('/agency/report/user', data)
}

/**
 * 佣金比例 agency/commission/scale
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6848df0c-36d0-4661-bb0d-af39bae989db
 */
export function ApiAgencyCommissionScale() {
  return httpClient.get<
    {
      conf_global: {
        id: string
        send_type: number
        commission_max_limit: string
        commission_settlement_type: number
      }
      conf: {
        id: string
        /** 1真人 2捕鱼 3电子 4体育 5棋牌 6电竞 */
        model_ids: string
        ico: string[]
        levels: {
          id: string
          /** 佣金配置ID */
          commission_id: string
          /** 等级 */
          level: number
          /** 有效投注≥(单位：万) */
          effective_amount: string
          /** 返佣比例% */
          rebate_ratio: string
          updated_by: string
          updated_at: number
          uid: string
        }[]
        performances: null
      }[]
    }
  >('/agency/commission/scale')
}

/**
 * 注册子代理
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=505e7566-d623-4529-bab6-50205becd5da
 */
export function ApiAgencyInsert(data: {
  /** 会员账号 */
  username: string
  /** 会员密码 */
  password: string
  /** 邮箱 */
  email: string
  /** 出生日期 */
  birthday: string
}) {
  return httpClient.post<string>('/agency/insert', data)
}

/**
 * 联盟计划-我的数据 agency/commission
 * @see https://console-docs.apipost.cn/preview/9a95d0a3b613d543/29a91c04967ad18b?target_id=48157d51-99d3-48fa-96b9-e315db57d5c9
 */
export function ApiMyData(data?: {
  start_time: string
  end_time: string
}) {
  return httpClient.post<{
    // 币种ID
    currency_id: string
    commission_amount_total: string
    commission_amount_direct: string
    commission_amount_other: string
    valid_bet_amount_total: string
    valid_bet_amount_direct: string
    valid_bet_amount_other: string
    valid_bet_cnt_total: number
    valid_bet_cnt_direct: number
    valid_bet_cnt_other: number
    reg_cnt_total: number
    reg_cnt_direct: number
    reg_cnt_other: number
    first_deposit_amt_total: string
    first_deposit_amt_direct: string
    first_deposit_amt_other: string
    first_cnt_total: number
    first_cnt_direct: number
    first_cnt_other: number
    deposit_amt_total: string
    deposit_amt_direct: string
    deposit_amt_other: string
    deposit_cnt_total: number
    deposit_cnt_direct: number
    deposit_cnt_other: number
  }>('/agency/commission/my', data)
}

/**
 * 联盟计划-财务数据 agency/commission/finance
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=500ef9ab-2c8b-4324-89d1-f483fea118cd
 */
export function ApiAgencyCommissionFinance(data?: {
  user_type: number
  username?: string
  page?: number
  page_size?: number
  start_time?: number
  end_time?: number
}) {
  return httpClient.post<IResponseList<{
    /** 代理账号 */
    username: string
    valid_bet_amount: string
    net_amount: string
    deposit_amount: string
    withdraw_amount: string
    cash_profit: string
  }>>('/agency/commission/finance', data)
}

/**
 * 联盟计划-佣金详情 /agency/commission/detail
 * @see https://console-docs.apipost.cn/preview/9a95d0a3b613d543/29a91c04967ad18b?target_id=fc45529e-402c-40ac-b2c4-6632b7a3ef27
 */
export function ApiAgencyCommissionDetail(data?: {
  d: {
    /** 必须 默认0 0:全部 1:直属 2:团队 */
    user_type: number
    page?: number
    page_size?: number
    start_time?: number
    end_time?: number
  }
}) {
  return httpClient.post<IResponseList<{
    d: {
      username: string
      valid_bet_amount: string
      commission_amount: string
    }[]
    c: {
      username: string
      valid_bet_amount: string
      commission_amount: string
    }
  }>>('/agency/commission/detail', data)
}

/**
 * 联盟计划-佣金记录 /agency/commission/records
 * @see https://console-docs.apipost.cn/preview/9a95d0a3b613d543/29a91c04967ad18b?target_id=89c29e8e-c6ff-45d3-bcda-94c6f5d728a2
 */
export function ApiAgencyCommissionRecordsNew(data?: {
  d: {
    cash_type: string
    page?: number
    page_size?: number
    start_time?: number
    end_time?: number
  }
}) {
  return httpClient.post<IResponseList<{
    /** 代理账号 */
    cash_type: string
    amount: number
    apply_at: number
    cash_type_name: string
  }>>('/agency/commission/records', data)
}

/**
 * 交易记录-其他-下拉选单
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=092cb9e6-c3b4-4bc0-b574-00b398629681
 */
export function ApiFinanceRecordOtherSelect() {
  return httpClient.get<{
    /** id */
    id: string
    /** 名称 */
    name: string
  }[]>('/finance/record/other/select')
}

/**
 * 交易记录-其他-列表
 * @see https://console-docs.apipost.cn/preview/c00b1160394a31fb?target_id=3a7be0ec-1921-462e-bc77-96a3de05502b
 */
export function ApiFinanceRecordOther(params?: {
  page?: number
  page_size?: number
  /** 菜单id */
  id: string
}) {
  return httpClient.get<IResponseList<PayInfo>>('/finance/record/other', { params })
}

/**
 * 支付可用货币列表-钱包存款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=0f52cba2-b41f-4d06-ae97-291b2fbe848d
 */
export function ApiFinanceDepositCurrency() {
  return httpClient.get<IAvailableCurrency[]>('/finance/deposit/currency')
}

/**
 * 支付可用货币列表-钱包提款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=54fde819-78a2-43b8-b24a-09bd9888fe6c
 */
export function ApiFinanceWithdrawCurrency() {
  return httpClient.get<IAvailableCurrency[]>('/finance/withdraw/currency')
}

/**
 * 查询可取款余额-钱包提款
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2d52d42a-26f6-4b0e-9ee8-00e965a28687
 */
export function ApiFinanceWithdrawBalance(params: {
  /** 货币id */
  currency_id: string
}) {
  return httpClient.get<IAvailableBalance>('/finance/withdraw/balance', { params })
}

/**
 * 查询代理余额
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=05a39f6b-613a-44e6-a753-f76f547e6df1
 */
export function ApiMemberBalanceAgency() {
  return httpClient.get<TCurrencyObject>('/member/balance/agency')
}

/**
 * 佣金历史记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=89c29e8e-c6ff-45d3-bcda-94c6f5d728a2
 */
export function ApiAgencyCommissionRecords(data?: {
  page: number
  page_siz: number
  start_time: string
  end_time: string
  cash_type: string
}) {
  return httpClient.post<IResponseList<{
    id: string
    /** 订单号 */
    bill_no: string
    /** uid */
    uid: string
    /** 会员名 */
    username: string
    /** 全部为空，帐变id，取帐变类型中的关于代理钱包的cash_type */
    cash_type: number
    /**  */
    business_type: number
    /** 金额 */
    amount: string
    /**  */
    before_amount: string
    /**  */
    after_amount: string
    /**  */
    multiple: number
    /**  */
    created_at: number
    /**  */
    tester: number
    /**  */
    remark: string
    /** 币种 */
    currency_id: CurrencyCode
    /**  */
    operator_uid: string
    /**  */
    operator_name: string
    /**  */
    device: number
    /** 时间（毫秒） */
    apply_at: number
    /** 类型 */
    cash_type_name: string
    /**  */
    business_type_name: string
  }[]>>('/agency/commission/records', data)
}

/**
 * 佣金分类列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=246198f7-f090-4956-ab33-a5917e08f265
 */
export function ApiAgencyCommissionRecordsClass() {
  return httpClient.get<{
    /** 类型 */
    CashType: string
    /** 名称 */
    CashTypeName: string
  }[]>('/agency/commission/records/class')
}

/**
 * 佣金钱包提取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=da617b1e-8b29-4ef3-9824-c9ee5c9f193e
 */
export function ApiAgencyTransferToMember() {
  return httpClient.post<string>('/agency/transfer/to/member')
}

/**
 * 最新版：风云榜
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b0b306f1-c31f-4871-9a24-c4fa1487b817
 */
export function ApiMemberHighRollersList(params: {
  /** 游戏code */
  game_code?: string
  /** 游戏类型 1=真人,2=捕鱼,3=电子,4=体育 */
  game_class?: string
  page?: number
  page_size?: number
  types: string
}) {
  return httpClient.get<IResponseList<{
    /** 注单流水号 */
    bill_no: string
    /** 投注时间 */
    bet_time: number
    /** 平台ID */
    platform_id: string
    /** 平台名称 */
    platform_name: string
    /** 投注人 */
    username: string
    /** 游戏类型 */
    game_class: string
    /** 游戏名称 */
    game_name: string
    /** 游戏编码 */
    game_code: string
    /** 投注金额 */
    bet_amount: string
    /** 有效投注金额 */
    valid_bet_amount: string
    /** 玩家输赢金额 */
    net_amount: string
    /** 币种ID */
    currency_id: CurrencyCode
    /** 乘数 */
    factor: string
  }>>('/member/high/rollers/list', { params })
}

/**
 * 新版：大赢家榜
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=3b67a9e3b0e036
 */
export function ApiMemberBigWinnerList(params: {
  /** 游戏code */
  game_code?: string
  /** 游戏类型 1=真人,2=捕鱼,3=电子,4=体育 */
  game_class?: string
  page?: number
  page_size?: number
}) {
  return httpClient.get<IResponseList<{
    /** 创建时间 */
    created_at: string
    /** 投注金额 */
    bet_amount: string
    /** 支付金额 */
    pay_amount: string
    /** 币种ID */
    currency_id: CurrencyCode
    /** 乘数 */
    factor: string
  }>>('/member/big/winner/list', { params })
}

/**
 * 新版：幸运赢家榜
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=3b68d29930e039
 */
export function ApiMemberLuckyWinnerList(params: {
  /** 游戏code */
  game_code?: string
  /** 游戏类型 1=真人,2=捕鱼,3=电子,4=体育 */
  game_class?: string
  page?: number
  page_size?: number
}) {
  return httpClient.get<IResponseList<{
    /** 创建时间 */
    created_at: string
    /** 投注金额 */
    bet_amount: string
    /** 支付金额 */
    pay_amount: string
    /** 币种ID */
    currency_id: CurrencyCode
    /** 乘数 */
    factor: string
  }>>('/member/lucky/winner/list', { params })
}

/**
 * 最新版:所有投注
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b0b306f1-c31f-4871-9a24-c4fa1487b817
 */
export function ApiMemberRecordList(params: {
  /** 游戏code */
  game_code?: string
  /** 游戏类型 1=真人,2=捕鱼,3=电子,4=体育 */
  game_class?: string
  page?: number
  page_size?: number
  types: string
}) {
  return httpClient.get<IResponseList<{
    /** 注单流水号 */
    bill_no: string
    /** 投注时间 */
    bet_time: number
    /** 平台ID */
    platform_id: string
    /** 平台名称 */
    platform_name: string
    /** 投注人 */
    username: string
    /** 游戏类型 */
    game_class: string
    /** 游戏名称 */
    game_name: string
    /** 游戏编码 */
    game_code: string
    /** 投注金额 */
    bet_amount: string
    /** 有效投注金额 */
    valid_bet_amount: string
    /** 玩家输赢金额 */
    net_amount: string
    /** 币种ID */
    currency_id: CurrencyCode
    /** 乘数 */
    factor: string
  }>>('/member/record/list', { params })
}

/**
 * 统计数据
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7878bfa1-8e3c-4da6-8266-c0a22c07315f
 */
export function ApiMemberBetReport(data: {
  /** 聊天室可查其它人的统计数据，传会员名 */
  username?: string
  /** 游戏类型,空=全部 1=娱乐城 2=体育 */
  game_class: '' | '1' | '2'
}) {
  return httpClient.post<{
    /** 货币id */
    currency_id: CurrencyCode
    /** 有效投注 */
    valid_bet_amount: string
    /** 输赢 */
    net_amount: string
    /** 注单量 */
    bet_count: number
    /**  */
    time: number
    /** 列表详情  */
    detail: {
      /** 货币id */
      currency_id: CurrencyCode
      /** 有效投注 */
      valid_bet_amount: string
      /** 输赢 */
      net_amount: string
      /** 注单量 */
      bet_count: number
      /** 天数，1=今天 */
      bet_time: string
    }[]
  }[]>('/member/bet/report', data)
}

/**
 * 佣金模式列表(下拉)
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=33325f51-5c7e-4213-9ae8-79115bfa5313
 */
export function ApiAgencyCommissionModelsList() {
  return httpClient.get<{
    /** id */
    id: string
    /** 名称 */
    name: string
  }[]>('/agency/commission/models/list')
}

/**
 * 获取二阶段验证密钥 && 验证qrcode
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8674babe-f9ba-4798-abc6-87cae49bf2f8
 */
export function ApiMemberAuthQrcode() {
  return httpClient.get<{
    /** 二阶段密钥 */
    secret: string
    /** 生成qrcode用的url */
    qrcode: string
  }>('/member/auth/qrcode')
}

/**
 * 设定二阶段验证
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3e0a839f-fda1-475f-89ff-665013e728ee
 */
export function ApiMemberAuthSet(data: {
  /** 二阶段验证码 */
  auth_code: string
  /** 登录密码 */
  password: string
}) {
  return httpClient.post<{
    /** 登录令牌 */
    token: string
  }>('/member/auth/set', data)
}

/**
 * 获取安全验证配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2f83ff71-7f04-4fa2-97d2-c0a00170a0a8
 */
export function ApiMemberAuthConfig() {
  return httpClient.get<{
    /** 二阶段密钥 */
    auth_secret: string
    /** 是否已配置密钥 1:已配置 0:未配置 */
    is_secret: string
    /** 是否已配置资金密码 1:已配置 0:未配置 */
    is_pay_password: string
  }>('/member/auth/config')
}

/**
 * 关闭二阶段验证
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=38c20319-c66e-4228-a7b7-b82eeac21713
 */
export function ApiMemberAuthClose(data: {
  /** 密码 8-30 */
  password: string
  /** 二阶段验证码 */
  auth_code: string
}) {
  return httpClient.post<{
    /** 登录令牌 */
    token: string
  }>('/member/auth/close', data)
}

/**
 * VIP积分倍率 member/vip/multiple
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6e6f1ec1-7f3f-43b2-b0cd-56a3322fd70e
 */
export function ApiMemberVipMultiple() {
  return httpClient.get<{
    /** 4: 体育 */
    game_type: number
    rate: string
    updated_at: number
    updated_uid: string
    updated_name: string
  }[]>('/member/vip/multiple')
}

/*
* 获取利息宝配置
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=f79ae784-bcef-462d-af70-900bc09f1ae9
*/
export function ApiMemberInterestConfig(params: {
  cur: string
}) {
  return httpClient.get<{
    rate: {
      currency_id: number
      currency_name: string
      id: string
      interest_rate: string
      min_deposit: string
      bill_time: string
    }
    rule: {
      detail: string
      rule_type: number
    }
    [key: string]: any
  }>('/member/interest/config', { params })
}

/**
 * 会员各币种间余额转换
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=05d3cf72-7b2a-4bfd-b994-6365cc48c3c4
 */
export function ApiFinanceBalanceTransfer(data: {
  currency_in: CurrencyCode | '0'
  currency_out: CurrencyCode | '0'
  amount: string
}) {
  return httpClient.post('/finance/balance/transfer', data)
}

/*
* vip奖励领取
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b913c96a-70ba-485c-b1f0-4b3ef8f89769
*/
export function ApiMemberVipBonusApply(data: {
  id: string
  cur: string
  amount: string
}) {
  return httpClient.post<string>('/member/vip/bonus/apply', data)
}

/*
* vip等级场馆返水配置
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=d7f53680-3e01-4a43-afc9-46aafb4d0a5b
*/
export function ApiMemberVipRebateVIPConfig(params: {
  /** 游戏类型 1真人视讯 2捕鱼游戏 3老虎机 4体育 */
  game_type: string
  /** 币种id */
  cur: string
}) {
  return httpClient.get<{
    /** 等级配置 */
    data: {
      /** 等级 */
      v: string
      /** 反水值 */
      r: string[]
    }[]
    /** 类型 */
    menu: string[]
    /** 游戏类目 */
    name: string[]
  }>('/member/vip/rebate/config', { params })
}

/*
* 会员梯级返水投注统计 不是统一场馆
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1ee6239b-14e9-4ed2-9bba-b274f026f247
*/
export function ApiMemberVipRebateTieredConfig(params: {
  game_type: string
  currency_id: string
}) {
  return httpClient.get<{
    /** 游戏类型 */
    t: string
    /** 币种 */
    currency_id: string
    /** 等级配置 */
    data: {
      /** 等级 */
      v: string
      /** 有效投注 */
      vba: string
      /** 反水值 */
      r: string[]
    }[]
    /** 类型 */
    menu: string[]
    /** 游戏类目 */
    name: string[]
    /** 场馆等级 */
    vblv: Record<string, any>
  }>('/member/tiered/rebate/config', { params })
}

/*
* 会员梯级返水投注统计 不是统一场馆
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1ee6239b-14e9-4ed2-9bba-b274f026f247
*/
export function ApiMemberTieredRebateValidBet(params: {
  game_type: string
  currency_id: string
}) {
  return httpClient.get<{
    currency_id: string
    date: string
    next_rate: string
    next_valid_bet_amount: string
    less_valid_bet_amount: string
    platform_id: string
    platform_name: string
    rate: string
    uid: string
    valid_bet_amount: string
    rebate_amount: string
  }[]>('/member/tiered/rebate/valid/bet', { params })
}

/*
* 会员梯级返水投注统计 统一场馆
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1ee6239b-14e9-4ed2-9bba-b274f026f247
*/
export function ApiMemberTieredRebateSumValidBet(params: {
  currency_id: string
}) {
  return httpClient.get<{
    currency_id: string
    date: string
    next_rate: string
    next_valid_bet_amount: string
    less_valid_bet_amount: string
    platform_id: string
    platform_name: string
    rate: string
    uid: string
    valid_bet_amount: string
    rebate_amount: string
    game_type: string
  }[]>('/member/tiered/rebate/sum/valid/bet', { params })
}

/*
* 会员梯级返水投注统计 统一场馆 详情
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1ee6239b-14e9-4ed2-9bba-b274f026f247
*/
export function ApiMemberTieredRebateSumConfig(params: {
  game_type: string
  currency_id: string
}) {
  return httpClient.get<{
    /** 游戏类型 */
    t: string
    /** 币种 */
    currency_id: string
    /** 等级配置 */
    data: {
      /** 等级 */
      v: string
      /** 有效投注 */
      vba: string
      /** 反水值 */
      r: string[]
    }[]
    /** 类型 */
    menu: string[]
    /** 游戏类目 */
    name: string[]
    /** 场馆等级 */
    vblv: string
  }>('/member/tiered/rebate/sum/config', { params })
}

/**
 * 按货币取银行列表 member/bankcard/bank
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=eda66e11-97ad-409d-b4f1-af753a74f5e2
 */
export function ApiMemberBankcardBank(params: {
  currency_id: CurrencyCode
  /** 出款方式id */
  type_id: string
}) {
  return httpClient.get<{
    country_id: string
    country_name: string
    bank_list: {
      currency_id: CurrencyCode
      id: string
      name: string
      sort_level: string
      country_id: string
    }[]
  }[]>('/member/bankcard/bank', { params })
}

/**
 * 会员站点banner列表 member/banner/v2/list?banner_type=2
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1da00228-93c5-4100-9bfc-02ee66985214
 */
export function ApiMemberBannerV2List(params: {
  /**
   * 1:娱乐城
   *
   * 2:体育
   */
  banner_type: 1 | 2
}) {
  return httpClient.get<{
    jump_type: number
    jump_url: string
    /** 跳转状态 跳转交互 1:开启 2:关闭 */
    jump_state: number | string
    /** 1靠右 2靠左 3自定义 */
    banner_style: 1 | 2 | 3
    banner_info: {
      background: string
      icon: string
      content: { [key: string]: string }
      /**
       * 1:显示
       *
       * 2:隐藏
       */
      button_state: 1 | 2
      button_content: { [key: string]: string }
      button_jump_type: number
      button_jump_url: string
      /** 标题 */
      title: { [key: string]: string }
      /** 副标题 */
      superscript: { [key: string]: string }
      /** 自定义 单语言配置 */
      pic_mode_setting?: {
        config: {
          [key: string]: {
            jump_type: number
            jump_url: string
            /** 跳转状态 跳转交互 1:开启 2:关闭 */
            jump_state: number | string
            /** 图片 */
            url: string
          }
        }
        /** 1 单语言 2 全部通用 */
        mode: 1 | 2
      }
    }
    banner_url: { [key: string]: string }
    pc_seq: number
    mobile_seq: number
    promo_info: {
      display_mode: number
      end_at: number
      id: string
      start_at: number
    }
  }[]>('/member/banner/v2/list', { params })
}

/*
* vip晋级奖励全部领取
* @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=998fe27d-fe2e-49d1-ada7-c52bf2caae56
*/
export function ApiMemberVipBonusApplyAll(data: {
  cur: string
  flag: string
}) {
  return httpClient.post<string>('/member/vip/bonus/apply/all', data)
}

/**
 * 没有登录发送邮箱验证码
 * @see null
 */
export function ApiMemberSendMailCaptcha(data: {
  /** 邮箱 */
  email: string
}) {
  return httpClient.post<string>('/member/send/mail/captcha', data)
}

/**
 * 新版: 竞赛排行榜
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=3b660830f0e030
 */
export function ApiMemberRaceList(params?: {
  page?: number
  page_size?: number
  types: string
}) {
  return httpClient.get<IResponseList<{
    /** 币种ID */
    currency_id: CurrencyCode
    /** 投注金额 */
    bet_amount: string
    /** 奖金 */
    settle_amount: string
  }[]>>('/member/race/list', { params })
}

/**
 * 站内信-修改全部已读
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=365c431b-6895-408c-8640-279ca5e0fdf6
 */
export function ApiMemberStationInfoDetailUpdateAllState() {
  return httpClient.get<string>('/member/station/info/detail/update/all/state')
}

/**
 * 通知列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=e5751afd-9eb8-4d96-a6ff-9ff029320158
 */
export function ApiMemberNotifications(params: {
  page: number
  page_size: number
}) {
  return httpClient.get<IResponseList<{
    id: string
    type: string
    title: string
    content: string
    is_read: number
    timestamp: number
    target: string
    target_id: string
    payload: string
  }>>('/member/notifications', { params })
}

/**
 * 读通知
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=45233f48-036a-4052-a495-079f7ad88440
 */
export function ApiMemberNotificationsRead(data: {
  id: string
}) {
  return httpClient.post<string>('/member/notifications/read', data)
}

/**
 * 通知全部已读
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=014f1a43-0f1d-4781-b7d5-3a7e80162da7
 */
export function ApiMemberNotificationsReadAll() {
  return httpClient.post<string>('/member/notifications/read/all')
}

/**
 * 余额转换的锁定时间
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b308bbcc-c303-4552-b879-9c64df00d123
 */
export function ApiFinanceBalanceTransferLock() {
  return httpClient.get<{
    /** 到期时间，0为未锁定 */
    expire_at: number
  }>('/finance/balance/transfer/lock')
}

/**
 *Plinko小游戏下注
 */
export function ApiBettingGameOriginalPlinko(data: {
  line: string
  amount: string
  risk: string
  currency_id: CurrencyCode
}) {
  return httpClient.post<MiniGamePlinko>('/game/original/plinko', data)
}

/**
 *dice小游戏下注
 */
export function ApiBettingGameOriginalDice(data: {
  point: string
  amount: string
  currency_id: string
  condition: string
}) {
  return httpClient.post<{
    id: string
    active: boolean
    payout_multiplier: string
    amount_multiplier: string
    amount: string
    payout: string
    updated_at: number
    currency: string
    game: string
    uid: string
    name: string
    settle_amount: string
    state: {
      result: string
      target: string
      condition: string
      payout_multiplier: string
      win_chance: string
    }
  }>('/game/original/dice', data)
}

/**
 *Limbo小游戏下注
 */
export function ApiBettingGameOriginalLimbo(data: {
  amount: string
  currency_id: string
  multiplier: string
}) {
  return httpClient.post<{
    id: string
    active: boolean
    payout_multiplier: string
    amount_multiplier: string
    amount: string
    payout: string
    updated_at: number
    currency: string
    game: string
    uid: string
    name: string
    state: {
      result: string
      multiplier_target: string
    }
  }>('/game/original/limbo', data)
}

/**
 *dragon-tower小游戏下注
 */
export function ApiBettingGameOriginalDragon(data: {
  id: string
  type: number //  类型：1=翻开瓷砖 2=兑现 3=创建订单 4 查询未订单
  bet_amount: string // 金额 (注意是字符串)
  currency_id: string
  difficulty: string// 难度 easy=简单 medium=中等 hard=困难 expert=高手 master=大师
  position: number // 翻开位置
}) {
  return httpClient.post<{
    id: string
    active: boolean
    payout_multiplier: string
    amount_multiplier: string
    amount: string
    payout: string
    updated_at: number
    currency: string
    game: string
    uid: string
    name: string
    settle_amount: string
    state: {
      current_round: number
      played_rounds: number[][]
      difficulty: string
      rounds: number[][]
      tiles_selected: number[]
    }
  }>('/game/original/dragon/tower', data)
}

/**
 *dragon-tower小游戏自动投注
 */
export function ApiGameOriginalDragonMultiple(data: {
  bet_amount: string // 金额 (注意是字符串)
  currency_id: string
  difficulty: string // 难度 easy=简单 medium=中等 hard=困难 expert=高手 master=大师
  position: string // 翻开位置
}) {
  return httpClient.post<{
    id: string
    active: boolean
    payout_multiplier: string
    amount_multiplier: string
    amount: string
    payout: string
    updated_at: number
    currency: string
    game: string
    uid: string
    name: string
    settle_amount: string
    state: {
      current_round: number
      played_rounds: number[][]
      difficulty: string
      rounds: number[][]
      tiles_selected: number[]
    }
  }>('/game/original/dragon/tower/multiple', data)
}

/**
 * 站内公告标记已读
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2f2b1fc8-92c1-4331-9711-6a76f8679c5e
 */
export function ApiMemberNoticeReadInsert(params: {
  id: string
}) {
  return httpClient.get<string>('/member/notice/read/insert', { params })
}

/**
 * 弹窗频率、勾选今日不再显示
 */
export function ApiMemberNoticeLimitCount(data: {
  /** 1=弹窗频率记录。2=今日不在显示 */
  types: 1 | 2
  /** 1选中，2取消选中 */
  is_check: 1 | 2
  ids: string[]
}) {
  return httpClient.post('/member/notice/limit/count', data)
}

/**
 * 消息未读统计
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2579f9ab-6940-45f6-a2de-aca0f6e2d5c2
 */
export function ApiMemberNotificationsCount() {
  return httpClient.get<{
    /** 通知数量 */
    notification_count: number
    /** 公告数量 */
    notice_count: number
    /** 站内信数量 */
    station_count: number
    /** 有奖反馈数量 */
    reward_count: number

  }>('/member/notifications/count')
}

/**
 * 小游戏公平性种子信息
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=d15fd064-d6bf-4bbe-bdb2-56d77613f9d4
 */
export function ApiGameOriginalSeedDetail() {
  return httpClient.get<MiniGameSeedDetail>('/game/original/seed/detail')
}

/**
 * 更新客户端种子
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=d58647d2-ea4c-46ab-9995-f5dfce438a66
 */
export function ApiGameOriginalSeedUpdate(params: { seed: string }) {
  return httpClient.get<MiniGameSeedDetail>('/game/original/seed/update', {
    params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

/**
 * 查看小游戏游戏结果
 * /original/game/detail?id=xxx
 */
export function ApiOriginalGameDetail(p: { id: string, uid: string }) {
  return httpClient.get<IOriginalGameDetail>('/game/original/game/detail', { params: { id: p.id, uid: p.uid } })
}

/**
 * 获取渠道链接跳转位置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7cb0e38e-8ec4-47c1-bc7f-f7de13eb156d
 */
export function ApiMemberChannelNavLocation(p: { c?: string }) {
  return httpClient.get<number>('/member/channel/nav/location', { params: { auth: false, c: p.c } })
}

/**
 * 种子取消散列化
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=a20ca535-acb7-4143-938f-46a2203c59f3
 */
export function ApiGameOriginalSeedDecryptHash(seed: string) {
  return httpClient.get<{
    server_seed: string
  }>('/game/original/seed/decrypt/hash', { params: { seed } })
}

/**
 * 取得在线支持跳转签名 /member/brand/kefu/sign GET
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7840679e-f489-4643-8cca-4d77d565b324
 */
export function ApiMemberBrandKefuSign() {
  return httpClient.get<string>('/member/brand/kefu/sign')
}

/**
 * 获取多语言
 * @see
 */
export function ApiMemberFrontLang(key: string) {
  return httpClient.get<{
    [t: string]: string
  }>('/member/front/lang', { params: { key } })
}

/**
 * 大转盘活动-旋转
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=79f51803-5d03-4676-a0a2-156b12b8ed15
 */
export function ApiMemberTurntableRoll(params: {
  pid: string
  cur: CurrencyCode
}) {
  return httpClient.get<{
    ok: boolean
    amount: string
  }>('/member/turntable/roll', { params })
}

/**
 * 大转盘活动-记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=83e41ab0-2012-44d2-96c8-a139c349daea
 */
export function ApiMemberTurntableRecord(params: {
  pid: string
  // cur: CurrencyCode
}) {
  return httpClient.get<{
    id: string
    /** 用户名 */
    username: string
    pid: string
    /** 第一次金额 */
    first_prize: string
    /** 活动总金额 */
    total_prize: string
    /** 当前用户总金额 */
    achieved_prize: string
    /** 剩余次数 */
    left_roll: number
    /** 奖金状态 */
    state: number
    /** 活动货币id */
    currency_id: CurrencyCode
    /** 第一次抽奖时间 */
    first_roll_at: number
    /** 是否最后一次申请 1-是 2-否 */
    last_apply: 1 | 2
    /** 奖金有效期 */
    period: number
  }>('/member/turntable/record', { params })
}

/**
 * 大转盘活动-累积奖金记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2381c19e-7ddf-4237-b3ed-c1f96d6474c0
 */
export function ApiMemberTurntablePrizeRecord(pid: string) {
  return httpClient.get<IResponseList<{
    id: string
    username: string
    top_uid: string
    top_name: string
    parent_uid: string
    parent_name: string
    pid: string
    sub_uid: string
    sub_username: string
    ty: number
    prize: string
    state: number
    currency_id: CurrencyCode
    created_at: number
  }>>('/member/turntable/prize/record', { params: { pid } })
}

/**
 * 活动分类列表
 * @see https://doc.apipost.net/docs/detail/3f404032b8e0000?target_id=33dae113ba800f&locale=zh-cn
 */
export function ApiMemberPromoCategory() {
  return httpClient.get<CategoryItem[]>('/member/promo/category')
}

/**
 * 活动列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4c053c39-a28e-4e48-ae43-ddd1c64db383
 */
export function ApiMemberPromoList(params: {
  category: '1' | '2' | '0'
  cate_id: string
}) {
  return httpClient.get<ActivityItem[]>('/member/promo/list', { params })
}

/**
 * 大转盘活动配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=deb215c9-4958-4180-a09f-016b945c1128
 */
export function ApiMemberTurntableConfig(params: {
  pid: string
  cur: CurrencyCode
}) {
  return httpClient.get<{
    /** 按钮是否显示 1-显示 2-不显示 */
    button: 1 | 2
    /** 按钮跳转地址 */
    button_redirect: string
    button_type: number | string
    /** 按钮文案 */
    button_text: string
    currency_id: CurrencyCode
    /** 旋转次数 */
    daily_roll_times: number
    /** 活动描述 */
    detail: string
    summary: string
    /** 活动总金额 */
    withdraw_amount: string
    /** 活动状态 1开启 2关闭 3未开启 */
    state: string | number
    lang: string
    now_style: string
    style: {
      def_style_id: string
      roll_style: {
        id: string
        currency_id: string
        award_amount: string
        type: number
        color: string
        icon: string
        style: {
          id: string
        }
      }[]
    }
  }>('/member/turntable/config', { params })
}

/**
 * 大转盘活动奖金领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4aab8b09-08e8-420a-94c0-8c89a1295f5f
 */
export function ApiMemberTurntableBonusApply(params: {
  pid: string
}) {
  return httpClient.get<string>('/member/turntable/bonus/apply', { params })
}

/**
 * 活动领取记录(虚假数据)
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2dffc7ed-74db-4c3c-b007-3d1e515227c2
 */
export function ApiMemberTurntableGetRecord(params: {
  t: string
  size: number
}) {
  return httpClient.get<{
    uid: string
    created_at: number
    amount: string
  }[]>('/member/turntable/get/record', { params })
}

/**
 * 活动侧边栏
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b9b5ad63-09fe-4d74-8f1e-9749543f0ecb
 */
export function ApiMemberPromoSidebar() {
  return httpClient.get<{
    /** 活动id */
    id: string
    /** 活动类型 1-轮盘抽奖 2-推广 3-抢红包活动 4-负盈利 5-自定义 */
    ty: 1 | 2 | 3 | 4 | 5
    /** 活动名称 */
    name: string
  }[]>('/member/promo/sidebar')
}

/**
 * 货币列表
 */
export function ApiMemberCurrencyConfig() {
  return httpClient.get<EnumCurrencyKey[]>('/member/currency/config')
}

/**
 * 小游戏投注限额
 */
export function ApiGameOriginalBetLimit(id: CurrencyCode) {
  return httpClient.get<string[]>('/game/original/bet/limit', { params: { id } })
}

/**
 * 查询埋点配置信息
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=d0fadd8d-b57e-42d8-b99a-cab39e20bbe6
 */
export function ApiMemberChannelTrackConfigDetail(data: {
  url: string
}) {
  return httpClient.post<[
    {
      track_id: string
      track_name: StatisticsType
    },
  ]>('/member/channel/track/config/detail', data)
}

/**
 * Mines小游戏接口
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=636e3333-62e2-471c-a84e-3a1ac41467fa#doc-anchor-basic-body
 */
export function ApiGameOriginalMines(data: {
  /** 类型：1=建立订单 2=翻开宝石 3=兑现 4=查询未完成的订单 */
  type: number
  /** 翻牌位置 0-24 type=2时必填 */
  position?: number
  /** 雷的数量(1-24) type=1时必填 */
  mines_count?: number
  /** type=2,3 id必须传 */
  id?: string//
  /** 金额 (注意是字符串) */
  amount: string
  currency_id: CurrencyCode
  noNotify?: boolean
}) {
  return httpClient.post<{
    id: string
    active: boolean
    payout_multiplier: string
    amount_multiplier: string
    amount: string
    payout: string
    updated_at: number
    currency: CurrencyCode
    game: string
    uid: string
    name: string
    settle_amount: string
    state: {
      mines: number[] | null
      mines_count: number
      rounds: {
        payout_multiplier: string
        field: string
      }[]
    }
  }>('/game/original/mines', data)
}

/**
 * 小游戏自动投注接口
 *
 */
export function ApiGameOriginalMinesMultiple(data: {
  position: string
  mines_count: number
  amount: string
  currency_id: CurrencyCode
}) {
  return httpClient.post<{
    id: string
    active: boolean
    payout_multiplier: string
    amount_multiplier: string
    amount: string
    payout: string
    updated_at: number
    currency: CurrencyCode
    game: string
    uid: string
    name: string
    settle_amount: string
    state: {
      mines: number[] | null
      mines_count: number
      rounds: {
        payout_multiplier: string
        field: string
      }[]
    }
  }>('/game/original/mines/multiple', data)
}

/**
 * Wheel小游戏接口
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=5383266b-1a69-4cfd-9a8a-c3d41f41eda2
 */
export function ApiGameOriginaWheel(data: {
  risk: string
  segments: number
  bet_amount: string
  currency_id: CurrencyCode
  noNotify?: boolean
}) {
  return httpClient.post<{
    id: string
    active: boolean
    amount: string
    amount_multiplier: string
    currency: string
    game: string
    name: string
    payout: string
    payout_multiplier: string
    settle_amount: string
    state: {
      result: number
      segments: number
      risk: string
    }
    uid: string
    updated_at: number
  }>('/game/original/wheel', data)
}

/*
 * 站内信删除
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=5c808c7e-30ba-4492-887a-62c92aba80e1
 */
export function ApiMemberStationInfoDetailDelete(params: {
  id: string
}) {
  return httpClient.get<string>('/member/station/info/detail/delete', { params })
}

/**
 * 首存是否已埋点
 * // true 已埋点  false:未埋点
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2883986a-7a4b-4d79-b9ac-5bf1363b6742
 */
export function ApiMemberPixelFirstDepositExists(params: {
  pixel_id: string
}) {
  return httpClient.get<boolean>('/member/pixel/firstdeposit/exists', { params })
}

/**
 * 首存已埋点
 * // true 已埋点  false:未埋点
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=d106af0b-43c7-48a8-b9b7-145c06105836
 */
export function ApiMemberPixelFirstDepositMark(params: {
  pixel_id: string
}) {
  return httpClient.get<string>('/member/pixel/firstdeposit/mark', { params })
}
/*
 * 推广活动 - 活动配置
 */
export function ApiMemberAgencyConfig(params: { pid: string, currency_id: CurrencyCode, noNotify?: boolean }) {
  return httpClient.get<IPromotionInviteConfig>('/member/promo/agency/detail', { params })
}

/**
 * 推广活动 - 有效推广人数
 */
export function ApiMemberAgencyValidMemberCount(params: { pid: string, currency_id: CurrencyCode, noNotify?: boolean }) {
  return httpClient.get<IPromotionInviteValidMemberData>('/member/agency/valid/member/count', { params })
}

/**
 * 推广活动 - 领取
 */
export function ApiMemberAgencyBonusApply(pid: string, currency_id: CurrencyCode) {
  return httpClient.get<{
    /** 返回文字 领取成功、为符合条件、审核中 */
    message: string
    /** 1待审核 2已审核 3已发放（领取）4待领取 5拒绝 */
    state: '1' | '2' | '3' | '4' | '5'
    /** 领取金额 */
    bonus_amount: string
    currency_id: CurrencyCode
  }>('/member/promo/agency/bonus/claim', { params: { pid, currency_id } })
}

/**
 * 推广活动 - 有效推广人数详情
 */
export function ApiMemberAgencyValidMemberDetail(params: {
  pid: string
  page?: number
  page_size?: number
  /** 0：全部、1：有效、2：无效 */
  state: 0 | 1 | 2
  username: string
  currency_id: CurrencyCode
}) {
  return httpClient.get<IResponseList<{
    /** 子会员uid */
    uid: string
    /** 子会员名 */
    username: string
    /** 子会员的上级uid */
    parent_uid: string
    /** 活动id */
    pid: string
    /** 该子会员是否为有效推广，1：有效、2：无效 */
    state: number
    /** 子会员注册时间 */
    registered_at: number
  }>>('/member/agency/valid/member/detail', { params })
}

/**
 * 抢红包活动详情
 */
export function ApiMemberRedDetail(pid: string) {
  return httpClient.get<DollarWavesDataDetail>('/member/promo/red/detail', { params: { pid, noNotify: true } })
}

/**
 * 活动快捷入口
 */
export function ApiMemberPromoShortCut() {
  return httpClient.get<Array<{
    icon: string
    id: string
    ty: string | number
    state: number | string
    [k: string]: any
  }>>('/member/promo/shortcut')
}

/**
 * 抢红包
 */
export function ApiMemberPromoRedBonus(pid: string, currency_id: string, receive: 0 | 1) {
  return httpClient.get<{
    amount: string
    state: number
    tongue: string
  }>('/member/promo/red/claim', { params: { pid, currency_id, noNotify: true, receive } })
}

/**
 * 红包活动领取奖金
 */
export function ApiMemberPromoRedReceive(pid: string) {
  return httpClient.get('/member/promo/red/receive', { params: { pid } })
}

/**
 * 自定义活动配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=769e2e96-6a74-4d2b-8d6e-209251600e4f
 */
export function ApiMemberDisplayConfig(pid: string) {
  return httpClient.get<{
    /** 规则说明 */
    detail: string
    /** 按钮状态 1显示 2不显示 */
    button: number
    /** 按钮文字(多种语言) */
    button_text: string
    /** 按钮跳转地址 */
    button_redirect: string
    button_type: number | string
    /** 展示开始时间 */
    display_start_at: number
    /** 展示结束时间 */
    display_end_at: number
    /** 展示方式 1:内置页面 2:跳转外部链接 */
    display_type: string
    /** 页面内容 */
    page_content: string
    /** 选择排版 1靠右 2靠左 3自定义 */
    banner_style: string
    /** 网址url banner_style = 3自定义时，必填 */
    banner_url: string
    /** 背景图片 */
    banner_background: string
    /** ICON图片 */
    banner_icon: string
    /** 图片简介 */
    banner_content: string
    image: string
    lang: string
    name: string
    timezone: string
  }>('/member/display/config', { params: { pid } })
}

/**
 * 红包活动兑换金额
 */
export function ApiMemberPromoRedExchange(pid: string, currency_id?: string) {
  return httpClient.get('/member/promo/red/exchange', { params: { pid, currency_id } })
}

/**
 * 转盘活动获取电话号码
 */
export function ApiMemberTurntablePhone(pid: string) {
  return httpClient.get<string[]>('/member/turntable/phone', { params: { pid } })
}

/**
 * 转盘活动弹框
 */
export function ApiMemberPromoPop() {
  return httpClient.get<{
    id: string
    name: string
    state: number
    ty: number
    cfg: string
    display_type: string
    button_type: number
    button_redirect: string
  }[]>('/member/promo/pop')
}

/*
 * 会员返水汇总
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=118687c7-16e7-42bb-9564-e256153a57c6
 */
export function ApiMemberRebateSum() {
  return httpClient.get<{
    uid: string
    game_type: string
    valid_bet_amount: string
    currency_id: CurrencyCode
    rebate_amount: string
  }[]>('/member/rebate/sum')
}

/*
 * 会员返水详情列表
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7cf0dffc-f8a8-41d8-99ae-f4ae50b18a41
 */
export function ApiMemberRebateDetail(params: {
  // page?: number
  // page_size?: number
  currency_id: CurrencyCode
  game_type: number
}) {
  return httpClient.get<Array<{
    // cash_type: number
    // created_at: number
    date: string
    currency_id: CurrencyCode
    // game_type: string
    id: string
    platform_id: string
    platform_name: string
    rate: string
    rebate_amount: string
    uid: string
    valid_bet_amount: string
  }>>('/member/rebate/detail', { params })
}

/*
 * 会员返水领取方式(自动发放还是手动领取)
 *
 */
export function ApiMemberRebateAutomatic(currency_id: CurrencyCode) {
  return httpClient.get<{
    /** 1自动返水 2次日领取 3实时返水 */
    automatic: string
    /** 1vip模式 2梯级模式 */
    mode: string
    /** 1统一币种 2单独币种 */
    unified: string
    gts: string
    unified_cur: string
    /** 1合并计算 2分开计算 */
    unified_sum: string
  }>('/member/rebate/config', { params: { currency_id } })
}

/*
 * 会员返水-领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=2b315424-9683-471d-b314-5c48a215c84f
 */
export function ApiMemberRebateApply() {
  return httpClient.get<Array<{
    rebate_amount: string
    currency_id: CurrencyCode
  }>>('/member/rebate/apply')
}

/*
 * 负盈利活动配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7752ee5a-7c9d-4b47-94fd-aa211bb1a99e
 */
export function ApiMemberProfitConfig(params: {
  pid: string
  currency: CurrencyCode
}) {
  return httpClient.get<{
    /** 活动状态 1开启 2关闭 3未开启 */
    state: string | number
    /** 简介 */
    summary: ''
    /** 活动详情介绍文字 */
    detail: ''
    /** 按钮状态 1显示 2不显示 */
    button: 1 | 2
    /** 按钮文字(多种语言) */
    button_text: string
    /** 按钮跳转类型 */
    button_type: string
    /** 按钮跳转地址 */
    button_redirect: string
    /** 开始时间 */
    start_at: number
    /** 结束时间 */
    end_at: number
    /** 统计开始时间 */
    count_start_at: number
    /** 统计结束时间 */
    count_end_at: number
    /** 领取开始时间 */
    receive_start_at: number
    /** 领取结束时间 */
    receive_end_at: number
    /** 发放时间 */
    give_at: number
    /** 活动周期(秒) */
    period: number
    /** 币种 */
    currency_id: CurrencyCode
    /** 可领取最大金额 */
    prize_limit: string
    /** 图片 */
    images: string
    /** 领取期限 */
    apply_period: number
    /** 返水等级梯度 */
    prize_config: {
      profit_prize_config: {
        /** 等级 */
        level: string
        /** 有效投注金额 */
        valid_bet_amount: string
        /** 返现比例 */
        bonus_rate: string
        currency_id: CurrencyCode
      }[]
    }
    /** 规则说明  1 固定模版 2 自定义模版 */
    rule_type: 1 | 2
  }>('/member/profit/config', { params })
}
/*
 * 定点充值 配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=ab0ef3b0-48b3-4c3a-8596-e5a01c4c49cb
 */
export function ApiMemberPromoFixedDepositDetail(params: {
  pid: number
  cur: CurrencyCode
}) {
  return httpClient.get<FixedRechargeActivity>('/member/promo/fixed/deposit/detail', { params: { ...params, noNotify: true } })
}

/*
 * 定点充值 登录后活动详情
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=4453943f-3d08-4496-956c-4a29391e12d3
 */
export function ApiMemberPromoFixedDepositData(params: {
  activity_id: string
  cur: CurrencyCode
}) {
  return httpClient.post<LoginFixedRechargeActivity>('/member/promo/fixed/deposit/data', params, { params: { noNotify: true } })
}

/*
 * 定点充值 领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3fb7ea69-b280-4052-98c0-0b0ddefeb852
 */
export function ApiMemberPromoFixedDepositClaim(params: {
  activity_id: string
  cur: CurrencyCode
}) {
  return httpClient.post<LoginFixedRechargeActivity>('/member/promo/fixed/deposit/claim', params, { params: { noNotify: true } })
}

/*
 * 钱包存款活动 未登录配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=e4e65ee6-6b6f-4fb6-8a3f-d5da0a2c1373
 * */
export function ApiMemberPromoWalletDailyDetail(params: {
  pid: number
  cur: CurrencyCode
}) {
  return httpClient.get<WalletPaymentDepositActivity>('/member/promo/wallet/daily/detail', { params: { ...params, noNotify: true } })
}

/*
   * 钱包存款活动 登录后活动详情
   * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3dca8ec0-aa87-444a-87b1-b149056c1bb2
   */
export function ApiMemberPromoWalletDailyData(params: {
  activity_id: string
  cur: CurrencyCode
}) {
  return httpClient.post<LoginWalletPaymentDepositActivity>('/member/promo/wallet/daily/data', params, { params: { noNotify: true } })
}

/*
   * 钱包存款活动 领取
   * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=0a20ce8f-c1ae-4ed3-bb38-20c187ea3b92
   */
export function ApiMemberPromoWalletDailyClaim(params: {
  activity_id: string
  cur: CurrencyCode
}) {
  return httpClient.post<LoginFixedRechargeActivity>('/member/promo/wallet/daily/claim', params, { params: { noNotify: true } })
}
/*
   * 钱包存款活动 往期历史记录
   * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=0a20ce8f-c1ae-4ed3-bb38-20c187ea3b92
   */
export function ApiMemberPromoWalletDailyList(params: {
  page: number
  page_size: number
  activity_id: string
  cur: CurrencyCode
}) {
  return httpClient.post<DepositStoryRecordList>('/member/promo/wallet/daily/list', params)
}

/*
 * 每日签到活动配置
 * @see http://192.168.100.103:10393/shareDoc?issue=bfb45a7e0f82f2bfe7701472d20c9dec&target_id=3ee87f06-74a8-42b3-8801-489b4c1fdc2b
 */
export function ApiMemberPromoDailySignDetail(params: {
  pid: string
}) {
  return httpClient.get<SignRewardDataConfig>('/member/promo/daily/sign/detail', { params })
}
/*
 * 首充活动 配置
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=211f63c6ba8001
 */
export function ApiMemberPromoDepositFirst(params: {
  activity_id: number
  curr_id: CurrencyCode
}) {
  return httpClient.get<RechargeActivity>('/member/promo/deposit/first', { params })
}

/*
 * 神秘矿井 详情
 * @see https://doc.apipost.net/docs/detail/448afae650e0000?target_id=7cb19e473d0ae
 */
export function ApiMemberPromoMineDetail(params: {
  pid: number
  currency_id: CurrencyCode
}) {
  return httpClient.get<PromoMineDetail>('/member/promo/mine/detail', { params })
}

/*
 * 神秘矿井 领取
 * @see https://doc.apipost.net/docs/detail/448afae650e0000?target_id=7cb19e473d0ae
 */
export function ApiMemberPromoMineClaim(params: {
  pid: number
  currency_id: CurrencyCode
}) {
  return httpClient.get<PromoMineClaim>('/member/promo/mine/claim', { params: { ...params, noNotify: true } })
}

/*
 * 神秘矿井 领取记录
 * @see https://doc.apipost.net/docs/detail/448afae650e0000?target_id=7cb19e473d0ae
 */
export function ApiMemberPromoMineClaimList(params: {
  pid: number
  currency_id: CurrencyCode
  page: number
  page_size: number
  start_at: number
  end_at: number
}) {
  return httpClient.get<PromoMineClaimList>('/member/promo/mine/claim/list', { params })
}

/*
 * 累计充值活动 配置
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=21f20d7ffa803a
 */
export function ApiMemberPromoDepositAccumulative(params: {
  activity_id: number
  curr_id: CurrencyCode
}) {
  return httpClient.get<RechargeActivity>('/member/promo/deposit/accumulative', { params })
}

/*
 * 注册充值活动 配置
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=21f1afe8ba8036
 */
export function ApiMemberPromoDepositRegistration(params: {
  activity_id: number
  curr_id: CurrencyCode
}) {
  return httpClient.get<RechargeActivity>('/member/promo/deposit/registration', { params })
}

/*
 * 领取任务
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=21f1afe8ba8036
 */
export function ApiMemberPromoDepositReceive(params: {
  activity_id: number
  task_id: string
  curr_id: CurrencyCode
}) {
  return httpClient.get<{
    state: number
  }>('/member/promo/deposit/receive', { params: { ...params, noNotify: true } })
}

/*
 * 重新提交
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=21f1afe8ba8036
 */
export function ApiMemberPromoDepositRecordResubmit(params: {
  id: string
}) {
  return httpClient.get<{
    code: string
  }>('/member/promo/deposit/record/resubmit', { params: { ...params, noNotify: true } })
}

/*
 * 累计充值活动历史领取
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=22addbbbb0e3c6
 */
export function ApiMemberPromoDepositStoryRecordList(params: {
  pid: number
  page: number
  page_size: number
  currency_id: string
}) {
  return httpClient.get<DepositStoryRecordList>('/member/promo/deposit/story/record/list', { params })
}

/*
 * 未登录 首充弹窗数据
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=318c4477ba8002
 */
export function ApiMemberPromoDepositInfo() {
  return httpClient.get<RechargeActivity>('/member/promo/deposit/info', {})
}

/*
 * 登录后的 注册弹窗
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=91cf1cbfa8005
 */
/* export function ApiMemberPromoDepositPopups() {
  return httpClient.get<{
    data: string
    status: boolean
  }>('/member/promo/deposit/popups', { })
} */

/*
 * 负盈利活动会员等级查询
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=265c3063-79bd-4a63-82e7-3fddd3fa789e
 */
export function ApiMemberProfitLevel(params: {
  pid: string
  cur: CurrencyCode
}) {
  return httpClient.get<{
    /** 当前比例 */
    bonus_rate: string
    /** 当前等级 */
    level: string
    /** 当前有效投注 */
    valid_bet_amount: string
    /** 领取按钮是否禁用 */
    receive: boolean
  }>('/member/profit/level', { params })
}

/**
 * 负盈利活动领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8c8ce82e-679a-4b8e-a86e-f66a1ee104f8
 */
export function ApiMemberProfitBonusApply(data: {
  pid: string
  cur: CurrencyCode
}) {
  return httpClient.post<{
    /** 提取方式 1直接转入钱包 2需审核 */
    withdraw_type: 1 | 2
    /** 成功领取金额 */
    bonus_amount: string
    /** 负盈利金额 */
    loss_amount: string
    /** 有效投注 */
    valid_bet_amount: string
    /** 返现比例 */
    gift_rate: string
    /** 返现等级 */
    level: string
  }>('/member/profit/bonus/apply', data)
}

/*
 * 每日投注奖励活动配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=7752ee5a-7c9d-4b47-94fd-aa211bb1a99e
 * /member/promo/daily/bonus/detail
 */
export function ApiMemberPromoDailyBonusDetail(params: {
  pid: string
}) {
  return httpClient.get<{
    img: {
      zh_CN: string
      en_US: string
      vi_VN: string
      pt_BR: string
      th_TH: string
      hi_IN: string
    }
    lang: string[]
    conf: {
      currency: {
        701: 701[]
        702: 702[]
        703: 703[]
        704: 704[]
        705: 705[]
        706: 706[]
      }
      plat_ids: string[]
      all: number
      method: number
      period: number
    }
    detail: {
      zh_CN: string
      en_US: string
      vi_VN: string
      pt_BR: string
      th_TH: string
      hi_IN: string
    }
    buttonText: {
      en_US: string
      hi_IN: string
      pt_BR: string
      th_TH: string
      vi_VN: string
      zh_CN: string
    }
    button: {
      redirect: string
      button: number
      button_type: number
    }
    rule_type: number
    state: number
    automatic: number
  }>('/member/promo/daily/bonus/detail', { params })
}

/*
 * 每日投注奖励活动获取我的有效投注
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=265c3063-79bd-4a63-82e7-3fddd3fa789e
 */
export function ApiMemberPromoDailyBonusBet(params: {
  pid: string
  currency: CurrencyCode
}) {
  return httpClient.get<{
    d: {
      platform_id: string
      platform_name: string
      game_class: string
      game_code: string
      game_name: string
      bet_count: number
      bet_count_proportion: string
      profit_rate: string
      bet_amount: string
      valid_bet_amount: string
      net_amount: string
      currency_id: string
      member_count: number
      site_id: string
      uid: string
      username: string
      parent_uid: string
      parent_name: string
      prefix: string
      site_name: string
      level_name: string
      vip: string
    }[]
    t: string
    s: string
    v: number[]
  }>('/member/promo/daily/bonus/bet', { params })
}
/**
 * 每日投注奖励活动领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8c8ce82e-679a-4b8e-a86e-f66a1ee104f8
 */
export function ApiMemberPromoDailyBonusClaim(params: {
  pid: string
  tier: number
  currency: CurrencyCode
}) {
  return httpClient.get('/member/promo/daily/bonus/claim', { params })
}

/**
 * 每日签到奖励活动领取
 * @see http://192.168.100.103:10393/shareDoc?issue=bfb45a7e0f82f2bfe7701472d20c9dec&target_id=eedfd9da-53b0-46d8-94c0-0e16da2fff60
 */
export function ApiMemberPromoDailySignClaim(params: {
  pid: string
}) {
  return httpClient.get('/member/promo/daily/sign/claim', { params })
}

/*
 * 会员vip奖金配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=9ec9328d-050c-4072-abe3-38f523e5140a
 */
export function ApiMemberVipPrizeConfig(params: {
  cur: CurrencyCode
}) {
  return httpClient.get<{
    /** 奖金数据 */
    data: {
      [t: string]: {
        level: number
        cash_type: number
        currency_id: CurrencyCode
        amount: string
      }[]
    }
    /** 奖金开关 */
    nav: {
      [t: string]: boolean
    }
  }>('/member/vip/prize/config', { params })
}

/*
 * 会员vip积分配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6e6f1ec1-7f3f-43b2-b0cd-56a3322fd70e
 */
export function ApiMemberVipScoreConfig(params: {
  cur: CurrencyCode
}) {
  return httpClient.get<{
    key: CurrencyCode
    value: string
  }>('/member/vip/score/config', { params })
}

/*
 * 消息中心-存取款通知删除
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3498dfff-ea99-487f-9cec-4a28cd95a344
 */
export function ApiMemberNotificationsDelete(params: {
  id: string
}) {
  return httpClient.get<boolean>('/member/notifications/delete', { params })
}

/**
 * 发送手机短信验证码
 */
export function ApiMemberPhoneSms(data: {
  phone?: string
  /** 0-输入手机号 1-获取会员手机号 */
  type: 0 | 1
  /** type是1时必传 */
  uid?: string
}) {
  return httpClient.post<string>('/member/phone/sms', data)
}

/**
 * 找回密码
 */
export function ApiMemberPasswordUpdateCode(data: {
  new_password: string
  captcha: string
  /** 1邮箱 2手机 */
  type: 1 | 2
  phone_email: string
}) {
  return httpClient.post('/member/password/update/code', data)
}

/**
 * 验证验证码并获得cpf
 */
export function ApiMemberAuthInfo(data: {
  /** 验证码 */
  captcha: string
  /** 1邮箱 2手机 */
  type: 1 | 2
  phone_email: string
}) {
  return httpClient.post<{
    /** 0验证失败，1验证成功 */
    status: number
    cpf_number: string
  }>('/member/pre/auth/info', data)
}

/**
 * hilo小游戏接口(投注)
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=5483285f-76b2-41ed-b776-6eda2397bbdc
 */
export function ApiGameOriginalHilo(data: {
  /** 起手牌 */
  start_card?: {
    /** suit-牌花色 */
    suit: string
    /** rank 派面值 */
    rank: string
  }
  /** 订单ID type=2 和type=3必传递 1和4 默认值"" */
  id?: string
  /** 类型：1=建立订单 2=下注 3=兑现 4=查询未完成的订单 */
  type: 1 | 2 | 3 | 4
  /** 下注 1=大于 2=小于 3=跳过(下一张牌) */
  action?: 1 | 2 | 3
  /** 金额 (注意是字符串) */
  amount: string
  /** 货币id */
  currency_id: CurrencyCode
}) {
  return httpClient.post<{
    /** 订单号 */
    id: string
    /** 是否为活跃订单(未完成的订单) */
    active: boolean
    /** 赔付乘数 */
    payout_multiplier: string
    /** 金额倍数 */
    amount_multiplier: string
    /** 下注金额 */
    amount: string
    /** 派彩金额 */
    payout: string
    /** 更新时间 */
    updated_at: number
    /** 币种id */
    currency: CurrencyCode
    /** 游戏名称 */
    game: string
    /** 用户id */
    uid: string
    /** 会员名 */
    name: string
    /** 支付额(下注详情页面显示) */
    settle_amount: string
    state: {
      /** 起始牌 */
      start_card: {
        /** 起始牌花色 */
        suit: PokerColors
        /** 起始牌面值 */
        rank: PokerRank
      }
      /** 牌记录 */
      rounds: {
        /** 赔付比例 */
        payout_multiplier: string
        /** 当前牌面 */
        card: {
          /** 牌花色 */
          suit: PokerColors
          /** 牌面值 */
          rank: PokerRank
        }
        /** 下注内容 higher_equal=大于等于 lower_equal=小于等于 skip=跳过 equal=等于 */
        guess: string
      }[]
    }
  }>('/game/original/hilo', data)
}

/**
 * 编辑银行卡
 */
export function ApiMemberBankcardUpdate(data: any) {
  return httpClient.post('/member/bankcard/update', data)
}

/*
 * 小游戏 blackjack
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=e3fec47f-b986-4a84-9e9d-42d770344556
 */
export function ApiGameOriginalBlackJack(data: {
  order_id?: string
  /** 1=叫牌 2=停牌 3=分牌 4=加倍 5=买保险 6=不买保险 7=查询订单 8=创建订单 */
  type: BlackJackActionType
  /** 金额 */
  bet_amount?: string
  /** 币种 */
  currency_id?: CurrencyCode
  /** 分牌后，发牌索引 */
  card_split_index?: number
}) {
  return httpClient.post<BlackJackData>('/game/original/blackJack', data)
}

/**
 * 货币ID排序
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=af9b4541-d55a-42f2-aafe-e877a37453a2
 */
export function ApiMemberCurrencySort() {
  return httpClient.get<CurrencyCode[]>('/member/currency/sort')
}

/**
 * 会员钱包显示不可绑定的货币
 *
 */
export function ApiFinanceDepositWalletInvalidCurrency() {
  return httpClient.get<{
    currency_id: string
    contract_id: {
      id: string
    }[]
  }[]>('/finance/deposit/wallet/invalid/currency')
}

/*
 * 小游戏 crash
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8ab53e9c-9ae9-4a24-abf8-32088e70de0f
 */
export function ApiGameOriginalCrash(data: {
  id?: string
  /** 1=建立订单 2=兑现 */
  type: 1 | 2
  /** 金额 */
  bet_amount: string
  /** 币种 */
  currency_id: CurrencyCode
  /** 兑现于 */
  multiplier: string
}) {
  return httpClient.post<{
    active: boolean
    amount: string
    amount_multiplier: string
    currency: CurrencyCode
    id: string
    name: string
    payout: string
    payout_multiplier: string
    settle_amount: string
    uid: string
    updated_at: number
    state: {
      bet_point: string
      cash_out_point: string
      crash_point: string
      issue_id: string
      payout_multiplier: string
    }
  }>('/game/original/crash', data)
}

/**
 * 编辑钱包 member/wallet/update
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=11cf8d2f-b301-411a-b5c2-91b446e6d479
 */
export function ApiMemberWalletUpdate(data: {
  /** 钱包id */
  id: string
  /** 钱包修改后的地址 */
  address: string
  /**
   * 验证类型
   *
   * 1:二阶段验证，2:支付密码
   */
  auth_type: number
  /** 密码 */
  pay_password: string
  is_default: number
}) {
  return httpClient.post('/member/wallet/update', data)
}

/**
 * 获取当前绑定了银行卡的银行列表 /finance/withdraw/bankcard/bank
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=6185646c-f776-4ffa-bf83-d16126300820
 */
export function ApiFinanceWithdrawBankcardBank(params: {
  currency_id: CurrencyCode
}) {
  return httpClient.get<{
    bank_id: number
    bank_name: string
    /** 1:有默认卡 2:没默认卡 */
    is_default: number
    /** 出款方式id */
    withdraw_type_id: string
  }[]>('/finance/withdraw/bankcard/bank', { params })
}

/**
 * 获取爆点记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=099e70a9-bbcf-44d4-a1a3-105f41f53fc7
 */
export function ApiGameOriginCrashIssueRecord(data: {
  page: number
  page_size: number
  issue: string
}) {
  return httpClient.post<IResponseList<{
    issue_id: string
    hash: string
    base_seed: string
    start_at: number
    crash_at: number
    crash_point: string
  }>>('/game/original/crash/issue', data)
}

/**
 * Crash 获取排行榜
 */
export function ApiGameOriginCrashIssueRanking(data: {
  issue: string
}) {
  return httpClient.post<{
    order_id: string
    bet_amount: string
    settle_amount: string
    net_amount: string
    currency_id: CurrencyCode
    bet_detail: string
    username: string
    payout: string
    payout_multiplier: string
    result: string
    uid: string
  }[]>('/game/original/crash/issue/rankings', data)
}

/**
 * Keno 下注接口
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=017c6999-45ae-457a-9e20-d05dec5be64f
 */
export function ApiGameOriginalKenoBet(data: {
  numbers: Array<number>
  /** 风险类型 classic=典型 low=低等 medium=中等 high=高等 */
  risk: string
  /**  金额 (注意是字符串) */
  bet_amount: string
  /** 币种 */
  currency_id: CurrencyCode
}) {
  return httpClient.post<{
    id: string
    active: boolean
    payout_multiplier: string
    amount_multiplier: string
    amount: string
    payout: string
    updated_at: number
    currency: CurrencyCode
    game: string
    uid: string
    name: string
    settle_amount: string
    state: {
      drawn_numbers: number[]
      selected_numbers: number[]
      risk: string
    }
  }>('/game/original/keno', data)
}

/*
 * 娱乐城首页请求接口
 */
export function ApiGameRecycle() {
  return httpClient.get('/game/recycle')
}

/**
 * 聊天室当前用户是否被禁言
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=00e8663e-69f6-4f3f-8549-352847283109
 */
export function ApiMemberChatEnable(data: {
  room: string
}) {
  return httpClient.post<boolean>(`/member/chat/enable?lang=${data.room}`)
}

/**
 * 登录注册 阿里 验证
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=b70c7e3a-4b69-4b4c-a65d-5a84c571ea97
 */
export function ApiMemberSmartVerify(data: {
  captcha_id: string // 验证码ID
  validate: string // 二次验证参数 前端生成
  username: string// 用户名，可为空
}) {
  return httpClient.post<boolean>('/member/captcha', data)
}

/**
 * 阿里 验证 配置
 * @see
 */
export function ApiSmartVerificationConfig() {
  return httpClient.get<{
    captcha_id: string
    type: string
  }>('/member/captcha/config')
}

export function ApiPromoRedClaimed(params: {
  pid: string
  lang: string
}) {
  return httpClient.get<{ tongue: string, claimed: string, ip?: boolean, bl?: boolean }>('/member/promo/red/claim/list', { params })
}

export function ApiPromoRedCountdown() {
  return httpClient.get<{
    id: string
    ct: any
    period: any
  }>('/member/promo/red/countdown', {})
}

/**
 * 活动弹窗 侧边栏 浮窗
 */
export function ApiMemberPromoCombine() {
  return httpClient.get<{
    pop: {
      id: string
      name: string
      state: number
      ty: number
      cfg: string
      display_type: string
      button_type: number
      button_redirect: string
      display_mode: number
      config: string
      start_at: number
      end_at: number
      active_content: number
      /** 1关闭 2未登陆弹 3登陆弹 4未登陆、登陆弹 */
      pop: string
    }[]
    sc: {
      icon: string
      id: string
      ty: string | number
      state: number | string
      [k: string]: any
      display_mode: number
    }[]
    rec: {
      /** 活动id */
      id: string
      /** 活动类型 1-轮盘抽奖 2-推广 3-抢红包活动 4-负盈利 5-自定义 */
      ty: 1 | 2 | 3 | 4 | 5
      /** 活动名称 */
      name: string
      display_mode: number
    }[]
  }>('/member/promo/combine')
}

/**
 * 汇率转换获取接口
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=20ee394f-e5a1-4bde-977f-34aa35670a66
 */
export function ApiExchangeRateFromTo(params: {
  from: CurrencyCode | string
  to: CurrencyCode
}) {
  return httpClient.get<IExchangeRateFromToData>('/exchange/rate', { params })
}

/**
 * win6 推广活动 footerbar 分享按钮状态提示
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=a41e837b-606f-48b3-8e0f-ed384fe24dc6
 */
export function ApiMemberAgencyCheck(params: {
  currency_id?: CurrencyCode
}) {
  return httpClient.get<{
    tips?: number | string
    pid?: number | string
  }>('/member/agency/check', { params })
}

/**
 * pwa配置
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=24a4e75c349237
 */
export function ApiMemberMarketDetail(id?: string | null) {
  return httpClient.get<{
    name: string
    app_name: string
    author: string
    icon: string
    promo_icon: string
    present: string
    fix: string
    down_button: string
    lead_page: string
    channel_id: string
    /** 渠道apk */
    apk: string
    /** 官方apk */
    official_apk: string
    /** 官方备用apk */
    official_reserve_apk: string
  }>('/member/market/detail', {
    params: { id, noNotify: true },
  })
}

/**
 * 幸运赌注 活动配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=c533b6bf-950e-44ed-b389-1263c8aeedc0
 */
export function ApiMemberLuckyBetConfig(params: {
  pid: string
  currency: CurrencyCode
}) {
  return httpClient.get<{
    /** 简介 */
    summary: string
    rule_type: number
    /** 活动详情介绍文字 */
    detail: string
    /** 按钮状态 1显示 2不显示 */
    button: number
    button_type: number
    /** 按钮文字(多种语言) */
    button_text: string
    /** 按钮跳转地址 */
    button_redirect: string
    /** 开始时间 */
    start_at: number
    /** 结束时间 */
    end_at: number
    images: string
    automatic: string
    /** 统计开始时间 */
    count_start_at: number
    /** 统计结束时间 */
    count_end_at: number
    /** 领取开始时间 */
    receive_start_at: number
    /** 领取结束时间 */
    receive_end_at: number
    /** 发放时间 */
    give_at: number
    /** 活动周期(秒) */
    period: number
    apply_period: number
    /** 币种 */
    currency_id: CurrencyCode
    currency_ids: CurrencyCode[]
    /** 1=全部场馆 2=指定场馆 */
    platform_range: number
    /** 启用的场馆列表 */
    platform_ids: string[]
    prize_limit: string
    state: number
    lang: string
    /** 奖金配置，梯级 */
    prize_config?: {
      currency_id: CurrencyCode
      lucky_bet_prize_config: {
        pid: string
        /** 等级 */
        level: string
        /** 有效投注 */
        valid_bet_amount: string
        receive_count: string
        /** 0是无，1是有领取的 */
        receive: number
      }[]
      /** 幸运号码配置 */
      lucky_number_config: {
        /** 尾号 */
        lucky_number: string
        /** 奖励倍数 */
        bonus_multiple: string
        /** 最大限制 */
        limit: string
        /** 0是无，1是有领取的 */
        receive: number
      }[]
    }
  }>('/member/lucky/bet/detail', { params })
}

/**
 * 幸运赌注 会员等级查询
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=60ccac80-1146-4798-8cb4-9aa6905bf9ca
 */
export function ApiMemberLuckyBetLevel(params: {
  pid: string
  currency: CurrencyCode
}) {
  return httpClient.get<{
    pid: string
    /** 返现等级 */
    level: string
    /** 有效投注 */
    valid_bet_amount: string
    /** 可领取次数 */
    receive_count: number
    /** 是否有待领取记录 1=无 2=有 3=今日已领取 4=审核中 */
    receive: number
    lucky_number: string[]
    /** 审核中的 */
    lucky_number_pending: string[]
    /** 今日已领取次数 */
    today_receive_count: number
  }>('/member/lucky/bet/level', { params })
}

/**
 * 幸运赌注 奖金领取
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=8ece2c18-3ee5-481e-957d-6ef5931dbfc3
 */
export function ApiMemberLuckyBetBonusApply(data: {
  pid: string
  cur: CurrencyCode
  lucky_number?: string | number
}) {
  return httpClient.post<{
    /** 提取方式 1直接转入钱包 2需审核 */
    withdraw_type: number
    /** 成功领取金额 */
    bonus_amount: string
    /** 是否有待领取记录 1=无 2=有 3=今日已领取 4=审核中 */
    receive: number
  }>('/member/lucky/bet/bonus/claim', data)
}

/**
 * 获取ios和安卓包地址
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=0be179b7-845d-4183-b81d-6cd692db689e
 */
export function ApiMemberBrandAppVersion() {
  return httpClient.get<{
    ios: {
      link: {
        primary: string
      }
    }
    android: {
      link: {
        primary: string
      }
    }
  }>('/member/v2/app/version?d=0', {
    params: { noNotify: true },
  })
}

/**
 * 返回虚拟币代收付支持的币种与协议
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=3ec837d9-9c78-4b01-9db5-4c6d6e53ea92
 */
export function ApiFinanceDepositVirtualInfo() {
  return httpClient.get<{
    currency_id: CurrencyCode
    contracts: {
      contract_id: string
      contract_name: string
    }[]
  }[]>('/finance/deposit/virtual/info')
}

/*
 * 逢8会员日 配置
 * @see ********************************卡总没给
 */
export function ApiMemberPromoMemberDayDetail(params: {
  pid: string
  currency: CurrencyCode
}) {
  return httpClient.get<{
    /** 活动banner */
    img: Record<string, any>
    /** 奖金配置 */
    conf: {
      currency_id: string
      ladder: any[]
      adwardType: number
      staticType: number
      [key: string]: any
    }
    /** 规则 */
    detail: Record<string, any>
    /** 活动状态 */
    state: string
    /** 规则类型 */
    rule_type: number
    /** 规则按钮配置 */
    button: Record<string, any>
    /** 按钮文字 */
    buttonText: Record<string, any>
  }>('/member/promo/member/day/detail', { params })
}

/*
 * 逢8会员日 本期累计存款/提款流水
 * @see ********************************卡总没给
 */
export function ApiMemberPromoMemberDayReport(params: {
  pid: string
  currency: CurrencyCode
  step: string
}) {
  return httpClient.get<{
    /** 提取方式 0不可以领取 1可以领取 2过期 3已领取 */
    bet_count: number
    /** 开始领取时间 */
    gift_amount: string
    /** 结束领取时间 */
    receive: string
    /** 可领取奖金 */
    net_amount: string
    /** 本期累计存款 */
    deposit_amount: string
  }>('/member/promo/member/day/report', { params })
}

/*
 * 逢8会员日 领取接口
 * @see ********************************卡总没给
 */
export function ApiMemberPromoMemberDayClaim(params: {
  pid: string
  currency: CurrencyCode
  step: string
}) {
  return httpClient.get<string>('/member/promo/member/day/claim', { params })
}
/**
 * 代理额外日奖励活动配置
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=9e21ad3fa8007
 */
export function ApiMemberPromoAgentDaily(params: {
  activity_id: string | number
  curr_id: CurrencyCode
}) {
  return httpClient.get<{
    /** 已选择货币 */
    promo_cur: CurrencyCode
    /** 状态  0未达1(待领取)，2(已过期)，3(待审核)，4(已领取)，5（审核拒绝） */
    state: number
    /** 佣金金额 */
    commission_amount: number | string
    /** 奖金金额 */
    bonus_amount: number | string
    /** 活动状态 20活动未开始,21活动已结束,22活动已关闭,但需要展示,23活动已关闭,24当前币种不支持此活动 */
    activity_state: number
    /** 申请金额 */
    apply_amount: number | string
    /** 满足档位金额 */
    term_amount: number | string
    /** 后端服务服时间 */
    cur_time: number
    promo_info?: {
      /** 按钮类型 */
      button_type: number
      /** 开始时间 */
      s: string | number
      /** 结束时间 */
      e: string | number
      detail: string
      /** 按钮 */
      button: string | number
      /** 规则类型 */
      rule_type: number
      /** 图片 */
      images: string
      /** 促销信息状态 */
      state: number
      /** 显示 */
      display: number
      /** 语言 */
      tongue: string
      lang: string
      /** 文本 */
      text: string
      /** 重定向 */
      redirect: string
      config?: {
        /** 统计周期 1前一个自然日 2前一个自然周 3前一个自然月 */
        period: number
        /** 奖金，1固定金额 2随机金额 3比例金额 */
        bonus: number
        tongue?: {
          [P in CurrencyCode]: {
            /** 存款 */
            commission: string
            /** 比例 */
            scale: string
            /** 限制 */
            limit: string
            /** 最小值 */
            min: string
            /** 最大值 */
            max: string
          }[]
        }
      }
    }
  }>('/member/promo/agent/daily', { params })
}

/**
 * 代理额外月奖励活动配置
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=9e434b63a87cf
 */
export function ApiMemberPromoAgentMonthly(params: {
  activity_id: string | number
  curr_id: CurrencyCode
}) {
  return httpClient.get<{
    /** 已选择货币 */
    promo_cur: CurrencyCode
    /** 状态  0未达 1(待领取)，2(已过期)，3(待审核)，4(已领取)，5（审核拒绝） */
    state: number
    /** 佣金金额 */
    commission_amount: number | string
    /** 奖金金额 */
    bonus_amount: number | string
    /** 活动状态 20活动未开始,21活动已结束,22活动已关闭,但需要展示,23活动已关闭,24当前币种不支持此活动,28本月已参与过该活动，暂不符合参与资格 */
    activity_state: number
    /** 申请金额 */
    apply_amount: number | string
    /** 满足档位金额 */
    term_amount: number | string
    /** 后端服务服时间 */
    cur_time: number
    promo_info?: {
      lang: string
      /** 按钮类型 */
      button_type: number
      /** 开始时间 */
      s: string | number
      /** 结束时间 */
      e: string | number
      detail: string
      /** 按钮 */
      button: string | number
      /** 规则类型 */
      rule_type: number
      /** 图片 */
      images: string
      /** 促销信息状态 */
      state: number
      /** 显示 */
      display: number
      /** 语言 */
      tongue: string
      /** 文本 */
      text: string
      /** 重定向 */
      redirect: string
      config?: {
        /** 统计周期 1前一个自然日 2前一个自然周 3前一个自然月 */
        period: number
        /** 奖金，1固定金额 2随机金额 3比例金额 */
        bonus: number
        tongue?: {
          [P in CurrencyCode]: {
            /** 存款 */
            commission: string
            /** 比例 */
            scale: string
            /** 限制 */
            limit: string
            /** 最小值 */
            min: string
            /** 最大值 */
            max: string
          }[]
        }
      }
    }
  }>('/member/promo/agent/monthly', { params })
}

/**
 * 领取代理日佣金奖励
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=9e4c0e8ba88ce
 */
export function ApiMemberPromoAgentDailyReceive(params: {
  activity_id: string | number
  curr_id: CurrencyCode
}) {
  return httpClient.get<{
    /** 0 表示正常领取，其他表示联系客服 */
    status: number
    message: string
    activity_state: number
  }>('/member/promo/agent/daily/receive', { params })
}

/**
 * 领取代理月佣金奖励
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=9e541663a88d0
 */
export function ApiMemberPromoAgentMonthlyReceive(params: {
  activity_id: string | number
  curr_id: CurrencyCode
}) {
  return httpClient.get<{
    /** 0 表示正常领取，其他表示联系客服 */
    status: number
    message: string
    activity_state: number
  }>('/member/promo/agent/monthly/receive', { params })
}
/**
 * 神秘盲盒活动配置
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=1a131da3-ff81-45ee-8d4c-46805a613f12
 */
export function ApiMemberPromoMysteryBoxDetail(params: {
  pid: string | number
  // cur: CurrencyCode
}) {
  return httpClient.get<MysteryBoxDetail>('/member/promo/mystery/box/detail', { params })
}
/**
 * 神秘盲盒用户数据
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=08eb643e-7e84-4db4-ad92-626f49cef6fd
 */
export function ApiMemberPromoMysteryBoxData(
  data: {
    activity_id: string
    claim_day: string | number
  },
) {
  return httpClient.post<{
    claim_amount: string // 可以领取的金额，展示用
    deposit_amount: string // N天总存款金额
    apply_date: string // 报名时间
    claim_at: string // 领取时间
    cur: string // 货币
    state: 1 | 2 | 3 // 状态：1可领取，2已领取, 3无法领取
  }>('/member/promo/mystery/box/data', data)
}
/**
 * 神秘盲盒领取奖励
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=08eb643e-7e84-4db4-ad92-626f49cef6fd
 */
export function ApiMemberPromoMysteryBoxClaim(
  data: {
    activity_id: string
    claim_day: string | number
  },
) {
  return httpClient.post<{
    // 错误提示信息
    message: string
    state: number
    task_id: string
  }>('/member/promo/mystery/box/claim', data)
}
/**
 * 神秘盲盒往期记录
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=08eb643e-7e84-4db4-ad92-626f49cef6fd
 */
export function ApiMemberPromoMysteryBoxList(
  data: {
    activity_id: string
    cur: string
  },
) {
  return httpClient.post<IResponseList<{
    id: string // 用户id
    uid: string // 用户账号
    username: string // 用户账号
    vip: string
    parent_uid: string
    parent_name: string
    pid: string // 活动id
    pname: string // 活动名称
    deposit_amount: string // 存款金额
    cond_deposit_amount: string // 所需存款金额
    bonus_amount: string // 红利金额
    multiple: string
    state: number // 状态：1可领取，2已领取，3已过期，4可领取未到领取时间
    automatic: number
    remark: string // 备注信息
    currency_id: string
    start_claim_at: number
    claim_at: number
    expired_at: number
    created_at: number
  }>>('/member/promo/mystery/box/list', data)
}

/**
 * 获取U币余额
 * @see https://console-docs.apipost.cn/preview/99a2979d95a1e861/a9fd3aba36c4d54f?target_id=eb301895-a3ad-4425-a2b6-795f9f37945d
 */
export function ApiFinanceUpayBalance() {
  return httpClient.post<{
    /** C2 为成功，其他失败 */
    Code: string
    /** 失败讯息 */
    Msg: string
    /** U币的会员帐号 */
    AccountNo: number
    /** U币的会员地址 */
    Addr: string
    /** U币的会员余额 */
    Balance: string
  }>('/finance/upay/balance')
}

/**
 * 取得购买U币连结
 * @see https://console-docs.apipost.cn/preview/99a2979d95a1e861/a9fd3aba36c4d54f?target_id=88ca7fab-1bc3-4a0b-a179-1d705c67ea55
 */
export function ApiFinanceUpayGotobuy() {
  return httpClient.post<string>('/finance/upay/gotobuy')
}

/**
 * 取得IP信息
 */
export function ApiMemberLocation() {
  return httpClient.get<any>('/member/location')
}
/**
 * 任务分类列表
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=2e2e80e8ba8005
 */
export function ApiTaskCategory() {
  return httpClient.get<{
    data: {
      id: number
      category_name: string
      images: string
      state: number
    }[]
  }>('/member/job/task/category')
}

/**
 * 任务列表
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=2e2dc9e8ba8001
 */
export function ApiTaskList(category_id: string | number, curr_id: string) {
  return httpClient.get<Ref<TaskList>>(`/member/job/task/list?category_id=${category_id}&curr_id=${curr_id}`)
}

/**
 * 任务奖励领取
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=2e2f636b3a8006
 */
export function ApiTaskReveive(task_id?: string, curr_id?: string, platform_id?: number | string, ty?: number | string) {
  return httpClient.get<IResponseList<{
    task_state: number
    message: string
    state: number
  }>>(`/member/job/task/receive?task_id=${task_id}&curr_id=${curr_id}&platform_id=${platform_id}&ty=${ty}`)
}

/**
 * 获取所有待领取奖励任务
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=2e2f636b3a8006
 */
export function ApiTaskWaitFinish(data?: {
  data: {
    task_id: string
    cur: string
    platform_id: string | number
    ty: number
  }[]
}) {
  return httpClient.post<IResponseList<{
    task_state: number
    message: string
    state: number
  }[]>>('/member/job/task/batch/receive', data)
}

/**
 * 任务分类列表
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=2e2e80e8ba8005
 */
export function ApiJobTaskCategory(params: { lang: string }) {
  return httpClient.get<{
    categories: {
      id: string
      category_name: string
      state: number
    }[]
  }>('/member/job/task/category', { params })
}

/**
 * 任务列表
 * @see https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=2e2dc9e8ba8001
 */
export function ApiJobTaskList(params: { category_id: string, lang: string }) {
  return httpClient.get<{ data: TaskDetail[] }>('/member/job/task/list', { params })
}

/**
 * 任务内页
 * @see https://console-docs.apipost.cn/preview/8bd8fad84ad6e862/836fe85d40460b37?target_id=fae825f0-f80c-45a1-915d-09084e207a2a
 */
export function ApiJobTaskDetail(params: { id: string }) {
  return httpClient.post<TaskInnerDetail>('/member/job/task/detail', params)
}

/**
 * 任务领取记录
 * @see https://console-docs.apipost.cn/preview/8bd8fad84ad6e862/836fe85d40460b37?target_id=25403449-aa23-46f1-b9d3-db713752f10b
 */
export function ApiJobReceiveRecord(params: { task_id: string }) {
  return httpClient.get<TaskRecord[]>('/member/job/receive/record', { params })
}

/**
 * 任务领取
 * @see https://console-docs.apipost.cn/preview/8bd8fad84ad6e862/836fe85d40460b37?target_id=25403449-aa23-46f1-b9d3-db713752f10b
 */
export function ApiJobTaskReceive(params: { task_id: string, lang: string }) {
  return httpClient.get<{
    bonus_amount: string
    message: string
    status: number
    task_id: string
    task_state: string
  }>('/member/job/task/receive', { params })
}

/**
 * 三次被锁，解除锁定接口
 * @see https://doc.apipost.net/docs/detail/41556597b804000?target_id=15410a7fb3d08a&locale=zh-cn
 */
export function ApiMemberUnlock(
  data: {
    username?: string
    email?: string
    phone?: string
    captcha?: string
  },
) {
  return httpClient.post<string>('/member/unlock', data)
}

/**
 * 30天未登录验证接口
 * @see https://doc.apipost.net/docs/detail/416bdec570e0000?target_id=16a2335d33d0ec
 */
export function ApiMemberVerify(
  data: {
    email?: string
    phone?: string
    captcha?: string
    username: string
    password: string
  },
) {
  return httpClient.post<string>('/member/verify', data)
}

/**
 * 会员自动排除/解除自动排除
 * https://doc.apipost.net/docs/detail/308041c9bc64000?target_id=10058d40f3d016
 */
export function ApiMemberExclude(data: {
  ty: number
  captcha: string
  /* 1.排除:传时间戳 2.解除 */
  exclude: number
  /** 用户的域名 */
  domain: string
}) {
  return httpClient.post('/member/exclude', data)
}

/**
 * 关闭账户待领取金额
 */
export function ApiAccountMoney() {
  return httpClient.get('/member/balance/close/detail')
}

/**
 * 关闭账户转入钱包
 */
export function ApiTransferMoneyToWallet() {
  return httpClient.post('/member/balance/close/transfer')
}

/**
 * 关闭账户
 */
export function ApiCloseAccount(data: {
  remark: string
  reasonIds: number[]
  domain: string
  // skip_key: string
}) {
  return httpClient.post('/member/balance/close/account', data)
}

/**
 * 关闭账户放弃奖金提现
 */
export function ApiGiveUpBonus() {
  return httpClient.post<{ skip_key: string, uid: string }>('/member/balance/close/skip')
}

/**
 * 保存cpf
 */
export function ApiMemberCPFUpdate(cpf: string) {
  /** state:1表示已存在 */
  return httpClient.post<{ state: number, cpf: string }>('/member/cpf/update', { cpf })
}

/**
 * 自我排除发送邮件
 */
export function ApiExcludeSendMailCode(data: {
  email: string
}) {
  return httpClient.post<string>('/member/send/mail/self', data)
}

/**
 * 用户kyc信息
 */
export function ApiMemberKYCInfo() {
  return httpClient.get<{
    uid: string
    cpf_number: string
    /**  0:默认 1:待验证 2:不在黑名单中 3:在黑名单中 */
    cpf_state: number
    kyc_state: number
    cpf_info: string
    kyc_info: string
    created_at: number
  }>('/member/kyc/info')
}

/**
 * 注册时检测CPF是否可用
 */
export function ApiMemberCPFInfo(cpf: string) {
  return httpClient.get<{
    uid: string
    cpf_number: string
    /**  0:默认 1:待验证 2:不在黑名单中 3:在黑名单中 */
    cpf_state: number
    kyc_state: number
    cpf_info: string
    kyc_info: string
    created_at: number
  }>(`/member/cpf/info?cpf_number=${cpf}`)
}

/**
 * 兑换码领取奖励
 */
export function ApiMemberExchangeClaim(params: { code: string, curr_id: string }) {
  return httpClient.get<{
    /** 1领取成功,2兑换码过期,3兑换码已领取,4兑换码被其他用户使用,5兑换码不存在 */
    state: number
    /** 数据金额 */
    amount: string
  }>('/member/exchange/claim', { params })
}

/**
 * 获取会员答谢礼状态
 */
export function ApiMemberPromoMemberAppreciationDetail(params: {
  pid: string | number
  uid: string
  currency: CurrencyCode
}) {
  return httpClient.get<MemberAppreciationDetail>('/member/promo/member/appreciation/detail', { params })
}

/**
 * 获取会员答谢礼领取
 */
export function ApiMemberPromoMemberAppreciationClaim(params: {
  pid: string | number
  uid: string
  currency: CurrencyCode
}) {
  return httpClient.get<{
    status: boolean
    data: string
  }>('/member/promo/member/appreciation/claim', { params })
}

/*
 * 邀请好友活动详情 配置
 * @see https://console-docs.apipost.cn/preview/d60075210ac6b1a9/84df38bcb0d3b8cd?target_id=9ba4805c-4989-4971-9a44-47029b2d04e2
 */
export function ApiMemberPromoInviteFriendsDetail(params: {
  pid: string
  cur: CurrencyCode
}) {
  return httpClient.get<Record<string, any>>('/member/promo/invite/friends/detail', { params })
}

/*
 * 邀请好友活动用户数据
 * @see https://console-docs.apipost.cn/preview/d60075210ac6b1a9/84df38bcb0d3b8cd?target_id=9ba4805c-4989-4971-9a44-47029b2d04e2
 */
export function ApiMemberPromoInviteFriendsData(data: {
  activity_id: string
  cur: CurrencyCode
}) {
  return httpClient.post<Record<string, any>>('/member/promo/invite/friends/data', data)
}

/*
 * 邀请好友活动获取奖金
 * @see https://console-docs.apipost.cn/preview/d60075210ac6b1a9/84df38bcb0d3b8cd?target_id=9ba4805c-4989-4971-9a44-47029b2d04e2
 */
export function ApiMemberPromoInviteFriendsClaim(data: {
  activity_id: string
  cur: CurrencyCode
}) {
  return httpClient.post<Record<string, any>>('/member/promo/invite/friends/claim', data)
}

/*
 * 邀请好友活动邀请记录
 * @see https://console-docs.apipost.cn/preview/d60075210ac6b1a9/84df38bcb0d3b8cd?target_id=9ba4805c-4989-4971-9a44-47029b2d04e2
 */
export function ApiMemberPromoInviteFriendsList(data: {
  page: number
  page_size: number
  activity_id: string
  cur: string
  time_type: number
}) {
  return httpClient.post<Record<string, any>>('/member/promo/invite/friends/list', data)
}

/*
 * 邀请好友活动存款记录
 * @see https://console-docs.apipost.cn/preview/d60075210ac6b1a9/84df38bcb0d3b8cd?target_id=9ba4805c-4989-4971-9a44-47029b2d04e2
 */
export function ApiMemberPromoInviteFriendsDepositList(data: {
  page: number
  page_size: number
  id: string
}) {
  return httpClient.post<Record<string, any>>('/member/promo/invite/friends/deposit/list', data)
}

/*
 * 邀请好友活动投注记录
 * @see https://console-docs.apipost.cn/preview/d60075210ac6b1a9/84df38bcb0d3b8cd?target_id=9ba4805c-4989-4971-9a44-47029b2d04e2
 */
export function ApiMemberPromoInviteFriendsBetList(data: {
  page: number
  page_size: number
  id: string
}) {
  return httpClient.post<Record<string, any>>('/member/promo/invite/friends/bet/list', data)
}

/**
 * 会员vip基础配置活动详情
 */
export function ApiMemberVipDetail(params: { lang: string }) {
  return httpClient.get<{
    key: string
    value: string
    ty: number
  }>('/member/vip/detail', { params })
}

/**
 * pwa弹窗关闭调用
 */
export function ApiOnPwaDialogClose(params: { lang: string }) {
  return httpClient.post<{
    status: string
    data: string
  }>('/member/pwa/popup/remove', { params })
}

/*
 * 集字活动配置
 */
export function ApiWordCollectionConfig(params: {
  pid: number
  cur: string
}) {
  return httpClient.get<ApiWordCollectionConfigRes>('/member/promo/wordle/detail', { params })
}

/*
 * 集字活动记录
 */
export function ApiWordCollectionRecord(params: {
  pid: number
  cur: string
}) {
  return httpClient.get<ApiWordCollectionRecordRes>('/member/promo/wordle/record', { params })
}

/*
 * 集字活动旋转
 */
export function ApiWordCollectionRoll() {
  return httpClient.get<{
    key: string
    value: string
    ty: number
  }>('/member/promo/wordle/roll')
}

/*
 * 集字活动领取
 */
export function ApiWordCollectionClaim() {
  return httpClient.get<{
    key: string
    value: string
    ty: number
  }>('/member/promo/wordle/claim')
}

/**
 * 自我排除 -- 投注限额 新增
 */
export function ApiMemberBetLimitInsert(data: {
  /** 周期 1日 2周 3月  */
  type: number //
  /** 限制类型 1下注 2损失 */
  limit_type: number //
  /** 限制数目，USDT */
  limit_amount: string
}) {
  return httpClient.post('/member/bet/limit/insert', data)
}

/**
 * 自我排除 -- 投注限额 列表
 */
export function ApiMemberBetLimitList() {
  return httpClient.get<{
    d: {
      id: string
      uid: string
      username: string
      /** 0 删除 1正常 */
      status: number
      /** 类型 1=日, 2=周, 3=月 */
      type: number
      /** 限制额度 */
      limit_amount: string
      /** 限制类型 1下注 2损失 */
      limit_type: number
      /** 当前额度 */
      now_amount: string
    }[]
  }>('/member/bet/limit/list')
}

/**
 * 自我排除 -- 投注限额编辑
 */
export function ApiMemberBetLimitUpdate(data: {
  id: string
  /** 0 删除 1正常 */
  status: number
  /** 限制额度 更新时传新的值 */
  limit_amount: string
}) {
  return httpClient.post('/member/bet/limit/update', data)
}

/**
 * 自我排除 -- 存款限额列表
 */
export function ApiMemberLimitBalanceConfig() {
  return httpClient.get<{
    cfg: {
      id: string
      /** 配置类型 1:每日 2:每周, 3:每月 */
      cfg_type: string
      /** 限制金额 */
      limit_amount: string
      /** 进度 */
      progress: string
      /** 剩馀金额 */
      left_amount: string
      /** 已存款金额 */
      already_amount: string
      created_at: number
      updated_at: number
      deleted_at: number
    }[]
    balance: {
      uid: string
    } & {
      [k in EnumCurrencyKey]?: string
    }
    total_balance: string
  }>('/member/limit/balance/config')
}

/**
 * 自我排除 -- 存款限额新增
 */
export function ApiMemberLimitBalanceConfigInsert(data: {
  /** 配置类型 1:每日 2:每周, 3:每月 */
  cfg_type: string
  /** 限制金额 */
  limit_amount: string
}) {
  return httpClient.post('/member/limit/balance/config/insert', data)
}

/**
 * 自我排除 -- 存款限额删除
 */
export function ApiMemberLimitBalanceConfigDelete(data: { id: string }) {
  return httpClient.post('/member/limit/balance/config/delete', data)
}

/**
 * 自我排除 -- 暂停投注
 */
export function ApiMemberStopBet(data: {
  ty: number
  captcha: string
  /* 时间戳 */
  stop_bet: number
  /** 用户的域名 */
  domain: string
}) {
  return httpClient.post('/member/stop_bet', data)
}
