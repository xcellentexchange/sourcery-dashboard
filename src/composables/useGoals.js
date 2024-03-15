import { ref, computed } from 'vue'
import { useApiQuery } from './useApiQuery'
import { useNotifications } from '@/composables/useNotifications'

const ws = new WebSocket(`${import.meta.env.VITE_API_WEBSOCKET_URL}`)

// const validateSocketConnection = async () => {
//   if (ws.value.readyState === 3) {
//     ws.value.close()
//     ws.value = new WebSocket(`${import.meta.env.VITE_API_WEBSOCKET_URL}`)

//     while (ws.value.readyState !== 1) {
//       await new Promise((r) => setTimeout(r, 250))
//     }
//   }
// }

ws.addEventListener('open', () => console.log(`Connected to websocket`))

ws.addEventListener('message', ({ data }) => {
  data = JSON.parse(data)
  if (data.type === 'goals') {
    goals.value = data.content
    createNotification({
      type: 'info',
      title: 'There Has Been a Change!',
      message: `Another user has updated goals.`,
      autoClose: true,
      duration: 10,
    })
  }
})

const { runQuery } = useApiQuery()
const { createNotification } = useNotifications()

const goals = ref([])

const upsert = (array, element, key) => {
  const i = array.findIndex((_element) => _element[key] === element[key])
  if (i > -1) array[i] = element
  else array.push(element)
}

const sendGoals = async () => {
  // await validateSocketConnection()
  ws.send(JSON.stringify({ type: 'goals', content: goals.value }))
}

const loadGoals = async () => {
  // if (localStorage.getItem('goals') !== null) goals.value = JSON.parse(localStorage.getItem('goals'))

  try {
    const response = await runQuery({ section: 'goals', action: 'getGoals' })
    // console.log(response)
    goals.value = response
  } catch (e) {
    console.log(e)
  }
}

loadGoals()

const saveGoals = () => {
  localStorage.setItem('goals', JSON.stringify(goals.value))
}

const upsertGoal = async (goal) => {
  // return console.log(goal)
  try {
    const response = await runQuery({ section: 'goals', action: 'setGoal', params: goal, method: 'POST' })
    await loadGoals()
    sendGoals()
    createNotification({
      type: 'success',
      title: 'Successfully Saved!',
      message: `The goal for ${goal.sku} (${goal.asin}) has been saved.`,
      autoClose: true,
      duration: 5,
    })
  } catch (e) {
    createNotification({
      type: 'error',
      title: 'Yikes!',
      message: 'Something went wrong saving the goals.',
      autoClose: true,
      duration: 5,
    })
  }
}

export function useGoals() {
  const goalSku = ref(null)
  const goalAsin = ref(null)

  const setGoalProperties = ({ sku, asin }) => {
    goalSku.value = sku
    goalAsin.value = asin
  }

  const setGoal = (goal) => {
    try {
      // upsert(goals.value, goal, 'sku')
      // saveGoals()
      upsertGoal(goal)
    } catch (e) {
      console.log(e)
    }
  }

  const goal = computed(() => goals.value.find((g) => g.sku === goalSku.value && g.asin === goalAsin.value)?.goal || 0)

  return {
    goals: computed(() => goals.value),
    goal,
    setGoalProperties,
    setGoal,
  }
}
