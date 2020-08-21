const Datastore = require('nedb');
const db = new Datastore({ filename: '.database/database.db', autoload: true });

module.exports = {
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
  }
}