import { ProductEvent } from "../../infrastructure/kafka/payload/products.payload";
import { ProductAggRepository } from "../../infrastructure/database/elasticsearch/repository/productAgg.repository";

export class ProductESService {
  private productAggRepository: ProductAggRepository;

  constructor() {
    this.productAggRepository = new ProductAggRepository();
  }

  public async UpsertProductsAggregate(
    parsedMessage: ProductEvent
  ): Promise<void> {
    try {
      switch (parsedMessage.op) {
        case "c":
          await this.productAggRepository.upsert({
            id: parsedMessage.after.id,
            name: parsedMessage.after.name,
            description: parsedMessage.after.description ?? null,
            price: parseFloat(parsedMessage.after.price),
            stock: parsedMessage.after.stock,
            image_url: parsedMessage.after.image_url ?? null,
            shop_id: parsedMessage.after.shop_id,
            shop_name: "not yet implemented",
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
        case "u":
          await this.productAggRepository.upsert({
            id: parsedMessage.after.id,
            name: parsedMessage.after.name,
            description: parsedMessage.after.description ?? null,
            price: parseFloat(parsedMessage.after.price),
            stock: parsedMessage.after.stock,
            image_url: parsedMessage.after.image_url ?? null,
            shop_id: parsedMessage.after.shop_id,
            shop_name: "not yet implemented",
            created_at: new Date(parsedMessage.after.created_at),
            updated_at: new Date(parsedMessage.after.updated_at),
          });
          break;
          break;
        case "d":
          if (!parsedMessage.before) {
            console.warn("No 'before' data for delete operation.");
            return;
          }
          await this.productAggRepository.delete(parsedMessage.before.id);
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
