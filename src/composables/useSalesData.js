import { ref, computed, reactive, toRefs } from 'vue'
import { useApiQuery } from './useApiQuery'
import { useNotifications } from '@/composables/useNotifications'

const { runQuery } = useApiQuery()
const { createNotification, removeNotification } = useNotifications()

const salesData = ref([])
const state = reactive({
  loading: false,
})

const getSalesByPeriod = async (params) => {
  state.loading = true
  try {
    let { id: notificationId } = createNotification({
      type: 'info',
      title: 'Loading Sales Data',
      message: 'Please do not refresh the page.',
      autoClose: false,
    })
    const response = await runQuery({ section: 'sales', action: 'getSalesByPeriod', params })
    salesData.value = response
    removeNotification(notificationId)
    createNotification({
      type: 'success',
      title: 'Successfully Loaded!',
      message: 'The sales data has successfully loaded.',
      autoClose: true,
      duration: 5,
    })
  } catch (e) {
    console.log(e)
    createNotification({
      type: 'error',
      title: 'Yikes!',
      message: `Something went wrong getting the sales data:
      ${e.message}`,
      autoClose: true,
      duration: 5,
    })
  } finally {
    state.loading = false
  }
}

export function useSalesData() {
  const getSalesData = (params) => getSalesByPeriod(params)

  return {
    salesData: computed(() => salesData.value),
    getSalesData,
    ...toRefs(state),
  }
}
