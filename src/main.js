import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入element—ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: function(h) { return h(App) }
}).$mount('#app')