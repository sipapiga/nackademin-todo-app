import { Api } from '../js/service.js';
import { router } from '../js/route.js';

export const Profile = Vue.component('Profile', {
  name: 'Profile',
  template: `
  <div class="container content-container">
    <div class="row">
    <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12 w-100">
      <div class="card bg-secondary rounded shadow dashboard-container">
        <div id="profileInfo" class="container m-1 m-b-10 rounded shadow p-4" style="height: 100%;">
          <b-container style="height: 75%;" class="bg-secondary card">
            <b-row>
            <b-avatar icon="people-fill" size="10em"></b-avatar>
                <b-card-body>
                  <b-card-text>
                    <b-container>
                      <b-table-simple borderless stacked class="text-white">
                        <b-tbody>
                          <b-tr>
                            <b-td stacked-heading="firstName:">{{ user.data.firstName }}</b-td>
                          </b-tr>
                          <b-tr>
                            <b-td stacked-heading="LastName:">{{ user.data.lastName }}</b-td>
                          </b-tr>
                          <b-tr>
                            <b-td stacked-heading="Email:">{{ user.data.email }}</b-td>
                          </b-tr>
                          <b-tr>
                            <b-td stacked-heading="Role:">{{ user.data.role }}</b-td>
                          </b-tr>

                        </b-tbody>
                      </b-table-simple>
                    </b-container>
                  </b-card-text>
                  <div class="d-flex justify-content-end">
                    <input class="btn btn-danger pl-5 pr-5 shadow mt-4 ml-4 mr-3" type="submit" value="Delete"
                      @click="confirmDelTodo()" />
                  </div>
                </b-card-body>
              </b-card>
            </b-row>
          </b-container>
        </div>
      </div>
    </div>
  </div>
</div>


  `,
  data () {
    return {
      user: null
    }
  },
  async created () {
    this.user = this.$parent.user
  },
  methods: {
    async removeUser (id) {
      console.log(id)
      await Api.delete(`users/${id}`)
        .then(res => {
          console.log(res)

          if (res.status === 200) {
            localStorage.removeItem('token');
            router.replace('/login')
          }
        }).catch(err => {
          console.log(err)
        })
    },
    confirmDelTodo () {
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
          const id = this.user.data._id
          if (value) {
            this.removeUser(id)
          }
        })
        .catch(err => {
          // An error occurred
        })
    }
  }
})