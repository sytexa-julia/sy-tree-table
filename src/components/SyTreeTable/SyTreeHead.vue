<script setup lang="ts">
import {ColumnAlign, type TreeHeadProps, type TreeTableColumn} from "@/components/SyTreeTable/types";
import {toRefs} from "vue";

const props = defineProps<TreeHeadProps>()
const { columns } = toRefs(props)

function colClass(col: TreeTableColumn): string {
  switch (col.align) {
    case ColumnAlign.End:
      return "sy-tree-table-col--align-end"
    case ColumnAlign.Center:
      return "sy-tree-table-col--align-center"
    case ColumnAlign.Justify:
      return "sy-tree-table-col--align-justify"
    case ColumnAlign.Begin:
    default:
      return "sy-tree-table-col--align-begin"
  }
}

function colWidth(col: TreeTableColumn): string {
  if (typeof col.width === 'string') {
    return col.width
  } else if (typeof col.width === 'number') {
    return `${col.width}px`
  }

  return ''
}
</script>

<template>
<colgroup>
  <col
      v-for="c in columns"
      :key="c.key"
      :style="{ width: colWidth(c)}" />
</colgroup>
<thead>
  <tr>
    <th v-for="c in columns" :key="c.key" :class="colClass(c)">
      {{ c.title }}
    </th>
  </tr>
</thead>
</template>

<style scoped>

</style>