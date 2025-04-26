import { Neo4jRepository } from "../../infrastructure/database/neo4j/repository/neo4j.repository";

export class ProductNeo4jService {
  private readonly neo4jRepository = new Neo4jRepository();
  constructor() {}

  async getProductByUserId(user_id: number): Promise<any> {
    return await this.neo4jRepository.getRecommendedProducts(user_id);
  }

  async syncProducts(product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    shop_id: number;
  }): Promise<void> {
    await this.neo4jRepository.upsertProduct(product);
  }
}
