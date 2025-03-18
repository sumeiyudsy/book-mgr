

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import { regDirectives } from './helpers/directive';
import permission from './permission'

import 'ant-design-vue/dist/reset.css';

const app = createApp(App)

regDirectives(app)

app.use(store).use(router).use(Antd).mount('#app');
