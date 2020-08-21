const Datastore = require('nedb');
const db = new Datastore({ filename: '.database/database.db', autoload: true, timestampData: true });

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.find({}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  getOneTodo: (id) => {
    console.log(id)
    return new Promise((resolve, reject) => {
      db.findOne({ _id: id }, (err, docs) => {
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
      db.insert(todo, (err, newDoc) => {
        if (err) reject(err);
        resolve(newDoc);
      })
    })
  },
  updateTodo: (newItems, id) => {
    console.log(newItems)
    console.log(id)
    return new Promise((resolve, reject) => {
      db.update({ _id: id }, { $set: newItems }, { returnUpdatedDocs: true }, (err, numReplaced, updated) => {
        if (err) reject(err);
        resolve(updated);
      });
    })
  },
  deleteTodo: (id) => {
    return new Promise((resolve, reject) => {
      db.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  }
}