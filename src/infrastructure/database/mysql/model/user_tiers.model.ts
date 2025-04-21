import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { config } from "../../../../config/config";

@Entity("user_tiers", { schema: config.mysql.database })
export class UserTiersModel {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  user_id: number;

  @Column({ type: "int", nullable: false })
  tier_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
