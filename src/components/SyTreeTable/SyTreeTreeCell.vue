<script setup lang="ts">
import SyTreeCell from "@/components/SyTreeTable/SyTreeCell.vue";
import SyTreeGuide from "@/components/SyTreeTable/SyTreeGuide.vue";
import SyTreeExpandButton from "@/components/SyTreeTable/SyTreeExpandButton.vue";
const props = defineProps<{value: any, level: number, isExpanded: boolean, hasChildren: boolean}>()
</script>

<template>
  <sy-tree-cell :value="props.value" class="sy-tree-table-tree-col">
    <template #default="{ value }">
      <sy-tree-guide :level="level" />
      <sy-tree-expand-button v-show="hasChildren" :is-expanded="isExpanded" />
      {{ value }}
    </template>
  </sy-tree-cell>
</template>

<style scoped>

</style>