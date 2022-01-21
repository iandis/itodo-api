import { Field, ObjectType } from '@nestjs/graphql';
import { TodoResponse } from './todo.response';

@ObjectType()
export class TodoListResponse {
  @Field(() => [TodoResponse])
  todos: TodoResponse[];
}
