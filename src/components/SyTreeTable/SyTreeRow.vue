<script setup lang="ts">
import {computed, inject, type MaybeRefOrGetter, toRefs, toValue} from "vue";
import type {TreeTableColumn, TreeTableRow} from "@/components/SyTreeTable/types";
import {get} from "lodash-es";
import SyTreeCell from "@/components/SyTreeTable/SyTreeCell.vue";
import SyTreeTreeCell from "@/components/SyTreeTable/SyTreeTreeCell.vue";
import {useIsExpanded} from "@/components/SyTreeTable/useTreeTable";

const emit = defineEmits<{
  (event: 'expandRow', rowKey: string): void
  (event: 'collapseRow', rowKey: string): void
}>()

const props = defineProps<{
  item: TreeTableRow
}>()
const {item} = toRefs(props)

const columns = inject<MaybeRefOrGetter<TreeTableColumn[]>>('columns')

const { isExpanded } = useIsExpanded(item)

const treeCol = computed(() => {
  const cols = toValue(columns)
  if (!cols || !cols.length) {
    throw new Error("No first column")
  }

  return cols[0]
})

const remainingCols = computed(() => {
  const cols = toValue(columns)

  if (!cols) {
    return []
  }

  return cols.slice(1)
})

const visibleChildren = computed(() => {
  if (isExpanded.value) {
    return item.value.children
  }

  return []
})

function onRowClick() {
  if (isExpanded.value) {
    emit('collapseRow', item.value.key)
  } else {
    emit('expandRow', item.value.key)
  }
}
</script>

<template>
  <tr :data-level="item.level">
    <sy-tree-tree-cell
        :value="get(item.data, treeCol.key)"
        :level="item.level"
        :is-expanded="isExpanded"
        :has-children="!!item.children.length"
        @click="onRowClick" />
    <sy-tree-cell
        v-for="col in remainingCols"
        :key="col.key"
        :value="get(item.data, col.key)">
    </sy-tree-cell>
  </tr>
  <sy-tree-row
      v-for="child in visibleChildren"
      :key="child.key"
      :item="child"
      @expand-row="$emit('expandRow', $event)"
      @collapse-row="$emit('collapseRow', $event)"/>
</template>

<style scoped>
</style>