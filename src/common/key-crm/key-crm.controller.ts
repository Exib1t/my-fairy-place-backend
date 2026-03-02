import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { KeyCrmService } from './key-crm.service';
import type { ChangeStatusDto } from './key-crm.models';

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

  @Get('extended-timeline')
  getExtendedTimeline(@Headers('Authorization') authHeader: string) {
    const api_key = authHeader.split(' ')[1];

    return this.keyCrmService.getExtendedTimeline(api_key);
  }

  @Post('change-status')
  changeStatus(
    @Headers('Authorization') authHeader: string,
    @Body() changeDto: ChangeStatusDto,
  ) {
    const api_key = authHeader.split(' ')[1];

    return this.keyCrmService.changeStatus(changeDto, api_key);
  }
}
