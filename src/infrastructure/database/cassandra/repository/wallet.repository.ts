import cassandraClient from "../connection";
import { Wallet } from "../model/wallet.model";

export class WalletsCassandraRepository {
  async insert(wallet: Wallet): Promise<void> {
    const query = `INSERT INTO shop_db.wallets (id, shop_id, balance, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?)`;
    await cassandraClient.execute(
      query,
      [
        wallet.id,
        wallet.shop_id,
        wallet.balance,
        wallet.created_at,
        wallet.updated_at,
      ],
      { prepare: true }
    );
  }

  async getById(id: string): Promise<Wallet | null> {
    const result = await cassandraClient.execute(
      `SELECT * FROM shop_db.wallets WHERE id = ?`,
      [id],
      { prepare: true }
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row["id"],
      shop_id: row["shop_id"],
      balance: row["balance"],
      created_at: row["created_at"],
      updated_at: row["updated_at"],
    } as Wallet;
  }

  async updateBalance(
    id: string,
    newBalance: number,
    updatedAt: Date
  ): Promise<void> {
    const query = `UPDATE shop_db.wallets SET balance = ?, updated_at = ? WHERE id = ?`;
    await cassandraClient.execute(query, [newBalance, updatedAt, id], {
      prepare: true,
    });
  }
}
