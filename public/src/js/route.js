import { Home } from '../component/Home.vue.js'
import { Login } from '../component/Login.vue.js'
import { Profile } from '../component/Profile.vue.js'
import { Policy } from '../component/Policy.vue.js'
import { CreateTodo } from '../component/CreateTodo.vue.js'

const ifAuthenticated = (to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    next()
  } else {
    next('/login')
  }
}
const routes = [
  {
    path: '/profile',
    component: Profile,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/policy',
    component: Policy
  },
  {
    path: '/createtodo',
    component: CreateTodo,
    beforeEnter: ifAuthenticated
  }
]
export const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/'
})
