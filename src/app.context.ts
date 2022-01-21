import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let appContext: NestApplication = null;
export const applicationContext = async (): Promise<NestApplication> => {
  if (!appContext) {
    appContext = (await NestFactory.create(AppModule)) as NestApplication;
  }
  return appContext;
};
