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
  sortType: string
  platformOptions: IPlatformOptions[]
}
defineOptions({
  name: 'AppGroupFilter',
})
const props = defineProps<Props>()

const emit = defineEmits(['sortTypeChange', 'platTypeChecked'])

const { t } = useI18n()
const { appContentWidth } = storeToRefs(useWindowStore())
const { push } = useLocalRouter()
const {
  bool: isPopperOpen,
  setTrue: setPopperOpen,
  setFalse: setPopperClose,
} = useBoolean(false)

const groupFilterOuter = ref()
const selectValue = ref(props.sortType)
const selectOptions = [
  { icon: '', label: 'A-Z', value: EnumCasinoSortType.nameA },
  { icon: '', label: 'Z-A', value: EnumCasinoSortType.nameZ },
  {
    icon: 'chess-bonus-rounds',
    label: t('meibo_exclusive_top_right_drop_down_menu_popular'),
    value: EnumCasinoSortType.hot,
  },
  {
    icon: 'chess-slot-machine',
    label: t('casino_sort_featured'),
    value: EnumCasinoSortType.recommend,
  },
]
const platformCheckedValues = ref([])
const _platformOptions = ref<IPlatformOptions[]>(cloneDeep(props.platformOptions))

const isProvider = computed(() => false) // props.gameType === 'provider' 供应商

function onSortSelect(v: string) {
  emit('sortTypeChange', v)
}
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

watch(() => props.sortType, (a) => {
  if (selectValue.value !== a)
    selectValue.value = a
})
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
      <template v-if="!isProvider">
        <div class="flex-center-bet title">
          <IconUniBars />
          <span class="txt">{{ $t('casino_filter_label') }}</span>
        </div>
        <div>
          <VDropdown
            placement="bottom" @hide="setPopperClose"
            @show="setPopperOpen"
          >
            <BaseButton size="sm" class="btn-default" bg-style="primary">
              <div class="btn-arrow-down">
                <span>{{ $t('h5_pop_up_menu_meibo_exclusives_casino_game_provider') }}</span>
                <!-- <BaseBadge
                  :count="platformOptions.length"
                  mode="active" :max="99999"
                /> -->
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
                          <BaseBadge :count="item.count" :max="10000" :mode="item.isChecked ? 'active' : 'black'" />
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
      </template>
      <template v-else>
        <BaseButton
          bg-style="dark"
          size="md"
          round
          @click="push('/casino/collection/provider')"
        >
          {{ $t('casino_filter_provider_all') }}
        </BaseButton>
      </template>
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
  @include webTheme('greenblack') {
      background-color: var(--tg-secondary-grey);
      color: var(--tg-popper-color-default);
      border-top: 1px solid #bbb;
  }
  @include webTheme('white') {
      background-color: #e8e8e8;
      color: #484848;
      border-top: 1px solid #bbb;
  }
}
.btn-default:not(.primary){
    @include webTheme('white') {
      background-color: var(--tg-secondary-grey);
      color: var(--tg-secondary-light);

      .icon{
        --tg-icon-color:#000000;
      }
    }
  }
.base-check-pop-inner {
  padding: var(--tg-spacing-button-padding-horizontal-xs);
  display: flex;
  flex-direction: column;
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
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
}

// 排序
.flex-center-bet {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include webTheme('green'){
  --tg-base-button-style-bg: #197B59;
  }
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

  .icon{
    display: flex;
    align-items: center;
    justify-content: center;
    // transition: var(--tg-transition);
    font-size: var(--tg-font-size-default);
    --tg-icon-color:#000000;
    &.up{
      transform: rotate(180deg);
    }
    @include webTheme('white') {
      --tg-icon-color: white;
    }
  }
}

.sort {
  --tg-icon-color: var(--tg-secondary-main);
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-input-padding-vertical);
  }

  .label {
    text-align: left;
    flex: 1;
  }

  &.active {
    color: var(--tg-text-blue);
    --tg-icon-color: var(--tg-text-blue);
  }
}
</style>
