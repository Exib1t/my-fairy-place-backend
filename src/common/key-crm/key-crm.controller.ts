import { Controller, Get } from '@nestjs/common';
import { KeyCrmService } from './key-crm.service';

@Controller('key-crm')
export class KeyCrmController {
  constructor(private readonly keyCrmService: KeyCrmService) {}

  @Get('orders')
  findAll() {
    return this.keyCrmService.findAll();
  }
}
