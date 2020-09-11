import { Api } from './service.js';

Api.interceptors.request.use(
function(config) {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers["authorization"] = 'Bearer ' + token;
  }
  return config;
},
function(error) {
  return Promise.reject(error);
}
);

Vue.component('Navbar', {
  name: 'navbar',
  template:
    `
    <div>
    <b-navbar toggleable="lg" type="dark"  style="background-color: #223e56;">
      <b-navbar-brand href="#">Todo App</b-navbar-brand>
  
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Todo</b-nav-item>
          <b-nav-item href="/admin" v-if="user.userRole === 'admin'">Admin</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right v-if=user.user>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{user.user.data.firstName}}</em>
            </template>
            <b-dropdown-item ><router-link to="/profile">Profile</router-link></b-dropdown-item>
            <b-dropdown-item v-on:click="removeToken"><router-link to="/">Sign Out</router-link></b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>


  `,
  props: ['user'],
  methods:{
    removeToken(){
      localStorage.removeItem('token');
    }
  }
})

Vue.component('Todo', {
  name: 'todo',
  template:
    `
  <div class="container content-container">
      <div class="row">
        <div class="col-lg-8 col-md-9 col-sm-9 col-xs-12">
          <b-alert v-if="dataSuccessMsg" variant="success" show dismissible>{{dataSuccessMsg}}</b-alert>
          <b-alert variant="danger" v-if="feedback" show dismissible>{{feedback}}</b-alert>
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model='newTodo.title' placeholder="What do you want to do?"
              aria-label="Task">
            <div class="input-group-append">
              <button @click="addTodo" class="btn btn btn-success" type="button"><i class="fas fa-plus"></i></button>
            </div>
          </div>

          <div>
            <b-table :hover=true :head-variant="dark" :items="todos" :fields="fields" :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc" sort-icon-left responsive="sm" class="text-white">
              <template v-slot:cell(done)="data">
              <b-form-group>
                  <input type="checkbox" v-model="data.item.done" />
                </b-form-group>
              </template>
              <template class="text-white" v-slot:cell(title)="data">{{ data.value }}</template>
              <template v-slot:head(title)="data">
                <span class="text-white">{{ data.label.toUpperCase() }}</span>
              </template>
              <template v-slot:cell(createdAt)="data">{{ data.value.slice(0, 10) }}</template>
              <template v-slot:head(createdAt)="data">
                <span class="text-white">{{ data.label.toUpperCase() }}</span>
              </template>
              <template v-slot:cell(updatedAt)="data">{{ data.value.slice(0, 10) }}</template>
              <template v-slot:head(updatedAt)="data">
                <span class="text-white">{{ data.label.toUpperCase() }}</span>
              </template>
              <template v-slot:cell(actions)="data">
                <b-button size="sm" @click="editTodo(data)" variant="warning"><i class="fas fa-edit"></i>
                  <b-modal ref="edit-Modal" title="Edit Todo">
                    <b-form-group id="input-edit" label="Todo Title:" label-for="input-1">
                      <b-form-input v-if="todo" id="input-edit" v-model="todo.data.title"></b-form-input>
                    </b-form-group>

                    <template v-slot:modal-footer="{save, cancel}">
                      <b-button size="sm" variant="success" @click="saveEdit(todo.data._id)">SAVE</b-button>
                      <b-button size="sm" variant="danger" @click="cancel()">CANCEL</b-button>
                    </template>
                  </b-modal>
                </b-button>
                <b-button size="sm" @click="confirmDelTodo(data)" class="btn btn btn-danger"><i
                    class="fas fa-trash-alt"></i></b-button>
              </template>
            </b-table>
          </div>
          <b-button size="sm" @click="getAllTodo()" variant="dark">ALL</b-button>
          <b-button size="sm" @click="getDoneTodo()" variant="info">COMPLETED</b-button>
        </div>
      </div>
    </div>
  `,
  props:['user'],
  data () {
    return {
      todos: [],
      newTodo: {
        title: null,
        done: false
      },
      todo: null,
      feedback: null,
      dataSuccessMsg: null,
      sortBy: 'createdAt',
      sortDesc: false,
      fields: [
        'done',
        { key: 'title', label: 'Title', sortable: true },
        { key: 'createdAt', label: 'Created', sortable: true },
        { key: 'updatedAt', label: 'Updated', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      dark: 'dark',
      light: 'light',
      secondary: 'secondary'

    }
  },
  async created () {
    try {
      this.todos = await Api.get('todos')
        .then(res => { return res.data })
        .catch(err => console.error(err))
    } catch (err) {
      this.error = err.message
    }
  },
  methods: {
    async addTodo () {
      let title = this.newTodo.title;
      if (title == null || title == '') {
        this.feedback = 'Please add your task!'
      } else {
        try {
          await Api.post('todos', {
            title
          })
            .then(res => {
              if (res.status === 201) {
                this.dataSuccessMsg = res.data.message
                this.fetchTodo()
              }
            })
            .catch(err => console.error(err))
        } catch (err) {
          this.error = err.message
        }
      }
    },
    async fetchTodo () {
      this.todos = await Api.get('todos')
        .then(res => { return res.data })
        .catch(err => console.error(err))
    },
    async editTodo (data) {
      const id = data.item._id
      this.$refs['edit-Modal'].show()
      this.todo = await Api.get(`todos/${id}`)
    },
    async saveEdit (id) {
      console.log(id)
      const title = this.todo.data.title
      if (title < 3) {
        this.feedback = "Enter at least 3 letters"
      } else {
        try {
          await Api.patch(`todos/${id}`, {
            title
          })
            .then(res => {
              if (res.status === 200) {
                this.$refs['edit-Modal'].hide()
                this.fetchTodo()
              }
            })
            .catch(err => console.error(err))
        } catch (err) {
          this.error = err.message
        }
      }
    },
    async deleteTodo (id) {
      await Api.delete(`todos/${id}`)
        .then(res => {
          console.log(res)

          if (res.status === 200) {
            this.dataSuccessMsg = res.data.message
            this.fetchTodo()
          }
        }).catch(err => {
          this.feedback = err.response.data.error
        })
    },
    confirmDelTodo (data) {
      console.log(data)
      this.$bvModal.msgBoxConfirm('Do you really want to delete?', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          console.log(value)
          if (value) {
            this.deleteTodo(data.item._id)
          }
        })
        .catch(err => {
          // An error occurred
        })
    }

  }
})

const Login = Vue.component('Login', {
  name: 'Login',
  template:
    `
  <div id="login" class="mt-5" v-if=seen>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-9 col-sm-9 col-xs-12">
          <div class="card bg-dark text-white rounded shadow">

            <b-form @submit.prevent="login" class="ml-4 card-panel">
              <h2 class="text-center mt-5">Login</h2>
              <div>
                <b-alert v-if="serverError" variant="danger" show dismissible>{{serverError}}</b-alert>
              </div>
              <div class="container">
                <b-form-group label="Username: ">
                  <b-form-input type="text" required v-model="username"  placeholder="Enter username"></b-form-input>
                  <!--               <span class="text-danger">{{}}</span> -->
                </b-form-group>
                
                <b-form-group label="Password:">
                  <b-form-input type="password" required v-model="password"  placeholder="Enter password"></b-form-input>
                 
                  <!--          <span class="text-danger">{{}}</span> -->

                </b-form-group>

              </div>
              <div class="form-group text-right">
                <p v-if="feedback" class="text-danger text-center">{{feedback}}</p>
                <button type="submit" class="btn btn-primary mr-2 mb-5">Login</button>
              </div>
            </b-form>
          </div>

        </div>

      </div>
    </div>
  </div>
</div>
  `,
  props:[
    'user'
  ],
  data () {
    return {
      seen: true,
      serverError: null,
      username: null,
      password: null,
      feedback: null,
      error: [],
    }
  },

  methods: {
    async login () {
      console.log('click')
      console.log(this.username + ' ' + this.password)
      try {
        await Api.post('auth/login', {
          username: this.username,
          password: this.password
        }
        ).then(res => {
          console.log(res)
          if (res.status === 200) {
            console.log('login')
            this.seen = false
            this.$parent.seen = true
            this.$parent.user = res.data
            console.log(res.data.data.role)
            this.$parent.userRole = res.data.data.role
            console.log(res.data.data.token)
            localStorage.setItem("token", res.data.token);
            console.log(this.$parent.user)

          }
          this.email = ''
          this.password = ''
        }, err => {
          console.log(err.data.err)
          if (err) {
            this.serverError = err.data.err
            this.email = ''
            this.password = ''
          } else {
            console.log('Unknown error')
          }
        })
      } catch (err) {
        console.log(err)
        this.serverError = err
      }
    }
  }
})

const Profile = { template: '<div>profile</div>' }
const routes = [
  { path: '/profile', component: Profile },
  { path: '/', component: Login },
]
const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: 'history',
  base: '/'
})

const app = new Vue({
  el: '#app',
  data: {
    seen: false,
    user: null,
    userRole :null
  },
  router
})