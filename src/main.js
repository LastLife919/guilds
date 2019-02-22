import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

import List from './components/list.vue';
import Levels from './components/levels.vue';
import Skills from './components/skills.vue';

Vue.component('list',List);
Vue.component('levels',Levels);
Vue.component('skills',Skills);

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
