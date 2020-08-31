const myController = require('../controllers/todo.js');
const auth = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

router.get('/', auth.protect,myController.getAll);
router.get('/:id', auth.protect,myController.getTodo);
router.post('/', auth.protect, myController.createTodo);
router.patch('/:id', auth.protect, myController.updateTodo);
router.delete('/:id', auth.protect, auth.admin, myController.deleteTodo);

module.exports = router;