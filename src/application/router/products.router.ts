import { Router } from "express";
import { ProductsController } from "../controller/products.controller";

const router = Router();
const productsController = new ProductsController();

router.post("/", (req, res) => productsController.create(req, res));
router.put("/:id", (req, res) => productsController.update(req, res));
router.patch("/:id/stock", (req, res) =>
  productsController.updateStock(req, res)
);
router.delete("/:id", (req, res) => productsController.delete(req, res));
router.get("/", (req, res) => productsController.get(req, res));

export default router;
