import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
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
  @Get(':order_id')
  findOne(
    @Headers('Authorization') authHeader: string,
    @Param('order_id') order_id: number,
  ) {
    const api_key = authHeader.split(' ')[1];

    return this.keyCrmService.getOrder(api_key, +order_id);
  }
}
