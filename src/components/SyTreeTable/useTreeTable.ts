import {
    computed,
    inject,
    type MaybeRefOrGetter,
    provide,
    type Ref,
    ref,
    toValue,
    defineModel,
} from 'vue'
import type {
    FlatTreeTableRow,
    InsertInfo,
    RowKey,
} from '@/components/SyTreeTable/types'
import { computedWithControl } from '@vueuse/core'

export function useIsExpanded(item: MaybeRefOrGetter<FlatTreeTableRow>) {
    const expandedRowKeys = inject<Ref<RowKey[]>>('expandedRowKeys', ref([]))
    const isExpanded = computed(() => {
        if (expandedRowKeys && expandedRowKeys.value) {
            return expandedRowKeys.value.includes(toValue(item).key)
        }

        return false
    })

    return { isExpanded }
}

export function useIsRowFocused(item: MaybeRefOrGetter<FlatTreeTableRow>) {
    const focusedRowKey = inject<Ref<string>>('focusedRowKey', ref(''))
    const isRowFocused = computed(() => {
        if (focusedRowKey && focusedRowKey.value) {
            return focusedRowKey.value === toValue(item).key
        }

        return false
    })

    return { isRowFocused }
}

export function useIsRowEditing(item: MaybeRefOrGetter<FlatTreeTableRow>) {
    const editingRowKey = inject<Ref<string>>('editingRowKey', ref(''))
    const isRowEditing = computed(() => {
        if (editingRowKey && editingRowKey.value) {
            return editingRowKey.value === toValue(item).key
        }

        return false
    })

    return { isRowEditing }
}

export function useVisibleItems(
    idFieldName: MaybeRefOrGetter<string>,
    parentIdFieldName: MaybeRefOrGetter<string>,
    rawData: MaybeRefOrGetter<any[]>,
    expandedRowKeys: MaybeRefOrGetter<RowKey[]>,
    focusedRowKey: Ref<RowKey | undefined>,
    editingRowKey: Ref<RowKey | undefined>
) {
    const INSERTING_ROW_KEY = 'inserting'

    const _id = toValue(idFieldName)
    const _pid = toValue(parentIdFieldName)
    const _rawData = toValue(rawData)
    const _xpdRowKeys = toValue(expandedRowKeys)
    const _edRowKey = toValue(editingRowKey)

    const _insInfo: Ref<InsertInfo> = ref({
        childOf: undefined,
        siblingOf: undefined,
    })

    const visibleItems = computed(() => {
        return createRows({ items: _rawData, insertInfo: _insInfo.value })
    })

    function isExpanded(item: any) {
        if (_xpdRowKeys) {
            return _xpdRowKeys.includes(toValue(item)[_id])
        }

        return false
    }

    /**
     * Create a new row as a sibling of `of`. It will appear below `of`
     * and enter editing mode.
     * @param of
     */
    function createSibling(of: RowKey) {
        _insInfo.value.siblingOf = of
        focusedRowKey.value = INSERTING_ROW_KEY
        editingRowKey.value = INSERTING_ROW_KEY
    }

    function createChild(of?: RowKey) {}

    function editRow(id: RowKey) {}

    function isEditing(item: any) {
        return _edRowKey == toValue(item)[_id]
    }

    /**
     * Generates the visible rows of the tree grid.
     * @param items Raw data for the tree grid
     * @param rootId ID of the root item
     * @param level Current level or depth into the tree
     * @param insertInfo
     */
    function createRows({
        items,
        rootId,
        level = 0,
        insertInfo = {},
    }: {
        items: any[]
        rootId?: string | null
        level?: number
        insertInfo?: InsertInfo
    }) {
        const rows: FlatTreeTableRow[] = []
        const children = findChildren(items, rootId)

        for (const r of children) {
            const rowKey = r[_id]
            const item = {
                key: rowKey,
                parentKey: r[_pid],
                data: r,
                hasChildren: hasChildren(items, rowKey),
                level: level,
                isExpanded: isExpanded(r),
            }

            rows.push(item)

            if (_insInfo.value?.siblingOf === item.key) {
                rows.push({
                    key: INSERTING_ROW_KEY,
                    parentKey: item.key,
                    data: { text: 'New Sibling' },
                    hasChildren: false,
                    level: level,
                    isExpanded: false,
                })
            }

            if (item.isExpanded) {
                if (_insInfo.value?.childOf === item.key)
                    rows.push({
                        key: INSERTING_ROW_KEY,
                        parentKey: item.key,
                        data: { text: 'New Child' },
                        hasChildren: false,
                        level: level + 1,
                        isExpanded: false,
                    })

                rows.push(
                    ...createRows({ items, rootId: rowKey, level: level + 1 })
                )
            }
        }

        return rows
    }

    function hasChildren(items: any[], parentId?: any) {
        return items.some((item) => {
            if (!parentId) {
                return item[_pid] === null || typeof item[_pid] === 'undefined'
            }

            return item[_pid] === parentId
        })
    }

    function findChildren(items: any[], parentId?: any) {
        return items.filter((item) => {
            if (!parentId) {
                return item[_pid] === null || typeof item[_pid] === 'undefined'
            }

            return item[_pid] === parentId
        })
    }

    function findParent(rowKey: RowKey) {
        const parentKey = _rawData.find((i) => i.key == rowKey).parentKey
        return _rawData.find((i) => i.key == parentKey)
    }

    return { visibleItems, createSibling, createChild, editRow, _insInfo }
}
