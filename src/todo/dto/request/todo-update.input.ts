import { Field, InputType, PartialType } from '@nestjs/graphql';
import { TodoCreateInput } from './todo-create.input';

@InputType()
export class TodoUpdateInput extends PartialType(TodoCreateInput) {
  @Field(() => String)
  id: string;
}
