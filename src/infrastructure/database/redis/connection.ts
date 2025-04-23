import { createClient } from "redis";
import { config } from "../../../config/config";

type RedisClientInstance = ReturnType<typeof createClient>;

class RedisConnection {
  private static client: RedisClientInstance | null = null;
  private static isConnecting = false;
  private static connectionPromise: Promise<RedisClientInstance> | null = null;

  private constructor() {}

  public static async getClient(): Promise<RedisClientInstance> {
    if (this.client?.isOpen) {
      return this.client;
    }
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = new Promise<RedisClientInstance>(
      (resolve, reject) => {
        console.log("Connecting to Redis...");

        const redisClient = createClient({
          url: `redis://${
            config.redis.password ? `:${config.redis.password}@` : ""
          }${config.redis.host}:${config.redis.port}`,
          database: config.redis.db,
        });

        redisClient.on("error", (err) => {
          console.error("Redis connection error:", err);
          this.isConnecting = false;
          reject(err);
        });

        redisClient.on("ready", () => {
          console.log("Redis connection established");
          this.client = redisClient;
          this.isConnecting = false;
          resolve(redisClient);
        });

        redisClient.connect().catch((err) => {
          console.error("Failed to connect to Redis:", err);
          this.isConnecting = false;
          reject(err);
        });
      }
    );

    return this.connectionPromise;
  }

  public static async closeConnection(): Promise<void> {
    try {
      if (this.client?.isOpen) {
        await this.client.quit();
        console.log("Redis connection closed");
      }
      this.client = null;
      this.isConnecting = false;
      this.connectionPromise = null;
    } catch (error) {
      console.error("Error closing Redis connection:", error);
      throw error;
    }
  }

  public static async get(key: string): Promise<string | null> {
    const client = await this.getClient();
    return client.get(key);
  }

  public static async set(key: string, value: string): Promise<void> {
    const client = await this.getClient();
    await client.set(key, value);
  }
}

export default RedisConnection;
