
<script setup lang="ts">
import type {ClosureEntry, TreeNode} from "./types";
import {onMounted, provide, ref} from "vue";
import TreeViewNode from "@/components/TreeView/TreeViewNode.vue";


// Function to transform closure table data into a tree structure
function closureToTree(nodes: TreeNode[], closures: ClosureEntry[]): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>();
  const childCountMap = new Map<number, number>();

  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [], isSelected: false, siblingCount: 0 });
    childCountMap.set(node.id, 0);
  });

  closures.forEach(closure => {
    if (closure.depth === 1) {
      const parentNode = nodeMap.get(closure.ancestor_id);
      const childNode = nodeMap.get(closure.descendant_id);
      if (childNode)
        childNode.parentId = parentNode?.id;

      parentNode?.children?.push(childNode!);

      childCountMap.set(closure.ancestor_id, (childCountMap.get(closure.ancestor_id) || 0) + 1);
    }
  });

  nodeMap.forEach(node => {
    if (node.parentId) {
      node.siblingCount = childCountMap.get(node.parentId);
    }

    if (node.children) {
      node.children.sort((a, b)=> a.weight - b.weight)
    }
  });

  // Identify root nodes (nodes that are never descendants)
  const descendantIds = new Set(closures.map(c => c.descendant_id));
  const result = Array.from(nodeMap.values()).filter(node => !descendantIds.has(node.id));
  return result;
}

const addingNode = defineModel<boolean>('addingNode')
const selectedNode = defineModel<number|null>('selectedNode')

/*const model = defineModel();
const emit = defineEmits(['nodeSelected']);*/

const props = defineProps({
  nodes: Array as () => TreeNode[],
  projectId: Number
});

const tree = ref<TreeNode[]>([]);

const handleNodeSelected = ({nodeId, node }: {nodeId: number, node: TreeNode}) => {
  if (node.isSelected) {
    clearSelection(tree.value);
    node.isSelected = false;
    selectedNode.value = null
  } else {
    clearSelection(tree.value);
    node.isSelected = true;
    selectedNode.value = node.id
  }
};

function clearSelection(nodes: TreeNode[]) {
  nodes.forEach(node => {
    node.isSelected = false;
    if (node.children && node.children.length > 0) {
      clearSelection(node.children);
    }
  });
}

function addNode() {

}

function cancelAddNode() {
  addingNode.value = false
}

provide('selectedNodeId', selectedNode)

onMounted(async () => {
  if (props.nodes) {
    tree.value = props.nodes;
  }
});
</script>

<template>
  <div>
<!--    <new-node v-if="addingNode && !selectedNode" @accept="addNode" @cancel="cancelAddNode" />-->

    <ul class="tree-view" v-if="tree.length">
      <template v-for="node in tree" :key="node.id">
        <tree-view-node
            :node="node"
            @nodeSelected="handleNodeSelected"
            :adding-node="addingNode"
        />
      </template>
    </ul>
  </div>
</template>

<style scoped>
.tree-view {
  list-style-type: none;
}
</style>