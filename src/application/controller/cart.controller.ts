import { Request, Response } from "express";
import {
  AddToCartCommand,
  AddToCartHandler,
  GetCartCommand,
  GetCartHandler,
  RemoveFromCartCommand,
  RemoveFromCartHandler,
  UpdateCartCommand,
  UpdateCartHandler,
} from "../command/cart.command";
import { CommandBus } from "../command/command_bus";

export class CartsController {
  private commandBus: CommandBus;

  constructor() {
    this.commandBus = new CommandBus();
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.commandBus.register("AddToCartCommand", new AddToCartHandler());
    this.commandBus.register("UpdateCartCommand", new UpdateCartHandler());
    this.commandBus.register(
      "RemoveFromCartCommand",
      new RemoveFromCartHandler()
    );
    this.commandBus.register("GetCartCommand", new GetCartHandler());
  }

  async addToCart(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.id;
    const command = new AddToCartCommand(
      userId,
      req.body.productId,
      req.body.quantity
    );
    const result = await this.commandBus.execute(command);
    res.status(200).json(result);
  }

  async updateCart(req: Request, res: Response): Promise<void> {
    const command = new UpdateCartCommand(
      parseInt(req.params.id),
      req.body.quantity
    );
    const result = await this.commandBus.execute(command);
    res.status(200).json(result);
  }

  async removeFromCart(req: Request, res: Response): Promise<void> {
    const command = new RemoveFromCartCommand(parseInt(req.params.id));
    const result = await this.commandBus.execute(command);
    res.status(200).json(result);
  }

  async getCart(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.id;
    const command = new GetCartCommand(userId);
    const result = await this.commandBus.execute(command);
    res.status(200).json(result);
  }
}
