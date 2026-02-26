import { Controller, Get, Headers } from '@nestjs/common';
import { KeyCrmService } from './key-crm.service';

@Controller('key-crm/orders')
export class KeyCrmController {
  constructor(private readonly keyCrmService: KeyCrmService) {}

  @Get()
  findAll(@Headers('Authorization') authHeader: string) {
    const api_key = authHeader.split(' ')[1];

    return this.keyCrmService.findAll(api_key);
  }

  @Get('timeline')
  getTimeline(@Headers('Authorization') authHeader: string) {
    const api_key = authHeader.split(' ')[1];

    return this.keyCrmService.getTimeline(api_key);
  }
}
