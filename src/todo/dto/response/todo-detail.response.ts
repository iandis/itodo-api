import { Field, ObjectType } from '@nestjs/graphql';
import { TodoResponse } from './todo.response';

@ObjectType()
export class TodoDetailResponse extends TodoResponse {
  @Field(() => String, { nullable: true })
  description: string;
}
