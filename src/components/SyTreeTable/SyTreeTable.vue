<script setup lang="ts">
import "./SyTreeTable.scss"

import SyTreeHead from "@/components/SyTreeTable/SyTreeHead.vue";
import type {TreeTableProps} from "@/components/SyTreeTable/types";
import {computed, provide, toRefs} from "vue";
import SyTreeRows from "@/components/SyTreeTable/SyTreeRows.vue";
import {useParser} from "@/components/SyTreeTable/parser";

const props = defineProps<TreeTableProps>()
const { items: rawItems, columns, expandedRowKeys } = toRefs(props)

const emit = defineEmits<{
  (event: 'update:expandedRowKeys', value: string[]): void
}>()

const items = computed(() => {
  return useParser(props.keyField, props.parentIdField)(rawItems.value)
})

provide('items', items)
provide('columns', columns)
provide('expandedRowKeys', expandedRowKeys)

function onExpandRow(rowKey: string) {
  if (!expandedRowKeys.value.includes(rowKey)) {
    expandedRowKeys.value.push(rowKey)
    emit('update:expandedRowKeys', expandedRowKeys.value)
  }
}

function onCollapseRow(rowKey: string) {
  const keyIndex = expandedRowKeys.value.indexOf(rowKey)
  if (keyIndex !== -1) {
    expandedRowKeys.value.splice(keyIndex, 1)
    emit('update:expandedRowKeys', expandedRowKeys.value)
  }
}

</script>

<template>
  <div class="sy-tree-table">
  <table class="sy-tree-table__table">
    <sy-tree-head :columns="columns" />
    <tbody>
      <sy-tree-rows @expand-row="onExpandRow" @collapse-row="onCollapseRow"></sy-tree-rows>
    </tbody>
  </table>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
}
</style>