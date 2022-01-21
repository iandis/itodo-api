import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { UserUpdateInput } from './user-update.input';

@InputType()
export class UserCreateInput extends PartialType(UserUpdateInput) {
  @MaxLength(50)
  @Field(() => ID)
  id: string;
}
