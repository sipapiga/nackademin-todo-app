const myController = require('../controllers/todo.js');
const express = require('express');
const router = express.Router();

router.get('/', myController.getAll);
router.get('/:id', myController.getOneTodo);
router.post('/', myController.createTodo);
router.patch('/update/:id', myController.updateTodo);
router.delete('/delete/:id', myController.deleteTodo);

module.exports = router;