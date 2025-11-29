<script lang="ts" setup>
interface Props {
  content: string
}
defineOptions({
  name: 'AfunBaseRichArea',
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
    padding-left: 20px;
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
    font-size: 13px;
    font-weight: 400;
    line-height: 18px;
    text-align: left;
  }
  .tm_theme1_blueGreen p:first-child {
    font-size: 21px;
    font-weight: 600;
    line-height: 30px;
  }
}
</style>
