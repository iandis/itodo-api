import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { TodoDetail } from 'src/todo/entities/todo-detail.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          name: 'default',
          type: 'postgres',
          host: config.DB_HOST,
          port: config.DB_PORT,
          username: config.DB_USERNAME,
          password: config.DB_PASSWORD,
          database: config.DB_DATABASE,
          keepConnectionAlive: true,
          entities: [Todo, TodoDetail, User],
          synchronize: false,
          ssl: {
            ca: config.SSL_CERT,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
