import { ApolloError } from 'apollo-server-errors';

export class RequestError extends ApolloError {
  constructor(
    message: string,
    code?: string,
    extensions?: Record<string, any>,
  ) {
    super(message, code, extensions);
  }
}
