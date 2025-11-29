<script setup lang='ts'>
import { IconNavbarUserBet } from '@tg/icons'
import { ApiMemberFeedbackBonusAll, ApiMemberFeedbackInsert, ApiMemberFeedbackList, ApiMemberFeedbackUpdate } from '@tg/apis'

defineOptions({
  name: 'AppFeedback',
})
const { t } = useI18n()
const { userLanguage } = storeToRefs(useLanguageStore())
const chatStore = useChatStore()
const { userInfo } = storeToRefs(useAppStore())
const { openNotify } = useNotify()
const { openReceiveBonusDialog, closeReceiveBonusDialog } = useDialogReceiveBonus(() => {
  seeFeedback()
  closeReceiveBonusDialog()
})
const { start, stop, reset, current } = useCountDown({ time: 11000 })
const { runNotificationsCount } = useNotificationState()

const state: any = {
  1: t('deal_pend'),
  2: t('feedback_status_done'),
  3: t('feedback_status_done'),
}

const imageUrl: Ref<string[]> = ref([])
const tab = ref(1)
const feedTextarea = ref()
const placeholder = t('feedback_placeholder')
const tabList = [
  { label: t('create_feedback'), value: 1 },
  { label: t('user_feedback'), value: 2 },
]

const {
  value: feedbackText,
  errorMessage: feedbackTextError,
  validate: feedbackTextValidate,
  meta: feedbacTextMeta,
  handleBlur,
  resetField,
} = useField<string>('feedbackText', (value) => {
  if (!value)
    return t('input_feedback')
  return ''
})

const textLength = computed(() => feedbackText.value?.length ?? 0)

const {
  run: runFeedbackInsert,
  loading: feedbackInsertLoading,
} = useRequest(ApiMemberFeedbackInsert, {
  onSuccess() {
    feedbackText.value = ''
    imageUrl.value = []
    resetField()
    openNotify({
      type: 'success',
      message: t('success_submit_feedback'),
    })
    reset()
    start()
    runNotificationsCount()
  },
})
const {
  run: runFeedbackList,
  data: feedbackList,
} = useRequest(ApiMemberFeedbackList, {
  onAfter: () => {
    runNotificationsCount()
  },
})
const { run: runUpdateFeedback } = useRequest(ApiMemberFeedbackUpdate, {
  onAfter: () => {
    runNotificationsCount()
  },
})
const { run: getTotalBonus, data: totalBonus } = useRequest(ApiMemberFeedbackBonusAll)

const isDisabled = computed(() => {
  return !totalBonus.value || !(+totalBonus.value > 0) || (userInfo.value && +userInfo.value.bonus_state !== 1)
})

async function submitFeedback() {
  handleBlur()
  await feedbackTextValidate()
  if (!feedbackTextError.value)
    runFeedbackInsert({ images: imageUrl.value.length ? JSON.stringify(imageUrl.value) : '', description: removeEmojis(feedbackText.value) })
}

function feedbackItemClick(item: any) {
  if (item.newest_m > 0)
    runUpdateFeedback({ id: item.id })

  chatStore.setFeedbackItem({ ...item, feed_id: item.id })
  chatStore.setFeedbackChatTrue()
}

function seeFeedback() {
  runFeedbackList()
  getTotalBonus()
}
function tabChange() {
  tab.value === 2 && seeFeedback()
}

function openTotalBonus() {
  if (totalBonus.value && +totalBonus.value > 0)
    openReceiveBonusDialog({ totalBonus: totalBonus.value })
}

function getStatusText(s: number) {
  return state[s]
}

function removeEmojis(s: string) {
  const regex = /[\u2700-\u27BF\u3299\u3297\u303D\u3030\u24C2\u203C\u2049\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u00A9\u00AE\u2122\u2139\u2600-\u26FF\u2B05\u2B06\u2B07\u2B1B\u2B1C\u2B50\u2B55\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u2934\u2935\u2190-\u21FF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u0023-\u0039]\uFE0F?\u20E3|\uD83C[\uDD70\uDD71]|\uD83C[\uDD7E\uDD7F]|\uD83C\uDD8E|\uD83C[\uDD91-\uDD9A]|\uD83C[\uDDE6-\uDDFF]|\uD83C[\uDE01\uDE02]|\uD83C\uDE1A|\uD83C\uDE2F|\uD83C[\uDE32-\uDE3A]|\uD83C[\uDE50\uDE51]|\uD83C\uDC04|\uD83C\uDCCF/g
  return s.replace(regex, ' ')
}

function cancel() {
  resetField()
  imageUrl.value = []
}

onActivated(() => {
  runFeedbackList()
  getTotalBonus()
  // runNotificationsCount()
})

watch(feedbackText, (val, old) => {
  if (!val && old)
    feedTextarea.value?.setPlaceHolder(placeholder)
})
</script>

