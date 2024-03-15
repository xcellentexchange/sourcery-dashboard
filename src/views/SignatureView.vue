<script setup>
import { ref, onMounted } from 'vue'

import SignatureForm from '@/components/Signature/SignatureForm.vue'
import SignatureIntegrations from '@/components/Signature/SignatureIntegrations.vue'
import SignaturePreview from '@/components/Signature/SignaturePreview.vue'

import { DocumentDuplicateIcon, DocumentCheckIcon } from '@heroicons/vue/24/outline'

const baseUrl = 'https://sourcery.plethora7.com'
const companies = [
  {
    id: 1,
    name: 'Xcellent Exchange USA',
    logo: { full: `${baseUrl}/logo/xcl_logo.png`, icon: `${baseUrl}/logo/xcl_icon.png` },
    websites: ['xcellentexchange.com'],
    emailDomain: 'xeusa.com',
    style: {
      color: {
        primary: '#05719e',
        secondary: '#9ca9b0',
        tertiary: '#05719e',
      },
    },
  },
  {
    id: 2,
    name: 'Plethora7',
    logo: { full: `${baseUrl}/logo/pl7_icon.png`, icon: `${baseUrl}/logo/pl7_icon.png` },
    websites: ['plethora7.com', 'plethora7.com/amazon'],
    emailDomain: 'plethora7.com',
    style: {
      color: {
        // primary: '#3a66f8',
        primary: '#2A64AC',
        secondary: '#9ca9b0',
        tertiary: '#2A64AC',
      },
    },
  },
  {
    id: 3,
    name: 'KRATE Tactical',
    logo: { full: `${baseUrl}/logo/krt_icon.png`, icon: `${baseUrl}/logo/krt_icon.png` },
    websites: ['kratetactical.com'],
    emailDomain: 'kratetactical.com',
    style: {
      color: {
        primary: '#000',
        secondary: '#ed1d23',
        tertiary: '#000',
      },
    },
  },
  {
    id: 4,
    name: 'Collapse-it',
    logo: { full: `${baseUrl}/logo/clp_logo.png`, icon: `${baseUrl}/logo/clp_icon.png` },
    websites: ['collapseit.com'],
    emailDomain: 'collapseit.com',
    style: {
      color: {
        primary: '#e33d2f',
        secondary: '#4d4c4d',
        tertiary: '#4d4c4d',
      },
    },
  },
]

const selectedCompany = ref(companies[1])
const preview = ref(null)

const fullLogo = ref(true)

const form = ref({
  ...{
    firstName: '',
    lastName: '',
    position: '',
    officePhone: '',
    mobilePhone: '',
    email: '',
  },
  ...JSON.parse(localStorage.getItem('signatureForm')),
})
</script>

<template>
  <div class="relative grid-cols-2 gap-4 px-8 pb-8 pt-24 sm:mx-auto sm:w-full lg:grid lg:max-w-7xl">
    <div>
      <p class="my-3 text-2xl font-medium text-slate-900">Details</p>
      <div class="rounded-lg bg-white px-4 py-8 shadow sm:px-10">
        <SignatureForm
          :companies="companies"
          :form="form"
          :selectedCompany="selectedCompany"
          :preview="preview"
          :fullLogo="fullLogo"
          @update-company="(company) => (selectedCompany = company)"
          @update-logo="(e) => (fullLogo = e)"
        />
        <SignatureIntegrations />
      </div>
    </div>
    <div class="flex flex-1 flex-col">
      <div class="sticky top-20">
        <div class="flex flex-wrap justify-between gap-4">
          <div>
            <p class="my-3 text-2xl font-medium text-slate-900">Preview</p>
          </div>
        </div>
        <div ref="preview" class="rounded-lg bg-white p-4 shadow-lg transition">
          <SignaturePreview ref="signaturePreview" :selectedCompany="selectedCompany" :form="form" :fullLogo="fullLogo" />
        </div>
      </div>
    </div>
  </div>
</template>
