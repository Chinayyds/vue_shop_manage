import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false;
// 导入全局样式
import '../src/assets/css/golbal.css'
// 导入eleui
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css';
// Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(ElementUI)

// 导入字体图标库
import '@/assets/fonts/iconfont.css'


import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    let token_ = window.sessionStorage.getItem('token')
    if (token_) {
        config.headers.Authorization = token_
        return config
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
new Vue({
    router,
    render: function(h) { return h(App) }
}).$mount('#app')