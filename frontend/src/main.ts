import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
// @ts-ignore
import BootstrapVue3 from 'bootstrap-vue-3'; 

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);
app.use(BootstrapVue3);
app.mount('#app');
