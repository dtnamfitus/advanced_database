import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "../../../config/config";
import mysql from "mysql2/promise";
import { CustomerTiersModel } from "./model/customer_tiers.model";
import { ProductsModel } from "./model/product.model";
import { OrderItemsModel } from "./model/order_items.model";
import { OrdersModel } from "./model/order.model";
import { ShopsModel } from "./model/shops.model";
import { WalletTransactionsModel } from "./model/transaction.model";
import { WalletsModel } from "./model/wallet.model";
import { UsersModel } from "./model/users.model";
import { UserTiersModel } from "./model/user_tiers.model";
import { CartsModel } from "./model/cart.model";
import { ReviewsModel } from "./model/review.model";

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.mysql.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();
}

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.mysql.host,
  port: config.mysql.port,
  username: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  synchronize: true,
  logging: false,
  charset: config.mysql.charset,
  timezone: config.mysql.timezone,
  maxQueryExecutionTime: 1000,
  entities: [
    CustomerTiersModel,
    ProductsModel,
    OrderItemsModel,
    OrdersModel,
    ShopsModel,
    WalletTransactionsModel,
    WalletsModel,
    UsersModel,
    UserTiersModel,
    WalletsModel,
    CartsModel,
    ReviewsModel,
  ],
});

ensureDatabaseExists()
  .then(() => {
    return AppDataSource.initialize();
  })
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
