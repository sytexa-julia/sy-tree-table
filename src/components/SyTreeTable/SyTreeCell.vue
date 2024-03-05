<script setup lang="ts">
const props = defineProps<{value: any}>()
</script>

<template>
  <td>
    <slot :value="value">
      {{ props.value }}
    </slot>
  </td>
</template>

<style scoped>

</style>