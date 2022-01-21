import { ObjectType } from '@nestjs/graphql';
import { TodoUpdateResponse } from './todo-update.response';

@ObjectType()
export class TodoDeleteResponse extends TodoUpdateResponse {}
