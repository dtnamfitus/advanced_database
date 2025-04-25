import { Request, Response } from "express";
import { CommandBus } from "../command/command_bus";
import {
  CreateReviewCommand,
  CreateReviewHandler,
  GetReviewByProductIdCommand,
  GetReviewByProductIdHandler,
} from "../command/review.command";

export class ReviewController {
  private commandBus: CommandBus;

  constructor() {
    this.commandBus = new CommandBus();
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.commandBus.register("CreateReviewCommand", new CreateReviewHandler());
    this.commandBus.register(
      "GetReviewByProductIdCommand",
      new GetReviewByProductIdHandler()
    );
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const command = new CreateReviewCommand(
        userId,
        req.body.product_id,
        req.body.rating,
        req.body.comment
      );
      const newReview = await this.commandBus.execute(command);
      res.status(201).json({
        success: true,
        data: newReview,
        message: "Review created successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create review",
      });
    }
  }
  async getByProductId(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.product_id);
      const command = new GetReviewByProductIdCommand(
        productId,
        req.query.page ? parseInt(req.query.page as string) : 1,
        req.query.limit ? parseInt(req.query.limit as string) : 10,
        req.query.sort
          ? JSON.parse(req.query.sort as string)
          : { created_at: -1 }
      );
      const reviews = await this.commandBus.execute(command);
      res.status(200).json({
        success: true,
        data: reviews,
        message: "Reviews retrieved successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve reviews",
      });
    }
  }
}
