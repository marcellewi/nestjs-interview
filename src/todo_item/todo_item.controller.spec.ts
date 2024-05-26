import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemController } from './todo_item.controller';
import { TodoItemService } from './todo_item.service';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoListsService } from '../todo_lists/todo_lists.service'; 
import { TodoItem } from '../interfaces/todo_item.interface';

describe('TodoItemController', () => {
  let controller: TodoItemController;
  let service: TodoItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [
        {
          provide: TodoItemService,
          useValue: {
            create: jest.fn(),
            getByListId: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: TodoListsService,
          useValue: {
            get: jest.fn().mockImplementation((id: number) => ({ id, name: `List ${id}` })),
          },
        },
        { provide: 'TODOITEMS', useValue: [] }, 
      ],
    }).compile();

    controller = module.get<TodoItemController>(TodoItemController);
    service = module.get<TodoItemService>(TodoItemService);
  });

  it('should create a new todo item', async () => {
    const dto: CreateTodoItemDto = { name: 'Test Item', description: 'Test Description' };
    const result: TodoItem = {
      id: 1,
      name: 'Test Item',
      description: 'Test Description',
      completed: false,
      todoListId: 1,
    };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(dto, '1')).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto, '1');
  });

  it('should return todo items by list id', async () => {
    const result: TodoItem[] = [
      { id: 1, name: 'Test Item 1', description: 'Description 1', completed: false, todoListId: 1 },
      { id: 2, name: 'Test Item 2', description: 'Description 2', completed: false, todoListId: 1 },
    ];
    jest.spyOn(service, 'getByListId').mockResolvedValue(result);

    expect(await controller.index('1')).toEqual(result);
    expect(service.getByListId).toHaveBeenCalledWith('1');
  });

  it('should return a todo item by id', async () => {
    const result: TodoItem = { id: 1, name: 'Test Item', description: 'Test Description', completed: false, todoListId: 1 };
    jest.spyOn(service, 'getById').mockResolvedValue(result);

    expect(await controller.findOne('1', '1')).toEqual(result);
    expect(service.getById).toHaveBeenCalledWith('1', '1');
  });

  it('should update a todo item', async () => {
    const updateDto: UpdateTodoItemDto = { name: 'Updated Item' };
    const result: TodoItem = { id: 1, name: 'Updated Item', description: 'Test Description', completed: false, todoListId: 1 };
    jest.spyOn(service, 'update').mockResolvedValue(result);

    expect(await controller.update('1', '1', updateDto)).toEqual(result);
    expect(service.update).toHaveBeenCalledWith('1', '1', updateDto);
  });

  it('should delete a todo item', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    expect(await controller.remove('1','1')).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('1', '1');
  });
});
