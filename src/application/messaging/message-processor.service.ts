import { config } from "../../config/config";
import { CartRedisService } from "../../domain/service/cart_redis.service";
import { ProductMongoService } from "../../domain/service/products_mongo.service";
import { CartKafkaMessage } from "../../infrastructure/kafka/payload/carts.payload";
import { ProductKafkaMessage } from "../../infrastructure/kafka/payload/products.payload";
import { IMessageProcessor } from "./message-consumer.interface";

export class MessageProcessorService implements IMessageProcessor {
  private productMongoService: ProductMongoService;
  private cartRedisService: CartRedisService;
  private topicHandlers: Map<string, (payload: any) => Promise<void>> =
    new Map();

  constructor() {
    this.productMongoService = new ProductMongoService();
    this.cartRedisService = new CartRedisService();

    this.registerHandler(
      config.cdc_topic.cdc_products,
      async (data: ProductKafkaMessage) => {
        const productEvent = data.payload;
        await this.productMongoService.SyncProducts(productEvent);
      }
    );

    this.registerHandler(
      config.cdc_topic.cdc_carts,
      async (data: CartKafkaMessage) => {
        const cartEvent = data.payload;
        await this.cartRedisService.SyncCarts(cartEvent);
      }
    );
  }

  async registerHandler(
    topic: string,
    handler: (payload: any) => Promise<void>
  ): Promise<void> {
    this.topicHandlers.set(topic, handler);
  }

  async processMessage(topic: string, data: any): Promise<void> {
    const handler = this.topicHandlers.get(topic);

    if (!handler) {
      console.warn(`No specific handler configured for topic: ${topic}`);
      return;
    }

    try {
      await handler(data);
    } catch (error) {
      console.error(`Error processing message for topic ${topic}:`, error);
      throw error;
    }
  }
}
