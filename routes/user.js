const user = require('../controllers/user.js');
const auth = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

router.get('/', auth.protect, user.getAll);
/* 
router.get('/:id', user.getUser);
router.post('/', user.createUser);
router.patch('/update/:id', user.updateUser);*/

router.delete('/:id', auth.protect, user.deleteUser);

module.exports = router;