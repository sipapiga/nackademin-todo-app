const { todoCollection } = require('../database/index');
const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  title: {
    type: String
  },
  done: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  todolistId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = {
  getAll: (userId) => {
    return new Promise((resolve, reject) => {
      Todo.find({ createdBy: userId }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  getTodo: (id) => {
    return new Promise((resolve, reject) => {
      Todo.findOne({ _id: id }, (err, todo) => {

        if (err) reject(err);
        if (todo) resolve(todo)
        else {
          reject(new Error(`${id} not found`))
        }
      });
    });
  },
  removeTodoWhenDeleteUser: (userid) => {
    console.log(userid)
    return new Promise((resolve, reject) => {
      Todo.remove({ createdBy: userid }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  removeTodoWhenDeleteTodolist: (listID) => {
    return new Promise((resolve, reject) => {
      Todo.remove({ todolistId: listID }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  createTodo: (data) => {
    console.log(data)
    let todoItem = {
      title: data.title,
      createdBy: data.user,
      todolistId: data.todolistId
    }

    return new Promise((resolve, reject) => {
      Todo.create(todoItem, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      })
    })
  },
  updateTodo: (newItems, id) => {

    return new Promise((resolve, reject) => {
      Todo.findByIdAndUpdate({ _id: id }, { $set: newItems }, { returnUpdatedDocs: true }, (err, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    })
  },
  deleteTodo: (id) => {
    return new Promise((resolve, reject) => {
      Todo.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  clearTodo: () => {
    return Todo.remove({}, { multi: true }, function (err, numRemoved) {
      Todo.loadDatabase(function (err) {
        return
      });
    });
  }
}