import { OrderService } from "../../domain/service/order.service";
import { OrderCassandraService } from "../../domain/service/order_cassandra";
import { OrderItemsCassandraService } from "../../domain/service/order_items_cassandra";
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

export class GetOrderHistoryCommand implements ICommand {
  constructor(public readonly userId: number) {}
}

export class GetOrderHistoryHandler {
  private readonly orderCassandraService: OrderCassandraService =
    new OrderCassandraService();
  public async execute(command: GetOrderHistoryCommand): Promise<any> {
    return this.orderCassandraService.getOrderByUserId(command.userId);
  }
}

export class GetOrderItemByOrderIdCommand implements ICommand {
  constructor(public readonly orderId: number) {}
}

export class GetOrderItemByOrderIdHandler {
  private readonly orderItemsCassandraService: OrderItemsCassandraService =
    new OrderItemsCassandraService();
  public async execute(command: GetOrderItemByOrderIdCommand): Promise<any> {
    return this.orderItemsCassandraService.getOrderItemsByOrderId(
      command.orderId
    );
  }
}
