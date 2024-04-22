<script setup lang="ts">
import SyTreeCell from '@/components/SyTreeTable/SyTreeCell.vue'
import SyTreeGuide from '@/components/SyTreeTable/SyTreeGuide.vue'
import SyTreeExpandButton from '@/components/SyTreeTable/SyTreeExpandButton.vue'
import { inject } from 'vue'
import type { RowKey } from '@/components/SyTreeTable/types'
const props = defineProps<{
    rowKey: RowKey
    columnKey: string
    value: any
    level: number
    isExpanded: boolean
    hasChildren: boolean
    isEditing: boolean
}>()
const emit = defineEmits<{
    (event: 'click:cell', rowKey: RowKey, colKey: string): void
}>()

const emitClickCell =
    inject<(rowKey: RowKey, colKey: string) => void>('emitClickCell')

function onCellClick(event: Event) {
    if (emitClickCell) {
        emitClickCell(props.rowKey, props.columnKey)
    }

    emit('click:cell', props.rowKey, props.columnKey)
}
</script>

<template>
    <sy-tree-cell
        :row-key="rowKey"
        :column-key="columnKey"
        :is-editing="isEditing"
        :value="props.value"
        class="sy-tree-table-tree-col"
        @click="onCellClick"
    >
        <template #prepend>
            <sy-tree-guide :level="level" />
            <sy-tree-expand-button
                v-show="hasChildren"
                :row-key="rowKey"
                :is-expanded="isExpanded"
            />
        </template>
    </sy-tree-cell>
</template>

<style scoped></style>
