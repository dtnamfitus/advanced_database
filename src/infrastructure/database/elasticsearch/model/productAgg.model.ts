export interface ProductAggModel {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  shop_id: number;
  shop_name: string;
  created_at: Date;
  updated_at: Date;

  // Add any other fields relevant for searching or aggregation
  // e.g., tags: string[];
  // e.g., category: string;
}
export const PRODUCT_AGG_INDEX = "products_aggregated";
