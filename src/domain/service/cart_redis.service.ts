import { ProductsRepository } from "../../infrastructure/database/mysql/repository/products.repository";
import { CartRedisModel } from "../../infrastructure/database/redis/model/cart.model";
import { CartRedisRepository } from "../../infrastructure/database/redis/repository/cart.repository";
import { CartEventPayload } from "../../infrastructure/kafka/payload/carts.payload";

export class CartRedisService {
  private readonly cartRedisRepository: CartRedisRepository;
  private readonly productRepository: ProductsRepository;
  constructor() {
    this.cartRedisRepository = new CartRedisRepository();
    this.productRepository = new ProductsRepository();
  }

  async SyncCarts(parsedMessage: CartEventPayload): Promise<void> {
    try {
      switch (parsedMessage.op) {
        case "c":
          const product = await this.productRepository.findById(
            parsedMessage.after.product_id
          );
          if (!product) {
            console.warn("Product not found:", parsedMessage.after.product_id);
            return;
          }
          await this.cartRedisRepository.addToCart({
            id: parsedMessage.after.id || 0,
            user_id: parsedMessage.after.user_id,
            product_id: parsedMessage.after.product_id,
            product_name: product.name,
            product_image_url: product.image_url,
            quantity: parsedMessage.after.quantity,
            price: parsedMessage.after.price,
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "u":
          const existingProduct = await this.productRepository.findById(
            parsedMessage.after.product_id
          );
          if (!existingProduct) {
            console.warn("Product not found:", parsedMessage.after.product_id);
            return;
          }
          await this.cartRedisRepository.updateCart({
            id: parsedMessage.after.id || 0,
            user_id: parsedMessage.after.user_id,
            product_id: parsedMessage.after.product_id,
            product_name: existingProduct.name,
            product_image_url: existingProduct.image_url,
            quantity: parsedMessage.after.quantity,
            price: parsedMessage.after.price,
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "d":
          if (!parsedMessage.before) {
            console.warn("No 'before' data for delete operation.");
            return;
          }
          await this.cartRedisRepository.removeFromCart(
            parsedMessage.before.user_id,
            parsedMessage.before.product_id
          );
          break;
        default:
          console.warn("Unknown operation:", parsedMessage.op);
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      throw error;
    }
  }

  async getCart(userId: number): Promise<any[]> {
    try {
      return await this.cartRedisRepository.getCart(userId);
    } catch (error) {
      console.error("Failed to get cart from Redis:", error);
      throw error;
    }
  }

  async addToCart(cart: any): Promise<void> {
    try {
      await this.cartRedisRepository.addToCart(cart);
    } catch (error) {
      console.error("Failed to add to cart in Redis:", error);
      throw error;
    }
  }

  async updateCart(cart: CartRedisModel): Promise<void> {
    try {
      await this.cartRedisRepository.updateCart(cart);
    } catch (error) {
      console.error("Failed to update cart in Redis:", error);
      throw error;
    }
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    try {
      await this.cartRedisRepository.removeFromCart(userId, productId);
    } catch (error) {
      console.error("Failed to remove from cart in Redis:", error);
      throw error;
    }
  }
}
