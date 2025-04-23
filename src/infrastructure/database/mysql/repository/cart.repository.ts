import { Repository } from "typeorm";
import { CartsModel } from "../model/cart.model";
import { AppDataSource } from "../connection";

export interface ICartsRepository {
  create(cart: CartsModel): Promise<CartsModel>;
  update(cart: CartsModel): Promise<CartsModel>;
}

export class CartsRepository implements ICartsRepository {
  private repository: Repository<CartsModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(CartsModel);
  }

  async create(cart: Partial<CartsModel>): Promise<CartsModel> {
    const newCart = this.repository.create(cart);
    return this.repository.save(newCart);
  }

  async update(cart: CartsModel): Promise<CartsModel> {
    return this.repository.save(cart);
  }

  async findById(cartId: number): Promise<CartsModel | null> {
    return this.repository.findOneBy({ id: cartId });
  }

  async delete(cart: CartsModel): Promise<void> {
    await this.repository.remove(cart);
  }
}
