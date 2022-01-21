import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TodoDeleteInput {
  @Field(() => String)
  id: string;
}
