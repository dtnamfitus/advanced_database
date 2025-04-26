import { IProduct } from "../../infrastructure/database/mongo/model/product.model";
import { ProductMongoRepository } from "../../infrastructure/database/mongo/repository/product.repository";
import { ProductEvent } from "../../infrastructure/kafka/payload/products.payload";

export interface IProductMongoService {
  SyncProducts(parsedMessage: ProductEvent): Promise<void>;
  GetProducts(
    keyword: string,
    page: number,
    limit: number,
    filters?: Record<string, any>,
    sort?: Record<string, 1 | -1 | "asc" | "desc">
  ): Promise<any>;
}

export class ProductMongoService implements IProductMongoService {
  private readonly productMongoRepository: ProductMongoRepository;

  constructor() {
    this.productMongoRepository = new ProductMongoRepository();
  }

  public async SyncProducts(parsedMessage: ProductEvent): Promise<void> {
    try {
      switch (parsedMessage.op) {
        case "c":
          console.log("Creating product with ID:", parsedMessage.after.id);
          await this.productMongoRepository.upsertProduct({
            product_id: parsedMessage.after.id,
            name: parsedMessage.after.name,
            description: parsedMessage.after.description ?? "",
            price: parsedMessage.after.price,
            stock: parsedMessage.after.stock,
            image_url: parsedMessage.after.image_url ?? "",
            shop_id: parsedMessage.after.shop_id,
            shop_name: "not yet implemented",
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "u":
          await this.productMongoRepository.upsertProduct({
            product_id: parsedMessage.after.id,
            name: parsedMessage.after.name,
            description: parsedMessage.after.description ?? "",
            price: parsedMessage.after.price,
            stock: parsedMessage.after.stock,
            image_url: parsedMessage.after.image_url ?? "",
            shop_id: parsedMessage.after.shop_id,
            shop_name: "not yet implemented",
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

  public async GetProducts(
    keyword: string,
    page: number,
    limit: number,
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1 | "asc" | "desc"> = { created_at: -1 }
  ): Promise<any> {
    try {
      const products = await this.productMongoRepository.searchProducts(
        keyword,
        page,
        limit,
        filters,
        sort
      );
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  public async GetProductByIds(ids: number[]): Promise<IProduct[]> {
    try {
      const product = await this.productMongoRepository.getProductsByIds(ids);
      return product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }
}
