import type { LotteryBetItem } from '@tg/types'
import { groupSameNumbers } from '@tg/utils'

export const multiplyArr = [1, 5, 10, 20, 50, 100]

export const winGoKindId: { [key: string]: number } = {
  Balls: 101,
  Green: 102,
  Red: 103,
  Purple: 104,
  Big: 105,
  Small: 106,
}
export const winGoIdToKindMap: { [key: number]: { name: string, color: string } } = {
  // 指定号码
  // WinGoBall = 101
  // //绿色
  // WinGoGreen = 102
  // //红色
  // WinGoRed = 103
  // //紫色
  // WinGoPurple = 104
  // //大
  // WinGoBig = 105
  // //小
  // WinGoSmall = 106
  102: { name: '绿色', color: '#40AD72' },
  103: { name: '红色', color: '#F2413B' },
  104: { name: '紫色', color: '#EB43DD' },
  105: { name: '大', color: '#FFC511' },
  106: { name: '小', color: '#6DA7F4' },
}
export const trxWinGoIdToKindMap: { [key: number]: { name: string, color: string } } = {
  // 指定号码
  // WinGoBall = 101
  // //绿色
  // WinGoGreen = 102
  // //红色
  // WinGoRed = 103
  // //紫色
  // WinGoPurple = 104
  // //大
  // WinGoBig = 105
  // //小
  // WinGoSmall = 106
  502: { name: '绿色', color: '#40AD72' },
  503: { name: '红色', color: '#F2413B' },
  504: { name: '紫色', color: '#EB43DD' },
  505: { name: '大', color: '#FFC511' },
  506: { name: '小', color: '#6DA7F4' },
}
export const colorHelp: { [key: number]: { [key: string]: string } } = {
  1: {
    Green: 'green',
    Purple: 'purple',
    Red: 'red',
  },
  2: {
    0: 'zero',
    5: 'five',
  },
  3: {
    Big: 'big',
    Small: 'small',
  },
}
export const racingOddMap: { [key: number]: { [key: string]: number } } = {
  1: {
    Ball: 211,
    Big: 212,
    Small: 213,
    Odd: 214,
    Even: 215,
  },
  2: {
    Ball: 221,
    Big: 222,
    Small: 223,
    Odd: 224,
    Even: 225,
  },
  3: {
    Ball: 231,
    Big: 232,
    Small: 233,
    Odd: 234,
    Even: 235,
  },
}
export const trxWinGoKindId: { [key: string]: number } = {
  Balls: 501,
  Green: 502,
  Red: 503,
  Purple: 504,
  Big: 505,
  Small: 506,
}
export function k3IdToKindMap(key: number, $t: (key: string) => string): LotteryBetItem {
  const map: { [key: number]: LotteryBetItem } = {
    301: { label: $t('大'), bg: '#FFA82E', parent_label: $t('总和1') },
    302: { label: $t('小'), bg: '#6DA7F4', parent_label: $t('总和1') },
    303: { label: $t('单'), bg: '#1D864C', parent_label: $t('总和1') },
    304: { label: $t('双'), bg: '#40AD72', parent_label: $t('总和1') },
    305: { label: $t('2个匹配的号码'), parent_label: $t('2个相同') },
    306: { label: $t('一对独特的数字'), parent_label: $t('2个相同') },
    307: { label: $t('3个相同的数字'), parent_label: $t('3个相同') },
    308: { label: $t('任意3个相同数字'), parent_label: $t('3个相同') },
    309: { label: $t('3个不同的数字'), parent_label: $t('不同') },
    310: { label: $t('3个连续的数字'), parent_label: $t('不同') },
    311: { label: $t('2个不同的数字'), parent_label: $t('不同') },
    312: { label: $t('总和1'), parent_label: $t('总和1') },
    313: { label: $t('总和1'), parent_label: $t('总和1') },
    314: { label: $t('总和1'), parent_label: $t('总和1') },
    315: { label: $t('总和1'), parent_label: $t('总和1') },
    316: { label: $t('总和1'), parent_label: $t('总和1') },
    317: { label: $t('总和1'), parent_label: $t('总和1') },
    318: { label: $t('总和1'), parent_label: $t('总和1') },
    319: { label: $t('总和1'), parent_label: $t('总和1') },
  }

  return map[key] || { label: '' }
}
export function getLotteryBallLabel(item: any, $t: (key: string) => string) {
  // 用于历史记录中球上展示文案
  const bigEven = [301, 302, 303, 304]
  const total = [312, 313, 314, 315, 316, 317, 318, 319]
  const balls = JSON.parse(item.bet_balls)
  if (bigEven.includes(item.play_id)) {
    return k3IdToKindMap(item.play_id, $t)
  }
  else if (total.includes(item.play_id)) {
    return {
      label: balls[0],
      bg: (balls[0] % 2 === 0) ? '#40AD72' : '#1D864C',
    }
  }
  else if (item.play_id === 306) {
    return {
      label: groupSameNumbers(balls).join('|'),
      bg: '#40AD72',
    }
  }
  else if (item.play_id === 308) {
    return {
      label: '3=',
      bg: '#40AD72',
    }
  }
  else if (item.play_id === 310) {
    return {
      label: '3≠',
      bg: '#40AD72',
    }
  }
  else {
    return {
      label: balls.join(''),
      bg: '#40AD72',
    }
  }
}

