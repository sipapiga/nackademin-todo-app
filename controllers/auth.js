const user = require('../models/user')
const jwt = require('jsonwebtoken');

function getSignedJwtToken (user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
  });
}

module.exports = {
  register: async (req, res) => {
    let user = req.body
    if (user) {
      try {
        const result = await user.register({ user });
        res.status(200).json({
          message: 'Success',
          data: result
        });
      } catch (err) {
        res.status(400).json('Something wrong!');
      }
    }else{
      res.status(400).json('Invalid request!');
    }
  },
  login: async (req, res) => {
    let credentials = req.body
    console.log(credentials)
    try{
      const result = await user.login({ credentials });
      console.log(result)
      res.status(200).json({
        message: 'Success',
        data: result
      });
    }catch(err){
      res.status(400).json('Something wrong!');
    }
  }
}