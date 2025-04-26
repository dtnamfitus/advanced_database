import { OrderItemsCassandraRepository } from "../../infrastructure/database/cassandra/repository/order_item.repository";
import { OrderItemEvent } from "../../infrastructure/kafka/payload/order_item.payload";
import { v4 as uuidv4 } from "uuid";

export class OrderItemsCassandraService {
  private readonly orderItemsRepository: OrderItemsCassandraRepository;
  constructor() {
    this.orderItemsRepository = new OrderItemsCassandraRepository();
  }

  async SyncOrderItems(parsedMessage: OrderItemEvent): Promise<void> {
    try {
      switch (parsedMessage.op) {
        case "c":
          console.log("Creating order item with ID:", parsedMessage.after.id);
          await this.orderItemsRepository.upsert({
            id: uuidv4(),
            order_item_id: parsedMessage.after.id,
            order_id: parsedMessage.after.order_id as number,
            product_id: parsedMessage.after.product_id as number,
            quantity: parsedMessage.after.quantity as number,
            price_at_order: parsedMessage.after.price_at_order as number,
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "u":
          console.log("Updating order item with ID:", parsedMessage.after.id);
          await this.orderItemsRepository.upsert({
            id: uuidv4(),
            order_item_id: parsedMessage.after.id,
            order_id: parsedMessage.after.order_id as number,
            product_id: parsedMessage.after.product_id as number,
            quantity: parsedMessage.after.quantity as number,
            price_at_order: parsedMessage.after.price_at_order as number,
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "d":
          if (!parsedMessage.before) {
            console.warn("No 'before' data for delete operation.");
            return;
          }
          console.log("Deleting order item with ID:", parsedMessage.before.id);
          break;
        default:
          console.warn("Unknown operation:", parsedMessage.op);
          break;
      }
    } catch (error) {
      throw new Error("Failed to sync order item: " + error);
    }
  }

  async getOrderItemsByOrderId(orderId: number): Promise<any[]> {
    try {
      return await this.orderItemsRepository.getByOrderId(orderId);
    } catch (error) {
      throw new Error("Failed to get order items: " + error);
    }
  }
}
