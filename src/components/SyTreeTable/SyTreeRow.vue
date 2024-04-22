<script setup lang="ts">
import { computed, inject, type MaybeRefOrGetter, toRefs, toValue } from 'vue'
import type {
    FlatTreeTableRow,
    RowKey,
    TreeTableColumn,
} from '@/components/SyTreeTable/types'
import { get } from 'lodash-es'
import SyTreeCell from '@/components/SyTreeTable/SyTreeCell.vue'
import SyTreeTreeCell from '@/components/SyTreeTable/SyTreeTreeCell.vue'
import {
    useIsExpanded,
    useIsRowEditing,
    useIsRowFocused,
} from '@/components/SyTreeTable/useTreeTable'

const emit = defineEmits<{
    (event: 'click:row', rowKey: RowKey): void
}>()

const emitClickRow = inject<(rowKey: RowKey) => void>('emitClickRow')

const props = defineProps<{
    item: FlatTreeTableRow
}>()
const { item } = toRefs(props)

const columns = inject<MaybeRefOrGetter<TreeTableColumn[]>>('columns')

const { isExpanded } = useIsExpanded(item)
const { isRowFocused } = useIsRowFocused(item)
const { isRowEditing } = useIsRowEditing(item)

const treeCol = computed(() => {
    const cols = toValue(columns)
    if (!cols || !cols.length) {
        throw new Error('No first column')
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

function onRowClick() {
    if (emitClickRow) {
        emitClickRow(item.value.key)
    }

    emit('click:row', item.value.key)
}
</script>

<template>
    <tr
        :data-level="item.level"
        :data-row-key="item.key"
        :class="{
            'sy-tree-table-row--focused': isRowFocused,
            'sy-tree-table-row--editing': isRowEditing,
        }"
        @click="onRowClick"
    >
        <sy-tree-tree-cell
            :row-key="item.key"
            :column-key="treeCol.key"
            :is-editing="isRowEditing"
            :value="get(item.data, treeCol.key)"
            :level="item.level"
            :is-expanded="isExpanded"
            :has-children="item.hasChildren"
        />
        <sy-tree-cell
            v-for="col in remainingCols"
            :key="col.key"
            :is-editing="isRowEditing"
            :row-key="item.key"
            :column-key="treeCol.key"
            :value="get(item.data, col.key)"
        >
        </sy-tree-cell>
    </tr>
</template>

<style scoped></style>
