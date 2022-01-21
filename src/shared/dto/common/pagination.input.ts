import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  page: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Max(30)
  @Min(1)
  limit: number;
}
