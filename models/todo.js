const { todoCollection } = require('../database/index');

module.exports = {
  getAll: (userId) => {
    return new Promise((resolve, reject) => {
      todoCollection.find({ "createdBy._id": userId }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  getTodo: (id) => {
    return new Promise((resolve, reject) => {
      todoCollection.findOne({ _id: id }, (err, todo) => {

        if (err) reject(err);
        if (todo) resolve(todo)
        else {
          reject(new Error(`${id} not found`))
        }
      });
    });
  },
  createTodo: (data) => {
    let todoItem = {
      title: data.title,
      done: false,
      createdBy: data.user,
      todolistId: data.todolistId
    }

    return new Promise((resolve, reject) => {
      todoCollection.insert(todoItem, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      })
    })
  },
  updateTodo: (newItems, id) => {

    return new Promise((resolve, reject) => {
      todoCollection.update({ _id: id }, { $set: newItems }, { returnUpdatedDocs: true }, (err, numReplaced, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    })
  },
  deleteTodo: (id) => {
    return new Promise((resolve, reject) => {
      todoCollection.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  clearTodo: () => {
    return todoCollection.remove({}, { multi: true }, function (err, numRemoved) {
      todoCollection.loadDatabase(function (err) {
        return
      });
    });
  }
}