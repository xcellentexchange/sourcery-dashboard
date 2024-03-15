<script setup>
import { ref, computed, watchEffect, defineAsyncComponent } from 'vue'
import { PrinterIcon } from '@heroicons/vue/24/outline'
const TransparencyForm = defineAsyncComponent(() => import('@/components/Transparency/TransparencyForm.vue'))
const TransparencyPreview = defineAsyncComponent(() => import('@/components/Transparency/TransparencyPreview.vue'))

const product = ref(null)
const codes = ref([])
const label = ref(null)

const pageSize = computed(() => {
  if (label.value && label.value.dimensions) {
    return `${label.value.dimensions.width}in ${label.value.dimensions.height}in`
  }
  return `4in 2.3125in`
})

const print = () => {
  const printWindow = window.open('', '', `left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0`)
  printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${[...document.querySelectorAll('link[rel="stylesheet"], style')].map((style) => style.outerHTML).join('\n')}
    <title>${`${product.value.sku}_${product.value.fnsku}_transparency_labels_${codes.value.length}`}_${new Date()
    .toISOString()
    .replace(/[\:\.]/gi, `-`)}</title>
  </head>
  <body>
    ${document.getElementById('print').innerHTML}
  </body>
</html>`)
  printWindow.document.close()
  printWindow.focus()
}

watchEffect(() => {
  const styleElement = document.getElementById('dynamic-page-size')
  if (styleElement) {
    styleElement.innerHTML = `@page { size: ${pageSize.value}; }`
  } else {
    const newStyleElement = document.createElement('style')
    newStyleElement.id = `dynamic-page-size`
    newStyleElement.innerHTML = `@page { size: ${pageSize.value}; }`
    document.head.appendChild(newStyleElement)
  }
})
</script>

<template>
  <div class="relative h-full grid-cols-2 gap-4 px-8 pb-8 pt-24 sm:mx-auto sm:w-full lg:grid lg:h-screen lg:max-w-7xl">
    <div class="flex flex-col">
      <p class="my-3 text-2xl font-medium text-slate-900">Details</p>
      <div class="flex flex-auto rounded-lg bg-white px-4 py-8 shadow sm:px-10">
        <TransparencyForm v-model:product="product" v-model:codes="codes" v-model:label="label" />
      </div>
    </div>
    <div class="flex flex-1 flex-col">
      <div class="flex flex-wrap justify-between gap-4">
        <div>
          <p class="my-3 text-2xl font-medium text-slate-900">Preview</p>
        </div>
        <div class="flex self-center md:ml-4">
          <button
            :disabled="codes.length === 0 || product === null"
            type="submit"
            @click="print()"
            class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-200"
          >
            <!-- <PrinterIcon class="h-6 w-6" alt="Print" /> -->
            Print
          </button>
        </div>
      </div>
      <TransparencyPreview v-if="codes.length" :codes="codes" :product="product" :label="label" />
    </div>
  </div>
</template>
