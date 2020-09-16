const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_CONNECT, { 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
   });
   console.log(`Connected to ${conn.connection.host}`)
}

module.exports = connectDB;