<script setup lang="ts">
import "./SyTreeTable.scss"

import SyTreeHead from "@/components/SyTreeTable/SyTreeHead.vue";
import type {RowKey, TreeTableProps} from "@/components/SyTreeTable/types";
import {computed, provide, ref, toRefs} from "vue";
import SyTreeRows from "@/components/SyTreeTable/SyTreeRows.vue";
import {useParser} from "@/components/SyTreeTable/parser";
import {useVisibleItems} from "@/components/SyTreeTable/useTreeTable";

const props = defineProps<TreeTableProps>()
const { items: rawItems, columns, expandedRowKeys } = toRefs(props)

const focusedRowKey = defineModel<RowKey>('focusedRowKey')
const focusedCellKey = defineModel<string>('focusedCellKey')

const emit = defineEmits<{
  (event: 'update:expandedRowKeys', value: RowKey[]): void
  (event: 'click:expandButton', rowKey: RowKey): void
  (event: 'click:row', rowKey: RowKey): void
  (event: 'click:cell', rowKey: RowKey, colKey: string): void
}>()

const emitUpdateExpandedRowKeys = (value: RowKey[]) => {
  //emit('update:expandedRowKeys', value)
}
const emitClickExpandButton = (rowKey: RowKey) => {
  const rowItem = visibleItems.value.find(vi => vi.key === rowKey)
  if (rowItem) {
    rowItem.isExpanded ? collapseRow(rowKey) : expandRow(rowKey)
  }
}
const emitClickRow = (rowKey: RowKey) => {
  if (rowKey) {
    focusedRowKey.value = rowKey
  }
  //emit('click:row', rowKey)
}
const emitClickCell = (rowKey: RowKey, colKey: string) => {
  //emit('click:cell', rowKey, colKey)
}
provide('emitUpdateExpandedRowKeys', emitUpdateExpandedRowKeys)
provide('emitClickExpandButton', emitClickExpandButton)
provide('emitClickRow', emitClickRow)
provide('emitClickCell', emitClickCell)

const items = computed(() => {
  return useParser(props.keyField, props.parentIdField)(rawItems.value)
})

const { visibleItems } = useVisibleItems(props.keyField, props.parentIdField, rawItems, expandedRowKeys)
const visibleItemDbg = computed(() => {
  return JSON.stringify(visibleItems.value, null, 2)
})
const hasFocus = ref(false)

provide('items', visibleItems)
provide('columns', columns)
provide('expandedRowKeys', expandedRowKeys)
provide('focusedRowKey', focusedRowKey)

function expandRow(rowKey?: RowKey): boolean {
  if (!rowKey) {
    return false
  }

  const rowItem = visibleItems.value.find(vi => vi.key === rowKey)
  if (!rowItem?.hasChildren) {
    return false
  }

  if (!expandedRowKeys.value.includes(rowKey)) {
    expandedRowKeys.value.push(rowKey)
    emit('update:expandedRowKeys', expandedRowKeys.value)
    return true
  }

  return false
}

function collapseRow(rowKey?: RowKey) {
  if (!rowKey) {
    return false
  }

  const rowItem = visibleItems.value.find(vi => vi.key === rowKey)
  if (!rowItem?.hasChildren) {
    return false
  }

  const keyIndex = expandedRowKeys.value.indexOf(rowKey)
  if (keyIndex !== -1) {
    expandedRowKeys.value.splice(keyIndex, 1)
    emit('update:expandedRowKeys', expandedRowKeys.value)
    return true
  }

  return false
}

function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      focusPrevRow()
      event.preventDefault()
      break;
    case 'ArrowDown':
      focusNextRow()
      event.preventDefault()
      break;
    case 'ArrowLeft':
      collapseRow(focusedRowKey.value)
      break;
    case 'ArrowRight':
      expandRow(focusedRowKey.value)
      break;
  }
}

function focusPrevRow() {
  const ci = visibleItems.value.findIndex(i => i.key === focusedRowKey.value)
  let ni: number
  if (ci === 0) {
    ni = visibleItems.value.length - 1
  } else {
    ni = ci - 1
  }

  focusedRowKey.value = visibleItems.value[ni].key
}

function focusNextRow() {
  const ci = visibleItems.value.findIndex(i => i.key === focusedRowKey.value)
  let ni: number
  if (ci + 1 >= visibleItems.value.length) {
    ni = 0
  } else {
    ni = ci + 1
  }

  focusedRowKey.value = visibleItems.value[ni].key
}

function onFocus() {
  hasFocus.value = true

  // Default focus to first row
  if (!focusedRowKey.value && items.value.length) {
    focusedRowKey.value = items.value[0].key
  }
}

function onBlur() {
  hasFocus.value = false
}
</script>

<template>
  <div :class="{
    'sy-tree-table': true,
    'sy-tree-table--focused': hasFocus}"
       tabindex="0"
  @keydown="onKeyDown"
  @focus="onFocus"
  @blur="onBlur">
  <table class="sy-tree-table__table">
    <sy-tree-head :columns="columns" />
    <tbody>
      <sy-tree-rows>
      </sy-tree-rows>
    </tbody>
  </table>
    <textarea v-model="visibleItemDbg">
    </textarea>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
}

textarea {
  width: 50%;
  height: 400px;
  position: absolute;
  bottom: 0;
}
</style>