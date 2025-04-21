import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { config } from "../../../../config/config";

@Entity("wallet_transactions", { schema: config.mysql.database })
export class WalletTransactionsModel {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ type: "bigint", unsigned: true, nullable: false })
  wallet_id: number;

  @Column({
    type: "enum",
    enum: ["INCOME", "WITHDRAWAL", "REFUND"],
    default: "INCOME",
  })
  type: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  amount: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
