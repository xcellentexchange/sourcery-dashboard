<script setup>
import { ref, computed, watchEffect } from 'vue'
import { DateTime } from 'luxon'
import SkuTableSkeleton from './SkuTableSkeleton.vue'
import SkuRow from './SkuRow.vue'
import DropDown from '../DropDown.vue'
import DatePicker from '../DatePicker.vue'
import { useTimeIntervals } from '@/composables/useTimeIntervals'
import { useSalesData } from '@/composables/useSalesData'
import { useDates } from '@/composables/useDates'
import { useFormatter } from '@/composables/useFormatter'
// import GoalStats from './GoalStats.vue'

const brand = ref(null)
// const brand = ref('Vitalití')

const { timeInterval } = useTimeIntervals()
const { getSalesData, salesData, loading: salesDataLoading } = useSalesData()
const { presets } = useDates()

const range = ref(JSON.parse(presets.find((preset) => preset.name === 'This Year').value))
// const range = ref(JSON.parse(presets.find((preset) => preset.name === 'Yesterday').value))

const formatWeek = ({ interval: week, year }) => {
  if (week === 0) {
    ;(week = 52), (year = --year)
  }
  const dt = DateTime.fromObject({
    weekYear: year,
    weekNumber: week,
  })
  return `${dt.startOf('week').toFormat(`MM/dd/yy`)}-${dt.endOf('week').toFormat(`MM/dd/yy`)}`
}

const formatMonth = ({ interval: month, year }) => {
  const dt = DateTime.fromObject({
    month,
    year,
  })
  return `${dt.startOf('month').toFormat(`MMM yyyy`)}`
}

const formatInterval = ({ interval, year }) => {
  if (timeInterval.value.value === 'week') return formatWeek({ interval, year })
  else return formatMonth({ interval, year })
}

const brands = computed(() => [
  ...[{ name: 'All Brands', value: null }],
  ...Array.from(new Set(salesData.value.map((sku) => JSON.stringify({ name: sku.brand, value: sku.brand }))), JSON.parse),
])
const filteredData = computed(() => salesData.value.filter((product) => product.brand.includes(brand.value || '')))
const dates = computed(() =>
  Array.from(
    new Set(
      filteredData.value
        .reduce(
          (skus, sku) =>
            skus.concat(
              sku.dates.map((date) => {
                return { [timeInterval.value.value]: date[timeInterval.value.value], year: date.year }
              })
            ),
          []
        )
        .map(JSON.stringify)
    ),
    JSON.parse
  ).sort((a, b) => {
    const compFn = (date) => `${date.year}${date[timeInterval.value.value].toString().padStart(2, 0)}`
    return compFn(a) - compFn(b)
  })
)
const historicalRevenue = computed(() =>
  filteredData.value.reduce((a, c) => {
    a += c.dates.map((date) => date.revenue).reduce((aa, cc) => aa + cc)
    return a
  }, 0)
)

const totalRevenue = ref(0)
const updateRevenue = (value) => (totalRevenue.value += value)

const tableScrolled = ref(false)
const tableScroll = (e) => (tableScrolled.value = e.target.scrollLeft > 0)

watchEffect(() => {
  console.log(`Running getSalesData with params: {range: ${range.value}, view: ${timeInterval.value.value}}`)
  getSalesData({ range: range.value, view: timeInterval.value.value })
})
</script>
<template>
  <div class="flex h-full w-full flex-col">
    <!-- <GoalStats :historical-revenue="historicalRevenue" :total-revenue="totalRevenue" /> -->
    <div class="relative z-20 flex w-full items-center justify-between space-x-4">
      <div class="flex w-1/2 items-center justify-start space-x-4">
        <h1 class="text-lg font-medium leading-6 text-slate-900">Brand Revenue Goals</h1>
        <div :class="['w-72']">
          <DropDown shadow v-model:current-option="brand" :options="brands" :placeholder="`Filter by brand`" :disabled="salesDataLoading" />
        </div>

        <h1 class="text-lg font-medium leading-6 text-slate-900">{{ useFormatter.currency(totalRevenue) }}</h1>
        <!-- <div :class="['w-72']">
          <DropDown
            shadow
            :disabled="salesDataLoading"
            v-model:current-option="timeInterval.name"
            :options="timeIntervalOptions"
            @update:current-option="setTimeInterval"
          />
        </div> -->
      </div>
      <DatePicker
        v-model:initial-range="range"
        v-model:view="timeInterval.value"
        @update:initial-range="(value) => (range = value)"
        :disabled="salesDataLoading"
      />
    </div>
    <div class="relative mt-6 overflow-auto bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg" @scroll="tableScroll">
      <table
        v-if="!salesDataLoading"
        class="relative min-w-full table-auto border-separate border-spacing-0 divide-y divide-slate-300 ring-1 ring-black ring-opacity-5"
      >
        <thead class="bg-slate-50">
          <tr class="divide-x divide-slate-300">
            <th
              scope="col"
              :class="[
                'sticky left-0 top-0 z-10 whitespace-nowrap border-slate-300 bg-slate-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 transition-all sm:pl-6',
                'border-b border-slate-300',
                { 'border-r-4': tableScrolled },
              ]"
            >
              SKU
            </th>
            <th
              scope="col"
              :class="[
                'whitespace-nowrap px-3 py-3.5 text-center text-sm font-semibold text-slate-900',
                'border-b border-slate-300',
                'sticky top-0 bg-slate-50',
              ]"
              v-for="{ [timeInterval.value]: interval, year } in dates"
              :key="interval"
            >
              {{ formatInterval({ interval, year }) }}
            </th>
            <th
              scope="col"
              :class="['px-3 py-3.5 text-center text-sm font-semibold text-slate-900', 'border-b border-slate-300', 'sticky top-0 bg-slate-50']"
            >
              Best
            </th>
            <th
              scope="col"
              :class="['px-3 py-3.5 text-center text-sm font-semibold text-slate-900', 'border-b border-slate-300', 'sticky top-0 bg-slate-50']"
            >
              Average
            </th>
            <th
              scope="col"
              :class="['px-3 py-3.5 text-center text-sm font-semibold text-slate-900', 'border-b border-slate-300', 'sticky top-0 bg-slate-50']"
            >
              Goal
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          <SkuRow
            v-for="(row, rowIdx) in filteredData"
            :dates="dates"
            :row="row"
            :index="rowIdx"
            :key="`${row.asin}_${row.sku}`"
            @update-revenue="updateRevenue"
            :tableScrolled="tableScrolled"
          />
        </tbody>
      </table>
      <SkuTableSkeleton v-else />
    </div>
  </div>
</template>
