const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static('./public'))


const todoRoute = require('./routes/todo.js');

app.use('/api/todo', todoRoute);

const port = 3000;
app.listen(port, () => console.log(`Server running on ${port}`));