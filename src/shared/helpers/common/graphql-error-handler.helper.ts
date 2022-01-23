import { Logger } from '@nestjs/common';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ServerError } from 'src/shared/errors/server.error';

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
    return new ServerError('Something is wrong', 'INTERNAL_SERVER_ERROR');
  }
  return new ServerError(
    err.extensions?.exception?.response?.message || err.message,
    err.extensions?.code || 'INTERNAL_SERVER_ERROR',
  );
};
