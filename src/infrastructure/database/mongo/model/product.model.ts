import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IProduct {
  product_id: number;
  shop_id: number;
  shop_name?: string;
  name: string;
  description?: string;
  price: string | number;
  stock: number;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IProductDocument extends IProduct, Document {}

export interface ProductPaginateResult {
  docs: IProductDocument[];
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

const ProductSchema = new Schema<IProductDocument>(
  {
    product_id: { type: Number, required: true, unique: true },
    shop_id: { type: Number, required: true, index: true },
    shop_name: { type: String },
    name: { type: String, required: true, index: true },
    description: { type: String },
    price: { type: Number, required: true, index: true },
    stock: { type: Number, default: 0 },
    image_url: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ id: 1, product_id: 1 }, { unique: true });

ProductSchema.plugin(mongoosePaginate);

interface ProductModel<T extends Document> extends mongoose.PaginateModel<T> {}

const ProductModel = mongoose.model<
  IProductDocument,
  ProductModel<IProductDocument>
>("Product", ProductSchema);

async function ensureTextIndex() {
  try {
    const indexExists = await ProductModel.collection.indexExists(
      "name_text_description_text"
    );
    if (!indexExists) {
      await ProductModel.createIndexes();
      console.log("Text index created");
    }
  } catch (error) {
    console.error("Error creating text index:", error);
  }
}
ensureTextIndex()
  .then(() => {
    console.log("Text index ensured");
  })
  .catch((error) => {
    console.error("Error ensuring text index:", error);
  });
export default ProductModel;
