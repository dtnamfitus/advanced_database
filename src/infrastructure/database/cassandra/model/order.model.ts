export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  created_at: Date;
  updated_at: Date;
}
