const URL = 'http://localhost:3000/api/todo';

const app = new Vue({
  el: '#app',
  data: {
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
  },
  async created () {
    try {
      this.todos = await axios.get(URL)
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
          await axios.post(URL, {
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
      this.todos = await axios.get(URL)
        .then(res => { return res.data })
        .catch(err => console.error(err))
    },
    async editTodo (data) {
      const id = data.item._id
      this.$refs['edit-Modal'].show()
      this.todo = await axios.get(`${URL}/${id}`)
    },
    async saveEdit (id) {
      console.log(id)
      const title = this.todo.data.title
      if (title < 3) {
        this.feedback = "Enter at least 3 letters"
      } else {
        try {
          await axios.patch(`${URL}/update/${id}`, {
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
      await axios.delete(`${URL}/delete/${id}`)
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