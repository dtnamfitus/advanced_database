export interface MessageHandler<T = any> {
  handle(message: T): Promise<void>;
}

export interface MessageBus {
  registerHandler<T>(messageType: string, handler: MessageHandler<T>): void;
  dispatch<T>(messageType: string, message: T): Promise<void>;
}

export interface MessageConsumer {
  connect(): Promise<void>;

  disconnect(): Promise<void>;

  subscribe(topics: string[]): Promise<void>;

  onMessage(callback: (topic: string, message: any) => Promise<void>): void;
}

export class MessageBusService implements MessageBus {
  private handlers: Map<string, MessageHandler<any>> = new Map();

  public registerHandler<T>(
    messageType: string,
    handler: MessageHandler<T>
  ): void {
    this.handlers.set(messageType, handler);
    console.log(`Registered handler for message type: ${messageType}`);
  }

  public async dispatch<T>(messageType: string, message: T): Promise<void> {
    const handler = this.handlers.get(messageType);

    if (!handler) {
      console.warn(`No handler registered for message type: ${messageType}`);
      return;
    }

    try {
      await handler.handle(message);
    } catch (error) {
      console.error(`Error dispatching message of type ${messageType}:`, error);
      throw error;
    }
  }
}
