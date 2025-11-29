## CheckBox

<script setup>
import BaseCheckBox from '../src/BaseCheckBox.vue'
</script>

## 示例

可选：<BaseCheckBox @change="handleChange" v-model="value" />
禁用：<BaseCheckBox disabled/>

```vue
<BaseCheckBox @change="handleChange" v-model="value" />

<BaseCheckBox disabled />
```
