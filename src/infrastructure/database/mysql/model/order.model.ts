import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { config } from "../../../../config/config";

@Entity("orders", { schema: config.mysql.database })
export class OrdersModel {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ type: "bigint", unsigned: true, nullable: false })
  user_id: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  total_amount: number;

  @Column({
    type: "enum",
    enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
