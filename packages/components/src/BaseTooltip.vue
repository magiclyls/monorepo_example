<script lang="ts" setup>
import { toRefs, ref, StyleValue, type Ref } from 'vue'
import { usePopper } from '../usePopper'
import type { PartialOptions } from '../usePopper'

interface Props {
  content: string
  placement?:'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
  trigger?: 'hover' | 'click' 
  /*出现位置的偏移量*/
  offset? : number
  showArrow? : boolean 
} 



defineOptions({name: 'BaseTooltip'})

const props = withDefaults(defineProps<Props>(), {
  trigger: 'hover',
  offset: 12,
  showArrow: true,
  placement: 'top'
})

const target = ref<HTMLElement>()
const popperEl = ref<HTMLElement>()
const options = ref<PartialOptions>({
  placement: props.placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, props.offset]
      },
    }
  ]
})
const { state, styles, attributes } = usePopper(target, popperEl, options)
const fixStyles = styles as unknown as { popper:StyleValue, arrow: StyleValue}


const visible = ref(false)

const handleMouseEnter = () => {
  visible.value = true;
};

const handleMouseLeave = () => {
  visible.value = false;
};

const handleClick = () => {
  visible.value = !visible.value;
};
</script>

<template>
  <div 
    ref="target"
    @mouseenter="trigger === 'hover' && handleMouseEnter()"
    @mouseleave="trigger === 'hover' && handleMouseLeave()"
    @click="trigger === 'click' && handleClick()"
  >
    <slot></slot>
  </div>
  <Teleport to="body">
    <transition name="">
      <div 
        v-if="visible" 
        ref="popperEl" 
        class="base-tooltip"
        v-bind="attributes.popper"
        :style="fixStyles.popper"
      >
        <div class="base-tooltip__content">
          {{ content }}
          <div 
            v-if="showArrow" 
            class="base-tooltip__arrow"
            :style="fixStyles.arrow"
            :data-popper-arrow="placement"
          ></div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style>
.base-tooltip {
  z-index: 2000;
}

.base-tooltip__content {
  background: #3a4142;
  color: #fff;
  padding: .5rem;
  border-radius: .5rem;;
  font-size: .875rem;
  line-height: 1.25rem;
}

.base-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  z-index: -1;
  border: 0.25rem solid #3a4142;
}

[data-popper-placement^='top'] .base-tooltip__arrow {
  bottom: -0.25rem;
  border-left-color: transparent; 
  border-right-color: transparent; 
  border-bottom: none; 
}

[data-popper-placement^='bottom'] .base-tooltip__arrow {
  top: -0.25rem;
  transform: rotate(-135deg);
}

[data-popper-placement^='left'] .base-tooltip__arrow {
  right: -0.25rem;
  transform: rotate(-45deg);
}

[data-popper-placement^='right'] .base-tooltip__arrow {
  left: -0.25rem;
  transform: rotate(135deg);
}


</style>
