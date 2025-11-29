<script lang="ts" setup>
interface Props {
  content: string
}
defineOptions({
  name: 'PhBaseRichArea',
})
defineProps<Props>()
</script>

<template>
  <div class="tg-rich-area leading-[1.5]" v-html="content" />
</template>

<style lang="scss" scoped>
// 重置富文本样式
.tg-rich-area {
  * {
    font: revert;
    color: #b1bad3;
  }
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td {
    border: revert-layer;
  }
  ul,
  ol {
    padding-left: 20rem;
  }
  li {
    list-style: initial;
  }
  table[border='1'] {
    td,
    th {
      border: 1px solid #b1bad3;
    }
  }
  .tm_theme1_blueGreen p {
    color: #fff;
    font-size: 13rem;
    font-weight: 400;
    line-height: 18rem;
    text-align: left;
  }
  .tm_theme1_blueGreen p:first-child {
    font-size: 21rem;
    font-weight: 500;
    line-height: 30rem;
  }
}
</style>
