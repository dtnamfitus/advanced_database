import neo4j, { Driver, Session } from "neo4j-driver";

export class Neo4jRepository {
  private driver: Driver;

  constructor(uri: string, user: string, password: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  private getSession(): Session {
    return this.driver.session({ defaultAccessMode: neo4j.session.WRITE });
  }

  async close() {
    await this.driver.close();
  }

  async upsertProduct(product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    shop_id: number;
  }) {
    const session = this.getSession();
    try {
      await session.run(
        `
        MERGE (p:Product {id: $id})
        SET p.name = $name, p.price = $price, p.stock = $stock
        MERGE (s:Shop {id: $shop_id})
        MERGE (p)-[:BELONGS_TO]->(s)
        `,
        product
      );
    } finally {
      await session.close();
    }
  }

  async addToCart(userId: number, productId: number) {
    const session = this.getSession();
    try {
      await session.run(
        `
        MERGE (u:User {id: $userId})
        MERGE (p:Product {id: $productId})
        MERGE (u)-[:ADDED_TO_CART]->(p)
        `,
        { userId, productId }
      );
    } finally {
      await session.close();
    }
  }

  async recordOrder(userId: number, productId: number) {
    const session = this.getSession();
    try {
      await session.run(
        `
        MERGE (u:User {id: $userId})
        MERGE (p:Product {id: $productId})
        MERGE (u)-[:ORDERED]->(p)
        `,
        { userId, productId }
      );
    } finally {
      await session.close();
    }
  }

  async getRecommendedProducts(userId: number) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:ORDERED|ADDED_TO_CART]->(p1:Product)
        MATCH (other:User)-[:ORDERED|ADDED_TO_CART]->(p1)
        MATCH (other)-[:ORDERED|ADDED_TO_CART]->(p2:Product)
        WHERE NOT (u)-[:ORDERED|ADDED_TO_CART]->(p2)
        RETURN DISTINCT p2
        LIMIT 10
        `,
        { userId }
      );
      return result.records.map((record) => ({
        id: record.get("id").toInt(),
        name: record.get("name"),
        price: record.get("price").toFloat(),
        stock: record.get("stock").toInt(),
      }));
    } finally {
      await session.close();
    }
  }
}
