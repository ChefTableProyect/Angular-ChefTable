export interface MenuItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  available: boolean;
  categoryId: number | null;
  categoryName: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface DiningTable {
  id: number;
  code: string;
  name: string;
  active: boolean;
}
