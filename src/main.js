import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 💎 Import Quasaru
import { Quasar } from 'quasar'
import 'quasar/src/css/index.sass' // alebo 'quasar/dist/quasar.css'

// vytvor aplikáciu
const app = createApp(App)

// použijeme Quasar ako plugin
app.use(Quasar, {
  plugins: {} // sem sa dajú doplniť Quasar pluginy neskôr (napr. Notify)
})

app.mount('#app')
