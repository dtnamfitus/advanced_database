import { OrderItemsRepository } from "../../infrastructure/database/mysql/repository/order_items.repository";
import { ProductsRepository } from "../../infrastructure/database/mysql/repository/products.repository";

export class OrderItemService {
  private readonly orderItemRepository;
  private readonly productRepository;
  constructor() {
    this.orderItemRepository = new OrderItemsRepository();
    this.productRepository = new ProductsRepository();
  }

  async createOrderItem(orderItemData: {
    order_id: number;
    product_id: number;
    quantity: number;
  }): Promise<any> {
    try {
      const product = await this.productRepository.findById(
        orderItemData.product_id
      );
      if (!product) {
        throw new Error("Product not found");
      }
      const price_at_order = product.price * orderItemData.quantity;
      return await this.orderItemRepository.create({
        price_at_order,
        ...orderItemData,
      });
    } catch (error) {
      throw new Error("Failed to create order item: " + error);
    }
  }

  async getOrderItemsByOrderId(orderId: number): Promise<any> {
    try {
      return await this.orderItemRepository.findByOrderId(orderId);
    } catch (error) {
      throw new Error("Failed to get order items: " + error);
    }
  }
}
