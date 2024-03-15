<script setup>
import TopNav from '@/components/TopNav.vue'
import ToastNotifications from './components/Notifications/ToastNotifications.vue'
</script>

<template>
  <TopNav v-if="!$route.meta.hideTopNav" />
  <RouterView />
  <ToastNotifications />
</template>
