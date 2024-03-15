<script setup>
import { ref, computed, watchEffect } from 'vue'
import { DateTime } from 'luxon'
import DropDown from '../DropDown.vue'
import DatePicker from '../DatePicker.vue'
import DatePickerNew from '../DatePickerNew.vue'
import { useTimeIntervals } from '@/composables/useTimeIntervals'
import { useDates } from '@/composables/useDates'
import { useFormatter } from '@/composables/useFormatter'
// import GoalStats from './GoalStats.vue'

const brand = ref(null)
// const brand = ref('Vitalití')
const brands = [{ name: 'All Brands', value: null }]

const { timeInterval } = useTimeIntervals()
const { presets } = useDates()

const range = ref(JSON.parse(presets.find((preset) => preset.name === 'This Year').value))
// const range = ref(JSON.parse(presets.find((preset) => preset.name === 'Yesterday').value))
</script>
<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative z-20 flex w-full items-center justify-between space-x-4">
      <DatePicker v-model:initial-range="range" v-model:view="timeInterval.name" @update:initial-range="(value) => (range = value)" />
      <!-- <DatePickerNew v-model:initial-range="range" v-model:view="timeInterval.name" @update:initial-range="(value) => (range = value)" /> -->
    </div>
  </div>
</template>
