<script lang="ts" setup name="base-loading">
defineOptions({
  name: 'BaseLoading',
})
const isFlutter = computed(() => isFlutterApp())
</script>

<template>
  <!-- <object type="image/svg+xml" data="/img/base-loading.svg" class="h-[12px] w-[76px]" /> -->
  <div class="relative" :class="[isFlutter && 'opacity-0']">
    <div class="loader top-[46%]">
      <div class="loader-animation" />
    </div>

    <div class="loader-wrap">
      <div class="wrap">
        <div class="content">
          <div class="loader top-[46%]">
            <div class="loader-animation" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0
}

.content {
    position: relative;
    height: 100%;
    width: 100%
}

.loader-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center
}

.loader {
    width: 4.75rem;
    height: .75rem;
    background-color: var(--tg-secondary-main); // var(--grey-400);
    left: 50%;
    transform: translate(-50%,-50%);
    position: absolute;
    border-radius: 4rem;
    @include webTheme('green'){
     background-color:#02432D;
    }
}

.loader .loader-animation {
    border-radius: 4rem;
    position: absolute;
    background-color: white; // var(--white);
    @include webTheme('green'){
     background-color:#1FFF20;
    }
    top: .125rem;
    bottom: .125rem;
    animation: loader-slide .8s infinite;
    will-change: left,right
}

.loader .loader-animation.no-animation-chromatic {
    animation-play-state: paused;
}

@keyframes loader-slide {
    0% {
        right: 4rem;
        left: .125rem
    }

    5% {
        left: .125rem
    }

    50% {
        right: .125rem;
        left: 4rem
    }

    55% {
        right: .125rem
    }

    to {
        right: 4rem;
        left: .125rem
    }
}
</style>
