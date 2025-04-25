import { PaginateOptions } from "mongoose";
import ReviewModel, {
  IReview,
  ReviewPaginateResult,
} from "../model/review.model";

export class ReviewsMongoRepository {
  async getAll(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1 | "asc" | "desc"> = { created_at: -1 }
  ): Promise<ReviewPaginateResult> {
    const options: PaginateOptions = {
      page,
      limit,
      sort,
      lean: true,
      customLabels: {
        docs: "reviews",
        totalDocs: "totalReviews",
      },
    };

    return (await ReviewModel.paginate(
      filters,
      options
    )) as unknown as ReviewPaginateResult;
  }

  async upsert(
    review: IReview,
    options: { upsert: boolean } = { upsert: true }
  ): Promise<IReview> {
    try {
      const reviewData = {
        ...review,
      };

      const result = await ReviewModel.findOneAndUpdate(
        { review_id: review.review_id },
        { $set: reviewData },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      if (!result) {
        throw new Error(`Failed to upsert product with id ${review.review_id}`);
      }
      return result;
    } catch (error) {
      console.error("Error upserting review:", error);
      throw error;
    }
  }
}
