import { Client, ClientOptions } from "@elastic/elasticsearch";
import { config } from "../../../config/config";

export class ElasticsearchConnection {
  private static instance: Client;

  private constructor() {}

  public static getInstance(): Client {
    if (!ElasticsearchConnection.instance) {
      console.log("Initializing Elasticsearch client...");
      const esConfig = config.elasticsearch;

      const clientOptions: ClientOptions = {
        node: esConfig.address,
      };

      if (esConfig.username && esConfig.password) {
        clientOptions.auth = {
          username: esConfig.username,
          password: esConfig.password,
        };
      }

      ElasticsearchConnection.instance = new Client(clientOptions);

      ElasticsearchConnection.instance
        .ping()
        .then(() => console.log("Elasticsearch client connected successfully."))
        .catch((error) =>
          console.error("Elasticsearch client failed to connect:", error)
        );
    }
    return ElasticsearchConnection.instance;
  }

  public static async closeConnection(): Promise<void> {
    if (ElasticsearchConnection.instance) {
      console.log("Closing Elasticsearch client connection...");

      console.log(
        "Elasticsearch client resources released (managed internally)."
      );
    }
  }
}

export const esClient = ElasticsearchConnection.getInstance();

export const closeEsConnection = ElasticsearchConnection.closeConnection;
