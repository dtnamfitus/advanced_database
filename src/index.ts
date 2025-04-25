import { config } from "./config/config";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
import { mongoConnection } from "./infrastructure/database/mongo/connection";

const app = express();
const port = config.server.port || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import {
  IMessageConsumer,
  IMessageProcessor,
} from "./application/messaging/message-consumer.interface";
import { MessageProcessorService } from "./application/messaging/message-processor.service";
import { KafkaConsumer } from "./infrastructure/kafka/kafka_consumer";

import productsRouter from "./application/router/products.router";
import userRouter from "./application/router/users.router";
import cartRouter from "./application/router/cart.router";
import reviewRouter from "./application/router/review.router";
import orderRouter from "./application/router/order.router";

app.use("/products", productsRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);

const topicsToConsume = [
  config.cdc_topic.cdc_products,
  config.cdc_topic.cdc_carts,
  config.cdc_topic.cdc_reviews,
  config.cdc_topic.cdc_orders,
  config.cdc_topic.cdc_order_items,
];
const kafkaConsumer: IMessageConsumer = new KafkaConsumer(
  "local",
  config.kafka.group
);
const kafkaProcessor: IMessageProcessor = new MessageProcessorService();

mongoConnection
  .connect()
  .then(() => {
    app.listen(port, async () => {
      kafkaConsumer
        .connect(topicsToConsume, async (topic, payload) =>
          kafkaProcessor.processMessage(topic, payload)
        )
        .then(() => {
          console.log(
            "Kafka consumer connected and subscribed to topics:",
            topicsToConsume
          );
        })
        .catch((error) => {
          console.error("Error connecting Kafka consumer:", error);
        });
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: any) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

module.exports = app;
