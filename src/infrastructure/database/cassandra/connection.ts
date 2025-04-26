import { Client } from "cassandra-driver";
import { config } from "../../../config/config";

async function init() {
  await cassandraClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS shop_db
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    `);

  await cassandraClient.execute(`USE shop_db`);

  await cassandraClient.execute(`
    CREATE TABLE IF NOT EXISTS shop_db.orders (
      order_id bigint PRIMARY KEY,
      user_id bigint,
      total_amount decimal,
      status text,
      created_at timestamp,
      updated_at timestamp
    );
  `);

  await cassandraClient.execute(`
    CREATE TABLE IF NOT EXISTS shop_db.order_items (
        id uuid PRIMARY KEY,
        order_item_id bigint,
        order_id bigint,
        product_id bigint,
        quantity int,
        price_at_order decimal,
        created_at timestamp,
        updated_at timestamp
        );
    `);

  //   await cassandraClient.execute(`
  //       CREATE TABLE IF NOT EXISTS shop_db.wallets (
  //         id UUID PRIMARY KEY,
  //         shop_id UUID,
  //         balance decimal,
  //         created_at timestamp,
  //         updated_at timestamp
  //       )
  //     `);

  //   await cassandraClient.execute(`
  //       CREATE TABLE IF NOT EXISTS shop_db.wallet_transactions (
  //         id UUID PRIMARY KEY,
  //         wallet_id UUID,
  //         type text,
  //         amount decimal,
  //         description text,
  //         created_at timestamp,
  //         updated_at timestamp
  //       )
  //     `);

  console.log("Cassandra database initialized and tables created.");
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
