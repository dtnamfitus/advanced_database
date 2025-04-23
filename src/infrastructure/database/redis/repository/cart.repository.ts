import { RedisClientType } from "redis";
import RedisConnection from "../connection";
import { CartRedisModel } from "../model/cart.model";

export class CartRedisRepository {
  private readonly CART_KEY_PREFIX = "cart:";
  private redisClient!: ReturnType<
    typeof RedisConnection.getClient
  > extends Promise<infer R>
    ? R
    : never;

  constructor() {
    RedisConnection.getClient()
      .then((client) => {
        this.redisClient = client;
      })
      .catch((err) => {
        console.error("Failed to init Redis in CartRepository:", err);
      });
  }

  async getCart(userId: number): Promise<CartRedisModel[]> {
    const cartKey = `${this.CART_KEY_PREFIX}${userId}`;
    const raw = await this.redisClient.get(cartKey);
    if (!raw) return [];
    return JSON.parse(raw) as CartRedisModel[];
  }

  async addToCart(cart: CartRedisModel): Promise<void> {
    try {
      const cartKey = `${this.CART_KEY_PREFIX}${cart.user_id}`;
      const cartData = await this.getCart(cart.user_id);
      const existingItemIndex = cartData.findIndex(
        (item) => item.product_id === cart.product_id
      );
      if (existingItemIndex !== -1) {
        cartData[existingItemIndex].quantity += cart.quantity;
      } else {
        cartData.push(cart);
      }
      await this.redisClient.set(cartKey, JSON.stringify(cartData));
      console.log("Cart updated in Redis:", cartData);
    } catch (error) {
      console.error("Failed to add to cart in Redis:", error);
    }
  }

  async updateCart(cart: CartRedisModel): Promise<void> {
    try {
      const cartKey = `${this.CART_KEY_PREFIX}${cart.user_id}`;
      const cartData = await this.getCart(cart.user_id);
      const existingItemIndex = cartData.findIndex(
        (item) => item.product_id === cart.product_id
      );
      if (existingItemIndex !== -1) {
        cartData[existingItemIndex].quantity = cart.quantity;
        await this.redisClient.set(cartKey, JSON.stringify(cartData));
        console.log("Cart updated in Redis:", cartData);
      } else {
        console.error("Item not found in cart for update:", cart);
      }
    } catch (error) {
      console.error("Failed to update cart in Redis:", error);
    }
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    try {
      const cartKey = `${this.CART_KEY_PREFIX}${userId}`;
      const cartData = await this.getCart(userId);
      const updatedCartData = cartData.filter(
        (item) => item.product_id !== productId
      );
      await this.redisClient.set(cartKey, JSON.stringify(updatedCartData));
      console.log("Item removed from cart in Redis:", updatedCartData);
    } catch (error) {
      console.error("Failed to remove from cart in Redis:", error);
    }
  }
}
