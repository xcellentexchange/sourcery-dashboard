<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'

const signatureWidth = ref(250)
const logoWidth = ref(0)
const logoHeight = ref(0)
const separatorHeight = ref(100)
const gutterSpacing = ref(18)

const separatorColor = '#d1dbe5'
const separatorBorder = `1px solid ${separatorColor}`

const maxLogoHeight = ref(100)
const maxLogoWidth = ref(180)

const logoSrc = computed(() => props.selectedCompany.logo[props.fullLogo ? 'full' : 'icon'])

const calculateLogoDimensions = async () => {
  const image = new Image()
  image.src = logoSrc.value
  await image.decode()
  const aspectRatio = image.width / image.height

  if (aspectRatio > 1) {
    logoWidth.value =
      Math.round(maxLogoHeight.value * aspectRatio) <= maxLogoWidth.value ? Math.round(maxLogoHeight.value * aspectRatio) : maxLogoWidth.value
    logoHeight.value = Math.round(logoWidth.value / aspectRatio)
  } else if (aspectRatio < 1) {
    logoHeight.value =
      Math.round(maxLogoWidth.value * aspectRatio) <= maxLogoHeight.value ? Math.round(maxLogoWidth.value * aspectRatio) : maxLogoHeight.value
    logoWidth.value = Math.round(logoHeight.value / aspectRatio)
  } else {
    logoHeight.value = Math.min(maxLogoHeight.value, maxLogoWidth.value)
    logoWidth.value = logoHeight.value
  }
}

const fontFamily = 'sans-serif'
const fontSize = '16px'
const fontSizeSmall = '11px'
const lineHeightSmall = 1.2

const nameStyle = computed(() => ({
  'font-family': fontFamily,
  'font-weight': 700,
  'font-size': fontSize,
  'line-height': 1.5,
  color: props.selectedCompany.style.color.primary,
  whitespace: 'nowrap',
  padding: '0px',
}))

const positionStyle = computed(() => ({
  'font-family': fontFamily,
  'font-weight': 700,
  'font-size': fontSizeSmall,
  'line-height': 1.5,
  color: props.selectedCompany.style.color.secondary,
  whitespace: 'nowrap',
  padding: '0px 0px 4px 0px',
  'text-transform': 'uppercase',
}))

const name = computed(() => `${props.form.firstName.trim()} ${props.form.lastName.trim()}`)
const position = computed(() => props.form.position.trim())

const phoneNumbers = computed(() =>
  [
    { type: 'office', abbreviation: 'P', number: props.form.officePhone.trim() },
    { type: 'mobile', abbreviation: 'M', number: props.form.mobilePhone.trim() },
  ].filter((phone) => phone.number !== '')
)

const emailAddresses = computed(() =>
  [
    {
      type: 'email',
      abbreviation: 'E',
      address: normalizeEmail(props.form.email.trim()) ? `${normalizeEmail(props.form.email.trim())}@${props.selectedCompany.emailDomain}` : '',
    },
  ].filter((email) => email.address !== '')
)

const normalizeEmail = (string) => {
  const email = /^([\w\.]+)@*([\w\.]*)$/.exec(string)
  return email ? email[1] : email
}

const websites = computed(() => props.selectedCompany.websites.map((url) => ({ type: 'website', url })))

watchEffect(() => {
  calculateLogoDimensions()
})

onMounted(() => {
  normalizeEmail('jason.sims@plethora7.com')
})

