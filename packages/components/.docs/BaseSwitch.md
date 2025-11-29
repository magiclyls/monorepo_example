## Button

<script setup>
import { ref } from 'vue'
import BaseSwitch from '../src/BaseSwitch.vue'
const a = ref(true)
</script>

<BaseSwitch v-model="a" />
