<script setup>
import { ref, computed, onMounted, reactive, watch, watchEffect, onBeforeUnmount } from 'vue'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import { DateTime } from 'luxon'
import { useFormatter } from '@/composables/useFormatter'
import { useGoals } from '@/composables/useGoals'
import { useTimeIntervals } from '@/composables/useTimeIntervals'
import { useProductImage } from '@/composables/useProductImage'
import SkuColumn from './SkuColumn.vue'

import TagElement from '../Elements/TagElement.vue'

const props = defineProps({
  dates: Array,
  row: Object,
  index: Number,
  tableScrolled: Boolean,
})

const emit = defineEmits(['updateRevenue'])

const { setGoal, setGoalProperties, goal: annualGoal } = useGoals()
const { timeInterval } = useTimeIntervals()
const { setProductAsin, productImage } = useProductImage()

setProductAsin(props.row.asin)
setGoalProperties({ sku: props.row.sku, asin: props.row.asin })
const skuImage = productImage

const totalDates = computed(() => props.dates)
const skuDates = computed(() => props.row.dates)
const dates = computed(() =>
  totalDates.value.map(
    (d) =>
      skuDates.value.find((s) => s[timeInterval.value.value] === d[timeInterval.value.value] && s.year === d.year) || {
        ...d,
        ...{ revenue: 0, quantity: 0 },
      }
  )
)
const averageQuantity = computed(() => {
  const sum = dates.value.reduce((a, c) => a + c.quantity, 0)
  return (sum / dates.value.length).toFixed(1)
})
const averagePrice = computed(() => {
  const sum = skuDates.value.reduce((a, c) => a + (c.quantity ? (c.revenue / c.quantity) : 0), 0)
  return (sum / skuDates.value.length).toFixed(2)
})
const averageRevenue = computed(() => averagePrice.value * averageQuantity.value)

const intervalGoal = ref(0)

// const intervalGoal = ref((annualGoal.value / timeInterval.value.intervalsPerYear).toFixed(0))

const annualRevenue = computed(() => intervalGoal.value * timeInterval.value.intervalsPerYear * averagePrice.value)
const intervalRevenue = computed(() => intervalGoal.value * averagePrice.value)

const average = computed(() => ({ quantity: averageQuantity.value, revenue: averageRevenue.value }))
const best = computed(() => dates.value.reduce((a, c) => (a.quantity > c.quantity ? a : c)))

watch(
  annualRevenue,
  (revenue, previousRevenue) => {
    emit('updateRevenue', revenue - (previousRevenue || 0))
  },
  { immediate: true }
)

watchEffect(() => {
  // console.log(`${props.row.sku} Annual Goal = ${annualGoal.value}`)
  intervalGoal.value = (annualGoal.value / timeInterval.value.intervalsPerYear).toFixed(0)
})

onBeforeUnmount(() => {
  emit('updateRevenue', -annualRevenue.value)
})
</script>
<template>
  <tr :class="[index % 2 === 0 ? undefined : 'bg-slate-50', 'divide-x divide-gray-100']">
    <td
      :class="[
        index % 2 === 0 ? 'bg-white' : 'bg-slate-50',
        'sticky left-0 z-0 whitespace-nowrap py-4 pl-4 pr-3 text-sm transition-all sm:pl-6',
        { 'border-r-4': tableScrolled },
      ]"
    >
      <div class="flex items-center">
        <div class="h-24 w-24 flex-shrink-0">
          <div class="h-24 w-24 overflow-hidden rounded-md bg-white p-2 shadow ring-1 ring-black ring-opacity-[.02]">
            <img v-if="skuImage" class="h-20 w-20 object-contain" :src="skuImage" alt="" />
            <PhotoIcon v-else class="h-20 w-20 animate-pulse text-slate-200" />
          </div>
        </div>
        <div class="ml-4">
          <div class="font-medium text-slate-900">{{ row.sku }}</div>
          <div>
            <TagElement
              v-if="row.asin"
              :class="['text-xs']"
              :value="row.asin"
              :link="`https://sellercentral.amazon.com/skucentral?mSku=${row.sku}&ref=myi_skuc`"
            />
          </div>
        </div>
      </div>
    </td>

    <template v-for="(col, idx) in dates">
      <SkuColumn :current="col" :previous="dates[idx - 1]" :goal="intervalGoal || averageQuantity" :best="col === best" />
    </template>
    <SkuColumn :current="best" :best="true" />
    <SkuColumn :current="average" />
    <td :class="['w-auto whitespace-nowrap px-3 py-4 text-center text-sm text-slate-500']">
      <div class="inline-flex w-full max-w-md rounded-md shadow-sm">
        <input
          v-model="intervalGoal"
          type="number"
          :name="`${row.asin}_goal`"
          :id="`${row.asin}_goal`"
          class="flex-grow rounded-l-md border-gray-300 text-center focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          type="button"
          class="-ml-px inline-flex items-center whitespace-nowrap rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-slate-700 hover:bg-slate-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
          @click="setGoal({ sku: row.sku, asin: row.asin, goal: intervalGoal * timeInterval.intervalsPerYear })"
        >
          Set Goal
        </button>
      </div>
      <div class="flex flex-wrap justify-center space-x-2">
        <div class="text-xs">
          <span class="font-semibold text-slate-900">{{ useFormatter.currency(intervalRevenue) }}</span
          ><span> per {{ timeInterval.value }}</span>
        </div>
        <div class="text-xs">
          <span class="font-semibold text-slate-900">{{ useFormatter.currency(annualRevenue) }}</span
          ><span> per year</span>
        </div>
      </div>
    </td>
  </tr>
</template>
