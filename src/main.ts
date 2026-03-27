import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from './plugins/fontawesome'
import { authService } from './services/authService'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('fa', FontAwesomeIcon)

// Seed le compte admin par défaut avant le premier rendu
authService.seedAdminIfNeeded().then(() => {
  app.mount('#app')
})
