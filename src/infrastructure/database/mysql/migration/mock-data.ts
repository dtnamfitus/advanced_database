import * as fs from "fs";
import * as path from "path";
import { AppDataSource } from "../connection";
import { UsersModel } from "../model/users.model";
import { ShopsModel } from "../model/shops.model";
import { ProductsModel } from "../model/product.model";
import { ReviewsModel } from "../model/review.model";
import { CartsModel } from "../model/cart.model";
import { OrderItemsModel } from "../model/order_items.model";
import { OrdersModel } from "../model/order.model";
import { WalletTransactionsModel } from "../model/transaction.model";
import { WalletsModel } from "../model/wallet.model";
import { UserTiersModel } from "../model/user_tiers.model";
import { CustomerTiersModel } from "../model/customer_tiers.model";

async function clearExistingData() {
  console.log("Clearing existing data...");

  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 0");

  const repositories = [
    { repo: AppDataSource.getRepository(ReviewsModel), name: "Reviews" },
    { repo: AppDataSource.getRepository(CartsModel), name: "Carts" },
    { repo: AppDataSource.getRepository(OrderItemsModel), name: "OrderItems" },
    { repo: AppDataSource.getRepository(OrdersModel), name: "Orders" },
    {
      repo: AppDataSource.getRepository(WalletTransactionsModel),
      name: "WalletTransactions",
    },
    { repo: AppDataSource.getRepository(WalletsModel), name: "Wallets" },
    { repo: AppDataSource.getRepository(ProductsModel), name: "Products" },
    { repo: AppDataSource.getRepository(ShopsModel), name: "Shops" },
    { repo: AppDataSource.getRepository(UserTiersModel), name: "UserTiers" },
    { repo: AppDataSource.getRepository(UsersModel), name: "Users" },
    {
      repo: AppDataSource.getRepository(CustomerTiersModel),
      name: "CustomerTiers",
    },
  ];

  for (const { repo, name } of repositories) {
    try {
      await repo.clear();
      console.log(`Cleared data from ${name} table`);
    } catch (error) {
      console.error(`Error clearing ${name} table:`, error);
    }
  }

  await AppDataSource.query("SET FOREIGN_KEY_CHECKS = 1");
}

async function runMockData() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection established");
    }

    console.log("Starting to insert mock data...");
    await clearExistingData();

    const userCount = await AppDataSource.getRepository(UsersModel).count();
    if (userCount === 0) {
      await createMockDataForUser();
    } else {
      console.log("Users table already has data, skipping...");
    }

    const shopCount = await AppDataSource.getRepository(ShopsModel).count();
    if (shopCount === 0) {
      await createMockDataForShop();
    } else {
      console.log("Shops table already has data, skipping...");
    }

    const productCount = await AppDataSource.getRepository(
      ProductsModel
    ).count();
    if (productCount === 0) {
      await createMockDataForProduct();
    } else {
      console.log("Products table already has data, skipping...");
    }

    const cartCount = await AppDataSource.getRepository(CartsModel).count();
    if (cartCount === 0) {
      await generateRandomCartItems();
    } else {
      console.log("Carts table already has data, skipping...");
    }
    const reviewCount = await AppDataSource.getRepository(ReviewsModel).count();
    if (reviewCount === 0) {
      await generateRandomReviewData();
    } else {
      console.log("Reviews table already has data, skipping...");
    }
  } catch (error) {
    console.error("Error inserting mock data:", error);
  } finally {
    console.log("Mock data process finished");
  }
}

async function createMockDataForUser(): Promise<void> {
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
    "48ba23563749e08fe58c6a199d23bb34b5b41655520c92515a8794b401de7dea";

  console.log(`Inserting ${users.length} users...`);

  const userRepository = AppDataSource.getRepository(UsersModel);

  for (const user of users) {
    const newUser = new UsersModel();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password_hash = passwordHash;
    newUser.phone = user.phone;
    newUser.full_name = user.full_name;
    newUser.address = user.address;

    await userRepository.save(newUser);
  }
}

async function createMockDataForShop(): Promise<void> {
  const filePath = path.resolve(__dirname, "shop.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const shops: Array<{
    shop_name: string;
    owner_id: number;
  }> = JSON.parse(raw);

  console.log(`Inserting ${shops.length} shops...`);

  const shopRepository = AppDataSource.getRepository(ShopsModel);

  for (const shop of shops) {
    const newShop = new ShopsModel();
    newShop.shop_name = shop.shop_name;
    newShop.owner_id = shop.owner_id;

    await shopRepository.save(newShop);
  }
}

async function createMockDataForProduct(): Promise<void> {
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

  console.log(`Inserting ${products.length} products...`);

  const productRepository = AppDataSource.getRepository(ProductsModel);

  for (const product of products) {
    const newProduct = new ProductsModel();
    newProduct.name = product.name;
    newProduct.description = product.description;
    newProduct.price = product.price;
    newProduct.stock = product.stock;
    newProduct.image_url = product.image_url;
    newProduct.shop_id = product.shop_id;

    await productRepository.save(newProduct);
  }
}

async function generateRandomCartItems() {
  console.log("Generating random cart items...");
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const totalRecords = 500;

  for (let i = 1; i <= totalRecords; i++) {
    const randomUserId = Math.floor(Math.random() * 100) + 1;
    const randomProductId = Math.floor(Math.random() * 3555) + 1;
    const randomQuantity = Math.floor(Math.random() * 5) + 1;

    const productRepository = AppDataSource.getRepository(ProductsModel);
    const product = await productRepository.findOneBy({
      id: randomProductId,
    });
    const randomUnitPrice = product?.price ?? 0;
    const totalPrice = randomUnitPrice * randomQuantity;

    const cartRepository = AppDataSource.getRepository(CartsModel);
    const newCartItem = new CartsModel();
    newCartItem.user_id = randomUserId;
    newCartItem.product_id = randomProductId;
    newCartItem.quantity = randomQuantity;
    newCartItem.price = totalPrice;
    await cartRepository.save(newCartItem);
  }
}

async function generateRandomReviewData() {
  console.log("Generating random review data...");
  const filePath = path.resolve(__dirname, "review.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const comments = JSON.parse(raw);
  const totalRecords = 5000;

  for (let i = 1; i <= totalRecords; i++) {
    const randomUserId = Math.floor(Math.random() * 100) + 1;
    const randomProductId = Math.floor(Math.random() * 3555) + 1;
    const randomRating = Math.floor(Math.random() * 5) + 1;

    const reviewRepository = AppDataSource.getRepository(ReviewsModel);
    const newReview = new ReviewsModel();
    newReview.user_id = randomUserId;
    newReview.product_id = randomProductId;
    newReview.rating = randomRating;
    newReview.comment = comments[Math.floor(Math.random() * comments.length)];
    await reviewRepository.save(newReview);
  }
}

// runMockData();
