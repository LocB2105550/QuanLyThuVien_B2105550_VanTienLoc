// Main CSS
import './assets/main.css'
// Modern Theme CSS
import './assets/modern-theme.css'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Fontawsome
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";


createApp(App).use(router).mount("#app");

// Thiết lập tiêu đề trang
const userRole = localStorage.getItem('userRole');
document.title = userRole === 'admin' ? 'Thư Viện - Admin' : 'Thư Viện';