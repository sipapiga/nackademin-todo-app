const { expect } = require('chai')
const User = require('../models/user')

describe('Auth', function () {
  beforeEach(() => {
    User.clear()
  })
  it('should return an object of registed user', async function () {

    const user = {
      firstName: 'Rosalee',
      lastName: 'Stroman',
      email: 'email63110@gmail.com',
      role: 'admin',
      username: 'Lia_Douglas',
      password: '2UYUfEwK1VtIl4o'
    }

    const createUser = await User.register(user)
    //assert 
    expect(createUser.username).to.equal('Lia_Douglas');
  })

  it('Auth-login', async function () {

    const user = {
      firstName: 'Rosalee',
      lastName: 'Stroman',
      email: 'email63110@gmail.com',
      role: 'admin',
      username: 'Lia_Douglas',
      password: '2UYUfEwK1VtIl4o'
    }
    const user2 = {
      firstName: 'Eriberto',
      lastName: 'Grimes',
      email: 'email91994@gmail.com',
      role: 'user',
      username: 'Stephen.Walker',
      password: 'Z9fn548lRjLp9_b'
    }

    await User.register(user)
    await User.register(user2)

    const credentials = {
      username: 'Stephen.Walker',
      password: 'Z9fn548lRjLp9_b'
    }
    const loginUser = await User.login({ credentials })
    //assert 
    expect(loginUser.username).to.equal('Stephen.Walker');
  })
})