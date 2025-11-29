# PhBaseToast 组件

#### 函数调用

- import { Message } from '@tg/utils/message'
- Message.success('操作成功！', 2000)

- ts:
- Message.success(
  h(
  'div',
  { class: 'flex items-center gap-[4rem]' },
  [
  h(BaseIcon, {
  name: 'uni-error',
  style: '--tg-base-icon-color: #fff',
  }),
  h('span', {class: 'whitespace-nowrap'}, '每次投注最多1000.00'),
  h(PhBaseCurrencyIcon, {
  currencyType: detail.value.currency_name,
  style: '--ph-app-currency-icon-size:14rem',
  }),
  ]
  )
  , 100000)
  - tsx:
  - Message.info(
      <div class="flex items-center gap-[4rem]">
        <BaseIcon name="uni-copy" style="--tg-base-icon-color: #fff"/>
        <span>{ t('复制成功') }</span>
        <PhBaseCurrencyIcon currency-type={detail.value.currency_name as EnumCurrencyKey} style="--ph-app-currency-icon-size:14rem" />
      </div>
    )

## Props

| 名称     | 类型     | 默认值 | 说明       |
| -------- | -------- | ------ | ---------- | ------ |
| msg      | `string` | Vnode  | ``         | `消息` |
| duration | `number` | `2000` | `显示时间` |

## Slot

默认 内容

## Event

无
