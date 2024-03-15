<script setup>
import { ref } from 'vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { ArrowLongRightIcon, PlusIcon } from '@heroicons/vue/20/solid'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import GmailIcon from '@/assets/gmail.svg'
import AppleMailIcon from '@/assets/apple_mail.svg'
import OutlookIcon from '@/assets/outlook.svg'

const integrations = [
  { id: 1, name: 'Gmail', icon: GmailIcon },
  { id: 2, name: 'Apple Mail', icon: AppleMailIcon },
  { id: 2, name: 'Outlook', icon: OutlookIcon },
]
</script>
<template>
  <div class="prose-lg prose prose-indigo mx-auto mt-6 text-slate-500">
    <h2>Email Integrations</h2>
    <TabGroup>
      <TabList class="flex space-x-0 border-b border-gray-200">
        <Tab class="-mb-px flex-auto" v-slot="{ selected }" v-for="integration in integrations" as="template">
          <button
            :class="[
              'w-full border-b-2 py-2.5 text-sm font-medium leading-5 text-slate-900 ',
              'focus:outline-none focus-visible:outline-none',
              selected ? 'border-indigo-500' : 'border-transparent hover:border-gray-300',
            ]"
          >
            <div class="text-lg font-semibold">
              <span>
                <component :is="integration.icon" class="mr-2 inline-flex h-8 w-8" />
                <span>{{ integration.name }}</span>
              </span>
            </div>
          </button>
        </Tab>
      </TabList>
      <TabPanels class="mt-2">
        <TabPanel class="focus:outline-none">
          <ol class="text-sm">
            <li>Click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">Copy Signature</kbd></li>
            <li>Open a new tab for your work Gmail account</li>
            <li>Select the <Cog6ToothIcon class="my-0 inline-flex h-5 w-5" /> icon in the Gmail toolbar</li>
            <li>
              Click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">See all settings</kbd> and navigate to General
              <ArrowLongRightIcon class="my-0 inline h-5 w-5 align-text-top" />
              Signature
            </li>
            <li>
              Click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs"><PlusIcon class="my-0 inline-flex h-5 w-5" /> Create new</kbd>
            </li>
            <li>Name the new signature and click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">Create</kbd></li>
            <li>Paste your copied signature into the box to the right</li>
            <li>Select your new signature as the default signature under <strong>Signature defaults</strong> dropdown</li>
            <li>Scroll to the bottom and click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">Save Changes</kbd></li>
          </ol>
        </TabPanel>
        <TabPanel class="focus:outline-none">
          <ol class="text-sm">
            <li>Click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">Copy Signature</kbd></li>
            <li>Open the Mail application and log into your account</li>
            <li>Click Mail <ArrowLongRightIcon class="my-0 inline h-5 w-5 align-text-top" /> Preferences in the top left of your screen</li>
            <li>From Preferences, click Signatures</li>
            <li>
              Click the <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs"><PlusIcon class="my-0 inline-flex h-5 w-5" /></kbd> button at the
              bottom of the middle column
            </li>
            <li>Uncheck "Always match my default message font" and paste your copied signature into the right-hand column</li>
            <li>Drag the signature to the mailboxes you want to use the signature with</li>
            <li>
              Click on the mailbox and set the signature as the default signature by opening the
              <strong>Choose Signature</strong> dropdown
            </li>
            <li>To save, close the window</li>
          </ol>
        </TabPanel>
        <TabPanel class="focus:outline-none">
          <ol class="text-sm">
            <li>Click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">Copy Signature</kbd></li>
            <li>Open Outlook and compose a new email</li>
            <li>On the Messages tab click Signature <ArrowLongRightIcon class="my-0 inline h-5 w-5 align-text-top" /> Signatures</li>
            <li>Click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">New</kbd> and name your signature</li>
            <li>Go to the <strong>Edit Signature</strong> area and paste your signature</li>
            <li>Click <kbd class="rounded-md bg-slate-100 py-1 px-2 text-xs">Ok</kbd></li>
            <li>Compose a new email in Outlook and your new signature will appear</li>
          </ol>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>
