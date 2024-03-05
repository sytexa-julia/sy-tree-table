export interface TreeTableProps {
    columns?: TreeTableColumn[]
    items: any[]
    keyField: string
    parentIdField: string,
    expandedRowKeys: string[]
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

type ColumnWidth = string | number

export interface TreeTableColumn {
    title: string
    type: ColumnType
    key: string
    align?: ColumnAlign
    width?: ColumnWidth
}

export interface TreeTableRow {
    key: string
    data: any
    children: TreeTableRow[]
    isExpanded: boolean
    level: number
}