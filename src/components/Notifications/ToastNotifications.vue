<script setup>
import { useNotifications } from '@/composables/useNotifications'
import ToastNotification from '@/components/Notifications/ToastNotification.vue'

const { notifications, removeNotification } = useNotifications()

const leave = (el) => {
  el.style.left = `${el.offsetLeft}px`
  el.style.top = `${el.offsetTop}px`
  el.style.width = window.getComputedStyle(el).width
  el.style.position = 'absolute'
}
</script>
<template>
  <!-- <div class="fixed inset-x-0 bottom-0 z-10 ml-auto flex w-full justify-end pb-2 sm:pb-5 lg:w-1/2"> -->
  <div class="pointer-events-none fixed inset-0 top-10 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6">
    <!-- <div class="relative max-w-2xl flex-grow px-2 sm:px-6 lg:px-8"> -->
    <div class="relative flex w-full flex-col items-center space-y-4 sm:items-end">
      <transition-group
        enter-active-class="transition transform duration-100 ease-out"
        enter-from-class="transform scale-50 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition transform duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
        @leave="leave"
        move-class="transition ease"
      >
        <ToastNotification
          v-for="(item, idx) in notifications"
          :key="item.id"
          :id="item.id"
          :type="item.type"
          :title="item.title"
          :message="item.message"
          :auto-close="item.autoClose"
          :duration="item.duration"
          @close="() => removeNotification(item.id)"
        />
      </transition-group>
    </div>
  </div>
</template>
