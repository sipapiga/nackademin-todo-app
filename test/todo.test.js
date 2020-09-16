const chai = require('chai')
chai.should()
const Todo = require('../models/todo')

describe('Todo Model', () => {
  beforeEach(() => {
    Todo.clearTodo()
  })
  it('should create a todo', async () => {
    //arrange
    const todoItem = {
      title: 'Todo1',
      user: {
        firstName: 'xyz'
      }
    }
    //act
    const todo = await Todo.createTodo(todoItem);

    //assert
    todo.title.should.be.equal('Todo1');
  })

  it('should get all todos', async () => {
    const todoItem1 = {
      title: 'Todo2',
      user: {
        _id: 'def'
      }
    }
    const todoItem2 = {
      title: 'Todo3',
      user: {
        _id: 'abc'
      }
    }
    await Todo.createTodo(todoItem1);
    await Todo.createTodo(todoItem2);

    const allTodo = await Todo.getAll('abc');
    allTodo.should.have.lengthOf(1);
  })

  it('should get only one todo', async () => {
    const todoItem1 = {
      title: 'Todo4',
      user: {
        _id: 'xyz'
      }
    }
    const todoItem2 = {
      title: 'Todo5',
      user: {
        _id: 'abc'
      }
    }
    const todo1 = await Todo.createTodo(todoItem1);
    const todo2 = await Todo.createTodo(todoItem2);

    const todo = await Todo.getTodo(todo1._id);

    todo.should.be.an('object');
  })
  it('should return an updated todo', async () => {
    const todoItem1 = {
      title: 'Todo6',
      user: {
        _id: 'xyz'
      }
    }
    const todoItem2 = {
      title: 'Todo7',
      user: {
        _id: 'abc'
      }
    }
    const todo1 = await Todo.createTodo(todoItem1);
    const todo2 = await Todo.createTodo(todoItem2);

    const newTodo = {
      title: 'Todo6 updated',
    }

    const updateTodo = await Todo.updateTodo(newTodo, todo1._id)
    updateTodo.title.should.be.equal('Todo6 updated');
  })
  it('should return a number of deleted a todo', async () => {
    const todoItem1 = {
      title: 'Todo8',
      user: {
        _id: 'xyz'
      }
    }
    const todoItem2 = {
      title: 'Todo9',
      user: {
        _id: 'abc'
      }
    }
    const todo1 = await Todo.createTodo(todoItem1);
    const todo2 = await Todo.createTodo(todoItem2);
    //act
    const deleteTodo = await Todo.deleteTodo(todo1._id)
    //assert
    deleteTodo.should.be.equal(2);
  })
})