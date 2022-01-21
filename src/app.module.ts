import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error';
import { graphqlErrorHandler } from './shared/helpers/common/graphql-error-handler.helper';
import { APP_GUARD } from '@nestjs/core';
import { AppAuthGuard } from './auth/app-auth.guard';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ConfigModule,
    TodoModule,
    UserModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: false,
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => ({ req, res, headers: req.headers }),
      formatError: (err: GraphQLError): GraphQLFormattedError => {
        return graphqlErrorHandler(err);
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard,
    }
  ]
})
export class AppModule {}
