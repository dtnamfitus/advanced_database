import { PaginateOptions, PaginateResult } from "mongoose";
import ProductModel, {
  IProduct,
  ProductPaginateResult,
} from "../model/product.model";

export class ProductMongoRepository {
  private convertBase64ToNumber(base64Value: string): number {
    try {
      const buffer = Buffer.from(base64Value, "base64");
      const value = buffer.readInt32BE(0);
      return value / 100;
    } catch (error) {
      console.error("Error converting base64 to number:", error);
      return 0;
    }
  }

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1 | "asc" | "desc"> = { created_at: -1 }
  ): Promise<any> {
    const options: PaginateOptions = {
      page,
      limit,
      sort,
      lean: true,
      customLabels: {
        docs: "products",
        totalDocs: "totalProducts",
      },
    };

    return await ProductModel.paginate(filters, options);
  }

  async searchProducts(
    keyword: string,
    page: number = 1,
    perPage: number = 10,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1 | "asc" | "desc"> = { created_at: -1 }
  ): Promise<any> {
    try {
      const query: any = {};

      if (keyword && keyword.trim()) {
        query.$text = { $search: keyword };
      }

      const skip = (page - 1) * perPage;

      const [products, total] = await Promise.all([
        ProductModel.find(query).sort(sort).skip(skip).limit(perPage).lean(),
        ProductModel.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / perPage);

      return {
        products,
        total,
        page,
        perPage,
        totalPages,
      };
    } catch (error) {
      console.error("Search products error:", error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await ProductModel.findById(id).lean();
  }

  async getProductsByIds(id: number[]): Promise<IProduct[]> {
    return await ProductModel.find({ product_id: { $in: id } }).lean();
  }

  async upsertProduct(
    product: IProduct,
    options: { upsert: boolean } = { upsert: true }
  ): Promise<IProduct> {
    const productData = {
      ...product,
      price:
        typeof product.price === "string"
          ? this.convertBase64ToNumber(product.price)
          : product.price,
    };

    const result = await ProductModel.findOneAndUpdate(
      { product_id: product.product_id },
      { $set: productData },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (!result) {
      throw new Error(`Failed to upsert product with id ${product.product_id}`);
    }

    return await result.save();
  }
}
