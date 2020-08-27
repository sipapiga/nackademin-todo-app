const user = require('../models/user')

module.exports = {
  getAll: async (req, res) => {
    const result = await user.getAll();
    res.status(200).json(result);
  },
}