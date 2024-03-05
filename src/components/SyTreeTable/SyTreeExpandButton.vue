<script setup lang="ts">
import {toRefs} from "vue";

const props = defineProps<{
  isExpanded: boolean
}>()
const { isExpanded } = toRefs(props)
</script>

<template>
  <span>{{ isExpanded ? '&#9660;' : '&#9654;'}}</span>
</template>

<style scoped>

</style>