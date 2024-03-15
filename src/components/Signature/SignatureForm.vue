<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronUpDownIcon, CheckIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import DropDown from '../DropDown.vue'
import { useNotifications } from '@/composables/useNotifications'

const { createNotification } = useNotifications()

const placeholder = {
  firstName: 'Han',
  lastName: 'Solo',
  position: 'Smuggler',
  email: 'han.solo',
}

const copySignature = async () => {
  try {
    const type = 'text/html'
    const blob = new Blob([props.preview.innerHTML], { type })
    const data = [new ClipboardItem({ [type]: blob })]
    await navigator.clipboard.write(data)
    saveInfo({ notify: false })
    createNotification({
      type: 'success',
      title: 'Successfully copied!',
      message: 'Your signature has been copied to your clipboard.',
      autoClose: true,
      duration: 5,
    })
  } catch (e) {
    createNotification({
      type: 'error',
      title: 'Yikes!',
      message: 'Something went wrong copying your signature.',
      autoClose: true,
      duration: 5,
    })
  }
}

const savedInfo = ref(false)
let saveTimer
const saveInfo = ({ notify = true }) => {
  localStorage.setItem('signatureForm', JSON.stringify(props.form))
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => (savedInfo.value = false), 1200)
  savedInfo.value = true
  if (notify)
    createNotification({
      type: 'success',
      title: 'Successfully saved!',
      message: 'Your info has been saved in your browser.',
      autoClose: true,
      duration: 5,
    })
}

const inputErrors = reactive({})
const requiredInputs = ref([])

const validateOnBlur = ({ target: input }) => {
  input.value = input.value.trim()
  validateInput(input)
}
const validateOnKeyUp = ({ target: input }) => validateInput(input)

const validateInput = (input) => {
  if (input.type === 'text' || input.type === 'email') {
    inputErrors[input.name] = input.value.trim() === '' ? `Field must be filled in.` : null
  }
  if (input.type === 'tel') {
    if (!requiredInputs.value.includes(input) && input.value === '') inputErrors[input.name] = null
    else {
      const phoneNumberPattern = /^(1-)?\d{3}-\d{3}-\d{4}$/
      inputErrors[input.name] = phoneNumberPattern.test(input.value) ? null : 'Numbers only, use dashes to separate.'
    }
  }
}

let copyTimer
const copyAnimationClasses = ['scale-105', '-rotate-1', 'shadow-xl', 'border-2', 'border-dashed', 'border-gray-300']
const copyMouseDown = (e) => {
  clearTimeout(copyTimer)
  props.preview.classList.add(...copyAnimationClasses)
}
const copyMouseUp = (e) => {
  copyTimer = setTimeout(() => props.preview.classList.remove(...copyAnimationClasses), 200)
}

const validForm = computed(
  () => Object.values(inputErrors).filter((e) => e !== null).length === 0 && requiredInputs.value.filter((el) => el.value.trim() === '').length === 0
)

