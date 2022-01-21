import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import {TodoResponse} from './todo.response';

@ObjectType()
export class TodoDetailResponse extends PartialType(TodoResponse) {
  @Field(() => String, { nullable: true })
  description: string;
}
