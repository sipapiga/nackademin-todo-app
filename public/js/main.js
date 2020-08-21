console.log("Test")

const URL = 'http://localhost:3000/api/todo';

const app = new Vue({
  el: '#todo',
  data: {
    todos: []
  },
  async created () {
    try {
      this.todos = await axios.get(URL)
        .then(res => { return res.data })
        .catch(err => console.error(err))
    } catch (err) {
      this.error = err.message
    }
  }
})