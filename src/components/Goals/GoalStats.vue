<script setup>
import { toRefs, computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'
import { useFormatter } from '@/composables/useFormatter'

const props = defineProps({
  totalRevenue: Number,
  historicalRevenue: Number,
})

const { totalRevenue, historicalRevenue } = toRefs(props)

const percentageDifference = computed(
  () => useFormatter.number(((historicalRevenue.value - totalRevenue.value) / historicalRevenue.value).toFixed(2)) * 100 || 0
)
</script>
<template>
  <div class="mb-6 flex items-center justify-start space-x-4">
    <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
      <div
        v-for="item in [
          { name: 'Historical', id: 'historical', stat: historicalRevenue },
          { name: 'Goal', id: 'goal', stat: totalRevenue },
        ]"
        :key="item.id"
        class="relative overflow-hidden rounded-lg bg-white px-4 py-4 text-center shadow sm:px-6 sm:pt-6"
      >
        <dt>
          <p class="truncate text-sm font-medium text-slate-500">{{ item.name }}</p>
        </dt>
        <dd class="flex items-center justify-center pb-6 sm:pb-7">
          <p class="text-2xl font-semibold text-slate-900">{{ useFormatter.currency(item.stat) }}</p>
          <p
            v-if="item.id === 'goal'"
            :class="[totalRevenue >= historicalRevenue ? 'text-green-600' : 'text-red-600', 'ml-2 flex items-baseline text-sm font-semibold']"
          >
            <ArrowUpIcon v-if="totalRevenue >= historicalRevenue" class="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
            <ArrowDownIcon v-else class="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
            <span class="sr-only"> {{ totalRevenue >= historicalRevenue ? 'Increased' : 'Decreased' }} by </span>
            {{ useFormatter.number(((historicalRevenue - totalRevenue) / historicalRevenue).toFixed(2)) * 100 }}%
          </p>
        </dd>
      </div>
    </dl>
  </div>
</template>
