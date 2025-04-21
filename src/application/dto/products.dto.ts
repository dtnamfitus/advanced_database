export class CreateProductDto {
  shop_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
}

export class UpdateProductDto {
  shop_id?: number;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image_url?: string;
}

export class UpdateProductStockDto {
  quantity: number;
}

export class ProductResponseDto {
  id: number;
  shop_id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}