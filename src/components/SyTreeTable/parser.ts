import type {TreeTableRow} from "@/components/SyTreeTable/types";

export function useParser(idFieldName: string, parentIdFieldName: string) {
    function createRows(items: any[],
                         rootId?: string|null,
                        level: number = 0) {
        const rows: TreeTableRow[] = []
        const children = findChildren(items, rootId)

        for (const r of children) {
            const rowKey = r[idFieldName]
            rows.push({
                key: rowKey,
                data: r,
                children: createRows(items, rowKey, level + 1),
                level: level,
                isExpanded: false
            })
        }

        return rows
    }

    function findChildren(items: any[], parentId?: any) {
        return items.filter((item) => {
            if (!parentId) {
                return item[parentIdFieldName] === null || typeof(item[parentIdFieldName]) === "undefined"
            }

            return item[parentIdFieldName] === parentId
        })
    }

    return createRows
}
