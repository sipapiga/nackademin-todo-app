const Datastore = require('nedb');
const todo = new Datastore({ filename: 'database/todo.db', autoload: true, timestampData: true });

module.exports = {
  getAll: (userId) => {
    console.log(userId)
    return new Promise((resolve, reject) => {
      todo.find({"createdBy._id": userId }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  getTodo: (id) => {
    console.log(id)
    return new Promise((resolve, reject) => {
      todo.findOne({ _id: id }, (err, todo) => {
        console.log(todo)
        if (err) reject(err);
        if(todo) resolve(todo)
        else{
          reject(new Error(`${id} not found`))
        }
      });
    });
  },
  createTodo: (data) => {
    console.log(data)
    let todoItem = {
      title : data.title,
      done: false,
      createdBy: data.user
    }
    console.log('todo ',todo)
    return new Promise((resolve, reject) => {
      todo.insert(todoItem, (err, newDoc) => {
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