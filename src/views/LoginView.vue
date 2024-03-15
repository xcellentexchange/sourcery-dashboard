<script setup>
import { useAuthStore, useUserStore } from '@/stores'
import { decodeCredential } from 'vue3-google-signin'

const userStore = useUserStore()

const handleOnSuccess = async (response) => {
  // console.log(response)
  const { credential } = response
  // console.log(credential)
  // const decodedCredential = decodeCredential(credential)
  // console.log(decodedCredential)
  userStore.login(credential)
}

const handleOnError = (error) => {
  console.log(error)
}
</script>
<template>
  <div class="flex h-screen w-full flex-col items-center justify-center">
    <h1 class="text-2xl font-medium text-slate-700">Login with Google</h1>
    <div class="py-4 px-4">
      <GoogleSignInButton one-tap size="large" shape="pill" @success="handleOnSuccess" @error="handleOnError" />
    </div>
  </div>
</template>
