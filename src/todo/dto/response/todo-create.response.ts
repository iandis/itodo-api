import { ObjectType } from '@nestjs/graphql';
import { TodoDetailResponse } from './todo-detail.response';

@ObjectType()
export class TodoCreateResponse extends TodoDetailResponse {}
