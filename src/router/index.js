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
        redirect: 'welcome',
        children: [{
                path: 'welcome',
                component: () =>
                    import ('@/components/Welcome.vue')
            },
            // {
            //     path: 'userList',
            //     component: () =>
            //         import ('@/components/userList.vue')
            // },
            // {
            //     path: 'addUser',
            //     component: () =>
            //         import ('@/components/addUser.vue')
            // },
            // {
            //     path: 'removeUser',
            //     component: () =>
            //         import ('@/components/removeUser.vue')
            // }
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