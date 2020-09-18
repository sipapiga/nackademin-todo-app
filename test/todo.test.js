const chai = require('chai')
chai.should()
const Todo = require('../models/todo')
const Database = require('../database/index')

describe('Todo Model', () => {
  before(async () => {
    await Database.connect()
  })

  after(async () => {
    await Database.disconnect()
  })

  beforeEach(async () => {
    await Database.clearDatabase()
  })
  it('should create a todo', async () => {
    //arrange
    const todoItem = {
      title: 'Todo1',
    }
    //act
    const todo = await Todo.createTodo(todoItem);

    //assert
    todo.title.should.be.equal('Todo1');
  })

  it('should get all todos', async () => {
    const todoItem1 = {
      title: 'Todo2',
    }
    const todoItem2 = {
      title: 'Todo3',
    }
    await Todo.createTodo(todoItem1);
    await Todo.createTodo(todoItem2);

    const allTodo = await Todo.getAll();
    allTodo.should.have.lengthOf(2);
  })

  it('should get only one todo', async () => {
    const todoItem1 = {
      title: 'Todo4',
    }
    const todoItem2 = {
      title: 'Todo5',
    }
    const todo1 = await Todo.createTodo(todoItem1);
    const todo2 = await Todo.createTodo(todoItem2);

    const todo = await Todo.getTodo(todo1._id);

    todo.should.be.an('object');
  })
  it('should return an updated todo', async () => {
    const todoItem1 = {
      title: 'Todo6',
    }
    const todoItem2 = {
      title: 'Todo7',
    }
    const todo1 = await Todo.createTodo(todoItem1);
    const todo2 = await Todo.createTodo(todoItem2);

    const newTodo = {
      title: 'Todo6 updated',
    }

    const updateTodo = await Todo.updateTodo(newTodo, todo1._id)

    console.log(updateTodo)
    updateTodo.title.should.be.equal('Todo6 updated');
  })
  it('should return a number of deleted a todo', async () => {
    const todoItem1 = {
      title: 'Todo8',
    }
    const todoItem2 = {
      title: 'Todo9',
    }
    const todo1 = await Todo.createTodo(todoItem1);
    const todo2 = await Todo.createTodo(todoItem2);
    //act
    const deleteTodo = await Todo.deleteTodo(todo1._id)
    //assert
    deleteTodo.deletedCount.should.be.equal(1);
  })
})