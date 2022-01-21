import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AppAuthGuard } from 'src/auth/app-auth.guard';
import { CurrentUser } from 'src/auth/current-user';
import { UserUpdateInput } from './dto/request/user-update.input';
import { UserResponse } from './dto/response/user.response';
import { UserService } from './user.service';

@Resolver()
@UseGuards(AppAuthGuard)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Mutation(() => UserResponse)
  registerUser(@CurrentUser() userId: string): Promise<UserResponse> {
    return this._userService.create(userId);
  }

  @Mutation(() => UserResponse)
  updateUser(
    @CurrentUser() userId: string,
    @Args('userUpdateInput') userUpdateInput: UserUpdateInput,
  ): Promise<UserResponse> {
    return this._userService.update(userId, userUpdateInput);
  }
}