<template>
  <div class="scroll-y app-feedback scrollable scroll-contain notice-scroll">
    <div class="feedback-tab-wrap">
      <div class="feedback-tab-left tab-left">
        <BaseTab v-model="tab" :list="tabList" :center="false" line-style need-scroll-into-view @change="tabChange" />
      </div>
    </div>
    <div class="content-wrap">
      <div v-if="tab === 1" class="create-feedback">
        <div class="text">
          <p class="label">
            {{ t('feedback_content') }}<span class="error-text">*</span>
          </p>
          <BaseTextarea ref="feedTextarea" v-model="feedbackText" :placeholder="placeholder" class="h-[140px]"
            @blur="handleBlur" />
          <p class="length">
            <span class="error" :class="{ show: feedbacTextMeta.touched }">{{ feedbackTextError }}</span>
            <span>{{ textLength }}/200</span>
          </p>
        </div>
        <div class="img-video">
          <p class="label">
            {{ t('image') }}
          </p>
          <div class="file">
            <BaseUpload v-model="imageUrl" :much="5" img-type="common" is-webp :size="1"
              :accept="['image/png', 'image/jpg', 'image/jpeg']" />
          </div>
          <div class="tips">
            {{ t('image_upload_tip') }}
          </div>
        </div>
        <div class="rule">
          <p class="label">
            {{ t('bonus_rule') }}
          </p>
          <div class="rule-text">
            {{ t('feedback_bonus_tip') }}
          </div>
        </div>
        <div class="buts feedback-footer-button">
          <BaseButton class="feedback-cancel" type="line" size="sm" @click="cancel">
            {{ t('cancel') }}
          </BaseButton>
          <BaseButton :disabled="current.seconds > 0 && current.seconds < 11" bg-style="secondary" size="sm"
            :loading="feedbackInsertLoading" @click="submitFeedback">
            {{ t('submit') }} <span v-if="current.seconds > 0 && current.seconds < 11">({{ current.seconds }}s)</span>
          </BaseButton>
        </div>
      </div>
      <div v-else class="feedback-list">
        <div class="total-bonus feedback-list-top">
          <span>{{ t('bonus_not_apply') }}：</span>
          <span class="green money">{{ totalBonus }}
          </span>
          <BaseImage url="/png/icon/coin-usdt.png" width="14px" height="14px" />
          <BaseButton class="receive-btn" bg-style="primary" style="
            --tg-base-button-padding-y: var(--tg-spacing-6);
            --tg-base-button-padding-x: var(--tg-spacing-10);" custom-padding round :disabled="isDisabled"
            @click="openTotalBonus">
            {{ t('receive') }}
          </BaseButton>
        </div>
        <template v-if="feedbackList?.d?.length">
          <div v-for="item, index in feedbackList?.d" :key="index" class="msg-item" :class="[userLanguage]"
            @click="feedbackItemClick(item)">
            <div class="line">
              <div>
                {{ t('feedback_status') }}：<span :style="{
                  color: item.state === 1
                    ? 'var(--app-feedback-text-color)'
                    : 'var(--tg-text-white)',
                }">
                  {{ getStatusText(item.state) }}
                </span>
              </div>
              <div class="unread" :style="{
                color: item.newest_m !== 0
                  ? 'var(--tg-text-lightgrey)'
                  : 'var(--tg-text-white)',
              }">
                {{ item.newest_m !== 0 ? t('message_has_unseen') : t('message_seen') }}
                <div v-if="item.newest_m !== 0" />
              </div>
            </div>
            <div class="line">
              <div class="text-overflow-hide">
                {{ t('feedback') }} ID: <span>{{ item.id }}</span>
              </div>
              <div class="text-overflow-hide color1">
                {{ dayjs(item.created_at * 1000).format('MM/DD HH:mm') }}
              </div>
            </div>
            <div class="text-overflow-hide leading-tight">
              {{ t('content_text') }}: {{ item.description }}
            </div>
          </div>
        </template>
        <template v-else>
          <BaseEmpty :description="t('no_content')" icon="navbar-user-bet" style="padding-top: 100px;">
            <template #icon>
              <IconNavbarUserBet width="14px" height="14px" />
            </template>
          </BaseEmpty>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --app-feedback-text-color: var(--tg-text-warn);
}

[theme='greenblack'] {
  --app-feedback-text-color: var(--tg-text-greenblack-main);
}

[theme='green'] {
  --app-feedback-text-color: #1fff20;
}

[theme='white'] {
  --app-feedback-text-color: #ff9800;
}
</style>

<style lang='scss' scoped>
.color1 {
  @include webTheme('green') {
    color: #3cb389;
  }
}

.error-text {
  font-size: var(--tg-font-size-xl);
  color: var(--tg-text-error) !important;
  line-height: 0;
  vertical-align: middle;
}

.total-bonus {
  cursor: pointer;
  color: var(--tg-text-white);
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);
  margin-top: var(--tg-spacing-16);
  display: inline-flex;
  align-items: center;

  @include webTheme('green') {
    --tg-primary-active: #42bc91;
    --tg-text-green-btn: #fff;
    --tg-base-button-primary-hover: #42bc91;
  }

  .money {
    color: var(--app-feedback-text-color);
    margin-right: 5px;
  }

  svg,
  button {
    margin-left: var(--tg-spacing-12);
    vertical-align: middle;
  }

  button {
    margin-left: var(--tg-spacing-12);
  }
}

