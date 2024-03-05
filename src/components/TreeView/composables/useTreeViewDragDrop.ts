import type {NodeMovedEmit} from "../types";
import type {MaybeRefOrGetter} from "vue";
import {toValue} from "vue";

export function useTreeViewDragDrop(nodeId: MaybeRefOrGetter<number>, emit: NodeMovedEmit) {
    const dragStart = (event: DragEvent) => {
        const target = event.target as HTMLElement
        event.dataTransfer?.setData('node-id', String(toValue(nodeId)));
        target.classList.add('dragging')
    };

    const dragEnd = (event: DragEvent) => {
        const target = event.target as HTMLElement
        target?.classList.remove('dragging')
    }

    const dragEnter = (event: DragEvent) => {
        const target = event.target as HTMLElement
        if (target?.classList.contains("droppable")) {
            target?.classList.add("dragover");
        }
    }

    const dragLeave = (event: DragEvent) => {
        const target = event.target as HTMLElement
        if (target?.classList.contains("droppable")) {
            target?.classList.remove("dragover");
        }
    }

    const drop = (event: DragEvent) => {
        const target = event.target as HTMLElement
        if (target?.classList.contains("droppable")) {
            target?.classList.remove("dragover");
        }

        const draggedNodeId = event?.dataTransfer?.getData('node-id');
        if (draggedNodeId)
            emit('nodeMoved', {draggedNodeId, targetNodeId: toValue(nodeId)});
    };

    return { dragStart, dragEnd, dragEnter, dragLeave, drop }
}