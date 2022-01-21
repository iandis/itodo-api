import { ObjectType, PartialType } from '@nestjs/graphql';
import { TodoDetailResponse } from './todo-detail.response';

@ObjectType()
export class TodoCreateResponse extends PartialType(TodoDetailResponse) {}
