## Icon

<script setup>
import BaseIcon from '../src/BaseIcon.vue';
import ids from 'virtual:svg-icons-names';
import { openNotices, copy} from './utils/index.js';

function copyValue(name) {
  copy(`<BaseIcon name="${name}" />`);
  openNotices('Copied ' + name)
}
</script>

<div class="grid grid-cols-4 gap-4">
  <div v-for="id in ids" :key="id" class="flex flex-col items-center" @click="copyValue(id.slice(5))">
    <div>
      <BaseIcon :name="id.slice(5)" class="text-6xl" />
    </div>
    <div>
      {{ id.slice(5) }}
    </div>
  </div>

</div>
