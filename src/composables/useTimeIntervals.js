import { ref, computed } from 'vue'

const timeIntervalOptions = [
  { name: 'Weekly', value: 'week', intervalsPerYear: 52 },
  { name: 'Monthly', value: 'month', intervalsPerYear: 12 },
]
const timeInterval = ref(timeIntervalOptions.find((option) => option.value === 'month'))

const loadTimeInterval = () => {
  if (localStorage.getItem('timeInterval') !== null) timeInterval.value = JSON.parse(localStorage.getItem('timeInterval'))
}
loadTimeInterval()

const saveTimeInterval = () => localStorage.setItem('timeInterval', JSON.stringify(timeInterval.value))

export function useTimeIntervals() {
  const setTimeInterval = (interval) => {
    try {
      timeInterval.value = timeIntervalOptions.find((option) => option.value === interval)
      saveTimeInterval()
    } catch (e) {
      console.log(e)
    }
  }

  return {
    timeInterval: computed(() => timeInterval.value),
    timeIntervalOptions: computed(() => timeIntervalOptions),
    setTimeInterval,
  }
}
