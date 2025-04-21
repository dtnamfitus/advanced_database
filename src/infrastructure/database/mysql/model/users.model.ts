import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
} from "typeorm";
import { config } from "../../../../config/config";

@Entity("users", { schema: config.mysql.database })
export class UsersModel {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ unique: true, type: "varchar", length: 100 })
  username: string;

  @Column({ unique: true, type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password_hash: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255 })
  full_name: string;

  @Column({ type: "varchar", length: 255 })
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
