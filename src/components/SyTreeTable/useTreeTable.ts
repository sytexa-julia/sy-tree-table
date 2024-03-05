import {computed, inject, type MaybeRefOrGetter, type Ref, ref, toValue} from "vue";
import type {TreeTableRow} from "@/components/SyTreeTable/types";

export function useIsExpanded(item: MaybeRefOrGetter<TreeTableRow>) {
        const expandedRowKeys = inject<Ref<string[]>>('expandedRowKeys', ref([]))
        const isExpanded = computed(() => {
            if (expandedRowKeys && expandedRowKeys.value) {
                return expandedRowKeys.value.includes(toValue(item).key)
            }

            return false
        })

    return { isExpanded }
}