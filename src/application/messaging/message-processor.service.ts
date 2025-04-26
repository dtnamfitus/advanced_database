import { config } from "../../config/config";
import { CartRedisService } from "../../domain/service/cart_redis.service";
import { OrderCassandraService } from "../../domain/service/order_cassandra";
import { OrderItemsCassandraService } from "../../domain/service/order_items_cassandra";
import { ProductMongoService } from "../../domain/service/products_mongo.service";
import { ReviewMongoService } from "../../domain/service/review_mongo.service";
import { CartKafkaMessage } from "../../infrastructure/kafka/payload/carts.payload";
import { OrderItemKafkaMessage } from "../../infrastructure/kafka/payload/order_item.payload";
import { OrderKafkaMessage } from "../../infrastructure/kafka/payload/orders.payload";
import { ProductKafkaMessage } from "../../infrastructure/kafka/payload/products.payload";
import { ReviewKafkaMessage } from "../../infrastructure/kafka/payload/reviews.payload";
import { IMessageProcessor } from "./message-consumer.interface";

export class MessageProcessorService implements IMessageProcessor {
  private productMongoService: ProductMongoService;
  private cartRedisService: CartRedisService;
  private reviewMongoService: ReviewMongoService;
  private orderCassandraService: OrderCassandraService;
  private orderItemsCassandraService: OrderItemsCassandraService;

  private topicHandlers: Map<string, (payload: any) => Promise<void>> =
    new Map();

  constructor() {
    this.productMongoService = new ProductMongoService();
    this.cartRedisService = new CartRedisService();
    this.reviewMongoService = new ReviewMongoService();
    this.orderCassandraService = new OrderCassandraService();
    this.orderItemsCassandraService = new OrderItemsCassandraService();

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

    this.registerHandler(
      config.cdc_topic.cdc_reviews,
      async (data: ReviewKafkaMessage) => {
        const reviewEvent = data.payload;
        await this.reviewMongoService.SyncReviews(reviewEvent);
      }
    );

    this.registerHandler(
      config.cdc_topic.cdc_orders,
      async (data: OrderKafkaMessage) => {
        const orderEvent = data.payload;
        await this.orderCassandraService.SyncOrders(orderEvent);
      }
    );

    this.registerHandler(
      config.cdc_topic.cdc_order_items,
      async (data: OrderItemKafkaMessage) => {
        const orderItemEvent = data.payload;
        await this.orderItemsCassandraService.SyncOrderItems(orderItemEvent);
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
