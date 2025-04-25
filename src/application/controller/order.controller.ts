import { Request, Response } from "express";
import { CommandBus } from "../command/command_bus";
import {
  CheckoutOrderCommand,
  CheckoutOrderHandler,
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
}
