import { OrderItemsRepository } from "../../infrastructure/database/mysql/repository/order_items.repository";

export class OrderItemService {
  private readonly orderItemRepository;

  constructor() {
    this.orderItemRepository = new OrderItemsRepository();
  }

  async createOrderItem(orderItemData: {
    order_id: number;
    product_id: number;
    quantity: number;
  }): Promise<any> {
    try {
      return await this.orderItemRepository.create(orderItemData);
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
