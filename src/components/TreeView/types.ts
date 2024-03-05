export interface TreeNode {
    id: number;
    title: string;
    children?: TreeNode[];
    isSelected?: boolean;
    weight: number;
    siblingCount?: number;
    parentId?: number;
}

export interface ClosureEntry {
    ancestor_id: number;
    descendant_id: number;
    depth: number;
}

export interface NodeMovedEmit {
    (event: 'nodeMoved', payload: { draggedNodeId: string, targetNodeId: number }): void;
}

export interface NodeSelectedEmit {
    (event: 'nodeSelected', payload: {nodeId: number, node: TreeNode}): void;
}

export interface TreeViewNodeEmits extends NodeMovedEmit, NodeSelectedEmit {}