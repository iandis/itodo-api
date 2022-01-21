import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppAuthGuard } from 'src/auth/app-auth.guard';
import { CurrentUser } from 'src/auth/current-user';
import { TodoCreateInput } from './dto/request/todo-create.input';
import { TodoDeleteInput } from './dto/request/todo-delete.input';
import { TodoDetailInput } from './dto/request/todo-detail.input';
import { TodoListInput } from './dto/request/todo-list.input';
import { TodoUpdateInput } from './dto/request/todo-update.input';
import { TodoCreateResponse } from './dto/response/todo-create.response';
import { TodoDeleteResponse } from './dto/response/todo-delete.response';
import { TodoDetailResponse } from './dto/response/todo-detail.response';
import { TodoListResponse } from './dto/response/todo-list.response';
import { TodoUpdateResponse } from './dto/response/todo-update.response';
import { TodoService } from './todo.service';

@Resolver()
@UseGuards(AppAuthGuard)
export class TodoResolver {
  constructor(private readonly _todoService: TodoService) {}

  @Query(() => TodoListResponse)
  todoList(
    @CurrentUser()
    userId: string,
    @Args('todoListInput')
    todoListInput: TodoListInput,
  ): Promise<TodoListResponse> {
    return this._todoService.fetch(userId, todoListInput);
  }

  @Query(() => TodoDetailResponse)
  todoDetail(
    @Args('todoDetailInput')
    todoDetailInput: TodoDetailInput,
  ): Promise<TodoDetailResponse> {
    return this._todoService.findOneById(todoDetailInput);
  }

  @Mutation(() => TodoCreateResponse)
  todoCreate(
    @CurrentUser()
    userId: string,
    @Args('todoCreateInput')
    todoCreateInput: TodoCreateInput,
  ): Promise<TodoCreateResponse> {
    return this._todoService.create(userId, todoCreateInput);
  }

  @Mutation(() => TodoUpdateResponse)
  todoUpdate(
    @Args('todoUpdateInput')
    todoUpdateInput: TodoUpdateInput,
  ): Promise<TodoUpdateResponse> {
    return this._todoService.update(todoUpdateInput);
  }

  @Mutation(() => TodoDeleteResponse)
  todoDelete(
    @Args('todoDeleteInput')
    todoDeleteInput: TodoDeleteInput,
  ): Promise<TodoDeleteResponse> {
    return this._todoService.delete(todoDeleteInput.id);
  }
}
