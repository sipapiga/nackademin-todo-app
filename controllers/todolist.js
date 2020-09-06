const todolistModel = require('../models/todolist')

module.exports = {
  createTodolist: async (req, res) => {
    let todo = req.body;
    //  req.body.user = req.user
    console.log(req.body)
    if (todo) {
      try {
        const result = await todolistModel.createTodolist(req.body);
        console.log(result)
        res.status(201).json({
          message: 'Todolist Created',
          data: result
        });
      } catch (err) {
        res.status(400).json('Something went wrong');
      }
    } else {
      res.status(400).json('Invalid request')
    }
  },
  getAll: () => {

  },
  getTodolist: async (req, res) => {
    let { id } = req.params;
    if (id) {
      try {
        const result = await todolistModel.getTodolist(id)
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({ err: err.message });
      }
    } else {
      res.status(400).json(`${id} not found`);
    }
  },
  updateTodolist: () => {

  },
  deleteTodolist: () => {

  }
}