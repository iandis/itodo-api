import { Logger } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export const graphqlErrorHandler = (
  err: GraphQLError,
): GraphQLFormattedError => {
  if (
    err.extensions?.code !== 'BAD_USER_INPUT' &&
    err.extensions?.code !== 'UNAUTHENTICATED' &&
    err.extensions?.code !== 'BAD_USER_INPUT' &&
    err.extensions?.code !== 'NOT_FOUND' &&
    err.extensions?.code !== 'GRAPHQL_PARSE_FAILED' &&
    err.extensions?.code !== 'GRAPHQL_VALIDATION_FAILED' &&
    err.message !== 'Bad Request Exception'
  ) {
    Logger.error(err.message, err.stack, `${err.path?.toString() || ''}`);
  }
  if (err.extensions?.exception?.sqlState) {
    return new ApolloError('Something is wrong', 'INTERNAL_SERVER_ERROR');
  }
  return new ApolloError(
    err.extensions?.exception?.response?.message || err.message,
    err.extensions?.code || 'INTERNAL_SERVER_ERROR',
  );
};
