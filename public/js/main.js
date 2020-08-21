console.log("Test")

const URL = 'http://localhost:3000/api/todo';

const app = new Vue({
  el: '#app',
  data: {
    todos: [],
    newTodo: {
      title: null,
      done: false
    },
    feedback: null
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
          axios.post(URL, {
            title
          })
            .then(res => { return res })
            .catch(err => console.error(err))
        } catch (err) {
          this.error = err.message
        }
      }
      this.todos = await axios.get(URL)
        .then(res => { return res.data })
        .catch(err => console.error(err))
    },
    async editTodo () {

    }
  }
})