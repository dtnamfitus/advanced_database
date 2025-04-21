import { config } from "./config/config";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const port = config.server.port || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import productsRouter from "./application/router/products.router";
app.use("/products", productsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
