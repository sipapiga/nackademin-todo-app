const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai
const app = require('../app')

const Todolist = require('../models/todolist')
const Database = require('../database/index')
const User = require('../models/user')

describe('Todolist API routes', function () {
  before(async () => {
    await Database.connect()
  })

  after(async () => {
    await Database.disconnect()
  })

  beforeEach(async function () {
    await Database.clearDatabase()


    const fields = await User.register({
      firstName: 'Jerrine',
      role: 'admin',
      username: 'abronot0',
      password: '5UyF09sG6oe'
    })
    this.currentTest.user = fields
    this.currentTest.userID = fields._id
    const credentials = {
      username: 'abronot0',
      password: '5UyF09sG6oe'
    }
    const todoList = {
      title: 'Intergration List',
      user: fields,
      todos: []
    }
    const result = await Todolist.createTodolist(todoList)
    this.currentTest.resultID = result._id
    const user = await User.login({ credentials })
    this.currentTest.token = await User.getSignedJwtToken(user.toJSON())

  })

  it('should create todolist', function (done) {
    const todoList2 = {
      title: 'Intergration List 2',
      user: this.test.user,
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
        done()
      })
  })

   it('should get status 200 when update todolist route', function (done) {
 
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
         done()
       })
   })
   it('should get a todolist route', function (done) {
 
     request(app)
       .get(`/api/todolist/${this.test.resultID}`)
       .set('authorization', `Bearer ${this.test.token}`)
       .set('Content-Type', `application/json`)
       .end((err, res) => {
         expect(res).to.have.status(200)
         expect(res).to.be.json
         done()
       })
   }) 


})