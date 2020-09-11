const user = require('../models/user')
const TodoModel = require('../models/todo.js');
const todolistModel = require('../models/todolist');

module.exports = {
  getAll: async (req, res) => {
    const result = await user.getAll();
    res.status(200).json(result);
  },
  deleteUser: async (req, res) => {
    let { id } = req.params;
    if (id) {
      try {
        const result = await user.deleteUser(id)
        await TodoModel.removeTodoWhenDeleteUser(id)
        await todolistModel.removeTodolistWhenDeleteUser(id)
        res.status(200).json({
          message: 'User Deleted',
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