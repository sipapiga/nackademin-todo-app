const Datastore = require('nedb');
const userDB = new Datastore({ filename: 'database/user.db', autoload: true, timestampData: true });
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
      email: data.user.email,
      role: data.user.role,
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
    const username = data.credentials.username

    return new Promise((resolve, reject) => {
      userDB.findOne({ username }, (err, user) => {
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
      user.find({}, (err, docs) => {
        if (err) reject(err);
        resolve(docs);
      });
    });
  },
}