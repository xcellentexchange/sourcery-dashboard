<script setup>
import { ref, toRefs, watchEffect, shallowRef } from 'vue'
import TransparencyLogo from '@/assets/transparency.svg'
import { useBarcode } from '@/composables/useBarcode'

const { generateBarcode } = useBarcode()

const props = defineProps({ code: String, product: Object, label: Object })
const { code, product, label } = toRefs(props)

const transparencyBarcode = ref(null)
const fnskuBarcode = ref(null)

watchEffect(async () => {
  const transparencyCode = code.value
  const fnskuCode = product.value.fnsku

  generateBarcode({ el: fnskuBarcode.value, type: 'code128', code: fnskuCode, options: { height: 8 } })
  if (transparencyCode) {
    generateBarcode({
      el: transparencyBarcode.value,
      type: 'datamatrix',
      code: transparencyCode,
      options: { width: 12.7, height: 12.7, padding: 1 },
    })
  }
})
</script>
<template>
  <div
    :class="[
      `h-[1.5in] w-[1.5in]`,
      'flex flex-col items-stretch rounded bg-white p-2 shadow-sm ring-1 ring-black ring-opacity-5',
      'break-after-page gap-2 last:break-after-avoid print:my-0 print:border-none print:shadow-none print:ring-0',
    ]"
  >
    <section class="grid w-full grid-cols-12 justify-center gap-1">
      <header class="col-span-5 flex flex-col items-start justify-between gap-0.5">
        <TransparencyLogo class="w-8" />
        <h1 class="text-left text-[0.48rem] font-bold leading-tight tracking-tighter">Scan with the Transparency app</h1>
      </header>
      <span class="col-span-7 flex-grow self-start" ref="transparencyBarcode"></span>
    </section>
    <section class="flex flex-grow flex-col items-center justify-between gap-2 text-center">
      <span class="flex w-full flex-col gap-1">
        <span class="w-full px-1" ref="fnskuBarcode"></span>
        <p class="max-h-1/2 line-clamp-4 flex items-center justify-center text-[0.5rem]">
          <span class="truncate">{{ product.sku }}</span>
          <span class="ml-auto whitespace-nowrap text-[0.5rem]"><slot name="identifier"></slot></span>
        </p>
      </span>
    </section>
  </div>
</template>
