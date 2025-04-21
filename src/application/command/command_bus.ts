export interface ICommand {}

export interface ICommandHandler<T extends ICommand> {
  execute(command: T): Promise<any>;
}

export class CommandBus {
  private handlers = new Map<string, ICommandHandler<ICommand>>();

  register<T extends ICommand>(
    commandName: string,
    handler: ICommandHandler<T>
  ): void {
    this.handlers.set(commandName, handler as ICommandHandler<ICommand>);
  }

  async execute(command: ICommand): Promise<any> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error(`No handler registered for: ${command.constructor.name}`);
    }
    return handler.execute(command);
  }
}
