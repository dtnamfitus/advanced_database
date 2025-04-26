import cassandraClient from "../connection";
import { OrderItem } from "../model/order_item.model";

export class OrderItemsCassandraRepository {
  async upsert(orderItem: OrderItem): Promise<void> {
    const query = `INSERT INTO shop_db.order_items (id, order_item_id, order_id, product_id, quantity, price_at_order, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    cassandraClient.execute(
      query,
      [
        orderItem.id,
        orderItem.order_item_id,
        orderItem.order_id,
        orderItem.product_id,
        orderItem.quantity,
        orderItem.price_at_order,
        orderItem.created_at,
        orderItem.updated_at,
      ],
      { prepare: true }
    );
  }

  async getByOrderId(order_id: number): Promise<OrderItem[]> {
    const result = await cassandraClient.execute(
      `SELECT * FROM shop_db.order_items WHERE order_id = ? ALLOW FILTERING;`,
      [order_id],
      { prepare: true }
    );
    return result.rows.map((row) => ({
      id: row["id"],
      order_item_id: row["order_item_id"],
      order_id: row["order_id"],
      product_id: row["product_id"],
      quantity: row["quantity"],
      price_at_order: row["price_at_order"],
      created_at: row["created_at"],
      updated_at: row["updated_at"],
    }));
  }
}
