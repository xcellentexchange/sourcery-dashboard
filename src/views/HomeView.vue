<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'
import { QrCodeIcon, AtSymbolIcon } from '@heroicons/vue/20/solid'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const quickstartItems = [
  {
    title: 'Create an Email Signature',
    description: 'Generate a company email signature.',
    icon: AtSymbolIcon,
    background: 'bg-green-500',
    href: '/signature-generator',
  },
  {
    title: 'Create Transparency Labels',
    description: 'Create Amazon Transparency labels.',
    icon: QrCodeIcon,
    background: 'bg-indigo-500',
    href: '/transparency',
  },
]
</script>
<template>
  <div class="flex h-screen flex-col items-center justify-center">
    <div class="flex max-w-4xl flex-col items-center justify-center rounded-xl bg-white py-16 px-16 shadow-sm">
      <div class="w-full">
        <h1 v-if="user" class="text-2xl font-medium text-slate-700">Hi, {{ user.first_name }}!</h1>
        <p class="mt-1 text-sm text-slate-500">What would you like to do?</p>
      </div>
      <ul class="mt-6 grid w-full grid-cols-1 gap-6 border-t border-b border-gray-200 py-6 sm:grid-cols-2">
        <li v-for="(item, itemIdx) in quickstartItems" :key="itemIdx" class="group/item flow-root">
          <div class="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-slate-50">
            <div :class="[item.background, 'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg']">
              <component :is="item.icon" class="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-slate-900">
                <RouterLink :to="item.href" class="focus:outline-none">
                  <span class="absolute inset-0" aria-hidden="true" />
                  {{ item.title
                  }}<span aria-hidden="true" class="relative transition-all group-hover/item:translate-x-2 group-hover/item:pl-2"> &rarr;</span>
                </RouterLink>
              </h3>
              <p class="mt-1 text-sm text-slate-500">{{ item.description }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
