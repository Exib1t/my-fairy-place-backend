import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { Configuration } from '../../core/config/configuration';
import { firstValueFrom } from 'rxjs';
import { KeyCrmOrder, KeyCrmOrderApi, OrderStatuses } from './key-crm.models';

@Injectable()
export class KeyCrmService {
  constructor(
    private readonly configService: ConfigService<Configuration>,
    private readonly httpService: HttpService,
  ) {}

  private _statusesMap = {
    new: 1,
    transferred_to_production: 5,
    gotove_do_vidpravki: 7,
  } as const satisfies Record<OrderStatuses, number>;

  private _statusesMapTitle = {
    new: 'Новий',
    transferred_to_production: 'Виробництво',
    gotove_do_vidpravki: 'Вироблено',
  } as const satisfies Record<OrderStatuses, string>;

  async findAll(api_key?: string) {
    const API_KEY = api_key ?? this.configService.get<string>('keyCrmApi');

    const sDate = new Date().setDate(new Date().getDate() - 365);
    const eDate = new Date().setDate(new Date().getDate());

    const statusesForFiltering = [
      this._statusesMap.new,
      this._statusesMap.transferred_to_production,
    ].join(',');

    const startDate = new Date(sDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(eDate);
    endDate.setHours(23, 59, 59, 999);

    const response = await firstValueFrom(
      this.httpService.get<{ data: KeyCrmOrderApi[] }>(
        `https://openapi.keycrm.app/v1/order?limit=50&include=shipping,status,customFields,products&filter[status_id]=${statusesForFiltering}&[shipping_between]=${startDate.toISOString()}, ${endDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      ),
    ).catch((reason) => {
      const typedReason = reason as { status: number };

      if (typedReason.status === 401) {
        throw new UnauthorizedException('API key is invalid or expired');
      }

      throw new InternalServerErrorException(typedReason);
    });

    const orders = response.data.data.filter((order) => {
      const shippingDate = order.shipping?.shipping_date_actual;
      if (!shippingDate) return false;

      const date = new Date(shippingDate);

      return date >= startDate && date <= endDate;
    });

    return orders
      .map((order) => this.transformToResource(order))
      .sort((a, b) => {
        if (!a.shipping_date || !b.shipping_date) return 0;

        return (
          new Date(a.shipping_date).getTime() -
          new Date(b.shipping_date).getTime()
        );
      });
  }

  async getTimeline(api_key?: string) {
    const API_KEY = api_key ?? this.configService.get<string>('keyCrmApi');

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 - воскресенье, 1 - понедельник, и т.д.
    const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;

    const sDate = new Date().setDate(new Date().getDate() - 365);
    const eDate = new Date().setDate(new Date().getDate() + daysUntilSunday);

    const statusesForFiltering = [
      this._statusesMap.new,
      this._statusesMap.transferred_to_production,
      this._statusesMap.gotove_do_vidpravki,
    ].join(',');

    const startDate = new Date(sDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(eDate);
    endDate.setHours(23, 59, 59, 999);

    const response = await firstValueFrom(
      this.httpService.get<{ data: KeyCrmOrderApi[] }>(
        `https://openapi.keycrm.app/v1/order?limit=50&include=shipping,status,customFields,products&filter[status_id]=${statusesForFiltering}&[shipping_between]=${startDate.toISOString()}, ${endDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      ),
    );

    const orders = response.data.data.filter((order) => {
      const shippingDate = order.shipping?.shipping_date_actual;
      if (!shippingDate) return false;

      const date = new Date(shippingDate);

      return date >= startDate && date <= endDate;
    });

    return orders
      .map((order) => this.transformToResource(order))
      .sort((a, b) => {
        if (!a.shipping_date || !b.shipping_date) return 0;

        return (
          new Date(a.shipping_date).getTime() -
          new Date(b.shipping_date).getTime()
        );
      });
  }

  private transformToResource(order: KeyCrmOrderApi): KeyCrmOrder {
    const statusTitle = this._statusesMapTitle[order.status.alias];
    const customField = order.custom_fields.find(
      (field) => field.uuid === 'OR_1002',
    );

    const childName = customField?.value as string | undefined;

    return {
      id: order.id,
      status: statusTitle,
      tracking_code: order.shipping.tracking_code ?? null,
      shipping_date: order.shipping.shipping_date_actual ?? null,
      child_name: childName ?? null,
      product_image: order.products?.[0]?.picture?.thumbnail ?? null,
    };
  }
}
