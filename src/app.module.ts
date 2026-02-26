import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/config/configuration';
import { KeyCrmModule } from './common/key-crm/key-crm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    KeyCrmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
