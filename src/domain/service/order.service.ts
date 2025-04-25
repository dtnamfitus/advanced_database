import { OrderRepository } from "../../infrastructure/database/mysql/repository/order.repository";
import { CartRedisModel } from "../../infrastructure/database/redis/model/cart.model";
import { CartService } from "./cart.service";
import { CartRedisService } from "./cart_redis.service";
import { OrderItemService } from "./order_item.service";
import { ProductMongoService } from "./products_mongo.service";

export class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly orderItemService: OrderItemService;
  private readonly cartRedisService: CartRedisService;
  private readonly cartService: CartService;
  private readonly productMongoService: ProductMongoService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderItemService = new OrderItemService();
    this.cartRedisService = new CartRedisService();
    this.productMongoService = new ProductMongoService();
    this.cartService = new CartService();
  }

  async createOrder(user_id: number): Promise<any> {
    try {
      const carts = await this.cartRedisService.getCart(user_id);
      if (!carts) {
        throw new Error("Cart not found for user: " + user_id);
      }
      const productIds = carts.map((item: CartRedisModel) => item.product_id);
      const orderItems = carts.map((item: CartRedisModel) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      const products = await this.productMongoService.GetProductByIds(
        productIds
      );
      const order = await this.orderRepository.create({
        user_id,
        status: "PENDING",
        total_amount: products.reduce(
          (total, product) => total + (product.price as number),
          0
        ),
      });
      const createOrderFunc = [];
      for (const item of orderItems) {
        createOrderFunc.push(
          this.orderItemService.createOrderItem({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
          })
        );
      }
      const removeCartsFunc = [];
      for (const item of carts) {
        removeCartsFunc.push(this.cartService.removeFromCart(item.id));
      }
      await Promise.all(removeCartsFunc);
      await Promise.all(createOrderFunc);
      return order;
    } catch (error) {
      throw new Error("Error creating order: " + error);
    }
  }

  async getOrderById(id: number): Promise<any> {
    try {
      const order = await this.orderRepository.findById(id);
      return order;
    } catch (error) {
      throw new Error("Error fetching order: " + error);
    }
  }

  async getOrdersByUserId(userId: number): Promise<any[]> {
    try {
      const orders = await this.orderRepository.findByUserId(userId);
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders: " + error);
    }
  }
}
