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
  ): Promise<any> {
    try {
      page = Math.max(1, page);
      limit = Math.max(1, Math.min(limit, 100));

      const skip = (page - 1) * limit;

      const [reviews, totalReviews] = await Promise.all([
        ReviewModel.find(filters)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),

        ReviewModel.countDocuments(filters),
      ]);

      const totalPages = Math.ceil(totalReviews / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        reviews,
        totalReviews,
        limit,
        page,
        totalPages,
        pagingCounter: (page - 1) * limit + 1,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
      };
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
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
      console.log("Upserted review:", result);
      return result;
    } catch (error) {
      console.error("Error upserting review:", error);
      throw error;
    }
  }
}
