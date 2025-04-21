import { Repository } from "typeorm";
import { ShopsModel } from "../model/shops.model";
import { AppDataSource } from "../connection";

export interface IShopsRepository {
  findAll(): Promise<ShopsModel[]>;
  findById(id: number): Promise<ShopsModel | null>;
  findByOwnerId(owner_id: number): Promise<ShopsModel[]>;
  create(shop: Partial<ShopsModel>): Promise<ShopsModel>;
  update(id: number, shopData: Partial<ShopsModel>): Promise<ShopsModel | null>;
  delete(id: number): Promise<boolean>;
}

export class ShopsRepository implements IShopsRepository {
  private repository: Repository<ShopsModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(ShopsModel);
  }

  async findAll(): Promise<ShopsModel[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<ShopsModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByOwnerId(owner_id: number): Promise<ShopsModel[]> {
    return this.repository.findBy({ owner_id });
  }

  async create(shop: Partial<ShopsModel>): Promise<ShopsModel> {
    const newShop = this.repository.create(shop);
    return this.repository.save(newShop);
  }

  async update(
    id: number,
    shopData: Partial<ShopsModel>
  ): Promise<ShopsModel | null> {
    await this.repository.update(id, shopData);
    return this.findById(id);
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
