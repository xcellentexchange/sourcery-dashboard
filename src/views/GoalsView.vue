<script setup>
import { useGoals } from '@/composables/useGoals'
import GoalHeader from '@/components/Goals/GoalHeader.vue'
import SkuTable from '@/components/Goals/SkuTable.vue'

const { goals } = useGoals()
</script>

<template>
  <div class="flex h-screen flex-col px-8 pt-24 pb-8">
    <SkuTable />
    <!-- <GoalHeader /> -->
  </div>
</template>
