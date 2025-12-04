<script setup>
import { ref, computed, watchEffect, watch } from 'vue'
import products from '@/data/products.json'
import labels from '@/data/labels.json'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  product: Object,
  label: Object,
  codes: Array,
})

const productQuery = ref('')
const filteredProducts = computed(() =>
  productQuery.value === '' ? products : products.filter((product) => product.sku.toLowerCase().includes(productQuery.value.toLowerCase()))
)

const labelQuery = ref('')
const filteredLabels = computed(() =>
  labelQuery.value === '' ? labels : labels.filter((label) => label.type.toLowerCase().includes(labelQuery.value.toLowerCase()))
)

const selectedProduct = ref(props.product)
const selectedLabel = ref(props.label)
const codes = ref(props.codes)
const codeInput = ref('')
const formatCodeInput = (codeInput) => codeInput.split('\n').filter((c) => c !== '')

const emit = defineEmits(['update:codes', 'update:product', 'update:label'])

// watchEffect(() => {
//   selectedLabel.value = labels.find((label) => label.type === selectedProduct.value?.labelType)
//   emit('update:label', selectedLabel.value)
// })

watch(selectedProduct, () => {
  selectedLabel.value = labels.find((label) => label.type === selectedProduct.value?.labelType)
  emit('update:label', selectedLabel.value)
})
</script>

<template>
  <div class="flex w-full flex-col space-y-6">
    <Combobox as="div" v-model="selectedProduct" @update:model-value="emit('update:product', $event)">
      <ComboboxLabel class="block text-sm font-medium text-slate-700">SKU</ComboboxLabel>
      <div class="relative mt-2">
        <ComboboxInput
          class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          @change="productQuery = $event.target.value"
          :display-value="(product) => product?.sku"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          v-if="filteredProducts.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ComboboxOption v-for="product in filteredProducts" :key="product.fnsku" :value="product" as="template" v-slot="{ active, selected }">
            <li :class="[active ? 'bg-indigo-600 text-white' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
              <span :class="['block truncate', selected && 'font-semibold']">
                {{ product.sku }}
              </span>

              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
    <dl v-if="selectedProduct" class="mt-2 divide-y divide-slate-200 border-b border-t border-slate-200">
      <div
        v-for="(info, detail) in (({ fnsku, title, brand }) => ({ FNSKU: fnsku, Title: title, Brand: brand }))(selectedProduct)"
        class="flex justify-between py-3 text-sm"
      >
        <dt class="flex-1 text-slate-700">{{ detail }}</dt>
        <dd class="line-clamp-4 basis-2/3 text-slate-700">{{ info }}</dd>
      </div>
    </dl>

    <Combobox as="div" v-model="selectedLabel" @update:model-value="emit('update:label', $event)">
      <ComboboxLabel class="block text-sm font-medium text-slate-700">Label Type</ComboboxLabel>
      <div class="relative mt-2">
        <ComboboxInput
          class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          @change="labelQuery = $event.target.value"
          :display-value="(label) => label?.type"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          v-if="filteredLabels.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ComboboxOption v-for="label in filteredLabels" :key="label.type" :value="label" as="template" v-slot="{ active, selected }">
            <li :class="[active ? 'bg-indigo-600 text-white' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
              <span :class="['block truncate', selected && 'font-semibold']">
                {{ label.type }}
              </span>

              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
    <div class="flex flex-1 flex-col items-start">
      <label class="block text-sm font-medium text-slate-700" for="codes">Codes </label>
      <textarea
        rows="4"
        class="relative w-full flex-1 rounded-md border border-slate-300 bg-white py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        name="codes"
        id="codes"
        v-model="codeInput"
        @input="$emit('update:codes', formatCodeInput($event.target.value))"
      ></textarea>
    </div>
  </div>
</template>
