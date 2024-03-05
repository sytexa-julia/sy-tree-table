<script setup lang="ts">
import {defineProps, defineEmits, inject, computed} from 'vue';
import type {TreeNode} from "./types";
import {useTreeViewDragDrop} from "./composables/useTreeViewDragDrop";
import NodeContent from "./NodeContent.vue";

const props = defineProps({
  node: {
    required: true,
    default: Object as () => TreeNode
  },
  addingNode: Boolean
});

const selectedNodeId = inject<number|null>('selectedNodeId')
const isSelected = computed(() => props.node.id === selectedNodeId)
const nodeId = computed(() => props.node.id)

//const emit = defineEmits<TreeViewNodeEmits>();
const emit = defineEmits(['nodeSelected', 'nodeMoved', 'addNode'])
const selectNode = (event: MouseEvent) => {
  emit('nodeSelected', { nodeId: props.node.id, node: props.node });
};

const handleAccept = (newNodeTitle: String) => {
  emit('addNode', { title: newNodeTitle, parent: props.node });
};

const handleCancel = () => {
};

const { dragStart, dragEnd, dragEnter, dragLeave, drop } = useTreeViewDragDrop(nodeId, emit)

</script>

<template>
  <li>
    <node-content
        :node="node"
        @click="selectNode"
        :class="{'font-style-italic': isSelected}"
    />

    <ul v-if="node.children && node.children.length">
      <template  v-for="child in node.children"
                 :key="child.id">
        <tree-view-node
            :node="child"
            @nodeSelected="$emit('nodeSelected', $event)"
            @addNode="$emit('addNode', $event)"
        />
      </template>
    </ul>
  </li>
</template>

<style scoped>
.selected {
  font-weight: bold;
  /* Add other styles for selected node */
}

ul {
  margin-left: 20px;
}



.dragging {
  opacity: 0.5;
  border: 2px solid #0d47a1;
}

ul {
  list-style-type: "└ ";
}
</style>