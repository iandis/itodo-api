import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TodoDeleteResponse {
  @Field(() => Boolean)
  success: boolean;
}
