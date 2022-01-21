import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class UserUpdateInput {
  @MinLength(1)
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  name?: string;

  @MinLength(5)
  @MaxLength(100)
  @Field(() => String, { nullable: true })
  email?: string;

  @MaxLength(150)
  @Field(() => String, { nullable: true })
  image?: string;

  @MaxLength(250)
  @Field(() => String, { nullable: true })
  about?: string;
}
