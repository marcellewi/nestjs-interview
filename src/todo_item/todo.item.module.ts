import { Module } from '@nestjs/common';
import { TodoItemController } from './todo_item.controller';
import { TodoItemService } from './todo_item.service';
import { TodoListsModule } from '../todo_lists/todo_lists.module';

@Module({
  imports: [TodoListsModule],
  controllers: [TodoItemController],
  providers: [
    { provide: 'TODOITEMS', useValue: [] }, 
    TodoItemService,
  ],
})
export class TodoItemModule {}

