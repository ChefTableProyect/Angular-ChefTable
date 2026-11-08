import { MenuItem } from '../menu/menu.models';

export interface CartItem {
  product: MenuItem;
  quantity: number;
  notes: string;
}
