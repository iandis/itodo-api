import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UserUpdateInput {
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @MaxLength(150)
  @Field(() => String, { nullable: true })
  image?: string;

  @IsOptional()
  @MaxLength(250)
  @Field(() => String, { nullable: true })
  about?: string;
}
