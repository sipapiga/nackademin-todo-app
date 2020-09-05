const Datastore = require('nedb');
require('dotenv').config();

let todoCollection, userCollection, todolistCollection
switch ((process.env.ENVIRONMENT)) {
  case 'development':
    todoCollection = new Datastore({ filename: 'database/todo.db', autoload: true, timestampData: true });
    userCollection = new Datastore({ filename: 'database/user.db', autoload: true, timestampData: true });
    todolistCollection = new Datastore({ filename: 'database/todolist.db', autoload: true, timestampData: true });
    break;
  case 'test':
    todoCollection = new Datastore({ filename: 'database/test-todo.db', autoload: true, timestampData: true });
    userCollection = new Datastore({ filename: 'database/test-user.db', autoload: true, timestampData: true });
    todolistCollection = new Datastore({ filename: 'database/test-todolist.db', autoload: true, timestampData: true });
    todoCollection.remove({})
    userCollection.remove({})
    todolistCollection.remove({})
    break;

}

module.exports={
  todoCollection,
  userCollection,
  todolistCollection
}