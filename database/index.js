const Datastore = require('nedb');
const mongoose = require('mongoose')
require('dotenv').config();



let todoCollection, userCollection, todolistCollection,mongoDatabase
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
  case 'production':
  case 'staging':
    mongoDatabase = {
      // mongodb+srv://user:password@host/dbname
      getUri: async () =>
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
    }
    break;

}

async function connect(){
    
  let uri = await mongoDatabase.getUri()

  await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
  })
  console.log(`Connected to ${conn.connection.host}`)
}

async function disconnect(){
  if(process.env.ENVIRONMENT == 'test' || process.env.ENVIRONMENT == 'development'){
      await mongoDatabase.stop()
  }
  await mongoose.disconnect()
}

module.exports = {
  todoCollection,
  userCollection,
  todolistCollection,
  connect, disconnect
}