import { Api } from '../js/service.js';
import { router } from '../js/route.js';

export const Login = Vue.component('Login', {
  name: 'Login',
  template:
    `
  <div id="login" class="mt-5" v-if=seen>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-lg-12 col-md-9 col-sm-9 col-xs-12">
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
  props: [
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
            router.push('/')
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
