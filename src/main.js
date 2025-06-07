import { createApp } from 'vue'
import App from './App.vue'
import './index.css'; // Import Tailwind CSS
import './firebaseConfig'; // Initialize Firebase
import './registerServiceWorker'

createApp(App).mount('#app')
