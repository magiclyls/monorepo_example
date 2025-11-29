<script lang="ts" setup>
import { IconUniJumpPage } from '@tg/icons'

</script>

<template>
  <div>
    <div class="text-tg-secondary-light text-[16px] leading-[1.5] @md:text-[18px]">
      Game events are translation of the randomly generated floats into a relatable outcome that is game specific. This includes anything from the outcome of a dice roll to the order of the cards in a deck, or even the location of every bomb in a game of mines.
    </div>
    <div class="text-tg-secondary-light mt-[16px] text-[16px] leading-[1.5] @md:text-[18px]">
      Below is a detailed explanation as to how we translate floats into events for each particular different game on our platform.
    </div>
    <div class="text-tg-text-white mt-[16px] text-[20px] font-semibold leading-[1.32] @md:text-[28px]">
      Dice Roll
    </div>
    <div class="text-tg-secondary-light mt-[16px] text-[16px] leading-[1.5] @md:text-[18px]">
      In our version of dice, we cover a possible roll spread of 00.00 to 100.00, which has a range of 10,001 possible outcomes. The game event translation is done by multiplying the float by number of possible outcomes and then dividing by 100 so that the resulting number fits the constraints of our stated dice range.
    </div>
    <div class="text-tg-text-white bg-tg-secondary-grey scroll-x mt-[16px] rounded-[4px] p-[16px] text-[16px] leading-[1.5] @md:text-[18px]">
      <pre><code style="font-family: monospace,monospace;font-size: 1em;">// Game event translation
const roll = (float * 10001) / 100;</code></pre>
    </div>
    <div class="text-tg-text-white mt-[16px] text-[20px] font-semibold leading-[1.32] @md:text-[28px]">
      Limbo
    </div>
    <div class="text-tg-secondary-light mt-[16px] text-[16px] leading-[1.5] @md:text-[18px]">
      When it comes to Limbo, we use a two-step process. Firstly, we take the float and multiply it by both the maximum possible multiplier and the house edge. Then, in order to generate a game event that has <a class="text-tg-text-white text-[14px]" href="https://en.wikipedia.org/wiki/Probability_distribution" target="_blank">probability distribution <IconUniJumpPage class="text-[12px]" /></a> , we divide the maximum possible multiplier by the result of the first step to create the game event in the form of a crash point.
    </div>
    <div class="text-tg-text-white bg-tg-secondary-grey scroll-x mt-[16px] rounded-[4px] p-[16px] text-[16px] leading-[1.5] @md:text-[18px]">
      <pre><code style="font-family: monospace,monospace;font-size: 1em;">// Game event translation with houseEdge of 0.99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Crash point rounded down to required denominator
const crashPoint = Math.floor(floatPoint * 100) / 100;

// Consolidate all crash points below 1
const result = Math.max(crashPoint, 1);</code></pre>
    </div>
    <div class="text-tg-text-white mt-[16px] text-[20px] font-semibold leading-[1.32] @md:text-[28px]">
      Plinko
    </div>
    <div class="text-tg-secondary-light mt-[16px] text-[16px] leading-[1.5] @md:text-[18px]">
      For any game of Plinko, the generated outcome is based on the path of the falling ball. The game event determines the direction of the falling ball for each level in the falling process. Players can choose between 8 and 16 pins of play, which determines the number of game events required to generate a complete path from top to bottom. Since there are only two possible directions (left or right) the translation is done by multiplying each float by 2, which maps to the following index:
    </div>
    <div class="text-tg-text-white bg-tg-secondary-grey scroll-x mt-[16px] rounded-[4px] p-[16px] text-[16px] leading-[1.5] @md:text-[18px]">
      <pre><code style="font-family: monospace,monospace;font-size: 1em;">// Index of 0 to 1 : left to right
const DIRECTIONS = [ left, right ];

// Game event translation
const direction = CARDS[Math.floor(float * 2)];</code></pre>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
