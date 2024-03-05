<script setup lang="ts">
import {inject} from "vue";
import type {TreeTableRow} from "@/components/SyTreeTable/types";
import SyTreeRow from "@/components/SyTreeTable/SyTreeRow.vue";
const emit = defineEmits<{
  (event: 'expandRow', rowKey: string): void
  (event: 'collapseRow', rowKey: string): void
}>()
const items = inject<TreeTableRow[]>('items')
</script>

<template>
  <sy-tree-row
      v-for="item in items"
      :key="item.key"
      :item="item"
      @expand-row="emit('expandRow', $event)"
      @collapse-row="emit('collapseRow', $event)"/>
</template>

<style scoped>

</style>