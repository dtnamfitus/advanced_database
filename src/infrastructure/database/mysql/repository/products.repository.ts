import { Repository } from "typeorm";
import { ProductsModel } from "../model/product.model";
import { AppDataSource } from "../connection";

export interface IProductsRepository {
  findAll(): Promise<ProductsModel[]>;
  findById(id: number): Promise<ProductsModel | null>;
  findByShopId(shop_id: number): Promise<ProductsModel[]>;
  create(product: Partial<ProductsModel>): Promise<ProductsModel>;
  update(
    id: number,
    productData: Partial<ProductsModel>
  ): Promise<ProductsModel | null>;
  updateStock(id: number, quantity: number): Promise<ProductsModel | null>;
  delete(id: number): Promise<boolean>;
}

export class ProductsRepository implements IProductsRepository {
  private repository: Repository<ProductsModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductsModel);
  }

  async findAll(): Promise<ProductsModel[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<ProductsModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByShopId(shop_id: number): Promise<ProductsModel[]> {
    return this.repository.findBy({ shop_id });
  }

  async create(product: Partial<ProductsModel>): Promise<ProductsModel> {
    const newProduct = this.repository.create(product);
    return this.repository.save(newProduct);
  }

  async update(
    id: number,
    productData: Partial<ProductsModel>
  ): Promise<ProductsModel | null> {
    await this.repository.update(id, productData);
    return this.findById(id);
  }

  async updateStock(
    id: number,
    quantity: number
  ): Promise<ProductsModel | null> {
    const product = await this.findById(id);
    if (!product) return null;

    product.stock += quantity;
    return this.repository.save(product);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (
      result?.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
