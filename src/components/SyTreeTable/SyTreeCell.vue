<script setup lang="ts">
import { inject, ref } from 'vue'
import type { RowKey } from '@/components/SyTreeTable/types'

const props = defineProps<{
    rowKey: RowKey
    columnKey: string
    value: any
    isEditing: boolean
}>()
const emit = defineEmits<{
    (event: 'click:cell', rowKey: RowKey, colKey: string): void
}>()

const editValue = ref(props.value)

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
    <td @click="onCellClick">
        <slot name="prepend" :value="value"></slot>
        <slot :value="value">
            <input v-if="isEditing" v-model="editValue" type="text" />
            <span v-else>{{ props.value }}</span>
        </slot>
    </td>
</template>

<style scoped></style>
