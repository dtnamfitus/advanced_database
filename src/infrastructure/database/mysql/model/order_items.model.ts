import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { config } from "../../../../config/config";

@Entity("order_items", { schema: config.mysql.database })
export class OrderItemsModel {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ type: "bigint", unsigned: true, nullable: false })
  order_id: number;

  @Column({ type: "bigint", unsigned: true, nullable: false })
  product_id: number;

  @Column({ type: "int", default: 0 })
  quantity: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: false })
  price_at_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
