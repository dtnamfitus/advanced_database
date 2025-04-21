// CREATE TABLE order_items (
//   id BIGINT AUTO_INCREMENT PRIMARY KEY,
//   order_id BIGINT NOT NULL,
//   product_id BIGINT NOT NULL,
//   quantity INT NOT NULL,
//   price_at_order DECIMAL(12, 2) NOT NULL,
//   FOREIGN KEY (order_id) REFERENCES orders(id),
//   FOREIGN KEY (product_id) REFERENCES products(id)
// );

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
