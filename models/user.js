const { userCollection } = require('../database/index');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

module.exports = {
  register: (data) => {
    let password = data.password
    const salt = bcrypt.genSaltSync(10)
    const hashPass = bcrypt.hashSync(password, salt)

    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      username: data.username,
      password: hashPass
    }
    return new Promise((resolve, reject) => {
      userCollection.insert(user, (err, newDoc) => {
        if (err) reject(err)
        resolve(newDoc)
      })
    })
  },
  login: (data) => {
    const username = data.credentials.username

    return new Promise((resolve, reject) => {
      userCollection.findOne({ username }, (err, user) => {
        if (!user) reject(new Error('User not found'))
        else {
          const passwordAttempt = data.credentials.password
          const validPassword = bcrypt.compareSync(passwordAttempt, user.password);
          if (validPassword) resolve(user)
          else {
            reject(new Error('Invalid credentials'))
          }
        }

      })
    })
  },
  getUsers: () => {
    return new Promise((resolve, reject) => {
      userCollection.find({}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  getSignedJwtToken: (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  },
  clear: () => {
    return userCollection.remove({}, { multi: true }, function (err, numRemoved) {
      userCollection.loadDatabase(function (err) {
        return
      });
    });
  }
}