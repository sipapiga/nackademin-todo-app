const myController = require('../controllers/todo.js');
const express = require('express');
const router = express.Router();

router.post('/', myController.createTodo);

module.exports = router;