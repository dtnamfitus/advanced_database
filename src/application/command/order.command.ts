import { ICommand } from "./command_bus";

export class CheckoutOrderCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly paymentMethod: string
  ) {}
}

export class CheckoutOrderHandler {
  public async execute(command: CheckoutOrderCommand): Promise<any> {}
}
