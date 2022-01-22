import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TodoStatus } from '../shared/todo-status.enum';

registerEnumType(TodoStatus, {
  name: 'TodoStatus',
  description: 'The status of the todo',
});

@ObjectType()
export class TodoResponse {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  subtitle: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => TodoStatus)
  status: TodoStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
