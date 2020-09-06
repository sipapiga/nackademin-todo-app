const todolistController = require('../controllers/todolist.js');
const auth = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

router.get('/', auth.protect,todolistController.getAll);
router.get('/:id', auth.protect,todolistController.getTodolist);
router.post('/', auth.protect, todolistController.createTodolist);
router.patch('/:id', auth.protect, todolistController.updateTodolist);
router.delete('/:id', auth.protect, todolistController.deleteTodolist);

module.exports = router;