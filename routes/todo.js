const myController = require('../controllers/todos.js');
const express = require('express');
const router = express.Router();

router.get('/', myController.getAll);
router.get('/:id', myController.getTodo);
router.post('/', myController.createTodo);
router.patch('/update/:id', myController.updateTodo);
router.delete('/delete/:id', myController.deleteTodo);

module.exports = router;