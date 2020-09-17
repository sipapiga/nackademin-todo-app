const Datastore = require('nedb');
const mongoose = require('mongoose')
require('dotenv').config();



let todoCollection, userCollection, todolistCollection, mongoDatabase
switch ((process.env.ENVIRONMENT)) {
  case 'development':
    /*   todoCollection = new Datastore({ filename: 'database/todo.db', autoload: true, timestampData: true });
      userCollection = new Datastore({ filename: 'database/user.db', autoload: true, timestampData: true });
      todolistCollection = new Datastore({ filename: 'database/todolist.db', autoload: true, timestampData: true }); */
    break;
  case 'test':
    /*  mongoDatabase = {
       // mongodb+srv://user:password@host/dbname
       getUri: async () =>
         `mongodb://127.0.0.1:27017/Nackademin-todo-test`
     }
  */
    const { MongoMemoryServer } = require('mongodb-memory-server')
    mongoDatabase = new MongoMemoryServer()
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

async function connect () {
  let uri
  if (process.env.ENVIRONMENT == 'test'){
    uri = await mongoDatabase.getConnectionString()
  } else{
    uri = await mongoDatabase.getUri()
  }
  console.log(uri)

  let conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log(`Connected to ${conn.connection.host}`)
}

async function disconnect () {
  if (process.env.ENVIRONMENT == 'test' || process.env.ENVIRONMENT == 'development') {
    await mongoDatabase.stop()
    //await mongoose.connection.close()
  }
  await mongoose.connection.close()
}

async function clearDatabase () {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

module.exports = {
  connect, disconnect, clearDatabase
}