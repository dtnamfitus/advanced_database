import { Repository } from "typeorm";
import { ReviewsModel } from "../model/review.model";
import { AppDataSource } from "../connection";

export class ReviewRepository {
  private repository: Repository<ReviewsModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(ReviewsModel);
  }

  async findByProductId(product_id: number): Promise<ReviewsModel[]> {
    return this.repository.findBy({ product_id });
  }

  async create(review: Partial<ReviewsModel>): Promise<ReviewsModel> {
    const newReview = this.repository.create(review);
    return this.repository.save(newReview);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (
      result.affected !== undefined &&
      result.affected != null &&
      result.affected > 0
    );
  }
}
