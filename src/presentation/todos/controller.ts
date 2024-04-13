import { create } from "domain"
import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos"

export class TodosController {

  constructor() { }
  
  public getTodos = async (req: Request, res: Response) => {
    const allTodos = await prisma.todo.findMany()
    return res.json(allTodos)
  }

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id
    
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' })
    
    const todo = await prisma.todo.findUnique({ where: { id: id } })
    
    if (!todo) return res.status(404).json({ message: 'Todo not found' })
    
    return res.json(todo)
  
    
  }

  public createTodo = async (req: Request, res: Response) => {

    const [error, createTodoDto] = CreateTodoDto.create(req.body)

    if(error) return res.status(400).json({ message: error })
    const todo = await prisma.todo.create({
      data: createTodoDto!
    })

    res.status(201).json({...todo})
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id
    console.log({...req.body, id})
    const [error, updateTodoDto] = UpdateTodoDto.update({...req.body, id})

    if(error) return res.status(400).json({ message: error })
    
    const todo = await prisma.todo.findFirst({ where: { id: id } })
    if(!todo) return res.status(404).json({ message: 'Todo not found' })
    
    // console.log(updateTodoDto?.values)
    const updatedTodo = await prisma.todo.update({
      where: { id: id },
      data: updateTodoDto!.values
    })
    res.json({ updatedTodo })
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' })
    const todo = await prisma.todo.findFirst({ where: { id: id } })
    if (!todo) return res.status(404).json({ message: 'Todo not found' })
    const deletedTodo = await prisma.todo.delete({where: { id: id }})
    res.json(deletedTodo)
    
  }
}