import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        name: 'index',
        path: '/index',
        component: () => import('@/views/index.vue')
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router