.app-feedback {
  white-space: pre-line;
  padding: var(--tg-spacing-16) var(--tg-spacing-16);

  .feedback-tab-wrap {
    display: flex;
    justify-content: space-between;
    line-height: 28px;
    min-height: 28px;

    .tab-left,
    .tab-right {
      display: flex;
      align-items: center;
      gap: 12px;
      --tg-tab-style-color: var(--tg-text-lightgrey);
      --tg-tab-style-line-active-text-color: var(--tg-text-white);
      --tg-tab-style-inner-padding-y: var(--tg-spacing-1);
      --tg-tab-style-box-padding: 0;

      @include webTheme('green') {
        --tg-tab-style-active-bg: #055434;
      }
    }

    .tab-right {
      p:nth-child(1) {
        color: var(--tg-text-green);
      }
    }

    .tab-btn {
      padding: var(--tg-spacing-6) var(--tg-spacing-10) !important;
      border-radius: 100px;
      width: 78px;
    }
  }

  .content-wrap {
    .create-feedback {

      .text,
      .img-video,
      .rule {
        .label {
          font-size: var(--tg-font-size-base);
          color: var(--tg-text-white);

          span {
            color: var(--tg-text-lightgrey);
          }

          margin-bottom: var(--tg-spacing-8);
          margin-top: var(--tg-spacing-16);
        }

        textarea {
          width: 100%;
          background: var(--tg-primary-main);
          padding: var(--tg-spacing-12);
          border-radius: var(--tg-radius-default);
          font-size: var(--tg-font-size-xs);
          color: var(--tg-text-lightgrey);
          border: var(--tg-border-width-sm) solid var(--tg-border-color-main);
          transition: var(--tg-transition);

          @include webTheme('white') {
            color: #111;
          }

          @include webTheme('green') {
            background: #055434;
            border-color: #197b59;
            color: white;
          }

          &:hover {
            border-color: var(--tg-border-color-deep-grey);

            @include webTheme('green') {
              border-color: #3cb389;
            }
          }

          &:focus {
            outline: none;
          }
        }

        .length {
          width: 100%;
          color: var(--tg-text-lightgrey);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;

          .error {
            color: var(--tg-text-error);
            font-size: var(--tg-font-size-xs);
            opacity: 0;

            &.show {
              opacity: 1;
            }
          }
        }

        // .file{
        //   width: 80px;
        //   height: 80px;
        // }
        .tips {
          margin-top: var(--tg-spacing-8);
          font-size: var(--tg-font-size-xs);
          color: var(--tg-text-lightgrey);

          @include webTheme('green') {
            --tg-text-lightgrey: #76f0c5;
          }
        }

        .rule-text {
          font-size: var(--tg-font-size-xs);
          line-height: 17px;
          color: var(--tg-text-lightgrey);

          @include webTheme('green') {
            --tg-text-lightgrey: #76f0c5;
          }
        }
      }

      .buts {
        margin-top: 16px;
        display: flex;
        gap: var(--tg-spacing-12);

        button {
          flex: 1;
        }
      }
    }

    .feedback-list {
      color: var(--tg-text-white);

      .msg-item {
        display: flex;
        flex-direction: column;
        gap: var(--tg-spacing-12);
        padding: var(--tg-spacing-12);
        background: var(--tg-secondary-main);
        margin-top: 16px;
        border-radius: var(--tg-radius-default);
        font-size: var(--tg-font-size-default);
        cursor: pointer;

        &.th-TH {
          line-height: 24px;
          gap: var(--tg-spacing-0);
        }

        .line {
          display: flex;
          justify-content: space-between;
        }

        .state {
          color: var(--app-feedback-text-color);
        }

        .unread {
          position: relative;

          div {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            z-index: 1;
            background: var(--tg-primary-success);
            animation: OnlineFlash 0.2s ease-out;
            position: absolute;
            transform: translate(-50%, -50%);
            margin-left: -6px;
            top: 50%;
            left: 0;
          }
        }

        .text-overflow-hide {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          span {
            color: var(--tg-text-white);
          }
        }

        @include webTheme('green') {
          --tg-secondary-main: #055434;
        }

        @include webTheme('white') {
          background-color: #f5f5f5;
          color: #555;
        }
      }

      @include webTheme('green') {
        --tg-text-lightgrey: #42bc91;
      }
    }
  }
}

.app-feedback {
  @include webTheme('green') {
    .feedback-tab-left {
      --tg-primary-active: var(--tg-tab-item-active);
    }

    .feedback-footer-button {
      --tg-base-button-line-border-color: var(--tg-border-color-main);

      .feedback-cancel {
        color: var(--tg-text-placeholder);
      }
    }

    .feedback-list-top {
      --app-feedback-text-color: var(--tg-primary-success);
      --tg-primary-button-active: var(--tg-tab-item-active);
      --tg-text-green-btn: var(--tg-primary-main);
    }
  }
}
</style>
