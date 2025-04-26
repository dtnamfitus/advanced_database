export interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}
