import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { config } from "../../../../config/config";

@Entity("carts", { schema: config.mysql.database })
export class CartsModel {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "int", unsigned: true })
  user_id: number;

  @Column({ type: "int", unsigned: true })
  product_id: number;

  @Column({ type: "int", unsigned: true })
  quantity: number;

  @Column({ type: "int", unsigned: true })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
