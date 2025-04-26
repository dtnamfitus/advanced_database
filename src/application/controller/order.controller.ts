import { Request, Response } from "express";
import { CommandBus } from "../command/command_bus";
import {
  CheckoutOrderCommand,
  CheckoutOrderHandler,
  GetOrderHistoryCommand,
  GetOrderHistoryHandler,
  GetOrderItemByOrderIdCommand,
  GetOrderItemByOrderIdHandler,
} from "../command/order.command";

export class OrderController {
  private commandBus: CommandBus;

  constructor() {
    this.commandBus = new CommandBus();
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.commandBus.register(
      "CheckoutOrderCommand",
      new CheckoutOrderHandler()
    );

    this.commandBus.register(
      "GetOrderHistoryCommand",
      new GetOrderHistoryHandler()
    );

    this.commandBus.register(
      "GetOrderItemByOrderIdCommand",
      new GetOrderItemByOrderIdHandler()
    );
  }

  async checkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const command = new CheckoutOrderCommand(userId);
      const order = await this.commandBus.execute(command);
      res.status(201).json({
        success: true,
        data: order,
        message: "Order created successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create order",
      });
    }
  }

  async getOrderHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const orders = await this.commandBus.execute(
        new GetOrderHistoryCommand(userId)
      );
      res.status(200).json({
        success: true,
        data: orders,
        message: "Order history retrieved successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve order history",
      });
    }
  }

  async getOrderItemByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.order_id);
      const orderItems = await this.commandBus.execute(
        new GetOrderItemByOrderIdCommand(orderId)
      );
      res.status(200).json({
        success: true,
        data: orderItems,
        message: "Order items retrieved successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve order items",
      });
    }
  }
}
