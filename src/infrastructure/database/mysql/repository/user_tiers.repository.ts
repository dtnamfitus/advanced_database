import { Repository } from "typeorm";
import { UserTiersModel } from "../model/user_tiers.model";
import { AppDataSource } from "../connection";

export interface IUserTiersRepository {
  findAll(): Promise<UserTiersModel[]>;
  findByUserId(user_id: number): Promise<UserTiersModel | null>;
  create(userTier: Partial<UserTiersModel>): Promise<UserTiersModel>;
  update(
    user_id: number,
    tierData: Partial<UserTiersModel>
  ): Promise<UserTiersModel | null>;
  delete(user_id: number): Promise<boolean>;
}

export class UserTiersRepository implements IUserTiersRepository {
  private repository: Repository<UserTiersModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserTiersModel);
  }

  async findAll(): Promise<UserTiersModel[]> {
    return this.repository.find();
  }

  async findByUserId(user_id: number): Promise<UserTiersModel | null> {
    return this.repository.findOneBy({ user_id });
  }

  async create(userTier: Partial<UserTiersModel>): Promise<UserTiersModel> {
    const newUserTier = this.repository.create(userTier);
    return this.repository.save(newUserTier);
  }

  async update(
    user_id: number,
    tierData: Partial<UserTiersModel>
  ): Promise<UserTiersModel | null> {
    await this.repository.update(user_id, tierData);
    return this.findByUserId(user_id);
  }

  async delete(user_id: number): Promise<boolean> {
    const result = await this.repository.delete(user_id);
    return (
      result?.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
