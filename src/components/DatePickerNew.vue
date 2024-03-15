<script setup>
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { ArrowLongRightIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { DateTime } from 'luxon'
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  startOfWeek,
  startOfQuarter,
  endOfQuarter,
  subQuarters,
  endOfWeek,
  subWeeks,
  subMonths,
  subDays,
  subYears,
  isFuture,
} from 'date-fns'
import { utcToZonedTime, format } from 'date-fns-tz'
import DropDown from './DropDown.vue'
import { useDates } from '../composables/useDates'
import { useTimeIntervals } from '@/composables/useTimeIntervals'

import colors from 'tailwindcss/colors'

const { timezone, config, views, presets } = useDates()
const { setTimeInterval, timeIntervalOptions, timeInterval } = useTimeIntervals()
const range = ref(Object.values(props.initialRange))
const preset = ref(null)
const calendar = ref(null)

const presetRanges = ref([
  { label: 'Today', range: [new Date(), new Date()] },
  { label: 'Yesterday', range: [subDays(new Date(), 1), subDays(new Date(), 1)] },
  { label: 'This Week', range: [startOfWeek(new Date()), isFuture(endOfWeek(new Date())) ? new Date() : endOfWeek(new Date())] },
  { label: 'Last Week', range: [startOfWeek(subWeeks(new Date(), 1)), endOfWeek(subWeeks(new Date(), 1))] },
  { label: 'This Month', range: [startOfMonth(new Date()), isFuture(endOfMonth(new Date())) ? new Date() : endOfMonth(new Date())] },
  {
    label: 'Last Month',
    range: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
  { label: 'This Quarter', range: [startOfQuarter(new Date()), isFuture(endOfQuarter(new Date())) ? new Date() : endOfQuarter(new Date())] },
  {
    label: 'Last Quarter',
    range: [startOfQuarter(subQuarters(new Date(), 1)), endOfQuarter(subQuarters(new Date(), 1))],
  },
  { label: 'This Year', range: [startOfYear(new Date()), isFuture(endOfYear(new Date())) ? new Date() : endOfYear(new Date())] },
  {
    label: 'Last Year',
    range: [startOfYear(subYears(new Date(), 1)), endOfYear(subYears(new Date(), 1))],
  },
])

const selectRange = (options) => {
  const defaults = {
    mode: 'select',
    value: '',
  }
  options = { ...defaults, ...options }
  let { mode, value } = options
  value = typeof value === 'object' ? value : JSON.parse(value)
  if (mode === 'preset') calendar.value.move(value.start)
  value = Object.keys(value).reduce((a, c) => ({ ...a, ...{ [c]: DateTime.fromJSDate(new Date(value[c])).setZone(timezone.value).toISO() } }), {})
  preset.value = JSON.stringify(value)
  range.value = value
}

const updateRange = () => {
  calendar.value.selectDate()
  // emit('update:initialRange', range.value)
}

const cancelRange = () => {
  // selectRange({ mode: 'select', value: props.initialRange })
  // calendar.value.hidePopover()
}

const props = defineProps({
  initialRange: Object,
  view: String,
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const attr = {
  highlight: {
    start: { fillMode: 'solid', contentClass: `bg-indigo-500 hover:bg-indigo-500 focus:bg-indigo-500` },
    base: { class: `bg-indigo-100` },
    end: { fillMode: 'solid', contentClass: `bg-indigo-500 hover:bg-indigo-500 focus:bg-indigo-500` },
  },
}

const emit = defineEmits(['update', 'update:initialRange', 'update:view', 'update:comparison'])
</script>
<template>
  <VueDatePicker
    ref="calendar"
    v-model="range"
    range
    multi-calendars
    six-weeks
    :timezone="timezone"
    :enable-time-picker="false"
    week-start="0"
    :month-change-on-scroll="false"
    :preset-ranges="presetRanges"
    :day-names="['S', 'M', 'T', 'W', 'T', 'F', 'S']"
    :class="['flex w-auto']"
    :max-date="subDays(new Date(), 1)"
  >
    <template #trigger>
      <div class="flex items-stretch justify-between text-slate-400 focus-within:text-slate-500">
        <div class="relative flex flex-grow items-stretch">
          <CalendarIcon class="absolute inset-y-0 left-0 z-10 ml-2 mr-6 h-full w-4 text-slate-400" />
          <input
            :value="format(utcToZonedTime(new Date(range[0]), timezone), 'MM/dd/yyyy')"
            :class="['appearance-none rounded-md border border-transparent py-2 pl-8 pr-2 text-center focus:outline-none sm:text-sm', 'shadow-md']"
          />
        </div>
        <ArrowLongRightIcon class="mx-2 h-auto w-4 flex-grow-0 align-middle" />
        <div class="relative flex flex-grow items-stretch">
          <CalendarIcon class="absolute inset-y-0 left-0 z-10 ml-2 mr-6 h-full w-4 text-slate-400" />
          <input
            :value="format(utcToZonedTime(new Date(range[1]), timezone), 'MM/dd/yyyy')"
            :class="['appearance-none rounded-md border border-transparent py-2 pl-8 pr-2 text-center focus:outline-none sm:text-sm', 'shadow-md']"
          />
        </div>
      </div>
    </template>
    <template #input-icon>
      <CalendarIcon class="ml-2 h-full w-4 text-slate-400" />
    </template>
    <template #arrow-left>
      <ChevronLeftIcon class="h-full w-4 text-slate-400" />
    </template>
    <template #arrow-right>
      <ChevronRightIcon class="h-full w-4 text-slate-400" />
    </template>
    <template #calendar-icon>
      <CalendarIcon class="h-full w-4 text-slate-400" />
    </template>
    <template #action-select>
      <div class="flex items-stretch justify-end space-x-2">
        <button
          :class="[
            'rounded border border-transparent py-2 px-4 text-slate-500 focus:border-gray-300 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ]"
          @click.stop="cancelRange"
        >
          Cancel
        </button>
        <button
          :disabled="disabled"
          :class="[
            'rounded border border-transparent py-2 px-4 text-indigo-600 transition hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ]"
          @click="updateRange"
        >
          Apply
        </button>
      </div>
    </template>
    <template #action-preview>
      <DropDown
        v-model:current-option="timeInterval.value"
        :options="timeIntervalOptions"
        @update:current-option="setTimeInterval"
        position="left-0"
        width="w-full"
        class="w-full rounded-md border border-gray-100"
      />
    </template>
    <!-- <template #left-sidebar>
      <div>Custom content</div>
    </template> -->
  </VueDatePicker>
</template>
<style lang="scss">
$dp__border_radius: 0.5rem;
$dp__cell_border_radius: 5rem;
$dp__cell_size: 2rem;
$dp__cell_padding: 0.25rem;

@import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';

.dp__theme_light {
  --dp-primary-color: v-bind(colors.indigo[ '500' ]);
  --dp-hover-color: v-bind(colors.slate[ '50' ]);
  --dp-border-color: v-bind(colors.slate[ '50' ]);
  --dp-menu-border-color: v-bind(colors.slate[ '100' ]);
}

.dp__calendar_header_item {
  @apply text-sm font-normal text-slate-600;
}

.dp__calendar_header_separator {
  @apply bg-slate-50;
}

.dp__calendar_item {
  @apply text-sm;
}

.dp__range_between {
  @apply border-indigo-50 bg-indigo-50 text-indigo-700;
}

.dp__date_hover_end:hover,
.dp__date_hover_start:hover {
  @apply bg-indigo-500 text-white;
}

.dp__range_end.dp__range_start {
  @apply rounded-full;
}

.dp__preset_range {
  @apply whitespace-nowrap text-sm font-normal text-slate-500;
}

.dp__menu_content_wrapper {
  @apply border-b border-slate-50;
}

.dp__preset_ranges,
.dp__action_row {
  @apply p-4;
}

.dp__instance_calendar {
  @apply p-2;
}

.dp__menu {
  @apply shadow-md;
}

.dp__month_year_select {
  @apply text-lg text-slate-700;
}
</style>
