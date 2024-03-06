<script setup lang="ts">
import {inject} from "vue";
import type {RowKey} from "@/components/SyTreeTable/types";

const props = defineProps<{rowKey: RowKey, columnKey: string, value: any}>()
const emit = defineEmits<{
  (event: 'click:cell', rowKey: RowKey, colKey: string): void
}>()

const emitClickCell = inject<(rowKey: RowKey, colKey: string) => void>('emitClickCell')

function onCellClick(event: Event) {
  if (emitClickCell) {
    emitClickCell(props.rowKey, props.columnKey)
  }

  emit('click:cell', props.rowKey, props.columnKey)
}
</script>

<template>
  <td @click="onCellClick">
    <slot :value="value">
      {{ props.value }}
    </slot>
  </td>
</template>

<style scoped>

</style>