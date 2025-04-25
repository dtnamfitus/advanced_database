import { Router } from "express";
import { CartsController } from "../controller/cart.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const cartsController = new CartsController();

router.post("/", authenticate, (req, res) =>
  cartsController.addToCart(req, res)
);
router.put("/:id", authenticate, (req, res) =>
  cartsController.updateCart(req, res)
);
router.delete("/:id", authenticate, (req, res) =>
  cartsController.removeFromCart(req, res)
);

export default router;
