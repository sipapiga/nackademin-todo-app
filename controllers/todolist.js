const todolistModel = require('../models/todolist')
const todoModel = require('../models/todo.js');

module.exports = {
  createTodolist: async (req, res) => {
    let todolist = req.body;
    req.body.user = req.user
    if (todolist) {
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
  getAll: async (req, res) => {
    const userID = req.user._id
    console.log(userID)
    const result = await todolistModel.getAll(userID);
    res.status(200).json(result);
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
        const result = await todolistModel.deleteTodolist(id)
        await todoModel.removeTodoWhenDeleteTodolist(id)

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