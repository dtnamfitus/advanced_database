export interface CartEvent {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: number; // MicroTimestamp
  updated_at: number; // MicroTimestamp
}

export interface CartKafkaMessage {
  schema: {
    type: string;
    fields: Array<{
      type: string;
      fields?: Array<{
        type: string;
        optional: boolean;
        field: string;
        name?: string;
        version?: number;
        parameters?: {
          scale?: string;
          precision?: string;
          allowed?: string;
        };
        default?: number | string;
      }>;
      optional: boolean;
      name?: string;
      field: string;
    }>;
    optional: boolean;
    name: string;
    version: number;
  };
  payload: CartEventPayload;
}

export interface CartEventPayload {
  before: CartEvent | null;
  after: CartEvent;
  source: {
    version: string;
    connector: string;
    name: string;
    ts_ms: number;
    snapshot: string;
    db: string;
    sequence: string | null;
    ts_us: number;
    ts_ns: number;
    table: string;
    server_id: number;
    gtid: string | null;
    file: string;
    pos: number;
    row: number;
    thread: number | null;
    query: string | null;
  };
  transaction: {
    id: string;
    total_order: number;
    data_collection_order: number;
  } | null;
  op: string;
  ts_ms: number;
  ts_us: number;
  ts_ns: number;
}
