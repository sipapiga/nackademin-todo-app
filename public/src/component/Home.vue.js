import { Api } from '../js/service.js';

export const Home = Vue.component('Home', {
  name: 'Home',
  template:
    `
  <div class="container content-container">
      <div class="row">
        <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12">
          <b-alert v-if="dataSuccessMsg" variant="success" show dismissible>{{dataSuccessMsg}}</b-alert>
          <b-alert variant="danger" v-if="feedback" show dismissible>{{feedback}}</b-alert>
          <div v-for="todolist in todolists" :key="todolist._id">
            <b-container fluid>
              <b-row>
              <b-col v-if="edit === true"> <input v-model= todolist.title type="text" class="form-control border-secondary mb-1" @keyup.enter="editTodolist(todolist._id)"></b-col>
              <b-col v-else> <h2>{{todolist.title}}</h2></b-col>
                <b-col class="text-right">
                  <b-button size="sm" @click="addMoreTodo()" variant="info"><i class="fas fa-plus"></i></b-button>
                  <b-button size="sm" @click="enterEditTodolist()" variant="warning"><i class="fas fa-edit"></i></b-button>
                  <b-button size="sm" @click="confirmDelTodo(todolist._id)" class="btn btn btn-danger"><i class="fas fa-trash-alt"></i></b-button>

                </b-col>
              </b-row>  
            </b-container>
         
              <b-table :hover=true :head-variant="dark" :items="todolist.todos" :fields="fields" :sort-by.sync="sortBy"
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
        </div>
      </div>
    </div>
  `,
  props: ['user'],
  data () {
    return {
      todolists: [],
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
      secondary: 'secondary',
      edit: false,
      todolist: {
        title:null
      }

    }
  },
  async created () {
    try {
      this.todolists = await Api.get('todolist')
        .then(res => { return res.data })
        .catch(err => console.error(err))
    } catch (err) {
      this.error = err.message
    }
  },
  methods: {
    async addTodo () {
      console.log('click')
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
                this.fetchTodolist()
              }
            })
            .catch(err => console.error(err))
        } catch (err) {
          this.error = err.message
        }
      }
    },
    async fetchTodolist () {
      this.todolists = await Api.get('todolist')
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
          if (res.status === 200) {
            this.dataSuccessMsg = res.data.message
            this.fetchTodolist()
          }
        }).catch(err => {
          this.feedback = err.response.data.error
        })
    },
    enterEditTodolist () {
      this.edit = true
    },
    async editTodolist (id) {
      console.log(id)
      const title = this.todolist.title
      console.log(title)
      if (title < 3) {
        this.feedback = "Enter at least 3 letters"
      } else {
        try {
          await Api.patch(`todolist/${id}`, {
            title
          })
            .then(res => {
              if (res.status === 200) {
                console.log('edit')
                this.fetchTodolist()
              }
            })
            .catch(err => console.error(err))
        } catch (err) {
          this.error = err.message
        }
      }
      this.edit = false
    },
    async deleteTodolist (id) {
      await Api.delete(`todolist/${id}`)
        .then(res => {
          if (res.status === 200) {
            this.dataSuccessMsg = res.data.message
            this.fetchTodolist()
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
            if (typeof data === 'string' || data instanceof String) {
              this.deleteTodolist(data)
            } else
              this.deleteTodo(data.item._id)
          }
        })
        .catch(err => {
          // An error occurred
        })
    }

  }
})
