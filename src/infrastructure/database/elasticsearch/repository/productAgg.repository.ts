import { PRODUCT_AGG_INDEX, ProductAggModel } from "../model/productAgg.model";
import { ElasticsearchConnection } from "../connection";
import { Client } from "@elastic/elasticsearch";
import { SearchHit } from "@elastic/elasticsearch/lib/api/types";
export class ProductAggRepository {
  private readonly client: Client;
  private readonly index = PRODUCT_AGG_INDEX;

  constructor() {
    this.client = ElasticsearchConnection.getInstance();
  }

  async upsert(product: ProductAggModel): Promise<void> {
    try {
      await this.client.index({
        index: this.index,
        id: product.id.toString(),
        document: product,
        refresh: "wait_for",
      });
      console.log(
        `Upserted product ${product.id} into Elasticsearch index ${this.index}`
      );
    } catch (error) {
      console.error(
        `Error upserting product ${product.id} in Elasticsearch:`,
        error
      );
      throw error;
    }
  }

  async delete(productId: number): Promise<void> {
    try {
      await this.client.delete({
        index: this.index,
        id: productId.toString(),
        refresh: "wait_for",
      });
      console.log(
        `Deleted product ${productId} from Elasticsearch index ${this.index}`
      );
    } catch (error: any) {
      if (error?.meta?.statusCode === 404) {
        console.log(
          `Product ${productId} not found in Elasticsearch for deletion (already deleted?).`
        );
        return;
      }
      console.error(
        `Error deleting product ${productId} from Elasticsearch:`,
        error
      );
      throw error;
    }
  }

  /**
   * Finds a product document by its ID.
   * @param productId - The ID of the product to find.
   * @returns The product document or null if not found.
   */
  async findById(productId: number): Promise<ProductAggModel | null> {
    try {
      const response = await this.client.get<ProductAggModel>({
        index: this.index,
        id: productId.toString(),
      });
      return response._source ?? null;
    } catch (error: any) {
      if (error?.meta?.statusCode === 404) {
        return null;
      }
      console.error(
        `Error fetching product ${productId} from Elasticsearch:`,
        error
      );
      throw error;
    }
  }

  /**
   * Performs a basic text search across relevant fields (e.g., name, description, shop_name).
   * @param query - The search query string.
   * @param limit - Maximum number of results to return.
   * @param offset - Number of results to skip (for pagination).
   * @returns An array of matching product documents.
   */
  async search(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<ProductAggModel[]> {
    try {
      const response = await this.client.search<ProductAggModel>({
        index: this.index,
        from: offset,
        size: limit,
        query: {
          multi_match: {
            query: query,
            fields: ["name^3", "description", "shop_name^2"],
            fuzziness: "AUTO",
          },
        },
      });

      return response.hits.hits.map(
        (hit: SearchHit<ProductAggModel>) => hit._source as ProductAggModel
      );
    } catch (error) {
      console.error(
        `Error searching products in Elasticsearch with query "${query}":`,
        error
      );
      throw error;
    }
  }

  /**
   * Checks if the index exists.
   */
  async indexExists(): Promise<boolean> {
    try {
      const exists = await this.client.indices.exists({ index: this.index });
      return exists;
    } catch (error) {
      console.error(`Error checking if index ${this.index} exists:`, error);
      return false;
    }
  }

  /**
   * Creates the index with a predefined mapping.
   * Call this during application startup if the index doesn't exist.
   */
  async createIndexWithMapping(): Promise<void> {
    if (await this.indexExists()) {
      console.log(`Index ${this.index} already exists.`);
      return;
    }

    console.log(`Creating index ${this.index} with mapping...`);
    try {
      await this.client.indices.create({
        index: this.index,
        mappings: {
          properties: {
            id: { type: "integer" },
            name: {
              type: "text",
              analyzer: "standard",
              fields: { keyword: { type: "keyword", ignore_above: 256 } },
            },
            description: { type: "text", analyzer: "standard" },
            price: { type: "float" },
            stock: { type: "integer" },
            image_url: { type: "keyword", index: false },
            shop_id: { type: "integer" },
            shop_name: {
              type: "text",
              analyzer: "standard",
              fields: { keyword: { type: "keyword", ignore_above: 256 } },
            },
            created_at: { type: "date" },
            updated_at: { type: "date" },
          },
        },
      });
      console.log(`Index ${this.index} created successfully.`);
    } catch (error) {
      console.error(`Error creating index ${this.index}:`, error);
      throw error;
    }
  }
}
