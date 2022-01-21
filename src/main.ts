import { Logger, ValidationPipe } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { applicationContext } from './app.context';
import * as serviceAccount from 'credentials/firebase-admin-service-account.json';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap(): Promise<void> {
  const app = await applicationContext();
  app.useGlobalPipes(new ValidationPipe());
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
  });
}
bootstrap().catch((err) => Logger.error(err.message, err.stack, '[main]'));
