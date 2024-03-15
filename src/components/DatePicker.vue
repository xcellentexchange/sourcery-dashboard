<script setup>
import { ref, toRaw } from 'vue'
import { DatePicker } from 'v-calendar'
import { ArrowLongRightIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { DateTime } from 'luxon'
import DropDown from './DropDown.vue'
import { useDates } from '../composables/useDates'
import { useTimeIntervals } from '@/composables/useTimeIntervals'

const { timezone, config, views, presets } = useDates()
const { setTimeInterval, timeIntervalOptions, timeInterval } = useTimeIntervals()
const range = ref(props.initialRange)
const preset = ref(null)
const calendar = ref(null)

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
  emit('update:initialRange', range.value)
}

const cancelRange = () => {
  selectRange({ mode: 'select', value: props.initialRange })
  calendar.value.hidePopover()
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
  <DatePicker
    :model-value="range"
    @update:model-value="selectRange({ mode: 'select', value: $event })"
    :model-config="config"
    is-range
    :timezone="timezone"
    ref="calendar"
    :columns="2"
    transition="slide-h"
    :max-date="new Date()"
    :popover="{
      keepVisibleOnInput: true,
      // visibility: 'hover-focus',
      visibility: 'click',
    }"
    :select-attribute="attr"
    :drag-attribute="attr"
  >
    <template #default="{ inputValue, inputEvents, togglePopover }">
      <div class="flex items-stretch justify-center text-slate-400 focus-within:text-slate-500" @click.stop="togglePopover()">
        <div class="relative flex flex-grow items-stretch">
          <CalendarIcon class="absolute inset-y-0 left-0 z-10 ml-2 mr-6 h-full w-4 text-slate-400" />
          <input
            :value="inputValue.start"
            v-on="inputEvents.start"
            :class="['appearance-none rounded-md border border-transparent py-2 pl-8 pr-2 text-center focus:outline-none sm:text-sm', 'shadow-md']"
          />
        </div>
        <ArrowLongRightIcon class="mx-2 h-auto w-4 flex-grow-0 align-middle" />
        <div class="relative flex flex-grow items-stretch">
          <CalendarIcon class="absolute inset-y-0 left-0 z-10 ml-2 mr-6 h-full w-4 text-slate-400" />
          <input
            :value="inputValue.end"
            v-on="inputEvents.end"
            :class="['appearance-none rounded-md border border-transparent py-2 pl-8 pr-2 text-center focus:outline-none sm:text-sm', 'shadow-md']"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-stretch justify-between space-x-2 border-t border-gray-100 px-2 py-4">
        <DropDown
          :options="presets"
          v-model:current-option="preset"
          @update:current-option="selectRange({ mode: 'preset', value: $event })"
          placeholder="Custom Range"
          position="left-0"
          width="w-full"
          class="w-full rounded-md border border-gray-100"
        />
        <!-- <DropDown
          :options="views"
          v-model:current-option="view"
          @update:current-option="$emit('update:view', $event)"
          position="left-0"
          width="w-full"
          class="w-full rounded-md border border-gray-100"
        /> -->
        <DropDown
          v-model:current-option="timeInterval.value"
          :options="timeIntervalOptions"
          @update:current-option="setTimeInterval"
          position="left-0"
          width="w-full"
          class="w-full rounded-md border border-gray-100"
        />
      </div>
      <div class="flex items-stretch justify-end space-x-2 px-2 pb-4">
        <button
          :class="[
            'rounded border border-transparent px-4 py-2 text-slate-500 focus:border-gray-300 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ]"
          @click.stop="cancelRange"
        >
          Cancel
        </button>
        <button
          :disabled="disabled"
          :class="[
            'rounded border border-transparent px-4 py-2 font-medium text-indigo-600 transition hover:bg-indigo-600 hover:text-white focus:border-indigo-600 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ]"
          @click="updateRange"
        >
          Apply
        </button>
      </div>
    </template>
  </DatePicker>
</template>
