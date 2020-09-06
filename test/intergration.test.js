const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai
const app = require('../app')

const User = require('../models/User')
const Todolist = require('../models/todolist')

describe('Todolist API routes', function () {
  beforeEach(async function () {
    await User.clear()
    await Todolist.clearTodolist()

    const fields = await User.register({
      firstName: 'Jerrine',
      lastName: 'De Blasi',
      email: '	jdeblasi0@bbc.co.uk',
      role: 'admin',
      username: 'abronot0',
      password: '5UyF09sG6oe'
    })
    this.currentTest.userID = fields._id
    const credentials = {
      username: 'abronot0',
      password: '5UyF09sG6oe'
    }
    const user = await User.login({ credentials })
    this.currentTest.token = await User.getSignedJwtToken(user)

  })

  it('should create todolist', function () {
    const todoList = {
      title: 'Intergration List',
      creator: 'Pat',
      todos: []
    }
    request(app)
      .post('/api/todolist')
      .set('authorization', `Bearer ${this.test.token}`)
      .set('Content-Type', `application/json`)
      .send(todoList)
      .end((err, res) => {
        console.log(res.body)
        expect(res).to.have.status(201)
        expect(res).to.be.json
        expect(res.body).to.have.keys(['message', 'data'])
      })
  }),
  
  it('should get a todolist route', async function () {
    const todoList = {
      title: 'Intergration List',
      creator: 'Pat',
      todos: []
    }

    const result = await Todolist.createTodolist(todoList)
    request(app)
      .get(`/api/todolist/${result._id}`)
      .set('authorization', `Bearer ${this.test.token}`)
      .set('Content-Type', `application/json`)
      .end((err, res) => {
        console.log(res.body)
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.have.keys(['_id', 'title','creator','todos','createdAt','updatedAt'])
      })
  })

})