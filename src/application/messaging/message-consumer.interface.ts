export interface IMessageConsumer {
  connect(
    topics: string[],
    messageHandler: (topic: string, payload: any) => Promise<void>
  ): Promise<void>;
  disconnect(): Promise<void>;
}
export interface IMessageProcessor {
  processMessage(topic: string, payload: any): Promise<void>;
  registerHandler(topic: string, handler: (payload: any) => Promise<void>): void;
}
