<script setup lang="ts">
import SyTreeTable from "@/components/SyTreeTable/SyTreeTable.vue";
import {ColumnType} from "@/components/SyTreeTable/types";
import {ref} from "vue";

const expRowKeys = ref([])
const data = [
  {
    "id": 1,
    "weight": 15,
    "text": "Root Node",
    "categories": ["root", "entry"]
  },
  {
    "id": 2,
    "parent_id": 1,
    "weight": 10,
    "text": "Child Node 1",
    "categories": ["branch"]
  },
  {
    "id": 3,
    "parent_id": 1,
    "weight": 8,
    "text": "Child Node 2",
    "categories": ["branch"]
  },
  {
    "id": 4,
    "parent_id": 2,
    "weight": 5,
    "text": "Grandchild Node 1",
    "categories": ["leaf"]
  },
  {
    "id": 5,
    "parent_id": 2,
    "weight": 4,
    "text": "Grandchild Node 2",
    "categories": ["leaf"]
  },
  {
    "id": 6,
    "parent_id": 3,
    "weight": 7,
    "text": "Grandchild Node 3",
    "categories": ["branch"]
  },
  {
    "id": 7,
    "parent_id": 3,
    "weight": 6,
    "text": "Grandchild Node 4",
    "categories": ["branch"]
  },
  {
    "id": 8,
    "parent_id": 6,
    "weight": 3,
    "text": "Great-Grandchild Node 1",
    "categories": ["leaf"]
  },
  {
    "id": 9,
    "parent_id": 6,
    "weight": 2,
    "text": "Great-Grandchild Node 2",
    "categories": ["leaf"]
  },
  {
    "id": 10,
    "parent_id": 7,
    "weight": 1,
    "text": "Great-Grandchild Node 3",
    "categories": ["leaf"]
  },
  {
    "id": 11,
    "parent_id": 7,
    "weight": 1,
    "text": "Great-Grandchild Node 4",
    "categories": ["leaf"]
  }
]

</script>

<template>
  <sy-tree-table
      :items="data"
      :columns="[{
       title: 'Title',
       key: 'text',
       type: ColumnType.Text,
       width: '30%'
      }, {
        title: 'Categories',
        key: 'categories',
        type: ColumnType.Text
      }]"
      key-field="id"
      parent-id-field="parent_id"
      v-model:expanded-row-keys="expRowKeys"
  />
</template>

<style scoped>

</style>