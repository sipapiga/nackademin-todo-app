const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static('./public'))


const todoRoute = require('./routes/todo.js');
const userRoute = require('./routes/user.js');
const authRoute = require('./routes/auth.js');

app.use('/api/todo', todoRoute);
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

const port = 3000;
app.listen(port, () => console.log(`Server running on ${port}`));