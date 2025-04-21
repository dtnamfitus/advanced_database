import { Repository } from "typeorm";
import { WalletsModel } from "../model/wallet.model";
import { AppDataSource } from "../connection";

export interface IWalletsRepository {
  findAll(): Promise<WalletsModel[]>;
  findById(id: number): Promise<WalletsModel | null>;
  findByShopId(shop_id: number): Promise<WalletsModel | null>;
  create(wallet: Partial<WalletsModel>): Promise<WalletsModel>;
  update(
    id: number,
    walletData: Partial<WalletsModel>
  ): Promise<WalletsModel | null>;
  updateBalance(id: number, amount: number): Promise<WalletsModel | null>;
  delete(id: number): Promise<boolean>;
}

export class WalletsRepository implements IWalletsRepository {
  private repository: Repository<WalletsModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(WalletsModel);
  }

  async findAll(): Promise<WalletsModel[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<WalletsModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByShopId(shop_id: number): Promise<WalletsModel | null> {
    return this.repository.findOneBy({ shop_id });
  }

  async create(wallet: Partial<WalletsModel>): Promise<WalletsModel> {
    const newWallet = this.repository.create(wallet);
    return this.repository.save(newWallet);
  }

  async update(
    id: number,
    walletData: Partial<WalletsModel>
  ): Promise<WalletsModel | null> {
    await this.repository.update(id, walletData);
    return this.findById(id);
  }

  async updateBalance(
    id: number,
    amount: number
  ): Promise<WalletsModel | null> {
    const wallet = await this.findById(id);
    if (!wallet) return null;

    wallet.balance += amount;
    return this.repository.save(wallet);
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
