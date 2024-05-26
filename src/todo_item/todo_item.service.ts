import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TodoItem } from '../interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoListsService } from '../todo_lists/todo_lists.service';

@Injectable()
export class TodoItemService {
  private todoItems: TodoItem[];

  constructor(
    private readonly todoListsService: TodoListsService, 
    @Inject('TODOITEMS') todoItems: TodoItem[] 
  ) {
    this.todoItems = todoItems;
  }

  async create(dto: CreateTodoItemDto, todoListId: string): Promise<TodoItem> {
    const listId = Number(todoListId);
    const todoList = this.todoListsService.get(listId);
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${listId} not found`);
    }

    const todoItem: TodoItem = {
      id: this.nextId(),
      name: dto.name,
      description: dto.description,
      completed: false,
      todoListId: listId,
    };

    this.todoItems.push(todoItem);
    return todoItem;
  }

  async getByListId(todoListId: string): Promise<TodoItem[]> {
    const listId = Number(todoListId);
    const todoList = this.todoListsService.get(listId);
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${listId} not found`);
    }

    return this.todoItems.filter((x) => x.todoListId === listId);
  }

  async getById(todoListId: string, id: string): Promise<TodoItem> {
    const listId = Number(todoListId);
    const itemId = Number(id);
    const todoList = this.todoListsService.get(listId);
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${listId} not found`);
    }

    const item = this.todoItems.find((x) => x.todoListId === listId && x.id === itemId);
    if (!item) {
      throw new NotFoundException(`TodoItem with id ${itemId} not found`);
    }
    return item;
  }

  async update(todoListId: string, id: string, dto: UpdateTodoItemDto): Promise<TodoItem> {
    const listId = Number(todoListId);
    const itemId = Number(id);
    const todoList = this.todoListsService.get(listId);
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${listId} not found`);
    }

    const index = this.todoItems.findIndex((x) => x.todoListId === listId && x.id === itemId);
    if (index === -1) {
      throw new NotFoundException(`TodoItem with id ${itemId} not found`);
    }
    const updatedItem = { ...this.todoItems[index], ...dto };
    this.todoItems[index] = updatedItem;
    return updatedItem;
  }

  async remove(todoListId: string, id: string): Promise<void> {
    const listId = Number(todoListId);
    const itemId = Number(id);
    const todoList = this.todoListsService.get(listId);
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${listId} not found`);
    }

    const index = this.todoItems.findIndex((x) => x.todoListId === listId && x.id === itemId);
    if (index === -1) {
      throw new NotFoundException(`TodoItem with id ${itemId} not found`);
    }
    this.todoItems.splice(index, 1);
  }

  private nextId(): number {
    const last = this.todoItems
      .map((x) => x.id)
      .sort((a, b) => b - a)[0];

    return last ? last + 1 : 1;
  }
}