const props = defineProps({
  companies: Array,
  selectedCompany: Object,
  preview: [Element, Object],
  form: Object,
  fullLogo: Boolean,
})
</script>
<template>
  <form action="#" class="space-y-6">
    <div>
      <label for="company" :class="['block text-sm font-medium text-slate-700']">Company</label>
      <Listbox
        v-slot="{ active, selected }"
        :value="selectedCompany"
        @update:model-value="$emit('updateCompany', $event)"
        as="template"
        name="company"
        id="company"
      >
        <div class="relative mt-1">
          <ListboxButton
            class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-1 focus-visible:ring-offset-indigo-500"
          >
            <span class="block truncate">
              {{ selectedCompany.name }}
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
            ><ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              ><ListboxOption v-slot="{ active, selected }" v-for="company in companies" :key="company.id" :value="company" as="template">
                <li :class="[active ? 'bg-indigo-600 text-white' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ company.name }}</span>
                  <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li> </ListboxOption
            ></ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>
    <div class="block space-y-6 sm:mt-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
      <div
        v-for="{ title, id, key, ref } in [
          { title: 'First Name', id: 'first-name', key: 'firstName', ref: 'requiredInputs' },
          { title: 'Last Name', id: 'last-name', key: 'lastName', ref: 'requiredInputs' },
        ]"
      >
        <label
          :for="id"
          :class="['block text-sm font-medium text-slate-700' /*requiredInputs.find((i) => i.name === id) ? `after:content-['*']` : ''*/]"
          >{{ title }}</label
        >
        <div
          :class="[
            'mt-1 overflow-hidden rounded-md border  bg-white shadow-sm focus-within:ring-1',
            inputErrors[id]
              ? 'border-red-300 focus-within:ring-red-500'
              : 'border-gray-300 focus-within:border-indigo-500  focus-within:ring-indigo-500',
          ]"
        >
          <div class="relative">
            <input
              :ref="ref"
              type="text"
              :name="id"
              :id="id"
              :placeholder="placeholder[key]"
              :autocomplete="id"
              :class="[
                'block w-full appearance-none border-none bg-transparent px-3 py-2 placeholder-gray-400 focus:border-none focus:outline-none focus:ring-0 sm:text-sm',
                inputErrors[id] ? 'text-red-900 placeholder-red-300' : 'placeholder-gray-300',
              ]"
              v-model="form[key]"
              @keyup="validateOnKeyUp"
              @blur="validateOnBlur"
            />
            <div v-if="inputErrors[id]" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          </div>
          <p v-if="inputErrors[id]" class="rounded-b-md border border-transparent bg-red-100 px-2 py-1 text-xs text-red-600">{{ inputErrors[id] }}</p>
        </div>
      </div>
    </div>
    <div v-for="{ title, id, key, ref } in [{ title: 'Job Title', id: 'position', key: 'position', ref: 'requiredInputs' }]">
      <label
        for="position"
        :class="['block text-sm font-medium text-slate-700' /*requiredInputs.find((i) => i.name === id) ? `after:content-['*']` : ''*/]"
        >{{ title }}</label
      >
      <div
        :class="[
          'mt-1 overflow-hidden rounded-md border  bg-white shadow-sm focus-within:ring-1',
          inputErrors[id]
            ? 'border-red-300 focus-within:ring-red-500'
            : 'border-gray-300 focus-within:border-indigo-500  focus-within:ring-indigo-500',
        ]"
      >
        <div class="relative">
          <input
            :ref="ref"
            type="text"
            :name="id"
            :id="id"
            :placeholder="placeholder[key]"
            :autocomplete="id"
            :class="[
              'block w-full appearance-none border-none bg-transparent px-3 py-2 placeholder-gray-400 focus:border-none focus:outline-none focus:ring-0 sm:text-sm',
              inputErrors[id] ? 'text-red-900 placeholder-red-300' : 'placeholder-gray-300',
            ]"
            v-model="form[key]"
            @keyup="validateOnKeyUp"
            @blur="validateOnBlur"
          />
          <div v-if="inputErrors[id]" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        </div>
        <p v-if="inputErrors[id]" class="rounded-b-md border border-transparent bg-red-100 px-2 py-1 text-xs text-red-600">
          {{ inputErrors[id] }}
        </p>
      </div>
    </div>
    <div v-for="{ title, id, key, ref } in [{ title: 'Email Address', id: 'email', key: 'email', ref: 'requiredInputs' }]">
      <label for="email" class="block text-sm font-medium text-slate-700">{{ title }}</label>

      <div
        :class="[
          'mt-1 overflow-hidden rounded-md border  bg-white shadow-sm focus-within:ring-1',
          inputErrors[id]
            ? 'border-red-300 focus-within:ring-red-500'
            : 'border-gray-300 focus-within:border-indigo-500  focus-within:ring-indigo-500',
        ]"
      >
        <div class="flex w-full">
          <div class="relative flex-1">
            <input
              :ref="ref"
              :type="id"
              :name="id"
              :id="id"
              :placeholder="placeholder[key]"
              autocomplete="email"
              :class="[
                'block w-full appearance-none border-none bg-transparent px-3 py-2 placeholder-gray-400 focus:border-none focus:outline-none focus:ring-0 sm:text-sm',
                inputErrors[id] ? 'text-red-900 placeholder-red-300' : 'placeholder-gray-300',
              ]"
              v-model="form[key]"
              @keyup="validateOnKeyUp"
              @blur="validateOnBlur"
            />
            <div v-if="inputErrors[id]" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          </div>
          <span class="inline-flex items-center border-l border-gray-300 bg-slate-50 px-3 text-slate-500 sm:text-sm"
            >@{{ selectedCompany.emailDomain }}</span
          >
        </div>
        <p v-if="inputErrors[id]" class="rounded-b-md border border-transparent bg-red-100 px-2 py-1 text-xs text-red-600">
          {{ inputErrors[id] }}
        </p>
      </div>
    </div>
    <div
      v-for="{ title, id, key, ref } in [
        { title: 'Office Phone', id: 'office-phone', key: 'officePhone', ref: 'officePhone' },
        { title: 'Mobile Phone', id: 'mobile-phone', key: 'mobilePhone', ref: 'mobilePhone' },
      ]"
    >
      <label for="office-phone" class="block text-sm font-medium text-slate-700">{{ title }}</label>

      <div
        :class="[
          'mt-1 overflow-hidden rounded-md border  bg-white shadow-sm focus-within:ring-1',
          inputErrors[id]
            ? 'border-red-300 focus-within:ring-red-500'
            : 'border-gray-300 focus-within:border-indigo-500  focus-within:ring-indigo-500',
        ]"
      >
        <div class="relative">
          <input
            type="tel"
            :name="id"
            :id="id"
            autocomplete="tel"
            :class="[
              'block w-full appearance-none border-none bg-transparent px-3 py-2 placeholder-gray-400 focus:border-none focus:outline-none focus:ring-0 sm:text-sm',
              inputErrors[id] ? 'text-red-900 placeholder-red-300' : 'placeholder-gray-300',
            ]"
            v-model="form[key]"
            @keyup="validateOnKeyUp"
            @blur="validateOnBlur"
          />
          <div v-if="inputErrors[id]" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        </div>
        <p v-if="inputErrors[id]" class="rounded-b-md border border-transparent bg-red-100 px-2 py-1 text-xs text-red-600">
          {{ inputErrors[id] }}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <button
        type="submit"
        :class="[
          'flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-10',
        ]"
        @click.prevent="copySignature"
        :disabled="!validForm"
        @mousedown="copyMouseDown"
        @mouseup="copyMouseUp"
      >
        Copy Signature
      </button>
      <button
        type="submit"
        class="flex w-full items-center justify-center rounded-md border-2 border-indigo-600 border-transparent px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:border-indigo-700 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-10"
        @click.prevent="saveInfo"
      >
        Save Info
        <CheckCircleIcon :class="['h-5 w-5  transition', savedInfo ? 'translate-x-2 rotate-0 opacity-100' : 'rotate-180 opacity-0 duration-300']" />
      </button>
      <!-- <button
        type="submit"
        class="flex w-full justify-center rounded-md border-2 border-indigo-600 py-2 px-4 text-sm font-medium text-indigo-700 shadow-sm hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-10"
        @click.prevent="() => {}"
        :disabled="true"
      >
        Copy HTML
      </button> -->
    </div>
  </form>
</template>
