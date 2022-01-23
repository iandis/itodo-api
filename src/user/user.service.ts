import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-errors';
import { RequestError } from 'src/shared/errors/request.error';
import { ServerError } from 'src/shared/errors/server.error';
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
      const user: User = await this._userRepository.findOne({
        where: { id },
      });
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
      const user: User = new User();
      user.id = userId;

      if (userCreateInput) {
        Object.assign(user, userCreateInput);
      }

      await queryRunner.manager.insert(User, user);
      await queryRunner.commitTransaction();

      return user;
    } catch (err) {
      Logger.error(err.message, err.stack, '[UserService.create]');
      await queryRunner.rollbackTransaction();
      throw new ServerError('Failed to create user.', 'USER_CREATE_FAILED');
    } finally {
      await queryRunner.release();
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
      const user: User | null = await this.findOneById(userId);
      if (!user) {
        throw new RequestError('User not found.', 'USER_NOT_FOUND');
      }
      Object.assign(user, userUpdateInput);
      await queryRunner.manager.update(User, userId, user);
      await queryRunner.commitTransaction();

      return user;
    } catch (err) {
      Logger.error(err.message, err.stack, '[UserService.update]');
      await queryRunner.rollbackTransaction();
      if (err instanceof ApolloError) {
        throw err;
      }
      throw new ServerError('Failed to update user.', 'USER_UPDATE_FAILED');
    } finally {
      await queryRunner.release();
    }
  }
}
