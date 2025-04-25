import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "fs";
import * as path from "path";

export class InitSchema1745597783164 implements MigrationInterface {
  name = "InitSchema1745597783164";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tắt foreign key checks nếu có FK
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);

    // Danh sách bảng cần truncate
    const tables = [
      "reviews",
      "carts",
      "user_tiers",
      "users",
      "wallets",
      "wallet_transactions",
      "shops",
      "orders",
      "order_items",
      "products",
      "customer_tiers",
    ];

    for (const t of tables) {
      // Truncate nhanh và reset auto-inc
      await queryRunner.query(`TRUNCATE TABLE \`${t}\`;`);
    }

    // Bật lại FK checks
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`customer_tiers\` (
          \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
          \`name\` varchar(50) NOT NULL,
          \`min_orders\` int NOT NULL DEFAULT '0',
          \`min_spent\` decimal(12,2) NOT NULL DEFAULT '0.00',
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`products\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`shop_id\` bigint UNSIGNED NOT NULL,
          \`name\` varchar(200) NOT NULL,
          \`description\` text NULL,
          \`price\` decimal(12,2) NOT NULL,
          \`stock\` int NOT NULL DEFAULT '0',
          \`image_url\` text NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`order_items\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`order_id\` bigint UNSIGNED NOT NULL,
          \`product_id\` bigint UNSIGNED NOT NULL,
          \`quantity\` int NOT NULL DEFAULT '0',
          \`price_at_order\` decimal(12,2) NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`orders\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`user_id\` bigint UNSIGNED NOT NULL,
          \`total_amount\` decimal(12,2) NOT NULL,
          \`status\` enum ('PENDING','PAID','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`shops\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`owner_id\` bigint UNSIGNED NOT NULL,
          \`shop_name\` varchar(100) NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`wallet_transactions\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`wallet_id\` bigint UNSIGNED NOT NULL,
          \`type\` enum('INCOME','WITHDRAWAL','REFUND') NOT NULL DEFAULT 'INCOME',
          \`amount\` decimal(12,2) NOT NULL,
          \`description\` text NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`wallets\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`shop_id\` bigint UNSIGNED NOT NULL,
          \`balance\` decimal(12,2) NOT NULL DEFAULT '0.00',
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          UNIQUE INDEX \`IDX_9aeb801cefd8d393a1d074ef88\` (\`shop_id\`),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`users\` (
          \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
          \`username\` varchar(100) NOT NULL,
          \`email\` varchar(255) NOT NULL,
          \`password_hash\` varchar(255) NOT NULL,
          \`phone\` varchar(20) NULL,
          \`full_name\` varchar(255) NOT NULL,
          \`address\` varchar(255) NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`),
          UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`user_tiers\` (
          \`user_id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`tier_id\` int NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`user_id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`carts\` (
          \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
          \`user_id\` int UNSIGNED NOT NULL,
          \`product_id\` int UNSIGNED NOT NULL,
          \`quantity\` int UNSIGNED NOT NULL,
          \`price\` int UNSIGNED NOT NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`reviews\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`user_id\` bigint UNSIGNED NOT NULL,
          \`product_id\` bigint UNSIGNED NOT NULL,
          \`rating\` int NOT NULL,
          \`comment\` text NULL,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`
    );

    await this.createMockDataForUser(queryRunner);
    await this.createMockDataForShop(queryRunner);
    await this.createMockDataForProduct(queryRunner);

    await queryRunner.query(`SET SESSION sql_log_bin = 1;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

  private async createMockDataForUser(queryRunner: QueryRunner): Promise<void> {
    const filePath = path.resolve(__dirname, "user.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const users: Array<{
      username: string;
      email: string;
      full_name: string;
      phone: string;
      address: string;
    }> = JSON.parse(raw);
    const passwordHash =
      "48ba23563749e08fe58c6a199d23bb34b5b41655520c92515a8794b401de7dea"; // Nam123

    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO users (username, email, password_hash, phone, full_name, address) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.username,
          user.email,
          passwordHash,
          user.phone,
          user.full_name,
          user.address,
        ]
      );
    }
  }

  private async createMockDataForShop(queryRunner: QueryRunner): Promise<void> {
    const filePath = path.resolve(__dirname, "shop.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const shops: Array<{
      shop_name: string;
      owner_id: number;
    }> = JSON.parse(raw);

    for (const shop of shops) {
      await queryRunner.query(
        `INSERT INTO shops (shop_name, owner_id) VALUES (?, ?)`,
        [shop.shop_name, shop.owner_id]
      );
    }
  }

  private async createMockDataForProduct(
    queryRunner: QueryRunner
  ): Promise<void> {
    const filePath = path.resolve(__dirname, "product.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const products: Array<{
      name: string;
      description: string;
      price: number;
      stock: number;
      image_url: string;
      shop_id: number;
    }> = JSON.parse(raw);

    for (const product of products) {
      await queryRunner.query(
        `INSERT INTO products (name, description, price, stock, image_url, shop_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description,
          product.price,
          product.stock,
          product.image_url,
          product.shop_id,
        ]
      );
    }
  }
}
