const { userCollection } = require('../database/index');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a name'],
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please add a username'],
  },
  password: {
    type: String
  },
  role: {
    type: String,
    required: [true, 'Please select a role'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', userSchema)

module.exports = {
  register: (data) => {
    console.log(data)
    let password = data.password
    const salt = bcrypt.genSaltSync(10)
    const hashPass = bcrypt.hashSync(password, salt)

    const user = {
      firstName: data.firstName,
      role: data.role,
      username: data.username,
      password: hashPass
    }
    return new Promise((resolve, reject) => {
      User.create(user, (err, newDoc) => {
        console.log(user)
        if (err) reject(err)
        resolve(newDoc)
      })
    })
  },
  login: (data) => {
    const username = data.credentials.username

    return new Promise((resolve, reject) => {
      User.findOne({ username }, (err, user) => {
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
  getUser: (id) => {
    return new Promise((resolve, reject) => {
      User.findOne({ _id: id }, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      User.remove({ _id: id }, { multi: true }, function (err, numRemoved) {
        if (err) reject(err);
        resolve(numRemoved);
      });

    })
  },
  getSignedJwtToken: (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  },
  clear: () => {
    return User.remove({}, { multi: true }, function (err, numRemoved) {
      User.loadDatabase(function (err) {
        return
      });
    });
  }
}