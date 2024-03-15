<script setup>
import { computed } from 'vue'
import { asyncComputed } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAuthStore, useUserStore } from '@/stores'
import GooglWorkspaceLogo from '@/assets/GoogleWorkspaceLogo.svg'
import GoogleIcon from '@/assets/GoogleIcon.svg'

const userStore = useUserStore()
const { profile: user } = storeToRefs(userStore)

// const retrievedUser = asyncComputed(() => userStore.getUserById(1))

const profile = [
  { title: 'Name', value: `${user.value.first_name} ${user.value.last_name}` },
  { title: 'Email', value: user.value.email },
  { title: 'Photo', value: user.value.picture },
]
</script>
<template>
  <div class="flex h-screen items-center justify-center bg-slate-50 pt-16">
    <div class="flex w-auto max-w-4xl flex-1 rounded-xl bg-white py-8 px-8 shadow-sm">
      <div class="w-full divide-y divide-gray-200">
        <div class="w-full space-y-1">
          <h3 class="text-lg font-medium leading-6 text-slate-900">Profile</h3>
          <p class="flex max-w-2xl items-center text-sm text-slate-500">
            <template v-if="user.iss === 'https://accounts.google.com'"
              >Your profile information is provided by <a :href="user.iss" target="_blank"><GoogleIcon class="ml-1 inline h-4 w-4" /></a
            ></template>
            <template v-else>View or update your information.</template>
          </p>
        </div>
        <div class="mt-6">
          <dl class="divide-y divide-gray-200">
            <div v-for="(item, itemIdx) in profile" :key="itemIdx" class="items-center py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt class="text-sm font-medium text-slate-500">{{ item.title }}</dt>
              <dd class="mt-1 flex justify-end text-sm text-slate-900 sm:col-span-2 sm:mt-0">
                <template v-if="item.title === 'Photo'">
                  <img class="h-12 w-12 rounded-full" :src="user.picture" :alt="user.name" referrerpolicy="no-referrer" />
                </template>
                <template v-else>
                  <span>{{ item.value }}</span>
                </template>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    <pre>{{ retrievedUser }}</pre>
  </div>
</template>
