const myController = require('../controllers/todos.js');
const auth = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

router.get('/', auth.protect,myController.getAll);
router.get('/:id', auth.protect,myController.getTodo);
router.post('/', auth.protect, myController.createTodo);
router.patch('/update/:id', auth.protect, myController.updateTodo);
router.delete('/delete/:id', auth.protect, auth.admin, myController.deleteTodo);

module.exports = router;