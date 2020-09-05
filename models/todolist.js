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
  getAll: (username) => {
    console.log(username)
    return new Promise((resolve, reject) => {
      todolistCollection.find({ "creator": username }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  updateTodolist: (newtodoList, id) => {
    console.log(newtodoList)
    console.log(id)
    return new Promise((resolve, reject) => {
      todolistCollection.update({ _id: id }, { $set: newtodoList }, { returnUpdatedDocs: true }, (err, numReplaced, updated) => {
        if (err) reject(err);
        console.log(updated)
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