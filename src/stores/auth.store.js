import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'
import { jwtVerify, jwtDecrypt, importSPKI, importPKCS8, decodeJwt } from 'jose'
import jwtDecode from 'jwt-decode'
import router from '../router'
import axios from 'axios'

const hex2Arr = (str) => {
  if (!str) return new Uint8Array()
  const arr = []
  for (let i = 0, len = str.length; i < len; i += 2) {
    arr.push(parseInt(str.substr(i, 2), 16))
  }
  return new Uint8Array(arr)
}

const buf2Hex = (buf) => {
  return Array.from(new Uint8Array(buf))
    .map((x) => `00${x.toString(16)}`.slice(-2))
    .join('')
}

const baseURL = import.meta.env.VITE_AUTH_SERVER_URL

const instance = axios.create({
  baseURL,
})

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()

  const accessToken = ref(null)

  const returnUrl = ref(null)

  const client = ref(null)
  const sharedSecret = ref(null)
  const encryptedSps = ref(null)

  const exchangeKeys = async () => {
    try {
      client.value = await window.crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveKey', 'deriveBits'])
      const clientPublicKeyExported = await window.crypto.subtle.exportKey('raw', client.value.publicKey)
      const clientPublicKeyHex = buf2Hex(clientPublicKeyExported)

      let response = await instance.post(`auth/key-exchange`, {
        cpk: clientPublicKeyHex,
      })
      const { spk: serverPublicKeyHex, sps } = response.data

      encryptedSps.value = sps
      instance.defaults.headers['X-SPS'] = encryptedSps.value

      const serverPublicKey = hex2Arr(serverPublicKeyHex)
      const serverKeyImported = await window.crypto.subtle.importKey('raw', serverPublicKey, { name: 'ECDH', namedCurve: 'P-256' }, true, [])
      sharedSecret.value = await window.crypto.subtle.deriveBits(
        { name: 'ECDH', namedCurve: 'P-256', public: serverKeyImported },
        client.value.privateKey,
        256
      )
    } catch (err) {
      console.log(err)
    }
  }

  // const verify = async (res) => {
  //   if (!sharedSecret.value) {
  //     await exchangeKeys()
  //   }

  //   let refreshToken
  //   try {
  //     let response = await instance.post(`/auth/verify`, res)

  //     ;({ refreshToken } = response.data)
  //     accessToken.value = response.data.accessToken

  //     instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
  //     const { payload: decryptedAccessToken } = await jwtDecrypt(decodeJwt(accessToken.value).jwe, new Uint8Array(sharedSecret.value), {
  //       issuer: `https://api.plethora7.com`,
  //       audience: ['https://api.plethora7.com/api/auth', 'https://api.plethora7.com/api/user'],
  //     })
  //     const { payload: decryptedRefreshToken } = await jwtDecrypt(decodeJwt(refreshToken).jwe, new Uint8Array(sharedSecret.value), {
  //       issuer: `https://api.plethora7.com`,
  //       audience: 'https://api.plethora7.com/api/auth/refresh',
  //     })

  //     // console.table({ decryptedAccessToken, decryptedRefreshToken })
  //     userStore.profile.value = decryptedAccessToken.data
  //     localStorage.setItem('userProfile', JSON.stringify(userStore.profile.value))

  //     // TEST THE ACCESS TOKEN
  //     const id = 1
  //     response = await instance.get(`/user/${id}`)
  //     console.log(response.data)
  //   } catch (err) {
  //     console.log(err)
  //     return
  //   }

  //   // idToken.value = jwtDecode(json.idToken)
  //   // localStorage.setItem('idToken', JSON.stringify(idToken.value))
  //   // router.push(returnUrl.value || '/')
  // }
  // TEMPORARY
  const verify = async () => {
    router.push(returnUrl.value || '/')
  }

  const checkTokenExpiration = async () => {
    return
    if (!accessToken.value) return false
    if (accessToken.value.exp * 1000 < Date.now()) {
      try {
        const newAccessToken = await refreshAccessToken()
        if (!newAccessToken) {
          const user = useUserStore()
          await user.logout()
          return false
        }
        accessToken.value = newAccessToken
        localStorage.setItem('idToken', JSON.stringify(newAccessToken.value))
        return true
      } catch (err) {
        console.log(err.message)
        return false
      }
    } else {
      return true
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(idToken.value),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.message)
      }

      return jwtDecode(res.idToken)
    } catch (err) {
      console.log(err)
      return false
    }
  }

  // const authenticate = async () => await checkTokenExpiration()
  // TEMPORARY
  const authenticate = async () => {
    const isAuthenticated = userStore.profile?.exp * 1000 >= Date.now()
    // console.log(isAuthenticated)
    return isAuthenticated
  }

  const revoke = () => {
    idToken.value = null
    localStorage.removeItem('idToken')
  }

  return { verify, authenticate, revoke }
})
