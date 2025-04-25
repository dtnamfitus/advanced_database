// import { ProductESService } from "../../domain/service/products_es.service";
// import {
//   ProductEvent,
//   ProductKafkaMessage,
// } from "../../infrastructure/kafka/payload/products.payload";
// import { IMessageProcessor } from "./message-consumer.interface";

// export class MessageProcessorService implements IMessageProcessor {
//   private productEsService: ProductESService;
//   private topicHandlers: Map<string, (payload: any) => Promise<void>> =
//     new Map();

//   constructor() {
//     this.productEsService = new ProductESService();

//     this.registerHandler(
//       "mckay.shoppee.products",
//       async (data: ProductKafkaMessage) => {
//         const productEvent = data.payload;
//         await this.productEsService.UpsertProductsAggregate(productEvent);
//       }
//     );
//   }

//   async registerHandler(
//     topic: string,
//     handler: (payload: any) => Promise<void>
//   ): Promise<void> {
//     this.topicHandlers.set(topic, handler);
//   }

//   async processMessage(topic: string, data: any): Promise<void> {
//     const handler = this.topicHandlers.get(topic);

//     if (!handler) {
//       console.warn(`No specific handler configured for topic: ${topic}`);
//       return;
//     }

//     try {
//       await handler(data);
//     } catch (error) {
//       console.error(`Error processing message for topic ${topic}:`, error);
//       throw error;
//     }
//   }
// }
