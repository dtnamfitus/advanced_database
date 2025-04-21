import { Repository } from "typeorm";
import { OrderItemsModel } from "../model/order_items.model";
import { AppDataSource } from "../connection";

export interface IOrderItemsRepository {
  findAll(): Promise<OrderItemsModel[]>;
  findById(id: number): Promise<OrderItemsModel | null>;
  findByOrderId(order_id: number): Promise<OrderItemsModel[]>;
  findByProductId(product_id: number): Promise<OrderItemsModel[]>;
  create(orderItem: Partial<OrderItemsModel>): Promise<OrderItemsModel>;
  update(
    id: number,
    orderItemData: Partial<OrderItemsModel>
  ): Promise<OrderItemsModel | null>;
  delete(id: number): Promise<boolean>;
}

export class OrderItemsRepository implements IOrderItemsRepository {
  private repository: Repository<OrderItemsModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrderItemsModel);
  }

  async findAll(): Promise<OrderItemsModel[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<OrderItemsModel | null> {
    return this.repository.findOneBy({ id });
  }

  async findByOrderId(order_id: number): Promise<OrderItemsModel[]> {
    return this.repository.findBy({ order_id });
  }

  async findByProductId(product_id: number): Promise<OrderItemsModel[]> {
    return this.repository.findBy({ product_id });
  }

  async create(orderItem: Partial<OrderItemsModel>): Promise<OrderItemsModel> {
    const newOrderItem = this.repository.create(orderItem);
    return this.repository.save(newOrderItem);
  }

  async update(
    id: number,
    orderItemData: Partial<OrderItemsModel>
  ): Promise<OrderItemsModel | null> {
    await this.repository.update(id, orderItemData);
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
