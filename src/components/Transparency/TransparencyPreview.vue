<script setup>
import { defineAsyncComponent, ref } from 'vue'
const TransparencyLabel = defineAsyncComponent(() => import('./TransparencyLabel.vue'))

const props = defineProps({
  codes: Array,
  product: Object,
  label: Object,
})
</script>
<template>
  <div
    class="flex flex-auto flex-wrap place-content-start items-start justify-center gap-2 overflow-auto rounded-lg bg-slate-100 px-2 py-6 lg:h-0"
    id="print"
  >
    <TransparencyLabel v-if="product" v-for="(code, index) in codes" :code="code" :product="product" :label="label">
      <template #identifier>
        <span>{{ `${index + 1}`.padStart(2, '0') }}-{{ `${codes.length}`.padStart(2, '0') }}</span>
      </template>
    </TransparencyLabel>
  </div>
</template>
