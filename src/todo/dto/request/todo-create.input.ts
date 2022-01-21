import { Field, InputType } from '@nestjs/graphql';
import { TodoStatus } from '../shared/todo-status.enum';

@InputType()
export class TodoCreateInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  subtitle: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => TodoStatus)
  status: TodoStatus;
}
