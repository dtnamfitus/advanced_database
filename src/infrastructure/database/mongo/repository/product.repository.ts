import { PaginateOptions } from "mongoose";
import ProductModel, {
  IProduct,
  ProductPaginateResult,
} from "../model/product.model";

export interface IProductRepository {
  getAllProducts(
    page?: number,
    limit?: number,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1 | "asc" | "desc">
  ): Promise<ProductPaginateResult>;
  searchProducts(
    keyword: string,
    page?: number,
    limit?: number,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1 | "asc" | "desc" | { $meta: string }>
  ): Promise<ProductPaginateResult>;
  getProductById(id: string): Promise<IProduct | null>;
  upsertProduct(
    product: IProduct,
    options?: { upsert: boolean }
  ): Promise<IProduct>;
}

export class ProductMongoRepository implements IProductRepository {
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
  ): Promise<ProductPaginateResult> {
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

    return (await ProductModel.paginate(
      filters,
      options
    )) as unknown as ProductPaginateResult;
  }

  async searchProducts(
    keyword: string,
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1 | "asc" | "desc" | { $meta: string }> = {
      score: { $meta: "textScore" },
    }
  ): Promise<ProductPaginateResult> {
    const searchFilters = {
      $text: { $search: keyword },
      ...filters,
    };

    const options: PaginateOptions = {
      page,
      limit,
      sort,
      lean: true,
      customLabels: {
        docs: "products",
        totalDocs: "totalProducts",
      },

      select: { score: { $meta: "textScore" } },
    };

    return (await ProductModel.paginate(
      searchFilters,
      options
    )) as unknown as ProductPaginateResult;
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await ProductModel.findById(id).lean();
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

    return result;
  }
}
