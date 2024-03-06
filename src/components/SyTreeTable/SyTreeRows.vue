<script setup lang="ts">
import {inject} from "vue";
import type {FlatTreeTableRow, RowKey} from "@/components/SyTreeTable/types";
import SyTreeRow from "@/components/SyTreeTable/SyTreeRow.vue";
const emit = defineEmits<{
  (event: 'click:expandButton', rowKey: RowKey): void
}>()
const items = inject<FlatTreeTableRow[]>('items')
</script>

<template>
  <sy-tree-row
      v-for="item in items"
      :key="item.key"
      :item="item"
      @click:expand-button="emit('click:expandButton', $event)" />
</template>

<style scoped>

</style>