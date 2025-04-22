import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { config } from "../../config/config";
import { MessageConsumer } from "../../application/message/message_bus";

export class KafkaConsumerService implements MessageConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private messageCallback?: (topic: string, message: any) => Promise<void>;

  constructor() {
    this.kafka = new Kafka({
      clientId: "advanced-database-service",
      brokers: [`${config.kafka.broker}:${config.kafka.port}`],
    });

    this.consumer = this.kafka.consumer({
      groupId: config.kafka.group,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log("Kafka consumer connected successfully");
    } catch (error) {
      console.error("Failed to connect to Kafka:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log("Kafka consumer disconnected");
    } catch (error) {
      console.error("Failed to disconnect from Kafka:", error);
      throw error;
    }
  }

  public async subscribe(topics: string[]): Promise<void> {
    try {
      for (const topic of topics) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
        console.log(`Subscribed to Kafka topic: ${topic}`);
      }

      await this.startConsuming();
    } catch (error) {
      console.error("Failed to subscribe to Kafka topics:", error);
      throw error;
    }
  }

  public onMessage(
    callback: (topic: string, message: any) => Promise<void>
  ): void {
    this.messageCallback = callback;
  }

  private async startConsuming(): Promise<void> {
    if (!this.messageCallback) {
      throw new Error(
        "No message callback registered. Call onMessage() before subscribing."
      );
    }

    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          const { topic, partition, message } = payload;
          const value = message.value?.toString();

          if (!value) {
            console.warn(
              `Received empty message from topic ${topic}, partition ${partition}`
            );
            return;
          }

          try {
            const parsedMessage = JSON.parse(value);
            await this.messageCallback?.(topic, parsedMessage);
            console.log(
              `Processed message from topic ${topic}, partition ${partition}`
            );
          } catch (error) {
            console.error(`Error processing message from ${topic}:`, error);
          }
        },
      });

      console.log("Kafka consumer started");
    } catch (error) {
      console.error("Failed to start Kafka consumer:", error);
      throw error;
    }
  }
}
