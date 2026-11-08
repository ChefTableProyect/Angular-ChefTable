export type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface CreateOrderRequest {
  tableCode: string;
  items: Array<{ productId: number; quantity: number; notes: string | null }>;
}

export interface OrderItemResponse {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  notes: string | null;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  publicCode: string;
  tableName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}

export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  fieldErrors: Record<string, string>;
}
