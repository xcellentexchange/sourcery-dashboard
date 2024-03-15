import { createApp } from 'vue'
import { createPinia } from 'pinia'
import GoogleSignInPlugin from 'vue3-google-signin'
import router from './router'
import App from './App.vue'
import 'v-calendar/dist/style.css'
import './style.css'

const pinia = createPinia()
const app = createApp(App)
app
  .use(router)
  .use(pinia)
  .use(GoogleSignInPlugin, {
    clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
  })
app.mount('#app')
