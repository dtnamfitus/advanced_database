import { Kafka, Consumer, EachMessagePayload, KafkaMessage } from "kafkajs";
import { config } from "../../config/config";
import { IMessageConsumer } from "../../application/messaging/message-consumer.interface";

export class KafkaConsumer implements IMessageConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected: boolean = false;
  private messageHandler?: (topic: string, payload: any) => Promise<void>;

  constructor(
    clientId: string = "kafka-consumer",
    groupId: string = config.kafka.group
  ) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: [`${config.kafka.broker}:${config.kafka.port}`],
    });

    this.consumer = this.kafka.consumer({
      groupId: groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxBytesPerPartition: 1048576,
      minBytes: 1,
      maxBytes: 5 * 1024 * 1024,
      maxWaitTimeInMs: 50,
      allowAutoTopicCreation: false,
      maxInFlightRequests: 5,
      readUncommitted: false,
    });
  }

  async connect(
    topics: string[],
    messageHandler: (topic: string, payload: any) => Promise<void>
  ): Promise<void> {
    if (this.isConnected) {
      console.warn("Kafka consumer is already connected.");
      return;
    }

    this.messageHandler = messageHandler;

    try {
      console.log("Connecting Kafka consumer...");
      await this.consumer.connect();
      this.isConnected = true;
      console.log("Kafka consumer connected successfully.");

      console.log(`Subscribing to topics: ${topics.join(", ")}`);
      await this.consumer.subscribe({ topics, fromBeginning: false });
      console.log("Subscription successful.");

      await this.startConsuming();
    } catch (error) {
      console.error("Failed to connect or subscribe Kafka consumer:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.warn("Kafka consumer is not connected.");
      return;
    }

    try {
      console.log("Disconnecting Kafka consumer...");
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log("Kafka consumer disconnected successfully.");
    } catch (error) {
      console.error("Failed to disconnect Kafka consumer:", error);
    }
  }

  private async startConsuming(): Promise<void> {
    if (!this.messageHandler) {
      throw new Error("Message handler not set before starting consumption.");
    }
    const handler = this.messageHandler;

    console.log("Starting Kafka message consumption...");
    try {
      await this.consumer.run({
        eachMessage: async ({
          topic,
          partition,
          message,
        }: EachMessagePayload) => {
          const rawValue = message.value?.toString();
          console.log(
            `Received raw message from topic ${topic} [partition ${partition}]`
          );

          if (!rawValue) {
            console.warn(
              `Received empty message from topic ${topic}, partition ${partition}`
            );
            return;
          }

          try {
            const payload = JSON.parse(rawValue);
            await handler(topic, payload);
            console.log(`Successfully processed message from topic ${topic}`);
          } catch (parseError) {
            console.error(
              `Error parsing JSON message from topic ${topic}:`,
              parseError,
              `Raw value: ${rawValue}`
            );
          }
        },
      });
      console.log("Kafka consumer is now running and processing messages.");
    } catch (error) {
      console.error("Failed to start Kafka consumer run loop:", error);
      this.isConnected = false;
      throw error;
    }
  }
}
