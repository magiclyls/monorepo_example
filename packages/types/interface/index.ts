/** 后端返回数组时候的数据结构 */
export interface IResponseList<T> {
  d: T[]
  t: number
  s: number
  [k: string]: any
  sums: {
    platform_id: string
    venue_id: string
    platform_name: string
    total: number
  }[]
}
