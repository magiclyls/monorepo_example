<script lang="ts" setup>
import { IconUniArrowDown, IconUniBars } from '@tg/icons'

interface IPlatformOptions {
  label: string
  value: string
  count: number
  isChecked: boolean
}
interface Props {
  gameType: string
  platformOptions: IPlatformOptions[]
}
defineOptions({
  name: 'AppGroupFilterInSearch',
})
const props = defineProps<Props>()
const emit = defineEmits(['platTypeChecked'])

const { appContentWidth } = storeToRefs(useWindowStore())
const {
  bool: isPopperOpen,
  setTrue: setPopperOpen,
  setFalse: setPopperClose,
} = useBoolean(false)

const groupFilterOuter = ref()
const platformCheckedValues = ref([])
const _platformOptions = ref<IPlatformOptions[]>(cloneDeep(props.platformOptions))

function onCheckedPlatform(v: string[]) {
  emit('platTypeChecked', v.join(','))
}
function resetPlatformChecked() {
  if (!platformCheckedValues.value.length)
    return
  platformCheckedValues.value = []
  _platformOptions.value = _platformOptions.value.map((a) => {
    return {
      ...a, isChecked: false,
    }
  })

  emit('platTypeChecked', '')
}

watch(() => props.platformOptions, (a) => {
  _platformOptions.value = cloneDeep(props.platformOptions)
})

defineExpose({ resetPlatformChecked })
</script>

<template>
  <section
    ref="groupFilterOuter" class="tg-app-group-filter flex-center-bet"
    :class="{ 'less-than-700': appContentWidth < 700 }"
  >
    <div class="flex-center-bet left">
      <div class="flex-center-bet title">
        <IconUniBars />
        <span class="txt">{{ $t('casino_filter_label') }}</span>
      </div>

      <!-- 只有一条数据的时候直接显示选项 -->
      <div v-if="_platformOptions.length === 1" class="pr-[8px]">
        <span class="text-tg-text-lightgrey text-[14px] font-semibold">{{ _platformOptions[0].label }}</span>
      </div>
      <div v-else>
        <VDropdown
          placement="bottom" @hide="setPopperClose"
          @show="setPopperOpen"
        >
          <BaseButton size="none" type="text">
            <div class="btn-arrow-down">
              <span>{{ $t('h5_pop_up_menu_meibo_exclusives_casino_game_provider') }}</span>
              <div class="icon" :class="{ up: isPopperOpen }">
                <IconUniArrowDown />
              </div>
            </div>
          </BaseButton>
          <template #popper="{ hide }">
            <div>
              <section class="base-check-pop-inner">
                <BaseCheckboxGroup
                  v-model="platformCheckedValues"
                  :list="_platformOptions"
                  size="mid"
                  @check="onCheckedPlatform"
                >
                  <template #default="{ item }">
                    <div
                      class="check-item-label"
                      :class="{ active: item.isChecked }"
                    >
                      <div>{{ item.label }}</div>
                      <div class="">
                        <BaseBadge
                          :count="item.count"
                          :max="10000"
                          :mode="item.isChecked ? 'active' : 'black'"
                        />
                      </div>
                    </div>
                  </template>
                </BaseCheckboxGroup>
              </section>
              <div class="clear-all" @click="resetPlatformChecked();hide()">
                {{ $t('clear_all') }}
              </div>
            </div>
          </template>
        </VDropdown>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// 游戏提供商
.clear-all {
  width: 100%;
  padding:
  var(--tg-spacing-button-padding-horizontal-xs)
  var(--tg-spacing-button-padding-vertical-xs);
  font-weight: var(--tg-font-weight-semibold);
  text-align: center;
  font-size: var(--tg-font-size-default);
  color: var(--tg-text-secondary-main);
  cursor: pointer;
  background-color: var(--tg-text-white);
  border-top: 1px solid var(--tg-text-grey-light);
  @include webTheme('green') {
      background-color: var(--tg-popper-bg);
      color: var(--tg-popper-color-default);
      border-top: 1px solid var(--tg-popper-color-default);
  }
  @include webTheme('white') {
      background-color: #f5f5f5;
      color: #111;
      border-top: 1px solid #c1c1c1;
  }
}

.base-check-pop-inner {
  padding: var(--tg-spacing-button-padding-horizontal-xs);
  display: flex;
  flex-direction: column;
  @include webTheme('green'){
    --tg-base-checkbox-group-outer-border-color:#02432D;
    --tg-base-checkbox-group-outer-border-color-active:#197B59;
    --tg-base-checkbox-group-outer-background-color-active:#197B59;
  }
}

.check-item-label {
  height: 32.4px;
  display: inline-flex;
  align-items: center;
  font-weight: var(--tg-font-weight-semibold);
  font-size: var(--tg-font-size-default);
  color: var(--tg-popper-color-default);
  transition: all 0.2s;
  letter-spacing: 0;
  padding-top: 6px;
  padding-bottom: 4px;
  justify-content: space-between;
  @include webTheme('white'){
    color:#111111;
  }
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
}

// 排序
.flex-center-bet {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tg-app-group-filter {
  width: 100%;
  color: var(--tg-text-white);
  font-size: var(--tg-font-size-default);
  line-height: 1.5;
  color: var(--tg-text-white);

  .left,
  .right {
    > *:not(:last-child) {
      margin-right: var(--tg-spacing-16);
    }

    .title {
      > *:not(:first-child) {
        margin-left: var(--tg-spacing-input-padding-vertical);
      }
    }

  }

  &.less-than-700 {
    .title {
      display: none;
    }
  }
}

.btn-arrow-down {
  font-size: var(--tg-font-size-default);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.3;
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
  @include webTheme('white'){
    color: #555;
    text-align: center;
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .icon{
    display: flex;
    align-items: center;
    justify-content: center;
    // transition: var(--tg-transition);
    font-size: var(--tg-font-size-default);
    &.up{
      transform: rotate(180deg);
    }
  }
}
</style>
