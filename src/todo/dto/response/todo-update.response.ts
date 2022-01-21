import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TodoUpdateResponse {
  @Field(() => Boolean)
  success: boolean;
}
