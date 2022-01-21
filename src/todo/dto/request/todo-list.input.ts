import { InputType, PartialType } from '@nestjs/graphql';
import { PaginationInput } from 'src/shared/dto/common/pagination.input';

@InputType()
export class TodoListInput extends PartialType(PaginationInput) {}