export function getBetItemByLotteryData(item: any, $t: (key: string) => string, bg_img = false) {
  // 根据 play_id bet_balls生成
  const typeMap: { [key: number]: number } = {
    // type 1
    301: 1,
    302: 1,
    303: 1,
    304: 1,
    312: 1,
    313: 1,
    314: 1,
    315: 1,
    316: 1,
    317: 1,
    318: 1,
    319: 1,
    // type 2
    305: 2,
    306: 2,
    // type 3
    307: 3,
    308: 3,
    // type 4
    309: 4,
    310: 4,
    311: 4,
  }

  const K3BetType = typeMap[item.play_id] || 1
  let K3BetData: any = []
  const bigEven = [301, 302, 303, 304]
  const total = [312, 313, 314, 315, 316, 317, 318, 319]
  const balls = JSON.parse(item.bet_balls)
  if (bigEven.includes(item.play_id)) {
    K3BetData = [k3IdToKindMap(item.play_id, $t)]
  }
  else if (total.includes(item.play_id)) {
    K3BetData = [{
      label: balls[0],
      bg: (balls[0] % 2 === 0) ? '#40AD72' : '#1D864C',
      bg_img,
    }]
  }
  else if (item.play_id === 305) {
    K3BetData = {
      betArr1: [{
        label: balls.join(''),
      }],
    }
  }
  else if (item.play_id === 306) {
    K3BetData = {
      betArr2: [{
        label: groupSameNumbers(balls)[0],
      }],
      betArr3: [{
        label: groupSameNumbers(balls)[1],
      }],
    }
  }
  else if (item.play_id === 307) {
    K3BetData = {
      betArr1: [{
        label: balls.join(''),
      }],
    }
  }
  else if (item.play_id === 308) {
    K3BetData = {
      betArr2: [],
    }
  }
  else if (item.play_id === 309) {
    K3BetData = {
      betArr1: balls.map((n: number) => {
        return {
          label: n,
        }
      }),
    }
  }
  else if (item.play_id === 310) {
    K3BetData = {
      betArr2: [],
    }
  }
  else if (item.play_id === 311) {
    K3BetData = {
      betArr3: [{
        label: balls.join(''),
      }],
    }
  }

  return {
    K3BetData,
    K3BetType,
  }
}

export function getBetBallsByLotteryData(id: number, ballstr: string) {
  // 根据 play_id balls生成 betBalls
  const total = [312, 313, 314, 315, 316, 317, 318, 319]
  const balls = ballstr.split(',').map(n => Number(n))
  let result = balls
  if (total.includes(id)) {
    result = [balls.reduce((acc, curr) => acc + curr, 0)]
  }

  return `[${result.toString()}]`
}
