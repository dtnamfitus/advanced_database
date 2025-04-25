import cassandraClient from "../connection";
import { Order } from "../model/order.model";

export class OrdersRepository {
  async insert(order: Order): Promise<void> {
    const query = `INSERT INTO shop_db.orders (id, user_id, total_amount, status, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    await cassandraClient.execute(
      query,
      [
        order.id,
        order.user_id,
        order.total_amount,
        order.status,
        order.created_at,
        order.updated_at,
      ],
      { prepare: true }
    );
  }

  async getById(id: string): Promise<Order | null> {
    const result = await cassandraClient.execute(
      `SELECT * FROM shop_db.orders WHERE id = ?`,
      [id],
      { prepare: true }
    );
    if (result.rows[0]) {
      const row = result.rows[0];
      return {
        id: row["id"],
        user_id: row["user_id"],
        total_amount: row["total_amount"],
        status: row["status"],
        created_at: row["created_at"],
        updated_at: row["updated_at"],
      } as Order;
    }
    return null;
  }

  async getByUserId(user_id: string): Promise<Order[]> {
    // Cassandra không hỗ trợ tốt WHERE với non-primary key nếu không có index.
    const result = await cassandraClient.execute(
      `SELECT * FROM shop_db.orders_by_user WHERE user_id = ?`,
      [user_id],
      { prepare: true }
    );

    return result.rows.map(
      (row) =>
        ({
          id: row["id"],
          user_id: row["user_id"],
          total_amount: row["total_amount"],
          status: row["status"],
          created_at: row["created_at"],
          updated_at: row["updated_at"],
        } as Order)
    );
  }

  async updateStatus(
    id: string,
    status: string,
    updatedAt: Date
  ): Promise<void> {
    await cassandraClient.execute(
      `UPDATE shop_db.orders SET status = ?, updated_at = ? WHERE id = ?`,
      [status, updatedAt, id],
      { prepare: true }
    );
  }
}
