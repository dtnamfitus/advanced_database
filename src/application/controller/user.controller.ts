import { Request, Response } from "express";
import { CommandBus } from "../command/command_bus";
import { LoginHandler } from "../command/user.command";
import { LoginCommand } from "../command/user.command";
import { CreateUserHandler } from "../command/user.command";
import { CreateUserCommand } from "../command/user.command";

export class UserController {
  private commandBus: CommandBus;

  constructor() {
    this.commandBus = new CommandBus();
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.commandBus.register("CreateUserCommand", new CreateUserHandler());
    this.commandBus.register("LoginCommand", new LoginHandler());
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const command = new CreateUserCommand(req.body);
    const user = await this.commandBus.execute(command);
    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const command = new LoginCommand(req.body);
    const user = await this.commandBus.execute(command);
    res.status(200).json({
      success: true,
      data: user,
      message: "User logged in successfully",
    });
  }
}
