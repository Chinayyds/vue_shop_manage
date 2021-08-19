import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')

    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import ('@/views/Home.vue'),
        redirect: '/home/welcome',
        children: [{
                path: '/home/welcome',
                component: () =>
                    import ('@/components/Welcome.vue')
            },
            {
                path: 'users',
                component: () =>
                    import ('@/components/user/userList.vue')
            },
            {
                path: 'roles',
                component: () =>
                    import ('@/components/quanxian/roles.vue')
            },
            {
                path: 'rights',
                component: () =>
                    import ('@/components/quanxian/rights.vue')
            },
            {
                path: 'goods',
                component: () =>
                    import ('@/components/shop/goods.vue')
            },
            {
                path: 'params',
                component: () =>
                    import ('@/components/shop/params.vue')
            },
            {
                path: 'categories',
                component: () =>
                    import ('@/components/shop/categories.vue')
            },
            {
                path: 'orders',
                component: () =>
                    import ('@/components/dingdan/orders.vue')
            },
            {
                path: 'reports',
                component: () =>
                    import ('@/components/shuju/reports.vue')
            },
        ]

    }
]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path === '/') return next()
    const token_ = window.sessionStorage.getItem('token')
    if (!token_) return next('/')
    next()

})
export default router