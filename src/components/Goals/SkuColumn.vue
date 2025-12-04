<script setup>
import { ref, computed } from 'vue'
import { useFormatter } from '@/composables/useFormatter'

const props = defineProps({
  current: Object,
  previous: {
    type: Object,
    required: false,
    default: undefined,
  },
  goal: {
    type: [Number, String],
    required: false,
    default: undefined,
  },
  best: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const calPercentage = (cur, prev) => Math.round(((cur - prev) / prev) * 100)

const hasIndicator = computed(() => (props.best || (props.goal && props.current.quantity < props.goal) ? true : false))
</script>
<template>
  <td :class="['w-auto whitespace-nowrap px-3 py-4 text-center text-sm text-slate-700']">
    <div class="space-y-2">
      <div class="group/units flex flex-grow flex-wrap items-center justify-center">
        <!-- <span
          :class="[
            'items-center rounded-full py-0.5 px-2.5 text-lg transition-all',
            best
              ? 'bg-indigo-100 text-indigo-600'
              : goal && current.quantity < goal
              ? previous && previous.quantity < goal
                ? 'bg-red-100 text-red-600'
                : 'bg-yellow-100 text-yellow-600'
              : 'bg-slate-50',
          ]"
        >
          {{ useFormatter.number(current.quantity) }}
        </span> -->
        <div class="flex items-center space-x-1">
          <span
            v-if="hasIndicator"
            :class="[
              'h-1.5 w-1.5 items-center rounded-full text-lg transition-all',
              best
                ? 'bg-indigo-400'
                : goal && current.quantity < goal
                ? previous && previous.quantity < goal
                  ? 'bg-red-400'
                  : 'bg-yellow-400'
                : 'hidden',
            ]"
          >
          </span>
          <span>
            {{ useFormatter.number(current.quantity) }}
          </span>
        </div>
      </div>
      <div class="flex flex-grow flex-wrap items-baseline justify-center">
        <div class="text-xs text-slate-500">{{ useFormatter.currency(current.revenue) }}</div>
      </div>
    </div>
  </td>
</template>
