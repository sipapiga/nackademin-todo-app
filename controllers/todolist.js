const todolistModel = require('../models/todolist')

module.exports = {
  createTodolist: async (req, res) => {
    let todo = req.body;
    req.body.createdBy = req.user
    if (todo) {
      try {
        const result = await todolistModel.createTodolist(req.body);
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
        console.log(err)
        res.status(401).json({ err: err.message });
      }
    } else {
      res.status(400).json(`${id} not found`);
    }
  },
  updateTodolist: async (req, res) => {
    let { id } = req.params;
    let creator = req.body.creator;
    let newTodolist = {}
    if (creator) {
      newTodolist = {
        creator: req.body.creator
      }
    } else {
      newTodolist = {
        title: req.body.title,
      }
    }

    if (id) {
      try {
        const result = await todolistModel.updateTodolist(newTodolist, id);
        res.status(200).json({
          message: 'Todolist Updated',
          data: result
        });
      } catch (err) {
        res.status(401).json('Something went wrong');
      }
    } else {
      res.status(400).json(`${id} not found`);
    }
  },
  deleteTodolist: async (req, res) => {
    let { id } = req.params;
    if (id) {
      try {
        let result = await todolistModel.deleteTodolist(id)
        res.status(200).json({
          message: 'Todolist Deleted',
          data: result
        })
      } catch (err) {
        res.status(400).json('Something went wrong');
      }
    } else {
      res.status(400).json(`${id} not found`);
    }
  }
}