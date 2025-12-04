<script setup>
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  type: {
    type: String,
    default: 'info',
    required: false,
  },
  title: { type: String, default: '', required: false },
  message: { type: String, default: 'Ooops! A message was not provided.', required: false },
  autoClose: { type: Boolean, default: true, required: false },
  duration: { type: Number, default: 5, required: false },
})

const timer = ref(-1)
const startedAt = ref(0)
const delay = ref(0)

onMounted(() => {
  if (props.autoClose) {
    startedAt.value = Date.now()
    delay.value = props.duration * 1000
    timer.value = setTimeout(close, delay.value)
  }
})

const toastIcon = computed(() => {
  switch (props.type) {
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'success':
      return CheckCircleIcon
    default:
      return InformationCircleIcon
  }
})

const close = () => emit('close')

const emit = defineEmits(['close'])
</script>
<template>
  <div
    :class="[
      'pointer-events-auto mt-2 w-full overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 sm:max-w-sm xl:max-w-md',
      //type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : type === 'success' ? 'bg-green-500' : 'bg-indigo-500',
      'bg-white',
    ]"
  >
    <div class="relative flex flex-wrap p-4">
      <div class="flex w-full items-start">
        <div class="flex-shrink-0">
          <span
            :class="[
              //'flex rounded-lg p-1',
              //type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-yellow-600' : type === 'success' ? 'bg-green-600' : 'bg-indigo-600',
            ]"
          >
            <component
              :is="toastIcon"
              :class="[
                'h-6 w-6',
                //'text-white',
                type === 'error'
                  ? 'text-red-400'
                  : type === 'warning'
                  ? 'text-yellow-400'
                  : type === 'success'
                  ? 'text-green-400'
                  : 'text-indigo-400',
              ]"
              aria-hidden="true"
            />
          </span>
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p
            v-if="title"
            :class="[
              'truncate text-sm font-medium',
              //'text-white',
              'text-slate-900',
            ]"
          >
            {{ title }}
          </p>
          <p
            v-if="message"
            :class="[
              'mt-1 text-sm',
              //'text-white/80',
              'text-slate-500',
            ]"
          >
            {{ message }}
          </p>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button
            type="button"
            @click="close"
            :class="[
              'inline-flex rounded-md p-0.5 focus:outline-none focus:ring-0 focus:ring-offset-2',
              //'text-white focus:ring-white',
              'text-slate-500 focus:ring-indigo-500',
            ]"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        v-if="autoClose"
        :class="[
          'absolute left-0 bottom-0 right-0 h-1 w-full',
          type === 'error' ? 'bg-red-300' : type === 'warning' ? 'bg-yellow-300' : type === 'success' ? 'bg-green-300' : 'bg-indigo-300',
        ]"
      >
        <div
          :class="[
            'h-2 w-0 animate-progress',
            type === 'error' ? 'bg-red-400' : type === 'warning' ? 'bg-yellow-400' : type === 'success' ? 'bg-green-400' : 'bg-indigo-400',
          ]"
          :style="{ 'animation-duration': `${duration * 1000}ms` }"
        ></div>
      </div>
    </div>
  </div>
</template>
