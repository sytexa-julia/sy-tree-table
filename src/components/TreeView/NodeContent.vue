<script setup lang="ts">
import {useTreeViewDragDrop} from "./composables/useTreeViewDragDrop";
import {computed} from "vue";
import type {TreeNode} from "./types";

const props = defineProps({
  node: {
    required: true,
    default: Object as () => TreeNode
  }
});
const emit = defineEmits(['nodeMoved'])

const nodeId = computed(() => props.node.id)

const { dragStart, dragEnd, dragEnter, dragLeave, drop } = useTreeViewDragDrop(nodeId, emit)
</script>

<template>
  <div>
    <div class="droppable before"
         @drop="drop"
         @dragenter="dragEnter"
         @dragleave="dragLeave"></div>
    <div :class="{ 'selected': node.isSelected, 'droppable': true, 'tree-view-node': true }"
         @dragstart="dragStart"
         @dragend="dragEnd"
         @dragover.prevent
         @dragenter="dragEnter"
         @dragleave="dragLeave"
         @drop="drop"
         draggable="true">{{ node.title }}</div>
    <div class="droppable after"
         @drop="drop"
         @dragenter="dragEnter"
         @dragleave="dragLeave"></div>
  </div>
</template>

<style scoped>
div.droppable.before,
div.droppable.after {
  min-height: 3px;
  max-height: 3px;
}

.dragover {
  background-color: orange;
}

.tree-view-node {
  cursor: pointer;
}

.selected {
  font-weight: bold;
  /* Add other styles for selected node */
}
</style>