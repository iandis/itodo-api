import { ObjectType } from '@nestjs/graphql';
import { TodoResponse } from './todo.response';

@ObjectType()
export class TodoUpdateResponse extends TodoResponse {}
