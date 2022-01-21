import { Injectable } from '@nestjs/common';
import { from } from 'env-var';

@Injectable()
export class ConfigService {
  constructor(private readonly _processEnv = process.env) {
    Object.freeze(this);
  }

  private readonly _env = from(this._processEnv);

  public readonly PORT: number = this._env
    .get('PORT')
    .required()
    .asPortNumber();

  public readonly DB_HOST: string = this._env
    .get('DB_HOST')
    .required()
    .asString();

  public readonly DB_DATABASE: string = this._env
    .get('DB_DATABASE')
    .required()
    .asString();

  public readonly DB_USERNAME: string = this._env
    .get('DB_USERNAME')
    .required()
    .asString();

  public readonly DB_PASSWORD: string = this._env
    .get('DB_PASSWORD')
    .required()
    .asString();

  public readonly DB_PORT: number = this._env
    .get('DB_PORT')
    .required()
    .asIntPositive();
}
