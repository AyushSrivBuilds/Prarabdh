import { createApp } from 'vue'
import App from './App.vue'
import './firebaseConfig'; // Initialize Firebase
import './registerServiceWorker'

createApp(App).mount('#app')
