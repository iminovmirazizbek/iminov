import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import Category from './pages/Category.vue'
import Product from './pages/Product.vue'
import Cart from './pages/Cart.vue'
import AdminLogin from './pages/AdminLogin.vue'
import Admin from './pages/Admin.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import './style.css'

const router = createRouter({ history: createWebHistory(), routes: [
 {path:'/', component:Home}, {path:'/kategoriya/:slug', component:Category}, {path:'/product/:id', component:Product}, {path:'/savatcha', component:Cart},
 {path:'/login', component:Login},
 {path:'/register', component:Register},
 {path:'/admin/login', component:AdminLogin},
 {path:'/admin', component:Admin, meta:{admin:true}}
]})
router.beforeEach((to) => {
  const publicRoutes = ['/login', '/register', '/admin/login']

  if (to.meta.admin && !localStorage.getItem('shopuz-admin-token')) return '/admin/login'
  if (!to.meta.admin && !publicRoutes.includes(to.path) && !localStorage.getItem('shopuz-token')) return '/login'
})
createApp(App).use(router).mount('#app')
