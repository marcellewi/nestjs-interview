import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoItemService } from './todo_item.service';
import { TodoItem } from 'src/interfaces/todo_item.interface';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';

@Controller('api/todolist')
export class TodoItemController {
  constructor(private todoItemService: TodoItemService) {}

  @Post("/:listId/todoitem")
  async create(@Body() dto: CreateTodoItemDto, @Param('listId') listId: string): Promise<TodoItem> {
    return await this.todoItemService.create(dto, listId);
  }

  @Get("/:listId")
  async index(@Param('listId') listId: string): Promise<TodoItem[]> {
    return await this.todoItemService.getByListId(listId);
  }

  @Get("/:listId/todoitem/:id")
  async findOne(@Param('listId') listId: string, @Param('id') id: string): Promise<TodoItem> {
    return await this.todoItemService.getById(listId, id);
  }

  @Put("/:listId/todoitem/:id")
  async update(@Param('listId') listId: string, @Param('id') id: string, @Body() dto: UpdateTodoItemDto): Promise<TodoItem> {
    return await this.todoItemService.update(listId, id, dto);
  }

  @Delete("/:listId/todoitem/:id")
  async remove(@Param('listId') listId: string, @Param('id') id: string): Promise<void> {
    return await this.todoItemService.remove(listId, id);
  }
}