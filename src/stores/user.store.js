import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { jwtVerify, decodeJwt } from 'jose'
import { useAuthStore } from '@/stores'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  const profile = ref(JSON.parse(localStorage.getItem('userProfile')))
  // const profile = ref()

  // const login = async (res) => await authStore.verify(res)

  // TEMPORARY
  const login = async (res) => {
    res = decodeJwt(res)
    // console.log(res)
    profile.value = {
      google_id: res.sub,
      email: res.email,
      first_name: res.given_name,
      last_name: res.family_name,
      picture: res.picture,
      exp: res.exp,
    }

    localStorage.setItem('userProfile', JSON.stringify(profile.value))
    await authStore.verify()
  }

  // const logout = async () => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER_URL}/user/logout`, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     const json = await response.json()
  //     if (!response.ok) {
  //       throw new Error(json.message)
  //     }
  //     authStore.revoke()
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // TEMPORARY
  const logout = async () => {
    profile.value = null
    localStorage.removeItem('userProfile')
  }

  const getUserById = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER_URL}/user/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.message)
      }
      return json
    } catch (err) {
      console.log(err)
    }
  }

  return { profile, login, logout, getUserById }
})
