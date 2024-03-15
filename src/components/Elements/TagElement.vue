<script setup>
import { ArrowTopRightOnSquareIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'

const copy = async (value) => navigator.clipboard.writeText(value)

const props = defineProps({
  value: String,
  link: String,
})
</script>
<template>
  <span
    class="group mx-1 inline-flex items-center rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-700 transition first:ml-0 last:mr-0"
  >
    <span class="inline-block h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
    <span class="ml-1 font-medium">{{ value }}</span>
    <span class="-ml-8 flex opacity-0 transition-all group-hover:ml-1 group-hover:space-x-1 group-hover:opacity-100">
      <a v-if="link" :href="link" target="_blank">
        <ArrowTopRightOnSquareIcon class="h-4 w-4 text-slate-400 transition hover:text-slate-700 active:rotate-6 active:scale-125" />
      </a>
      <a href="#" @click.stop="copy(value)">
        <ClipboardDocumentListIcon class="h-4 w-4 text-slate-400 transition hover:text-slate-700 active:rotate-6 active:scale-125" />
      </a>
    </span>
  </span>
</template>
