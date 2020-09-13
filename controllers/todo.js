const MyModel = require('../models/todo.js');
const todolistModel = require('../models/todolist');

module.exports = {
  getAll: async (req, res) => {
    const userID = req.user._id
    const result = await MyModel.getAll(userID);
    res.status(200).json(result);
  },
  getTodo: async (req, res) => {
    let { id } = req.params;
    if (id) {
      try {
        const result = await MyModel.getTodo(id)
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({ err: err.message });
      }
    } else {
      res.status(400).json(`${id} not found`);
    }
  },
  getUserTodo: async (req, res) => {
    let { userid } = req.params;
    if (userid) {
      try {
        const result = await MyModel.getTodo(userid)
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({ err: err.message });
      }
    } else {
      res.status(400).json(`${id} not found`);
    }
  },
  createTodo: async (req, res) => {
    let todo = req.body;
    req.body.user = req.user
    if (todo) {
      try {
        const result = await MyModel.createTodo(req.body);
        await todolistModel.getTodolist(result.todolistId)
        await todolistModel.addTodoInList(result)
        res.status(201).json({
          message: 'Todo Created',
          data: result
        });

      } catch (err) {
        res.status(400).json('Something went wrong');
      }
    } else {
      res.status(400).json('Invalid request')
    }
  },
  updateTodo: async (req, res) => {
    let { id } = req.params;
    let done = req.body.done;
    let newTodo = {}
    if (done) {
      newTodo = {
        done: req.body.done
      }
    } else {
      newTodo = {
        title: req.body.title,
      }
    }

    if (id) {
      try {
        const todo = await MyModel.getTodo(id)
        const result = await MyModel.updateTodo(newTodo, id);
        await todolistModel.removeTodoFromList(todo)
        await todolistModel.addTodoInList(result)
        res.status(200).json({
          message: 'Todo Updated',
          data: result
        });
      } catch (err) {
        res.status(400).json('Something went wrong');
      }
    } else {
      res.status(400).json(`${id} not found`);
    }
  },
  deleteTodo: async (req, res) => {
    let { id } = req.params;
    if (id) {
      try {
        const todo = await MyModel.getTodo(id)
        const result = await MyModel.deleteTodo(id)
        await todolistModel.removeTodoFromList(todo)
        res.status(200).json({
          message: 'Todo Deleted',
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