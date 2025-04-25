export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: "INCOME" | "WITHDRAWAL" | "REFUND";
  amount: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
