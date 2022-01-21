import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-errors';
import { Connection, Repository } from 'typeorm';
import { TodoCreateInput } from './dto/request/todo-create.input';
import { TodoListInput } from './dto/request/todo-list.input';
import { TodoDetailInput } from './dto/request/todo-detail.input';
import { TodoCreateResponse } from './dto/response/todo-create.response';
import { TodoDetailResponse } from './dto/response/todo-detail.response';
import { TodoDetail } from './entities/todo-detail.entity';
import { Todo } from './entities/todo.entity';
import { v4 as uuidv4 } from 'uuid';
import { TodoUpdateInput } from './dto/request/todo-update.input';
import { TodoUpdateResponse } from './dto/response/todo-update.response';
import { TodoDeleteResponse } from './dto/response/todo-delete.response';
import { TodoListResponse } from './dto/response/todo-list.response';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly _todoRepository: Repository<Todo>,
    @InjectRepository(TodoDetail)
    private readonly _todoDetailRepository: Repository<TodoDetail>,
    private readonly _connection: Connection,
  ) {}

  async fetch(
    userId: string,
    todoListInput: TodoListInput,
  ): Promise<TodoListResponse> {
    const { page, limit } = todoListInput;
    try {
      const todos: Todo[] = await this._todoRepository.find({
        where: { userId: userId },
        order: { updatedAt: 'DESC' },
        skip: page * limit,
        take: limit,
      });
      const todoList: TodoListResponse = {
        todos: todos,
      };
      return todoList;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.fetch]');
      throw new ApolloError('Failed to fetch todos.', 'TODO_FETCH_FAILED');
    }
  }

  async findOneById(
    todoDetailInput: TodoDetailInput,
  ): Promise<TodoDetailResponse> {
    const { id } = todoDetailInput;
    try {
      const todo: TodoDetail = await this._internalFindOneById(id);
      return todo;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.findOneById]');
      throw new ApolloError('Failed to find todo.', 'TODO_FIND_FAILED');
    }
  }

  private async _internalFindOneById(id: string): Promise<TodoDetail> {
    const todo: TodoDetail = await this._todoDetailRepository.findOne(id);
    return todo;
  }

  async create(
    userId: string,
    todoCreateInput: TodoCreateInput,
  ): Promise<TodoCreateResponse> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const todoId: string = uuidv4();
      const createdAt: Date = new Date();
      const newTodo: TodoDetail = Object.assign(new TodoDetail(), {
        ...todoCreateInput,
        id: todoId,
        userId: userId,
        createdAt: createdAt,
        updatedAt: createdAt,
      });
      const result = await queryRunner.manager.insert(TodoDetail, newTodo);
      Logger.log(JSON.stringify(result), '[TodoService.create]');
      return newTodo;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.create]');
      await queryRunner.rollbackTransaction();
      throw new ApolloError('Failed to create todo.', 'TODO_CREATE_FAILED');
    } finally {
      await queryRunner.release();
    }
  }

  async update(todoUpdateInput: TodoUpdateInput): Promise<TodoUpdateResponse> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id, ...newTodo } = todoUpdateInput;
      const oldTodo: TodoDetail = await this._internalFindOneById(id);
      const updatedAt: Date = new Date();
      const updatedTodo: TodoDetail = Object.assign(new TodoDetail(), {
        ...oldTodo,
        ...newTodo,
        updatedAt: updatedAt,
      });
      await queryRunner.manager.update(
        TodoDetail,
        {
          where: { id: id },
        },
        updatedTodo,
      );
      return { success: true } as TodoUpdateResponse;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.update]');
      await queryRunner.rollbackTransaction();
      throw new ApolloError('Failed to update todo.', 'TODO_UPDATE_FAILED');
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<TodoDeleteResponse> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Todo, { id });
      return { success: true } as TodoDeleteResponse;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.delete]');
      await queryRunner.rollbackTransaction();
      throw new ApolloError('Failed to delete todo.', 'TODO_DELETE_FAILED');
    } finally {
      await queryRunner.release();
    }
  }
}
