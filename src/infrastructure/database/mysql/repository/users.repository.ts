import { Repository } from "typeorm";
import { UsersModel } from "../model/users.model";
import { AppDataSource } from "../connection";

export interface IUsersRepository {
  findAll(): Promise<UsersModel[]>;
  findById(id: number): Promise<UsersModel | null>;
  findByUsername(username: string): Promise<UsersModel | null>;
  findByEmail(email: string): Promise<UsersModel | null>;
  create(user: Partial<UsersModel>): Promise<UsersModel>;
  update(id: number, userData: Partial<UsersModel>): Promise<UsersModel | null>;
  delete(id: number): Promise<boolean>;
}

export class UsersRepository implements IUsersRepository {
  private repository: Repository<UsersModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UsersModel);
  }

  async findAll(): Promise<UsersModel[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<UsersModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<UsersModel | null> {
    return this.repository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<UsersModel | null> {
    return this.repository.findOneBy({ email });
  }

  async create(user: Partial<UsersModel>): Promise<UsersModel> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async update(
    id: number,
    userData: Partial<UsersModel>
  ): Promise<UsersModel | null> {
    await this.repository.update(id, userData);
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
