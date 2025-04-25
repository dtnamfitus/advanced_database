import cassandraClient from "../connection";
import { OrderItem } from "../model/order_item.model";

export class OrderItemsRepository {
  async insert(item: OrderItem): Promise<void> {
    const query = `INSERT INTO shop_db.order_items (id, order_id, product_id, quantity, price_at_order, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await cassandraClient.execute(
      query,
      [
        item.id,
        item.order_id,
        item.product_id,
        item.quantity,
        item.price_at_order,
        item.created_at,
        item.updated_at,
      ],
      { prepare: true }
    );
  }

  async getByOrderId(order_id: string): Promise<OrderItem[]> {
    const result = await cassandraClient.execute(
      `SELECT * FROM shop_db.order_items_by_order WHERE order_id = ?`,
      [order_id],
      { prepare: true }
    );
    return result.rows.map((row) => ({
      id: row["id"],
      order_id: row["order_id"],
      product_id: row["product_id"],
      quantity: row["quantity"],
      price_at_order: row["price_at_order"],
      created_at: row["created_at"],
      updated_at: row["updated_at"],
    }));
  }
}
