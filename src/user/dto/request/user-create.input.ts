import { InputType } from '@nestjs/graphql';
import { UserUpdateInput } from './user-update.input';

@InputType()
export class UserCreateInput extends UserUpdateInput {}
