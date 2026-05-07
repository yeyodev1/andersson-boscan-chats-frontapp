import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAdminStore } from '@/stores/admin'
import '@/styles/global.scss'
import '@/styles/admin.scss'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
useAdminStore().hydrate()
app.use(router)

app.mount('#app')
