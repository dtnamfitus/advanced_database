import { Router } from "express";
import { CartsController } from "../controller/cart.controller";

const router = Router();
const cartsController = new CartsController();

router.post("/", (req, res) => cartsController.addToCart(req, res));
router.put("/:id", (req, res) => cartsController.updateCart(req, res));
router.delete("/:id", (req, res) => cartsController.removeFromCart(req, res));
router.get("/:id", (req, res) => cartsController.getCart(req, res));

export default router;