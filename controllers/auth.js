const userModel = require('../models/user')
const jwt = require('jsonwebtoken');

function getSignedJwtToken (user) {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

module.exports = {
  register: async (req, res) => {
    let user = req.body
    if (user) {
      try {
        const result = await userModel.register(user);
        res.status(200).json({
          message: 'Success',
          data: result
        });
      } catch (err) {
        res.status(400).json('Something wrong!');
      }
    } else {
      res.status(400).json('Invalid request!');
    }
  },
  login: async (req, res) => {
    const credentials = req.body
    try {
      const user = await userModel.login({ credentials });
      const token = getSignedJwtToken(user);
      res.status(200).json({
        message: 'Success',
        token,
        data: user
      });
    } catch (err) {
      res.status(400).json({err: err.message});
    }
  }
}