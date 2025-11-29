<script lang="ts" setup>
import { PhBaseImage } from '@tg/bccomponents'
import { getEnv } from '@tg/utils'

const { VITE_OFFICIAL_NAME } = getEnv()
</script>

<template>
  <div>
    <div class="text-[#0D2245] text-[20rem] font-bold leading-[1.32] xl:text-[24rem]" font-semibold>
      Solving the Trust Issue with Online Gambling
    </div>
    <div class="text-[#6D7693] mt-[16rem] text-[16rem] leading-[1.5] xl:text-[18rem]">
      The underlying concept of <a class="text-[#0D2245] text-[14rem]" href="https://en.wikipedia.org/wiki/Provable_fairness" target="_blank">provable fairness <BaseIcon class="text-[12rem]" name="uni-jump-page" /></a> is that players have the ability to prove and verify that their results are fair and unmanipulated. This is achieved through the use of a <a class="text-[#0D2245] text-[14rem]" href="https://en.wikipedia.org/wiki/Commitment_scheme" target="_blank">commitment scheme <BaseIcon class="text-[12rem]" name="uni-jump-page" /></a> , along with cryptographic hashing.
    </div>
    <div class="text-[#6D7693] mt-[16rem] text-[16rem] leading-[1.5] xl:text-[18rem]">
      The commitment scheme is used to ensure that the player has an influence on all results generated. Cryptographic hashing is used to ensure that the casino also remains honest to this commitment scheme. Both concepts combined creates a trust-less environment when gambling online.
    </div>
    <div class="text-[#6D7693] mt-[16rem] text-[16rem] leading-[1.5] xl:text-[18rem]">
      This is simplified in the following representation:
    </div>
    <div class="text-[#0D2245] bg-[#F6F7F8] mt-[16rem] rounded-[4rem] p-16 text-[16rem] leading-[1.5] xl:text-[18rem]">
      fair result = operators input (hashed) + customers input
    </div>
    <div class="text-[#0D2245] mt-[16rem] text-[20rem] font-semibold leading-[1.32] xl:text-[24rem]">
      3rd Party Verification
    </div>
    <div class="text-[#6D7693] mt-[16rem] text-[16rem] leading-[1.5] xl:text-[18rem]">
      All {{ VITE_OFFICIAL_NAME }} Originals played on {{ VITE_OFFICIAL_NAME }} can be verified both here and via 3rd party websites who have also open sourced the verification procedure. You can find them via a google search, or simply check out some of these that have been put together by our community:
    </div>
    <div class="text-[#0D2245] mt-[16rem]">
      <ul class="ml-[32rem] list-disc">
        <li><a class="text-[14rem]" href="https://provablyfair.me" target="_blank">https:// provablyfair.me<BaseIcon class="text-[12rem]" name="uni-jump-page" /></a></li>
      </ul>
    </div>
    <div class="text-[#0D2245] mt-[32rem] text-[20rem] font-semibold leading-[1.32] xl:text-[24rem]">
      Crypto Gambling Foundation
    </div>
    <div class="text-[#6D7693] mt-[16rem] text-[16rem] leading-[1.5] xl:text-[18rem]">
      {{ VITE_OFFICIAL_NAME }} is a verified operator on the Crypto Gambling Foundation network. This foundation aims to uphold the highest standard of provably fair gambling and we are proud to be a part of their network. You can find further information and insights about provable fairness and the power it has in this industry, check out the Crypto Gambling Foundation via their website:
      <a class="text-[#0D2245] text-[14rem]" href="https://en.wikipedia.org/wiki/Provable_fairness" target="_blank">cryptogambling.org <BaseIcon class="text-[12rem]" name="uni-jump-page" /></a>
    </div>
    <div class="mt-[16rem]">
      <PhBaseImage width="120px" url="/ph-h5/png/verified_white.png" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
