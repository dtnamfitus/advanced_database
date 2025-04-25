import { Router } from "express";
import { OrderController } from "../controller/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const orderController = new OrderController();

router.post("/checkout", authenticate, (req, res) =>
  orderController.checkout(req, res)
);

export default router;
