var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
const Todolist = require('../models/todolist')
const Todo = require('../models/todo')
const Database = require('../database/index')
const User = require('../models/user')

describe('TodoList Model', function () {
  before(async () => {
    await Database.connect()
  })

  after(async () => {
    await Database.disconnect()
  })

  beforeEach(async function () {
    await Database.clearDatabase()

    //create user 
    const user = {
      firstName: 'Rosalee',
      role: 'admin',
      username: 'Rosalee',
      password: '2UYUfEwK1VtIl4o'
    }

    this.createUser = await User.register(user)

    const todoList = {
      title: 'List2',
      user: this.createUser,
      todos: []
    }

    const result = await Todolist.createTodolist(todoList)
    console.log(result)

    //Create todoitem 
    const todoItem1 = {
      title: 'tenetur laborum commodi',
      user: this.createUser,
      todolistId: result._id
    }
    const todoItem2 = {
      title: 'in eum consequatur',
      user: this.createUser,
      todolistId: result._id
    }
    this.todo1 = await Todo.createTodo(todoItem1);
    this.todo2 = await Todo.createTodo(todoItem2);
  })

  it('should create todoList with todos', async function () {
    let user = this.createUser
    //create todoList
    const todoList = {
      title: 'List1',
      createdBy: user,
      todos: []
    }

    const result = await Todolist.createTodolist(todoList)

    //Create todoitem 
    const todoItem3 = {
      title: 'odio necessitatibus placeat',
      user: user,
      todolistId: result._id
    }
    const todoItem4 = {
      title: 'numquam necessitatibus ad',
      user: user,
      todolistId: result._id
    }

    const result1 = await Todo.createTodo(todoItem3);
    const result2 = await Todo.createTodo(todoItem4);
    await Todolist.addTodoInList(result1)
    await Todolist.addTodoInList(result2)

    const todolist = await Todolist.getTodolist(result._id)


    expect(todolist.title).to.equal('List1');
  })

  it('should get all todolists', async function () {
    //create todoList
    const todoList = {
      title: 'List1',
      user: this.createUser,
      todos: [this.todo1, this.todo2]
    }

    const todoList2 = {
      title: 'List2',
      user: this.createUser,
      todos: [this.todo1, this.todo2]
    }

    const todoList3 = {
      title: 'List3',
      user: this.createUser,
      todos: [this.todo1, this.todo2]
    }

    await Todolist.createTodolist(todoList)
    await Todolist.createTodolist(todoList2)
    await Todolist.createTodolist(todoList3)

    const alltodoList = await Todolist.getAll(this.createUser._id)


    alltodoList.should.have.lengthOf(4)
    expect(alltodoList).to.be.an('array')
  })

  it('should return an updated todolist', async function () {
    //create todoList
    const todoList = {
      title: 'List1',
      user: this.createUser,
      todos: [this.todo1._id, this.todo2._id]
    }

    const result = await Todolist.createTodolist(todoList)

    let newTitleTodolist = {
      title: 'Todolist1 changed'
    }

    const updateTodolist = await Todolist.updateTodolist(newTitleTodolist, result._id)

    expect(updateTodolist).to.exist
    updateTodolist.title.should.be.equal('Todolist1 changed');
  })

  it('should return a number of deleted list', async function () {
    //create todoList
    const todoList = {
      title: 'List1',
      user: this.createUser,
      todos: [this.todo1._id, this.todo2._id]
    }

    const todoList2 = {
      title: 'List2',
      user: this.createUser,
      todos: [this.todo1._id, this.todo2._id]
    }

    const list1 = await Todolist.createTodolist(todoList)
    const list2 = await Todolist.createTodolist(todoList2)

    const deletedTodolist = await Todolist.deleteTodolist(list1._id)

    deletedTodolist.deletedCount.should.be.equal(1);
  })
})