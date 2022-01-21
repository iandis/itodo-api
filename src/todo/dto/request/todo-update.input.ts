import { Field, InputType } from '@nestjs/graphql';
import { TodoCreateInput } from './todo-create.input';

@InputType()
export class TodoUpdateInput extends TodoCreateInput {
  @Field(() => String)
  id: string;
}
