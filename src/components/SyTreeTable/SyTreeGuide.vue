<script setup lang="ts">
import {toRefs} from "vue";

const props = defineProps<{
  level: number
}>()
const { level } = toRefs(props)
</script>

<template>
  <span class="guide-spacer" v-for="l in level" :key="l"></span>
</template>

<style scoped>
.guide-spacer {
  display: inline-block;
  width: 1rem;
}
</style>