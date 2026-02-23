import { Controller, Get } from '@nestjs/common';
import { KeyCrmService } from './key-crm.service';

@Controller('key-crm/orders')
export class KeyCrmController {
  constructor(private readonly keyCrmService: KeyCrmService) {}

  @Get()
  findAll() {
    return this.keyCrmService.findAll();
  }

  @Get('timeline')
  getTimeline() {
    return this.keyCrmService.getTimeline();
  }
}
