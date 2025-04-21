export class ProductEntity {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  shop_id: number;
  created_at: Date;
  updated_at: Date;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number,
    shop_id: number,
    created_at: Date,
    updated_at: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.shop_id = shop_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
