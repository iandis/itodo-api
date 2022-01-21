import { Logger, ValidationPipe } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { applicationContext } from './app.context';
import * as serviceAccount from 'credentials/firebase-admin-service-account.json';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from './config/config.service';

async function bootstrap(): Promise<void> {
  const app = await applicationContext();
  app.useGlobalPipes(new ValidationPipe());
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
  });
  const config = app.get(ConfigService);
  await app.listen(config.PORT);
  Logger.log(`Server running on http://localhost:${config.PORT}/graphql`, '[itodo-api]');
}
bootstrap().catch((err) => Logger.error(err.message, err.stack, '[itodo-api]'));
