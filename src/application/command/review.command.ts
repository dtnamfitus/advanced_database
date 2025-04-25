import { ReviewService } from "../../domain/service/review.service";
import { ReviewMongoService } from "../../domain/service/review_mongo.service";
import { ReviewPaginateResult } from "../../infrastructure/database/mongo/model/review.model";
import { ICommand } from "./command_bus";

export class CreateReviewCommand implements ICommand {
  constructor(
    public readonly user_id: number,
    public readonly product_id: number,
    public readonly rating: number,
    public readonly comment: string
  ) {}
}

export class CreateReviewHandler {
  private readonly reviewService: ReviewService = new ReviewService();
  public async execute(command: CreateReviewCommand): Promise<any> {
    return this.reviewService.createReview(command);
  }
}

export class GetReviewByProductIdCommand implements ICommand {
  constructor(
    public readonly product_id: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly sort: Record<string, 1 | -1 | "asc" | "desc">
  ) {}
}

export class GetReviewByProductIdHandler {
  private readonly reviewMongoService: ReviewMongoService =
    new ReviewMongoService();
  public async execute(
    command: GetReviewByProductIdCommand
  ): Promise<ReviewPaginateResult> {
    return this.reviewMongoService.getReviewByProductId(
      command.product_id,
      command.page,
      command.limit,
      command.sort
    );
  }
}
