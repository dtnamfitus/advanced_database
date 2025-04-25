import { CommandBus } from "../command/command_bus";

export class OrderController {
  private commandBus: CommandBus;

  constructor() {
    this.commandBus = new CommandBus();
    this.registerHandlers();
  }

  private registerHandlers(): void {}
}
