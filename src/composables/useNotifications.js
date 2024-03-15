import { ref, computed } from 'vue'
const notifications = ref([
  // {
  //   id: 'nonsense',
  //   type: 'info',
  //   title: 'Test Message',
  //   message: `This is a really long message! Like seriously, it's really really long for a notification message.`,
  //   autoClose: false,
  // },
])

const defaultNotificationOptions = {
  type: 'info',
  message: 'Ooops! A message was not provided.',
  autoClose: true,
  duration: 5,
}

export function useNotifications() {
  const createNotification = (options) => {
    const _options = Object.assign({ ...defaultNotificationOptions }, options)
    const notification = {
      // id: createUUID(),
      id: crypto.randomUUID(),
      ..._options,
    }
    notifications.value.push(notification)
    return notification
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((item) => item.id === id)
    if (index !== -1) notifications.value.splice(index, 1)
  }

  return {
    notifications: computed(() => notifications.value),
    notificationsCount: computed(() => notifications.value.length),
    createNotification,
    removeNotification,
  }
}
