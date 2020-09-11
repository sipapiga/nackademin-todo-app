const { todolistCollection } = require('../database/index');

module.exports = {
  createTodolist: (todolist) => {
    return new Promise((resolve, reject) => {
      todolistCollection.insert(todolist, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      })
    })

  },
  addTodoInList: (todos) => {
    return new Promise((resolve, reject) => {
      todolistCollection.update({ _id: todos.todolistId }, { $push: { todos: todos } }, { returnUpdatedDocs: true }, (err, numReplaced, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    })
  },
  removeTodoFromList: (todo) => {
    return new Promise((resolve, reject) => {
      todolistCollection.update({ _id: todo.todolistId }, { $pull: { todos: todo } }, { returnUpdatedDocs: true }, (err, numReplaced, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    })
  },
  removeTodolistWhenDeleteUser: (userid) => {
    console.log(userid)
    return new Promise((resolve, reject) => {
      todolistCollection.remove({ "createdBy._id":  userid }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  getAll: (id) => {
    return new Promise((resolve, reject) => {
      todolistCollection.find({ "createdBy._id": id }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  getTodolist: (id) => {
    return new Promise((resolve, reject) => {
      todolistCollection.findOne({ _id: id }, (err, todolist) => {
        if (err) reject(err);
        if (todolist) resolve(todolist)
        else {
          reject(new Error(`${id} not found`))
        }
      });
    });
  },
  updateTodolist: (newtodoList, id) => {
    return new Promise((resolve, reject) => {
      todolistCollection.update({ _id: id }, { $set: newtodoList }, { returnUpdatedDocs: true }, (err, numReplaced, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    })
  },
  deleteTodolist: (id) => {

    return new Promise((resolve, reject) => {
      todolistCollection.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  clearTodolist: () => {
    return todolistCollection.remove({}, { multi: true }, function (err, numRemoved) {
      todolistCollection.loadDatabase(function (err) {
        return
      });
    });
  }

}