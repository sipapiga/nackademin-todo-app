const userDB = require('../database/user.db')
const bcrypt = require('bcryptjs')

module.exports = {
  register: (data) => {
    console.log(data)
    let password = data.user.password
    const salt = bcrypt.genSaltSync(10)
    const hashPass = bcrypt.hashSync(password, salt)

    let user = {
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      username: data.user.username,
      password: hashPass
    }
    return new Promise((resolve, reject) => {
      userDB.insert(user, (err, newDoc) => {
        if (err) reject(err)
        resolve(newDoc)
      })
    })
  },
  login: (data) => {
    console.log('login')
    console.log(data)

    const user = userDB.findOne({ username: data.credentials.username })
    console.log(user)
    let passwordAttempt = data.login.password

    const success = bcrypt.compareSync(passwordAttempt, user.password)

    console.log('HEJ:', success);
    return new Promise((resolve, reject) => {
      userDB.findOne({ password: success }, (err, newDoc) => {
        if (err) reject(err)
        resolve(newDoc)
      })
    })
  }
}