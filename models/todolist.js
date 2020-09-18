const { todolistCollection } = require('../database/index');

const mongoose = require('mongoose')

const todolistSchema = new mongoose.Schema({
  title: {
    type: String
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Todo'
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
todolistSchema.set('timestamps', true)
const Todolist = mongoose.model('Todolist', todolistSchema)

module.exports = {
  createTodolist: (data) => {
    let todolistItem = {
      title: data.title,
      createdBy: data.user,
      todos: []
    }
    return new Promise((resolve, reject) => {
      Todolist.create(todolistItem, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      })
    })

  },
  addTodoInList: async (todo) => {
    try {
      return await Todolist.findOneAndUpdate({ _id: todo.todolistId }, { $push: { todos: todo } }, {
        new: true,
        runValidators: true
      })
    } catch (err) {
      throw err
    }
  },
  removeTodoFromList: async (todo) => {
    try {
      return await Todolist.findOneAndUpdate({ _id: todo.todolistId._id }, { $pull: { todos: todo } }, {
        new: true,
        runValidators: true
      })
    } catch (err) {
      throw err
    }
  },
  removeTodolistWhenDeleteUser: (userid) => {
    console.log(userid)
    return new Promise((resolve, reject) => {
      Todolist.remove({ createdBy: userid }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  getAll: (userId) => {
    console.log(userId)
    return new Promise((resolve, reject) => {
      Todolist.find({ createdBy: userId }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      }).populate({
        path: 'todos',
        model: 'Todo'
      });
    });
  },
  getTodolist: (id) => {
    return new Promise((resolve, reject) => {
      Todolist.findOne({ _id: id }, (err, todolist) => {
        if (err) reject(err);
        if (todolist) resolve(todolist)
        else {
          reject(new Error(`${id} not found`))
        }
      }).populate({
        path: 'todos',
        model: 'Todo'
      });
    });
  },
  updateTodolist: (newtodoList, id) => {
    return Todolist.findByIdAndUpdate(id, newtodoList, {
      new: true,
      runValidators: true
    });
  },
  deleteTodolist: (id) => {
    return new Promise((resolve, reject) => {
      Todolist.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  clearTodolist: () => {
    return Todolist.remove({}, { multi: true }, function (err, numRemoved) {
      Todolist.loadDatabase(function (err) {
        return
      });
    });
  }

}