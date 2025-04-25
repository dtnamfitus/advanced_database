import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IReview {
  review_id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IReviewDocument extends IReview, Document {}

export interface ReviewPaginateResult {
  docs: IReviewDocument[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    review_id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true, index: true },
    product_id: { type: Number, required: true, index: true },
    rating: { type: Number, required: true, index: true },
    comment: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

ReviewSchema.index({ product_id: 1, user_id: 1 });
ReviewSchema.index({ rating: 1, comment: "text" });

ReviewSchema.plugin(mongoosePaginate);

interface ReviewModel<T extends Document> extends mongoose.PaginateModel<T> {}

const ReviewModel = mongoose.model<
  IReviewDocument,
  ReviewModel<IReviewDocument>
>("Review", ReviewSchema);

export default ReviewModel;
