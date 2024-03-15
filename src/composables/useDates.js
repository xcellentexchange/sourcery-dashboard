import { ref, computed } from 'vue'
import { DateTime } from 'luxon'

const options = ref({
  timezone: 'America/Los_Angeles',
  config: {
    start: {
      timeAdjust: '00:00:00',
    },
    end: {
      timeAdjust: '23:59:59.999',
    },
  },
})

const calculatePresets = {
  last: (unit) => ({
    start: DateTime.now()
      .setZone(options.value.timezone, { keepLocalTime: true })
      .minus({ [`${unit}s`]: 1 })
      .startOf(unit)
      .toISO(),
    end: DateTime.now()
      .setZone(options.value.timezone, { keepLocalTime: true })
      .minus({ [`${unit}s`]: 1 })
      .endOf(unit)
      .toISO(),
  }),
  this: (unit) => ({
    start: DateTime.now().setZone(options.value.timezone, { keepLocalTime: true }).startOf(unit).toISO(),
    end: DateTime.now().setZone(options.value.timezone, { keepLocalTime: true }).endOf('day').toISO(),
  }),
}

export const useDates = () => {
  const views = [
    // { name: 'Hourly', value: 'hour' },
    // { name: 'Daily', value: 'day' },
    { name: 'Weekly', value: 'week' },
    { name: 'Monthly', value: 'month' },
    // { name: 'Quarterly', value: 'quarter' },
    // { name: 'Yearly', value: 'year' },
  ]

  const quarterPresets = [...Array(4).keys()].reduce((a, c) => {
    const start = DateTime.fromJSDate(new Date(), { zone: options.value.timezone, keepLocalTime: true }).startOf('year').plus({ quarter: c })
    const end = start.endOf('quarter')
    a.push({ name: `Q${c + 1}`, value: JSON.stringify({ start: start.toISO(), end: end.toISO() }) })
    return a
  }, [])

  const presets = [
    ...[
      { name: 'Today', value: JSON.stringify(calculatePresets.this('day')) },
      { name: 'Yesterday', value: JSON.stringify(calculatePresets.last('day')) },
      { name: 'This Week', value: JSON.stringify(calculatePresets.this('week')) },
      { name: 'Last Week', value: JSON.stringify(calculatePresets.last('week')) },
      { name: 'This Month', value: JSON.stringify(calculatePresets.this('month')) },
      { name: 'Last Month', value: JSON.stringify(calculatePresets.last('month')) },
      { name: 'This Quarter', value: JSON.stringify(calculatePresets.this('quarter')) },
      { name: 'Last Quarter', value: JSON.stringify(calculatePresets.last('quarter')) },
    ],
    // ...quarterPresets,
    ...[
      { name: 'This Year', value: JSON.stringify(calculatePresets.this('year')) },
      { name: 'Last Year', value: JSON.stringify(calculatePresets.last('year')) },
    ],
  ]

  const comparisons = [
    { name: 'No Comparisons', value: null },
    { name: 'Previous Period', value: 'period' },
    { name: 'Previous Year', value: 'year' },
  ]

  return {
    timezone: computed(() => options.value.timezone),
    config: computed(() => options.value.config),
    views,
    presets,
    comparisons,
  }
}
