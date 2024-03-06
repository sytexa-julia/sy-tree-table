export type RowKey = string | number

export interface TreeTableProps {
    columns?: TreeTableColumn[]
    items: any[]
    keyField: string
    parentIdField: string,
    expandedRowKeys: RowKey[]
}

export interface TreeHeadProps {
    columns: TreeTableColumn[]
}

export enum ColumnType {
    Text
}

export enum ColumnAlign {
    Begin,
    End,
    Center,
    Justify
}

export type ColumnWidth = string | number

export interface TreeTableColumn {
    title: string
    type: ColumnType
    key: string
    align?: ColumnAlign
    width?: ColumnWidth
}

export interface FlatTreeTableRow {
    key: RowKey
    data: any
    parentKey: string
    hasChildren: boolean
    isExpanded: boolean
    level: number
}

export interface TreeTableRow extends FlatTreeTableRow{
    children: TreeTableRow[]
}

export enum SortDirection {
    None,
    Ascending,
    Descending
}

export interface TreeSortSpec {
    /**
     * Fields to sort by and their sort configuration
     */
    [fieldName: string]: {
        /**
         * Direction to sort the column data
         */
        sort: SortDirection,
        /**
         * Index of the sort, for sorting by multiple columns
         */
        index: number
    }
}