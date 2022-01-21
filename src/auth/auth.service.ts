import { Injectable, Logger } from '@nestjs/common';

import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class AuthService {
  async verify(token: string): Promise<string | null> {
    try {
      const decodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(token, true);

      return decodedIdToken.uid;
    } catch (err) {
      Logger.error(err.message, err.stack, '[AuthService.verify]');
      return null;
    }
  }
}
