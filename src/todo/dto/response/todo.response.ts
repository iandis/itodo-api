import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TodoStatus } from '../shared/todo-status.enum';

@ObjectType()
export class TodoResponse {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  subtitle: string;

  @Field(() => String)
  status: TodoStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
