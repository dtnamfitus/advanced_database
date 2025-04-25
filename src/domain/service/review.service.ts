import { ReviewRepository } from "../../infrastructure/database/mysql/repository/review.repository";

export class ReviewService {
  private readonly reviewsRepository = new ReviewRepository();

  async createReview(reviewData: {
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
  }): Promise<any> {
    try {
      return await this.reviewsRepository.create(reviewData);
    } catch (error) {
      throw new Error("Failed to create review: " + error);
    }
  }
}
