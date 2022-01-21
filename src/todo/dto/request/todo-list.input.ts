import { InputType } from '@nestjs/graphql';
import { PaginationInput } from 'src/shared/dto/common/pagination.input';

@InputType()
export class TodoListInput extends PaginationInput {}
