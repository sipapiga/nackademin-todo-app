import { Api } from '../js/service.js';

export const CreateTodo = Vue.component('CreateTodo', {
  name: 'CreateTodo',
  template:
    `
  <div class="container content-container">
      <div class="row">
        <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12">
          <b-alert v-if="dataSuccessMsg" variant="success" show dismissible>{{dataSuccessMsg}}</b-alert>
          <b-alert variant="danger" v-if="feedback" show dismissible>{{feedback}}</b-alert>
          <div class="input-group mb-3">
              <input type="text" class="form-control" v-model='todolist' placeholder="Enter todolist title" @keyup.enter="createTodolist"
                aria-label="todolistname">
          </div>
          <div><h1>{{todolistTitle}}</h1></div>
          <div v-if="todolistTitle">
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
               
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: ['user'],
  data () {
    return {
      todos: [],
      todolist: '',
      todolistTitle: '',
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
        { key: 'title', label: 'Title', sortable: true },
        { key: 'createdAt', label: 'Created', sortable: true },
        { key: 'updatedAt', label: 'Updated', sortable: true },
      ],
      dark: 'dark',
      light: 'light',
      secondary: 'secondary'

    }
  },

  methods: {
    async addTodo () {
      console.log('click')
      const title = this.newTodo.title;
      const todolistId = this.todolist._id
      if (title == null || title == '') {
        this.feedback = 'Please add your task!'
      } else {
        try {
          await Api.post('todos', {
            title,
            todolistId
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
      const todolist_id = this.todolist._id
      this.todos = await Api.get('todos')
        .then(res => {
          return res.data.filter(function (todo) {
            if (todo.todolistId === todolist_id) {
              return todo
            }
          })
        })
        .catch(err => console.error(err))
    },

    async createTodolist (event) {
      console.log('enter')
      const title = this.todolist
      if (title == null || title == '') {
        this.feedback = 'Please add Todolist Title!'
      } else {
        try {
          await Api.post('todolist', {
            title
          })
            .then(res => {
              if (res.status === 201) {
                this.dataSuccessMsg = res.data.message
                this.todolistTitle = res.data.data.title
                this.todolist = res.data.data
              }
            })
            .catch(err => console.error(err))
        } catch (err) {
          this.error = err.message
        }
      }

    }
  }
})
