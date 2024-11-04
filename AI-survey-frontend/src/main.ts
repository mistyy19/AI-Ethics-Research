import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import { IonicVue } from '@ionic/vue';
import router from './router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './assets/styles/variables.css';

const pinia = createPinia();
pinia.use(piniaPersistedstate); // 应用持久化插件

const app = createApp(App)
  .use(IonicVue)
  .use(pinia) // 使用已配置的 Pinia 实例
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});
