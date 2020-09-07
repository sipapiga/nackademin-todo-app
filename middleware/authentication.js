const jwt = require('jsonwebtoken');

module.exports = {
  protect: (req, res, next) => {
    if (!req.headers.authorization) return res.sendStatus(403)
    const token = req.headers.authorization.replace("Bearer ", "")
    if(!token){
      const error = new Error('Not authenticated');
      error.statusCode = 401
      throw error
    }

    try {
      const success = jwt.verify(token, process.env.JWT_SECRET)
      req.user = success
      next()
    } catch (err) {
      res.sendStatus(403)
    }
  },
  admin: (req, res, next) => {
    if (req.user.role == 'admin') {
      next()
    } else {
      return res.status(403).json({
        error: {
          message: 'You are not permitted to access this resource'
        }
      });
    }
  },
  user: (req, res, next) => {

  }

}