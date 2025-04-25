import { OrderService } from "../../domain/service/order.service";
import { ICommand } from "./command_bus";

export class CheckoutOrderCommand implements ICommand {
  constructor(public readonly userId: number) {}
}

export class CheckoutOrderHandler {
  private readonly orderService: OrderService = new OrderService();
  public async execute(command: CheckoutOrderCommand): Promise<any> {
    return this.orderService.createOrder(command.userId);
  }
}
