import { Module } from '@nestjs/common';
import { KeyCrmService } from './key-crm.service';
import { KeyCrmController } from './key-crm.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [KeyCrmController],
  providers: [KeyCrmService],
})
export class KeyCrmModule {}
