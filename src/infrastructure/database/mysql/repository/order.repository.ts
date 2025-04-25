import { Repository } from "typeorm";
import { OrdersModel } from "../model/order.model";
import { AppDataSource } from "../connection";

export class OrderRepository {
  private repository: Repository<OrdersModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrdersModel);
  }

  async create(order: Partial<OrdersModel>): Promise<OrdersModel> {
    const newOrder = this.repository.create(order);
    return this.repository.save(newOrder);
  }

  async findById(id: number): Promise<OrdersModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUserId(userId: number): Promise<OrdersModel[]> {
    return this.repository.findBy({ user_id: userId });
  }
}
