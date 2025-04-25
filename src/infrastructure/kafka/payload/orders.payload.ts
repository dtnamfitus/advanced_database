// {
// 	"schema": {
// 		"type": "struct",
// 		"fields": [
// 			{
// 				"type": "struct",
// 				"fields": [
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "id"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "user_id"
// 					},
// 					{
// 						"type": "bytes",
// 						"optional": false,
// 						"name": "org.apache.kafka.connect.data.Decimal",
// 						"version": 1,
// 						"parameters": {
// 							"scale": "2",
// 							"connect.decimal.precision": "12"
// 						},
// 						"field": "total_amount"
// 					},
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"name": "io.debezium.data.Enum",
// 						"version": 1,
// 						"parameters": {
// 							"allowed": "PENDING,PAID,SHIPPED,DELIVERED,CANCELLED"
// 						},
// 						"default": "PENDING",
// 						"field": "status"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"name": "io.debezium.time.MicroTimestamp",
// 						"version": 1,
// 						"default": 0,
// 						"field": "created_at"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"name": "io.debezium.time.MicroTimestamp",
// 						"version": 1,
// 						"default": 0,
// 						"field": "updated_at"
// 					}
// 				],
// 				"optional": true,
// 				"name": "mckay.shoppee.orders.Value",
// 				"field": "before"
// 			},
// 			{
// 				"type": "struct",
// 				"fields": [
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "id"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "user_id"
// 					},
// 					{
// 						"type": "bytes",
// 						"optional": false,
// 						"name": "org.apache.kafka.connect.data.Decimal",
// 						"version": 1,
// 						"parameters": {
// 							"scale": "2",
// 							"connect.decimal.precision": "12"
// 						},
// 						"field": "total_amount"
// 					},
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"name": "io.debezium.data.Enum",
// 						"version": 1,
// 						"parameters": {
// 							"allowed": "PENDING,PAID,SHIPPED,DELIVERED,CANCELLED"
// 						},
// 						"default": "PENDING",
// 						"field": "status"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"name": "io.debezium.time.MicroTimestamp",
// 						"version": 1,
// 						"default": 0,
// 						"field": "created_at"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"name": "io.debezium.time.MicroTimestamp",
// 						"version": 1,
// 						"default": 0,
// 						"field": "updated_at"
// 					}
// 				],
// 				"optional": true,
// 				"name": "mckay.shoppee.orders.Value",
// 				"field": "after"
// 			},
// 			{
// 				"type": "struct",
// 				"fields": [
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"field": "version"
// 					},
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"field": "connector"
// 					},
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"field": "name"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "ts_ms"
// 					},
// 					{
// 						"type": "string",
// 						"optional": true,
// 						"name": "io.debezium.data.Enum",
// 						"version": 1,
// 						"parameters": {
// 							"allowed": "true,last,false,incremental"
// 						},
// 						"default": "false",
// 						"field": "snapshot"
// 					},
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"field": "db"
// 					},
// 					{
// 						"type": "string",
// 						"optional": true,
// 						"field": "sequence"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": true,
// 						"field": "ts_us"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": true,
// 						"field": "ts_ns"
// 					},
// 					{
// 						"type": "string",
// 						"optional": true,
// 						"field": "table"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "server_id"
// 					},
// 					{
// 						"type": "string",
// 						"optional": true,
// 						"field": "gtid"
// 					},
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"field": "file"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "pos"
// 					},
// 					{
// 						"type": "int32",
// 						"optional": false,
// 						"field": "row"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": true,
// 						"field": "thread"
// 					},
// 					{
// 						"type": "string",
// 						"optional": true,
// 						"field": "query"
// 					}
// 				],
// 				"optional": false,
// 				"name": "io.debezium.connector.mysql.Source",
// 				"field": "source"
// 			},
// 			{
// 				"type": "struct",
// 				"fields": [
// 					{
// 						"type": "string",
// 						"optional": false,
// 						"field": "id"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "total_order"
// 					},
// 					{
// 						"type": "int64",
// 						"optional": false,
// 						"field": "data_collection_order"
// 					}
// 				],
// 				"optional": true,
// 				"name": "event.block",
// 				"version": 1,
// 				"field": "transaction"
// 			},
// 			{
// 				"type": "string",
// 				"optional": false,
// 				"field": "op"
// 			},
// 			{
// 				"type": "int64",
// 				"optional": true,
// 				"field": "ts_ms"
// 			},
// 			{
// 				"type": "int64",
// 				"optional": true,
// 				"field": "ts_us"
// 			},
// 			{
// 				"type": "int64",
// 				"optional": true,
// 				"field": "ts_ns"
// 			}
// 		],
// 		"optional": false,
// 		"name": "mckay.shoppee.orders.Envelope",
// 		"version": 2
// 	},
// 	"payload": {
// 		"before": null,
// 		"after": {
// 			"id": 3,
// 			"user_id": 1,
// 			"total_amount": "AA==",
// 			"status": "PENDING",
// 			"created_at": 1745596680012292,
// 			"updated_at": 1745596680012292
// 		},
// 		"source": {
// 			"version": "3.0.0.Final",
// 			"connector": "mysql",
// 			"name": "mckay",
// 			"ts_ms": 1745596719000,
// 			"snapshot": "last",
// 			"db": "shoppee",
// 			"sequence": null,
// 			"ts_us": 1745596719000000,
// 			"ts_ns": 1745596719000000000,
// 			"table": "orders",
// 			"server_id": 0,
// 			"gtid": null,
// 			"file": "mysql-bin.000003",
// 			"pos": 71847,
// 			"row": 0,
// 			"thread": null,
// 			"query": null
// 		},
// 		"transaction": null,
// 		"op": "r",
// 		"ts_ms": 1745596719547,
// 		"ts_us": 1745596719547468,
// 		"ts_ns": 1745596719547468407
// 	}
// }

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

export interface OrderEvent {
  before: Order | null;
  after: Order;
  source: DebeziumSource;
  transaction?: DebeziumTransaction | null;
  op: "c" | "u" | "d" | "r";
  ts_ms?: number;
  ts_us?: number;
  ts_ns?: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: string | number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderKafkaMessage {
  schema: DebeziumSchema;
  payload: OrderEvent;
}
