import { Router } from "express";
import { ReviewController } from "../controller/review.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const reviewController = new ReviewController();

router.post("/", authenticate, (req, res) => reviewController.create(req, res));
router.get("/:product_id", (req, res) =>
  reviewController.getByProductId(req, res)
);

export default router;
