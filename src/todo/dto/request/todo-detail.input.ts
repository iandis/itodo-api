import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TodoDetailInput {
  @Field(() => String)
  id: string;
}
