const user = require('../controllers/user.js');
const express = require('express');
const router = express.Router();

router.get('/', user.getAll);
/* 
router.get('/:id', user.getUser);
router.post('/', user.createUser);
router.patch('/update/:id', user.updateUser);
router.delete('/delete/:id', user.deleteUser); */

module.exports = router;