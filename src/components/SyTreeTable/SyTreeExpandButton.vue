<script setup lang="ts">
import {inject, toRefs} from "vue";
import type {RowKey} from "@/components/SyTreeTable/types";

const props = defineProps<{
  isExpanded: boolean,
  rowKey: RowKey
}>()
const { isExpanded } = toRefs(props)

const emit = defineEmits<{
  (event: 'click:expandButton', rowKey: RowKey): void
}>()

const emitClickExpandButton = inject<(rowKey: RowKey) => void>('emitClickExpandButton')

function onClick(event: Event) {
  if (emitClickExpandButton) {
    emitClickExpandButton(props.rowKey)
  }

  emit('click:expandButton', props.rowKey)
}
</script>

<template>
  <span @click="onClick">
    {{ isExpanded ? '&#9660;' : '&#9654;'}}
  </span>
</template>

<style scoped>

</style>