import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [AuthModule, ConfigModule, TypeOrmModule.forFeature([Todo, User])],
  providers: [TodoService, TodoResolver],
  exports: [TodoService],
})
export class TodoModule {}
