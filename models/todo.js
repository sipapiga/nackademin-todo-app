const Datastore = require('nedb');
const todo = new Datastore({ filename: '.database/todo.db', autoload: true, timestampData: true });

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      todo.find({}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  getOneTodo: (id) => {
    console.log(id)
    return new Promise((resolve, reject) => {
      todo.findOne({ _id: id }, (err, docs) => {
        console.log(docs)
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  createTodo: (items) => {
    console.log(items)
    let todo = {
      title: items.title,
      done: false
    }
    return new Promise((resolve, reject) => {
      todo.insert(todo, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      })
    })
  },
  updateTodo: (newItems, id) => {
    console.log(newItems)
    console.log(id)
    return new Promise((resolve, reject) => {
      todo.update({ _id: id }, { $set: newItems }, { returnUpdatedDocs: true }, (err, numReplaced, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    })
  },
  deleteTodo: (id) => {
    return new Promise((resolve, reject) => {
      todo.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  }
}