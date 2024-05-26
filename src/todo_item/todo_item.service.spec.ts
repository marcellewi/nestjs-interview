import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemService } from './todo_item.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';

describe('TodoItemService', () => {
  let service: TodoItemService;
  let todoListsService: TodoListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoItemService,
        {
          provide: TodoListsService,
          useValue: {
            get: jest.fn().mockImplementation((id: number) => ({ id, name: `List ${id}` })),
          },
        },
        { provide: 'TODOITEMS', useValue: [] }, 
      ],
    }).compile();

    service = module.get<TodoItemService>(TodoItemService);
    todoListsService = module.get<TodoListsService>(TodoListsService);
  });

  it('should create a new todo item', async () => {
    const dto: CreateTodoItemDto = { name: 'Test Item', description: 'Test Description' };
    const result = await service.create(dto, '1');
    expect(result).toEqual({
      id: expect.any(Number),
      name: 'Test Item',
      description: 'Test Description',
      completed: false,
      todoListId: 1,
    });
  });

  it('should throw an error if todo list not found', async () => {
    jest.spyOn(todoListsService, 'get').mockReturnValueOnce(undefined);
    const dto: CreateTodoItemDto = { name: 'Test Item', description: 'Test Description' };
    await expect(service.create(dto, '999')).rejects.toThrow(NotFoundException);
  });

  it('should update a todo item', async () => {
    const createDto: CreateTodoItemDto = { name: 'Test Item', description: 'Test Description' };
    const updateDto: UpdateTodoItemDto = { name: 'Updated Item' };
    const createdItem = await service.create(createDto, '1');
    const updatedItem = await service.update('1', createdItem.id.toString(), updateDto);
    expect(updatedItem.name).toBe('Updated Item');
  });

  it('should delete a todo item', async () => {
    const createDto: CreateTodoItemDto = { name: 'Test Item', description: 'Test Description' };
    const createdItem = await service.create(createDto, '1');
    await service.remove('1', createdItem.id.toString());
    await expect(service.getById('1', createdItem.id.toString())).rejects.toThrow(NotFoundException);
  });
});
