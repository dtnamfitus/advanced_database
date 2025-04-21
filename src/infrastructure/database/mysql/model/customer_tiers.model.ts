import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { config } from "../../../../config/config";

@Entity("customer_tiers", { schema: config.mysql.database })
export class CustomerTiersModel {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  name: string; // Bronze, Silver, Gold, Diamond

  @Column({ type: "int", default: 0 })
  min_orders: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  min_spent: number;
}
