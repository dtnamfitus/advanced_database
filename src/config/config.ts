import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: Number(process.env.SERVER_PORT),
  },
  mysql: {
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASS || "",
    host: process.env.MYSQL_HOST || "",
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_NAME || "",
    parseTime: process.env.MYSQL_PARSE_TIME === "true",
    charset: process.env.MYSQL_CHARSET || "utf8mb4",
    timezone: process.env.MYSQL_LOC || "UTC",
    maxIdleConns: Number(process.env.MYSQL_MAX_IDLE_CONNS),
    maxOpenConns: Number(process.env.MYSQL_MAX_OPEN_CONNS),
    maxLifetime: Number(process.env.MYSQL_MAX_LIFETIME),
  },
  redis: {
    host: process.env.REDIS_HOST || "",
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || "",
    db: Number(process.env.REDIS_DATABASE),
  },
  kafka: {
    broker: process.env.KAFKA_BROKER || "",
    port: Number(process.env.KAFKA_PORT),
    group: process.env.KAFKA_CONSUMER_GROUP || "",
  },
  elasticsearch: {
    address: process.env.ELASTICSEARCH_ADDRESS || "",
    username: process.env.ELASTICSEARCH_USERNAME || "",
    password: process.env.ELASTICSEARCH_PASSWORD || "",
  },
  jwt: {
    accessSecret: process.env.SECURITY_JWT_ACCESS_SECRET || "",
    refreshSecret: process.env.SECURITY_JWT_REFRESH_SECRET || "",
    accessExpiration: Number(process.env.SECURITY_JWT_ACCESS_EXPIRATION),
    refreshExpiration: Number(process.env.SECURITY_JWT_REFRESH_EXPIRATION),
  },
  mongo: {
    host: process.env.MONGODB_HOST || "",
    port: Number(process.env.MONGODB_PORT),
    dbName: process.env.MONGODB_DATABASE || "",
  },
  neo4j: {
    host: process.env.NEO4J_HOST || "",
    port: Number(process.env.NEO4J_PORT),
    username: process.env.NEO4J_USERNAME || "",
    password: process.env.NEO4J_PASSWORD || "",
  },
  cassandra: {
    host: process.env.CASSANDRA_HOST || "",
    port: Number(process.env.CASSANDRA_PORT),
  },
  cdc_topic: {
    cdc_products: process.env.CDC_PRODUCT_TOPIC || "",
    cdc_carts: process.env.CDC_CART_TOPIC || "",
    cdc_reviews: process.env.CDC_REVIEW_TOPIC || "",
    cdc_orders: process.env.CDC_ORDER_TOPIC || "",
    cdc_order_items: process.env.CDC_ORDER_ITEM_TOPIC || "",
  },
};
