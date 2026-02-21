import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './common/auth/auth.module';
import configuration from './core/config/configuration';
import { PrismaModule } from './core/db/prisma.module';
import { KeyCrmModule } from './common/key-crm/key-crm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    AuthModule,
    KeyCrmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
