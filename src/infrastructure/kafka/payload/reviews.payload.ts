export interface DebeziumSource {
  version: string;
  connector: string;
  name: string;
  ts_ms: number;
  snapshot?: string;
  db: string;
  sequence?: string | null;
  ts_us?: number;
  ts_ns?: number;
  table?: string;
  server_id: number;
  gtid?: string | null;
  file: string;
  pos: number;
  row: number;
  thread?: number;
  query?: string | null;
}

export interface DebeziumTransaction {
  id: string;
  total_order: number;
  data_collection_order: number;
}

export interface DebeziumSchema {
  type: "struct";
  fields: DebeziumField[];
  optional: boolean;
  name: string;
  version: number;
}

export interface DebeziumField {
  type: string | DebeziumNestedType;
  optional: boolean;
  field: string;
  name?: string;
  version?: number;
  default?: any;
  parameters?: Record<string, string>;
  fields?: DebeziumField[];
}

export interface DebeziumNestedType {
  type: "struct";
  fields: DebeziumField[];
  optional: boolean;
  name?: string;
  version?: number;
}

export interface ReviewEvent {
  before: Review | null;
  after: Review;
  source: DebeziumSource;
  transaction?: DebeziumTransaction | null;
  op: "c" | "u" | "d" | "r";
  ts_ms?: number;
  ts_us?: number;
  ts_ns?: number;
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string | null;
  created_at: number;
  updated_at: number;
}

export interface ReviewKafkaMessage {
  schema: DebeziumSchema;
  payload: ReviewEvent;
}
