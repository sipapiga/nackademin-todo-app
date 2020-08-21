const MyModel = require('../models/todo.js');

module.exports = {
  createTodo: async (req, res) => {
    let todo = req.body;
    console.log(req.body)
    if (todo) {
      try {
        const result = await MyModel.createTodo(todo);
        console.log(result)
        res.status(200).json(result)
      } catch (err) {
        res.status(400).json('Something went wrong')
      }
    }else{
      res.status(400).json('Invalid request')
    }
  }
}