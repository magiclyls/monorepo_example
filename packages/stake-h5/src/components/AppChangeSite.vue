<script lang="ts" setup>
defineOptions({
  name: 'AppChangeSite',
})

const siteList = ref([
  {
    name: 'Win6',
    site: 'wi6',
    bgStyle: 'primary',
  },
  {
    name: '新葡京',
    site: 'x02',
    bgStyle: 'secondary',
  },
  // {
  //   name: '威尼斯人',
  //   site: 'v03',
  //   bgStyle: 'dark',
  // },
  {
    name: 'Meibo',
    site: 'meibo',
    bgStyle: 'grey',
  },
  {
    name: 'btb',
    site: 'btb',
    bgStyle: '',
  },
  {
    name: 'BETFF',
    site: 'btf',
    bgStyle: 'primary',
  },
])
const activeName = ref(Local.get(STORAGE_SITE_NAME)?.value || 'meibo')

function changeSite(site: string) {
  Local.set(STORAGE_SITE_NAME, site)
  activeName.value = site
}
</script>

<template>
  <div class="bg-tg-primary flex flex-col gap-[5px] rounded-[5px] p-[6px]">
    <BaseButton v-for="item in siteList" :key="item.site" :bg-style="item.bgStyle" @click="changeSite(item.site)">
      <span
        :class="{
          'text-indigo-300': activeName === item.site,
        }"
      >{{ item.name }}</span>
    </BaseButton>
  </div>
</template>
