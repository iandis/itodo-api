import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { TodoCreateInput } from './dto/request/todo-create.input';
import { TodoListInput } from './dto/request/todo-list.input';
import { TodoDetailInput } from './dto/request/todo-detail.input';
import { TodoCreateResponse } from './dto/response/todo-create.response';
import { Todo } from './entities/todo.entity';
import { v4 as uuidv4 } from 'uuid';
import { TodoUpdateInput } from './dto/request/todo-update.input';
import { TodoUpdateResponse } from './dto/response/todo-update.response';
import { TodoDeleteResponse } from './dto/response/todo-delete.response';
import { TodoListResponse } from './dto/response/todo-list.response';
import { TodoResponse } from './dto/response/todo.response';
import { ServerError } from 'src/shared/errors/server.error';
import { ApolloError } from 'apollo-server-express';
import { RequestError } from 'src/shared/errors/request.error';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly _todoRepository: Repository<Todo>,
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
      throw new ServerError('Failed to fetch todos.', 'TODO_FETCH_FAILED');
    }
  }

  async findOneById(todoDetailInput: TodoDetailInput): Promise<TodoResponse> {
    const { id } = todoDetailInput;
    try {
      const todo: Todo = await this._internalFindOneById(id);
      return todo;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.findOneById]');
      throw new ServerError('Failed to find todo.', 'TODO_FIND_FAILED');
    }
  }

  private async _internalFindOneById(id: string): Promise<Todo> {
    const todo: Todo = await this._todoRepository.findOne({
      where: { id },
    });
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
      const newTodo: Todo = Object.assign(new Todo(), {
        id: todoId,
        userId: userId,
        ...todoCreateInput,
        createdAt: createdAt,
        updatedAt: createdAt,
      });
      await queryRunner.manager.insert(Todo, newTodo);
      await queryRunner.commitTransaction();

      return newTodo;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.create]');
      await queryRunner.rollbackTransaction();
      throw new ServerError('Failed to create todo.', 'TODO_CREATE_FAILED');
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
      const oldTodo: Todo = await this._internalFindOneById(id);
      if (!oldTodo) {
        throw new RequestError('Todo not found.', 'TODO_NOT_FOUND');
      }
      const updatedAt: Date = new Date();
      const updatedTodo: Todo = Object.assign(new Todo(), {
        ...oldTodo,
        ...newTodo,
        updatedAt: updatedAt,
      });
      await queryRunner.manager.update(Todo, updatedTodo.id, updatedTodo);
      await queryRunner.commitTransaction();

      return updatedTodo;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.update]');
      await queryRunner.rollbackTransaction();
      if (err instanceof ApolloError) {
        throw err;
      }
      throw new ServerError('Failed to update todo.', 'TODO_UPDATE_FAILED');
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
      await queryRunner.commitTransaction();

      return { success: true } as TodoDeleteResponse;
    } catch (err) {
      Logger.error(err.message, err.stack, '[TodoService.delete]');
      await queryRunner.rollbackTransaction();
      throw new ServerError('Failed to delete todo.', 'TODO_DELETE_FAILED');
    } finally {
      await queryRunner.release();
    }
  }
}
