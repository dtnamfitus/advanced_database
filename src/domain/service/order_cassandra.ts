import { Order } from "../../infrastructure/database/cassandra/model/order.model";
import { OrdersCassandraRepository } from "../../infrastructure/database/cassandra/repository/order.repository";
import { OrderEvent } from "../../infrastructure/kafka/payload/orders.payload";

export class OrderCassandraService {
  private readonly orderCassandraRepository: OrdersCassandraRepository;

  constructor() {
    this.orderCassandraRepository = new OrdersCassandraRepository();
  }

  public async SyncOrders(parsedMessage: OrderEvent): Promise<void> {
    try {
      switch (parsedMessage.op) {
        case "c":
          console.log("Creating order with ID:", parsedMessage.after);
          await this.orderCassandraRepository.upsert({
            order_id: parsedMessage.after.id,
            user_id: parsedMessage.after.user_id,
            total_amount: parsedMessage.after.total_amount as number,
            status: parsedMessage.after.status,
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "u":
          console.log("Updating order with ID:", parsedMessage.after.id);
          await this.orderCassandraRepository.upsert({
            order_id: parsedMessage.after.id,
            user_id: parsedMessage.after.user_id as number,
            total_amount: parsedMessage.after.total_amount as number,
            status: parsedMessage.after.status,
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "d":
          if (!parsedMessage.before) {
            console.warn("No 'before' data for delete operation.");
            return;
          }
          console.log("Deleting product with ID:", parsedMessage.before.id);
          break;
        default:
          console.warn("Unknown operation:", parsedMessage.op);
          break;
      }
    } catch (error) {
      throw new Error("Failed to sync order: " + error);
    }
  }
  async getOrderByUserId(user_id: number): Promise<any> {
    try {
      return await this.orderCassandraRepository.getByUserId(user_id);
    } catch (error) {
      throw new Error("Failed to get order by user ID: " + error);
    }
  }
}
