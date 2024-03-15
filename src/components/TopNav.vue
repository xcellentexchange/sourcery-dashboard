<script setup>
import { BellIcon, BellAlertIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
// import { BellAlertIcon } from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { useUserStore } from '../stores'
import { storeToRefs } from 'pinia'
// import router from '../router'

import { useNotifications } from '@/composables/useNotifications'

const { notificationsCount } = useNotifications()

const userStore = useUserStore()

const { profile: user } = storeToRefs(userStore)

const navItems = [
  { name: 'Dashboard', href: '/' },
  {
    name: 'Transparency',
    href: '/transparency',
  },
  {
    name: 'Email Signature',
    href: '/signature-generator',
  },
  {
    name: 'Goals',
    href: '/goals',
  },
]

const userNavigation = [
  {
    name: 'Your Profile',
    href: '/profile',
  },
  { name: 'Settings', href: '#' },
  { name: 'Sign Out', href: '/logout' },
]
</script>
<template>
  <Disclosure as="nav" class="fixed z-30 w-full border-b border-gray-200 bg-white" v-slot="{ open }">
    <div class="mx-auto px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <div class="hidden space-x-8 lg:flex">
            <RouterLink
              :class="[
                item.href === $route.path
                  ? 'border-indigo-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:border-gray-300 hover:text-slate-700',
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
              ]"
              v-for="item in navItems"
              :to="item.href"
              >{{ item.name }}</RouterLink
            >
          </div>
        </div>
        <div class="relative z-10 flex items-center lg:hidden">
          <DisclosureButton
            :class="[
              'inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
            ]"
          >
            <span class="sr-only">Open menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
          <button
            type="button"
            :class="[
              'relative rounded-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              notificationsCount ? 'text-indigo-500 hover:text-indigo-600' : 'text-slate-400 hover:text-slate-500',
            ]"
          >
            <span class="sr-only">View Notifications</span>
            <component :is="notificationsCount ? BellAlertIcon : BellIcon" :class="['h-6 w-6']" aria-hidden="true" />
            <span
              v-if="notificationsCount"
              class="absolute -top-[0.25rem] -right-[0.25rem] flex h-5 min-w-[1.25rem] items-center justify-center self-start rounded-full bg-red-500 px-1 text-[0.625rem] text-white"
              >{{ notificationsCount }}</span
            >
          </button>
          <Menu v-if="user" as="div" class="relative ml-3">
            <div class="flex-shrink-0">
              <MenuButton
                class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="user.picture" :alt="user.name" referrerpolicy="no-referrer" />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <RouterLink :to="item.href" :class="[active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700']">
                    {{ item.name }}
                  </RouterLink>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
      <DisclosurePanel class="lg:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3">
          <DisclosureButton
            v-for="item in navItems"
            :class="[
              item.href === $route.path ? 'text-indigo-500' : 'text-slate-500 hover:text-slate-700',
              'block w-full rounded-md py-2 px-3 text-left text-base font-medium hover:bg-slate-50',
            ]"
            @click="() => $router.push(`${item.href}`)"
            >{{ item.name }}
          </DisclosureButton>
        </div>
        <div class="border-t border-slate-200 pt-4 pb-3">
          <div class="flex items-center px-4">
            <template v-if="user">
              <div class="flex-shrink-0">
                <img class="h-10 w-10 rounded-full" :src="user.picture" :alt="user.name" referrerpolicy="no-referrer" />
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-slate-700">{{ user.name }}</div>
                <div class="text-base font-medium text-slate-700">{{ user.email }}</div>
              </div>
            </template>
            <button
              type="button"
              :class="[
                'relative ml-auto rounded-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                notificationsCount ? 'text-indigo-500 hover:text-indigo-600' : 'text-slate-400 hover:text-slate-500',
              ]"
            >
              <span class="sr-only">View Notifications</span>
              <component :is="notificationsCount ? BellAlertIcon : BellIcon" :class="['h-6 w-6']" aria-hidden="true" />
              <span
                v-if="notificationsCount"
                class="absolute -top-[0.25rem] -right-[0.25rem] flex h-5 min-w-[1.25rem] items-center justify-center self-start rounded-full bg-red-500 px-1 text-[0.625rem] text-white"
                >{{ notificationsCount }}</span
              >
            </button>
          </div>
          <div class="mt-3 px-2">
            <DisclosureButton
              v-for="item in userNavigation"
              :class="['block w-full rounded-md px-4 py-2 text-left text-base font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700']"
              @click="() => $router.push(`${item.href}`)"
            >
              {{ item.name }}
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>
