import { Client } from "cassandra-driver";
import { config } from "../../../config/config";

async function init() {
  await cassandraClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS shop_db
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    `);

  await cassandraClient.execute(`USE shop_db`);

  await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY,
        user_id UUID,
        total_amount decimal,
        status text,
        created_at timestamp,
        updated_at timestamp
      );
    `);

  await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY,
        order_id UUID,
        product_id UUID,
        quantity int,
        price_at_order decimal,
        created_at timestamp,
        updated_at timestamp
      );
    `);

  await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY,
        shop_id UUID,
        balance decimal,
        created_at timestamp,
        updated_at timestamp
      );
    `);

  await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id UUID PRIMARY KEY,
        wallet_id UUID,
        type text,
        amount decimal,
        description text,
        created_at timestamp,
        updated_at timestamp
      );
    `);
}

const cassandraClient = new Client({
  contactPoints: [config.cassandra.host],
  localDataCenter: "datacenter1",
  keyspace: "shop_db",
});

init()
  .then(() => {
    console.log("Cassandra database initialized and tables created.");
  })
  .catch((error) => {
    console.error("Error initializing Cassandra database:", error);
  });

export default cassandraClient;
