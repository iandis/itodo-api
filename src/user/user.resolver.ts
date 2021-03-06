import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppAuthGuard } from 'src/auth/app-auth.guard';
import { CurrentUser } from 'src/auth/current-user';
import { UserUpdateInput } from './dto/request/user-update.input';
import { UserResponse } from './dto/response/user.response';
import { UserService } from './user.service';

@Resolver()
@UseGuards(AppAuthGuard)
export class UserResolver {
  constructor(private readonly _userService: UserService) {}

  @Query(() => UserResponse)
  userDetail(@CurrentUser() userId: string): Promise<UserResponse> {
    return this._userService.findOneById(userId);
  }

  @Mutation(() => UserResponse)
  userCreate(
    @CurrentUser() userId: string,
    @Args('userCreateInput', { nullable: true })
    userCreateInput?: UserUpdateInput,
  ): Promise<UserResponse> {
    return this._userService.create(userId, userCreateInput);
  }

  @Mutation(() => UserResponse)
  userUpdate(
    @CurrentUser() userId: string,
    @Args('userUpdateInput') userUpdateInput: UserUpdateInput,
  ): Promise<UserResponse> {
    return this._userService.update(userId, userUpdateInput);
  }
}
