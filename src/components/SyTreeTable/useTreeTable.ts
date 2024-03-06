import {computed, inject, type MaybeRefOrGetter, type Ref, ref, toValue} from "vue";
import type {FlatTreeTableRow, RowKey} from "@/components/SyTreeTable/types";

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

export function useVisibleItems(idFieldName: MaybeRefOrGetter<string>,
                           parentIdFieldName: MaybeRefOrGetter<string>,
                           rawData: MaybeRefOrGetter<any[]>,
                           expandedRowKeys: MaybeRefOrGetter<RowKey[]>) {
    const _id = toValue(idFieldName)
    const _pid = toValue(parentIdFieldName)
    const _rawData = toValue(rawData)
    const _xpdRowKeys = toValue(expandedRowKeys)

    const visibleItems = computed(() => {
        return createRows(_rawData)
    })

    function isExpanded(item: any) {
        if (_xpdRowKeys) {
            return _xpdRowKeys.includes(toValue(item)[_id])
        }

        return false
    }

    function createRows(items: any[],
                        rootId?: string|null,
                        level: number = 0) {
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
                isExpanded: isExpanded(r)
            }

            rows.push(item)

            if (item.isExpanded) {
                rows.push(...createRows(items, rowKey, level + 1))
            }
        }

        return rows
    }

    function hasChildren(items: any[], parentId?: any) {
        return items.some((item) => {
            if (!parentId) {
                return item[_pid] === null || typeof(item[_pid]) === "undefined"
            }

            return item[_pid] === parentId
        })
    }

    function findChildren(items: any[], parentId?: any) {
        return items.filter((item) => {
            if (!parentId) {
                return item[_pid] === null || typeof(item[_pid]) === "undefined"
            }

            return item[_pid] === parentId
        })
    }

    return { visibleItems }
}