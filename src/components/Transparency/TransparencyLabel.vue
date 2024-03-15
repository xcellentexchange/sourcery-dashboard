<script setup>
import { ref, computed, toRefs, watchEffect, shallowRef, defineAsyncComponent } from 'vue'
const props = defineProps({ code: String, product: Object, label: Object })
const { code, product, label } = toRefs(props)

const LabelComponent = shallowRef()

watchEffect(() => {
  if (label.value && label.value.type) {
    LabelComponent.value = defineAsyncComponent(() => import(`./TransparencyTemplate${label.value.type}.vue`))
  }
})

// const LabelComponent = defineAsyncComponent(() => import(`./TransparencyTemplate${label.value.type}.vue`))
</script>
<template>
  <component :is="LabelComponent" :code="code" :product="product" :label="label">
    <template #identifier>
      <slot name="identifier"></slot>
    </template>
  </component>
</template>