const props = defineProps({
  selectedCompany: Object,
  form: Object,
  fullLogo: Boolean,
})
</script>
<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="{ 'background-color': '#FFF', width: '100%' }">
    <tr>
      <td :width="logoWidth" :style="{ 'vertical-align': 'middle' }">
        <img
          :src="logoSrc"
          alt=""
          :width="logoWidth"
          :height="logoHeight"
          :style="{ display: 'block', 'image-rendering': '-webkit-optimize-contrast' }"
        />
      </td>
      <td :width="gutterSpacing * 2 + 1">
        <table cellspacing="0" cellpadding="0" border="0" :style="{ width: `${gutterSpacing * 2 + 1}px` }">
          <tr>
            <td :width="gutterSpacing" :height="separatorHeight" :style="{ width: `${gutterSpacing}px` }">&nbsp;</td>
            <td width="1" :height="separatorHeight" :style="{ 'border-left': `${separatorBorder}` }"></td>
            <td :width="gutterSpacing" :height="separatorHeight" :style="{ width: `${gutterSpacing}px` }">&nbsp;</td>
          </tr>
        </table>
      </td>
      <td>
        <table cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td>
              <table cellspacing="0" cellpadding="0" border="0" :width="signatureWidth">
                <tr>
                  <td :style="nameStyle">{{ name }}</td>
                </tr>
                <tr v-if="position">
                  <td :style="positionStyle">
                    <span class="flex-nowrap">{{ position }}, </span><span class="whitespace-nowrap">{{ selectedCompany.name }}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr v-if="phoneNumbers.length > 0">
            <td :style="{ padding: '0px 0px 2px 0px', 'font-size': fontSizeSmall, 'line-height': lineHeightSmall }">
              <table cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <template v-for="(phone, idx) in phoneNumbers" :key="idx">
                    <td
                      :style="[
                        {
                          padding: `0px ${idx < phoneNumbers.length - 1 ? 5 : 0}px 0px ${idx > 0 ? 5 : 0}px`,
                          'font-family': fontFamily,
                          'font-weight': 500,
                          'font-size': fontSizeSmall,
                          'line-height': lineHeightSmall,
                          color: selectedCompany.style.color.tertiary,
                          whitespace: 'nowrap',
                        },
                        idx > 0 ? { 'border-left': `${separatorBorder}` } : '',
                      ]"
                    >
                      <strong>{{ phone.abbreviation }}:</strong>
                      {{ phone.number }}
                    </td>
                  </template>
                </tr>
              </table>
            </td>
          </tr>
          <tr v-if="emailAddresses.length > 0">
            <td :style="{ padding: '0px 0px 5px 0px', 'font-size': fontSizeSmall, 'line-height': lineHeightSmall }">
              <table cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <template v-for="(email, idx) in emailAddresses" :key="idx">
                    <td
                      :style="[
                        {
                          padding: `0px ${idx < emailAddresses.length - 1 ? 5 : 0}px 0px ${idx > 0 ? 5 : 0}px`,
                          'font-family': fontFamily,
                          'font-weight': 500,
                          'font-size': fontSizeSmall,
                          'line-height': lineHeightSmall,
                          color: selectedCompany.style.color.tertiary,
                          whitespace: 'nowrap',
                        },
                        idx > 0 ? { 'border-left': `${separatorBorder}` } : '',
                      ]"
                    >
                      <strong>{{ email.abbreviation }}:</strong>&nbsp;<a
                        :href="`mailto:${email.address}`"
                        :style="{
                          color: selectedCompany.style.color.tertiary,
                          'text-decoration': 'unset',
                        }"
                        >{{ email.address }}</a
                      >
                    </td>
                  </template>
                </tr>
              </table>
            </td>
          </tr>
          <tr v-if="websites.length > 0">
            <td :style="{ padding: '0', 'font-size': fontSizeSmall, 'line-height': lineHeightSmall }">
              <table cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <template v-for="(website, idx) in websites" :key="idx">
                    <td
                      :style="[
                        {
                          padding: `0px ${idx < websites.length - 1 ? 5 : 0}px 0px ${idx > 0 ? 5 : 0}px`,
                          'font-size': fontSizeSmall,
                          'line-height': lineHeightSmall,
                        },
                        idx > 0 ? { 'border-left': `${separatorBorder}` } : '',
                      ]"
                    >
                      <a
                        :href="`https://${website.url}`"
                        :style="{
                          'font-family': fontFamily,
                          'font-weight': 700,
                          color: selectedCompany.style.color.primary,
                          'text-decoration': 'unset',
                        }"
                        >{{ website.url }}</a
                      >
                    </td>
                  </template>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>
