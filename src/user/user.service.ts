import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-errors';
import { Connection, Repository } from 'typeorm';
import { UserCreateInput } from './dto/request/user-create.input';
import { UserUpdateInput } from './dto/request/user-update.input';
import { UserResponse } from './dto/response/user.response';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    private readonly _connection: Connection,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    try {
      const user: User = await this._userRepository.findOne(id);
      return user;
    } catch (err) {
      Logger.error(err.message, err.stack, '[UserService.findOneById]');
      return null;
    }
  }

  async create(
    userId: string,
    userCreateInput?: UserCreateInput,
  ): Promise<UserResponse> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user: User = {
        id: userId,
      } as User;

      if (userCreateInput) {
        user = {
          ...user,
          ...userCreateInput,
        } as User;
      }

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return user;
    } catch (err) {
      Logger.error(err.message, err.stack, '[UserService.create]');
      await queryRunner.rollbackTransaction();
      throw new ApolloError('Failed to create user.', 'USER_CREATE_FAILED');
    }
  }

  async update(
    userId: string,
    userUpdateInput: UserUpdateInput,
  ): Promise<UserResponse> {
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const oldUser: User | null = await this.findOneById(userId);
      if (!oldUser) {
        throw new ApolloError('User not found.', 'USER_NOT_FOUND');
      }
      const newUser: User = {
        ...oldUser,
        ...userUpdateInput,
      } as User;
      await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();

      return newUser;
    } catch (err) {
      Logger.error(err.message, err.stack, '[UserService.update]');
      await queryRunner.rollbackTransaction();
      throw new ApolloError('Failed to update user.', 'USER_UPDATE_FAILED');
    }
  }
}
