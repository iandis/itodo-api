import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
