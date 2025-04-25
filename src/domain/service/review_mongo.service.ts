import { ReviewPaginateResult } from "../../infrastructure/database/mongo/model/review.model";
import { ReviewsMongoRepository } from "../../infrastructure/database/mongo/repository/review.repository";
import { ReviewEvent } from "../../infrastructure/kafka/payload/reviews.payload";

export class ReviewMongoService {
  private readonly reviewMongoRepository: ReviewsMongoRepository;

  constructor() {
    this.reviewMongoRepository = new ReviewsMongoRepository();
  }

  async getReviewByProductId(
    product_id: number,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1 | "asc" | "desc"> = { created_at: -1 }
  ): Promise<ReviewPaginateResult> {
    try {
      const reviews = await this.reviewMongoRepository.getAll(
        page,
        limit,
        { product_id },
        sort
      );
      return reviews;
    } catch (error) {
      throw new Error("Failed to fetch reviews: " + error);
    }
  }

  async SyncReviews(parsedMessage: ReviewEvent): Promise<void> {
    try {
      switch (parsedMessage.op) {
        case "c":
          const review = await this.reviewMongoRepository.upsert({
            review_id: parsedMessage.after.id,
            product_id: parsedMessage.after.product_id,
            user_id: parsedMessage.after.user_id,
            rating: parsedMessage.after.rating,
            comment: parsedMessage.after.comment?.toString() ?? "",
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          if (!review) {
            console.warn("Review not found:", parsedMessage.after.id);
            return;
          }
          console.log("Creating product with ID:", parsedMessage.after.id);
          break;
        case "u":
          await this.reviewMongoRepository.upsert({
            review_id: parsedMessage.after.id,
            product_id: parsedMessage.after.id,
            user_id: parsedMessage.after.user_id,
            rating: parsedMessage.after.rating,
            comment: parsedMessage.after.comment?.toString() ?? "",
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "d":
          if (!parsedMessage.before) {
            console.warn("No 'before' data for delete operation.");
            return;
          }
          console.log("Deleting product with ID:", parsedMessage.before.id);
          break;
        default:
          console.warn("Unknown operation:", parsedMessage.op);
          break;
      }
    } catch (error) {
      console.error("Error creating index:", error);
      throw error;
    }
  }
}
