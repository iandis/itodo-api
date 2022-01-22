import { ObjectType } from '@nestjs/graphql';
import { TodoResponse } from './todo.response';

@ObjectType()
export class TodoCreateResponse extends TodoResponse {}
