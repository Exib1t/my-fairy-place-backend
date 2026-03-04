export interface KeyCrmShipping {
  shipping_date_actual?: string;
  tracking_code?: string;
}

export type OrderStatuses =
  | 'new'
  | 'transferred_to_production'
  | 'gotove_do_vidpravki';

export interface KeyCrmOrderApi {
  id: number;
  created_at: string;
  updated_at: string;
  source_id: number;
  status: {
    id: number;
    name: string;
    alias: OrderStatuses;
  };
  custom_fields: {
    id: number;
    uuid: string;
    name: string;
    type: 'select' | 'text';
    value: string | string[];
  }[];
  shipping: KeyCrmShipping;
  products?: Array<{
    id: number;
    name: string;
    quantity: number;
    comment: string;
    price: number;
    picture: { thumbnail: string } | null;
    properties: { name: string; value: string }[];
  }>;
  attachments: { file: { url: string } }[];
}

export interface KeyCrmOrder {
  id: number;
  status: string;
  tracking_code: string | null;
  shipping_date: string | null;
  child_name: string | null;
  product_image: string | null;
  source_name: string;
  products: KeyCrmOrderProduct[];
  custom_fields: {
    name: string;
    value: string;
  }[];
  attachments: string[];
}

export interface KeyCrmOrderProduct {
  id: number;
  name: string;
  comment: string;
  thumbnail: string | null;
  quantity: number;
  properties: {
    name: string;
    value: string;
  }[];
}

export interface ChangeStatusDto {
  order_id: number;
  status_id: number;
}
