import type { EnumCurrencyKey } from '@tg/types'
import type { PropType } from 'vue'
import { AfunBaseCurrencyIcon } from '@tg/bccomponents'
import { languageConfig } from '@tg/types'
import { formatAmountFunc, getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { computed, defineComponent, ref } from 'vue'

const { VITE_SITE_NAME } = getEnv()
/** 金额位置索引 */
let amount_index = 0

const AppPromotionBaseRuleText = defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
    currencyType: {
      type: String as PropType<EnumCurrencyKey>,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    /** 转盘活动旋转次数 */
    freetimes: {
      type: String,
      required: false,
      default: '0',
    },
    replaceType: {
      type: String,
      required: false,
      default: '0',
    },
    amountArr: {
      type: Array<string | number>,
      required: false,
    },
    ruleArray: {
      type: Array<string | number>,
      required: false,
    },
    isLogin: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props) {
    const userLanguage = ref(getLang())
    const isLogin = computed(() => props.isLogin)
    // 金额货币要插入的地方
    const regex = /(\d+(\.\d+)?%?\s?)?[A-Za-z]{1,7}\${2,}currency\$\$/g
    const regexCur = /[A-Za-z]{1,7}\${2,}currency\$\$/g
    const regexVar1 = /\${2,}variable1\$\$/g
    const regexVar2 = /\${2,}variable2\$\$/g
    const regexVar3 = /\${2,}variable3\$\$/g
    const regexVar4 = /\${2,}variable4\$\$/g
    const str = computed(() => props.content?.replace('$$site_name$$', VITE_SITE_NAME.toUpperCase())?.replace(/\d*\$\$freetimes\$\$/, props.freetimes.toString()))
    const currencyStr = computed(() => {
      const target = str.value.match(regex)
      return target ? target[0] : null
    })
    const langCurrencyType = computed(() => languageConfig[userLanguage.value]?.currency)
    const currencyType = computed(() => props.currencyType)
    const amount = computed(() => props.amount)
    const renderAppIcon = () => {
      return currencyType.value
        ? (
            <>
              {amount.value}
              <AfunBaseCurrencyIcon v-if={isLogin.value} class="mx-[3px] translate-y-[2px]" style="--ph-app-currency-display:inline-flex;--tg-app-currency-icon-style-margin: 0 3px; display: inline-flex;" currencyType={currencyType.value}></AfunBaseCurrencyIcon>
            </>
          )
        : ''
    }
    const renderAppIconTwo = (matchedStr: string) => {
      const curArr = matchedStr.match(regexCur)
      let cur_amount, cur_currency
      if (curArr && curArr.length) {
        cur_amount = matchedStr.split(curArr[0]).join('')
        if (props.amountArr && props.amountArr.length) {
          if (props.amountArr[amount_index] !== undefined)
            cur_amount = props.amountArr[amount_index]
          amount_index++
        }
        cur_currency = curArr[0].split('$$currency$$').join('') as EnumCurrencyKey
        cur_currency = cur_currency === langCurrencyType.value ? currencyType.value : cur_currency
        return (
          <>
            <span class="ml-[3px]">{cur_amount ? formatAmountFunc(`${cur_amount}`, cur_currency) : ''}</span>
            <AfunBaseCurrencyIcon v-if={isLogin.value} class="mx-[3px] translate-y-[2px]" style="--ph-app-currency-display:inline-flex;--tg-app-currency-icon-style-margin: 0 3px; display: inline-flex;" currencyType={cur_currency}></AfunBaseCurrencyIcon>
          </>
        )
      }
      return matchedStr
    }

    const renderAppIconThird = (matchedStr: string) => {
      const curArr = matchedStr.match(regexCur)
      let cur_amount, cur_currency
      if (curArr && curArr.length) {
        cur_amount = matchedStr.split(curArr[0]).join('')
        if (props.amountArr && props.amountArr.length) {
          if (props.amountArr[amount_index] !== undefined)
            cur_amount = props.amountArr[amount_index]
          amount_index++
        }
        cur_currency = curArr[0].split('$$currency$$').join('') as (EnumCurrencyKey | 'NOW')

        cur_currency = cur_currency === 'NOW' ? currencyType.value : cur_currency
        return (
          <>
            <span class="ml-[3px]">{cur_amount ? formatAmountFunc(`${cur_amount}`, cur_currency) : ''}</span>
            <AfunBaseCurrencyIcon v-if={isLogin.value} class="mx-[3px] translate-y-[2px]" style="--ph-app-currency-display:inline-flex;--tg-app-currency-icon-style-margin: 0 3px; display: inline-flex;" currencyType={cur_currency}></AfunBaseCurrencyIcon>
          </>
        )
      }
      return matchedStr
    }
    const renderAppIconFourth = (matchedStr: string) => {
      const curArr = matchedStr.match(regexCur)
      let cur_amount, cur_currency
      if (curArr && curArr.length) {
        cur_amount = matchedStr.split(curArr[0]).join('')
        cur_currency = curArr[0].split('$$currency$$').join('') as EnumCurrencyKey
        cur_currency = langCurrencyType.value ? currencyType.value : cur_currency
        return (
          <>
            <span class="ml-[3px]">{cur_amount ? formatAmountFunc(`${cur_amount}`, cur_currency) : ''}</span>
            <AfunBaseCurrencyIcon v-if={isLogin.value} class="mx-[3px] translate-y-[2px]" style="--ph-app-currency-display:inline-flex;--tg-app-currency-icon-style-margin: 0 3px; display: inline-flex;" currencyType={cur_currency}></AfunBaseCurrencyIcon>
          </>
        )
      }
      return matchedStr
    }
    const replacedStr = () => {
      const divArr = str.value?.split('\n').filter(a => a.trim().length > 0)
      return (
        <ul class="w-full flex flex-col list-disc pl-[14px]">
          {
            divArr?.map((line, didx) => {
              let temp
              if (props.replaceType === '0') {
                temp = (
                  <span>
                    {
                      currencyStr.value
                        ? line.trim().split(currencyStr.value).map((item, index) => {
                            return (
                              <>
                                {item}
                                {index === line.split(currencyStr.value!).length - 1 ? '' : renderAppIcon()}
                              </>
                            )
                          })
                        : line.trim()
                    }
                  </span>
                )
              }
              else if (props.replaceType === '3') {
                const _line1 = line.trim().replace(regexVar1, props.amountArr && props.amountArr[0] ? props.amountArr[0] as string : '')
                const _line2 = _line1.replace(regexVar2, props.amountArr && props.amountArr[1] ? props.amountArr[1] as string : '')
                const _line3 = _line2.replace(regexVar3, props.ruleArray && props.ruleArray[0] ? props.ruleArray[0] as string : '')
                const _line4 = _line3.replace(regexVar4, props.ruleArray && props.ruleArray[1] ? props.ruleArray[1] as string : '')
                const matchedArr = _line4.trim().match(regex)
                let newLine = _line4.trim()
                if (matchedArr && matchedArr.length) {
                  matchedArr.forEach((mtm) => {
                    newLine = newLine.replace(mtm, '[[[AppAmount]]]')
                  })
                }
                const nArr = newLine.split('[[[AppAmount]]]')
                temp = (
                  <span>
                    {matchedArr && matchedArr.length
                      ? nArr.map((ntm, ndx) => {
                          return (
                            <>
                              {ntm}
                              {ndx === nArr.length - 1 ? '' : renderAppIconFourth(matchedArr[ndx])}
                            </>
                          )
                        })
                      : _line4.trim()}
                  </span>
                )
              }
              else {
                const matchedArr = line.trim().match(regex)
                let newLine = line.trim()
                if (matchedArr && matchedArr.length) {
                  matchedArr.forEach((mtm) => {
                    newLine = newLine.replace(mtm, '[[[AppAmount]]]')
                  })
                }
                const nArr = newLine.split('[[[AppAmount]]]')
                temp = (
                  <span>
                    {matchedArr && matchedArr.length
                      ? nArr.map((ntm, ndx) => {
                          return (
                            <>
                              {ntm}
                              {ndx === nArr.length - 1 ? '' : (props.replaceType === '1' ? renderAppIconTwo(matchedArr[ndx]) : renderAppIconThird(matchedArr[ndx]))}
                            </>
                          )
                        })
                      : line.trim()}
                  </span>
                )
              }
              if (didx === divArr.length - 1) {
                amount_index = 0
                return (
                  <li>
                    {temp}
                  </li>
                )
              }
              return (
                <li class="mb-[6px]">
                  {temp}
                </li>
              )
            })
          }
        </ul>
      )
    }

    return () => <div class="text-[#B1BAD3] w-full text-[14px] font-[600] leading-[1.5]">{replacedStr()}</div>
  },
})

export default AppPromotionBaseRuleText
