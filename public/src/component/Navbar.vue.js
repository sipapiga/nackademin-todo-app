import { router } from '../js/route.js';

export const Navbar = Vue.component('Navbar', {
  name: 'navbar',
  template:
    `
    <div>
    <b-navbar toggleable="lg" type="dark"  style="background-color: #223e56;">
      <b-navbar-brand href="/">Todo App</b-navbar-brand>
  
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if=user.user><router-link to="/"  >Home</router-link></b-nav-item>
          <b-nav-item v-if=user.user><router-link to="/createtodo"  >Create Todo</router-link></b-nav-item>
          <b-nav-item href="/admin" v-if="user.userRole === 'admin'">Admin</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right v-if=user.user>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{user.user.data.firstName}}</em>
            </template>
            <b-dropdown-item ><router-link to="/profile"  >Profile</router-link></b-dropdown-item>
            <b-dropdown-item v-on:click="removeToken"><router-link to="/" >Sign Out</router-link></b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>


  `,
  props: ['user'],
  methods: {
    removeToken () {
      localStorage.removeItem('token');
      router.replace('/login')
    }
  }
})
