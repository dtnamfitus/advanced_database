import { Repository } from "typeorm";
import { WalletTransactionsModel } from "../model/transaction.model";
import { AppDataSource } from "../connection";

export interface IWalletTransactionsRepository {
  findAll(): Promise<WalletTransactionsModel[]>;
  findById(id: number): Promise<WalletTransactionsModel | null>;
  findByWalletId(wallet_id: number): Promise<WalletTransactionsModel[]>;
  create(
    transaction: Partial<WalletTransactionsModel>
  ): Promise<WalletTransactionsModel>;
  update(
    id: number,
    transactionData: Partial<WalletTransactionsModel>
  ): Promise<WalletTransactionsModel | null>;
  delete(id: number): Promise<boolean>;
}

export class WalletTransactionsRepository
  implements IWalletTransactionsRepository
{
  private repository: Repository<WalletTransactionsModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(WalletTransactionsModel);
  }

  async findAll(): Promise<WalletTransactionsModel[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<WalletTransactionsModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByWalletId(wallet_id: number): Promise<WalletTransactionsModel[]> {
    return this.repository.findBy({ wallet_id });
  }

  async create(
    transaction: Partial<WalletTransactionsModel>
  ): Promise<WalletTransactionsModel> {
    const newTransaction = this.repository.create(transaction);
    return this.repository.save(newTransaction);
  }

  async update(
    id: number,
    transactionData: Partial<WalletTransactionsModel>
  ): Promise<WalletTransactionsModel | null> {
    await this.repository.update(id, transactionData);
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
