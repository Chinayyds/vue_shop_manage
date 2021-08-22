import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false;
// 导入全局样式
import '@/assets/css/golbal.css'
// 导入eleui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(ElementUI)

// 导入字体图标库
import '@/assets/fonts/iconfont.css'

// 导入Axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// 导入Vue。tree

import TreeTable from 'vue-table-with-tree-grid'

Vue.component("tree-table", TreeTable)

// 导入
// import Timeline from '@assets/timeline/index.js'
// import TimelineItem from '@assets/timeline-item/index.js'

// Vue.use(Timeline)
// Vue.use(TimelineItem)
// 导入富文本编辑器

// // 导入依赖项
// import echarts from 'echarts'
// Vue.use(echarts)
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */ )
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

// 全局时间过滤器
Vue.filter('dateFormat', function(val) {
    const dt = new Date(val)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: function(h) { return h(App) }
}).$mount('#app')