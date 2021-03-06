const express = require('express');
const bodyParser = require('body-parser');
require('dotenv/config');


const app = express();
app.use(bodyParser.json());

app.use(express.static('./public'))


const todoRoute = require('./routes/todo.js');
const userRoute = require('./routes/user.js');
const authRoute = require('./routes/auth.js');
const todoListRoute = require('./routes/todolist.js');

app.use('/api/todos', todoRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/todolist', todoListRoute);


module.exports = app;