import { ObjectType, PartialType } from '@nestjs/graphql';
import { TodoUpdateResponse } from './todo-update.response';

@ObjectType()
export class TodoDeleteResponse extends PartialType(TodoUpdateResponse) {}
