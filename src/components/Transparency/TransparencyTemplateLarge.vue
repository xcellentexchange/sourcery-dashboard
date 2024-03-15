<script setup>
import { ref, toRefs, watchEffect, shallowRef } from 'vue'
import TransparencyLogo from '@/assets/transparency.svg'
import DefaultBrand from './DefaultBrand.vue'
import { useBarcode } from '@/composables/useBarcode'

const { generateBarcode } = useBarcode()

const props = defineProps({ code: String, product: Object, label: Object })
const { code, product, label } = toRefs(props)

const transparencyBarcode = ref(null)
const fnskuBarcode = ref(null)

const BrandLogo = shallowRef()
watchEffect(async () => {
  const transparencyCode = code.value
  const fnskuCode = product.value.fnsku
  let module = undefined
  try {
    module = await import(`../../assets/${product.value.brand.toLowerCase()}.svg`)
  } catch (e) {}
  BrandLogo.value = typeof module !== 'undefined' ? module.default : DefaultBrand

  generateBarcode({ el: fnskuBarcode.value, type: 'code128', code: fnskuCode, options: {} })
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
      `h-[2.3125in] w-[4in]`,
      'flex items-stretch rounded bg-white p-2 shadow-sm ring-1 ring-black ring-opacity-5',
      'break-after-page last:break-after-avoid print:my-0 print:border-none print:shadow-none print:ring-0',
    ]"
  >
    <section class="flex basis-1/4 flex-col justify-center gap-2 pr-2">
      <header class="flex flex-col items-center gap-2">
        <TransparencyLogo class="w-14" />
        <h1 class="whitespace-nowrap text-center text-[0.625rem] font-bold">Scan with the<br />Transparency app</h1>
      </header>
      <span class="w-full" ref="transparencyBarcode"></span>
    </section>
    <section class="flex flex-grow flex-col justify-between gap-2 border-l border-black pl-2">
      <div class="flex h-14 items-center justify-center">
        <component :is="BrandLogo" :class="[{ 'h-full': BrandLogo !== DefaultBrand }]" :title="product.brand" />
      </div>
      <span class="flex flex-col gap-1">
        <span class="w-full" ref="fnskuBarcode"></span>
        <p class="max-h-1/2 line-clamp-4 text-[0.625rem]">{{ product.title }}</p>
      </span>
      <span class="flex w-full items-baseline justify-between">
        <p class="text-sm">{{ product.condition }}</p>
        <span class="text-[0.5rem]">
          <slot name="identifier"></slot>
        </span>
      </span>
    </section>
  </div>
</template>
