const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai
const app = require('../app')

const User = require('../models/user')
const Todolist = require('../models/todolist')

describe('Todolist API routes', function () {
  beforeEach(async function () {
    await User.clear()
    await Todolist.clearTodolist()
    const todoList = {
      title: 'Intergration List',
      creator: 'Pat',
      todos: []
    }

    const result = await Todolist.createTodolist(todoList)
    this.currentTest.resultID = result._id

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
    const todoList2 = {
      title: 'Intergration List',
      creator: 'Pat',
      todos: []
    }
    request(app)
      .post('/api/todolist')
      .set('authorization', `Bearer ${this.test.token}`)
      .set('Content-Type', `application/json`)
      .send(todoList2)
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res).to.be.json
        expect(res.body).to.have.keys(['message', 'data'])
      })
  })

  it('should get status 200 when update todolist route', function () {

    const updatedTodolist = {
      title: 'update List'
    }
    request(app)
      .patch(`/api/todolist/${this.test.resultID}`)
      .set('authorization', `Bearer ${this.test.token}`)
      .set('Content-Type', `application/json`)
      .send(updatedTodolist)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body.message).to.equal('Todolist Updated')
      })
  })
  it('should get a todolist route', function () {

    request(app)
      .get(`/api/todolist/${this.test.resultID}`)
      .set('authorization', `Bearer ${this.test.token}`)
      .set('Content-Type', `application/json`)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.json
      })
  })


})