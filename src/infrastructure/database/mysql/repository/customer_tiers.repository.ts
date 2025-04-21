import { Repository } from "typeorm";
import { CustomerTiersModel } from "../model/customer_tiers.model";
import { AppDataSource } from "../connection";

export interface ICustomerTiersRepository {
  findAll(): Promise<CustomerTiersModel[]>;
  findById(id: number): Promise<CustomerTiersModel | null>;
  findByName(name: string): Promise<CustomerTiersModel | null>;
  create(tier: Partial<CustomerTiersModel>): Promise<CustomerTiersModel>;
  update(
    id: number,
    tierData: Partial<CustomerTiersModel>
  ): Promise<CustomerTiersModel | null>;
  delete(id: number): Promise<boolean>;
}

export class CustomerTiersRepository implements ICustomerTiersRepository {
  private repository: Repository<CustomerTiersModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(CustomerTiersModel);
  }

  async findAll(): Promise<CustomerTiersModel[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<CustomerTiersModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<CustomerTiersModel | null> {
    return this.repository.findOneBy({ name });
  }

  async create(tier: Partial<CustomerTiersModel>): Promise<CustomerTiersModel> {
    const newTier = this.repository.create(tier);
    return this.repository.save(newTier);
  }

  async update(
    id: number,
    tierData: Partial<CustomerTiersModel>
  ): Promise<CustomerTiersModel | null> {
    await this.repository.update(id, tierData);
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
