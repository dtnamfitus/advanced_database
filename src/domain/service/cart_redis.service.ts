import { CartRedisModel } from "../../infrastructure/database/redis/model/cart.model";
import { CartRedisRepository } from "../../infrastructure/database/redis/repository/cart.repository";

export class CartRedisService {
  private readonly cartRedisRepository: CartRedisRepository;

  constructor() {
    this.cartRedisRepository = new CartRedisRepository();
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
