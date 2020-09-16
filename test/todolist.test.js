const { expect, should } = require('chai')
const Todolist = require('../models/todolist')
const Todo = require('../models/todo')

describe('TodoList Model', function () {
  beforeEach(async function () {
    Todolist.clearTodolist()
    Todo.clearTodo()

    //Create todoitem 
    const todoItem1 = {
      title: 'tenetur laborum commodi',
      user: {
        _id: 'xyz'
      },
      todolistId: 'Fkl5T2GK2qDG1qfI'
    }
    const todoItem2 = {
      title: 'in eum consequatur',
      user: {
        _id: 'abc'
      },
      todolistId: 'Fkl5T2GK2qDG1qfI'
    }
    this.todo1 = await Todo.createTodo(todoItem1);
    this.todo2 = await Todo.createTodo(todoItem2);
  })

  it('should create todoList with todos', async function () {
    //create todoList
    const todoList = {
      title: 'List1',
      createdBy: 'Pat',
      todos: []
    }

    const result = await Todolist.createTodolist(todoList)

    //Create todoitem 
    const todoItem3 = {
      title: 'odio necessitatibus placeat',
      user: {
        _id: 'abc'
      },
      todolistId: result._id
    }
    const todoItem4 = {
      title: 'numquam necessitatibus ad',
      user: {
        _id: 'abc'
      },
      todolistId: result._id
    }

    await Todo.createTodo(todoItem3);
    await Todo.createTodo(todoItem4);

    const todos = await Todo.getAll('abc')

    const newtodo = todos.filter(function (todo) {
      if (todo.todolistId === result._id) {
        return todo
      }
    })
    result.todos.push(newtodo)

    expect(result.title).to.equal('List1');
  })

  it('should get all todolists', async function () {
    //create todoList
    const todoList = {
      title: 'List1',
      createdBy: {
        _id: 'Pat'
      },
      todos: [this.todo1, this.todo2]
    }

    const todoList2 = {
      title: 'List2',
      createdBy: {
        _id: 'Pat'
      },
      todos: [this.todo1, this.todo2]
    }

    const todoList3 = {
      title: 'List3',
      createdBy:{
        _id: 'Kalle'
      },
      todos: [this.todo1, this.todo2]
    }

    await Todolist.createTodolist(todoList)
    await Todolist.createTodolist(todoList2)
    await Todolist.createTodolist(todoList3)

    const alltodoList = await Todolist.getAll('Pat')

   // alltodoList.should.have.lengthOf(2)
    expect(alltodoList).to.be.an('array')
  })

  it('should return an updated todolist', async function () {
    //create todoList
    const todoList = {
      title: 'List1',
      createdBy: 'Pat',
      todos: [this.todo1._id,this.todo2._id]
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
      createdBy: 'Pat',
      todos: [this.todo1._id,this.todo2._id]
    }

    const todoList2 = {
      title: 'List2',
      createdBy: 'Kiana',
      todos: ['5f53aa72fc13ae3b8f000000','5f53aa72fc13ae3b8f000002']
    }

    const list1 = await Todolist.createTodolist(todoList)
    const list2 = await Todolist.createTodolist(todoList2)

    const deletedTodolist = await Todolist.deleteTodolist(list1._id)

    deletedTodolist.should.be.equal(1);
  }) 


})