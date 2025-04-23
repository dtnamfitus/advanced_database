import { config } from "./config/config";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const port = config.server.port || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import {
  IMessageConsumer,
  IMessageProcessor,
} from "./application/messaging/message-consumer.interface";
// import { MessageProcessorService } from "./application/messaging/message-processor.service";
import { KafkaConsumer } from "./infrastructure/kafka/kafka_consumer";

import productsRouter from "./application/router/products.router";
import userRouter from "./application/router/users.router";
import cartRouter from "./application/router/cart.router";
app.use("/products", productsRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);

const topicsToConsume = ["mckay.shoppee.products"];
const kafkaConsumer: IMessageConsumer = new KafkaConsumer(
  "local",
  config.kafka.group
);
// const kafkaProcessor: IMessageProcessor = new MessageProcessorService();

app.listen(port, async () => {
  // kafkaConsumer
  //   .connect(topicsToConsume, async (topic, payload) =>
  //     kafkaProcessor.processMessage(topic, payload)
  //   )
  //   .then(() => {
  //     console.log("Kafka consumer connected and subscribed to topics.");
  //   })
  //   .catch((error) => {
  //     console.error("Error connecting Kafka consumer:", error);
  //   });
  console.log(`Server is running on port ${port}`);
});
module.exports = app;
