import mongoose from "mongoose";
import { config } from "../../../config/config";

class MongoConnection {
  private static instance: MongoConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("MongoDB is already connected");
      return;
    }

    try {
      const { host, port, dbName } = config.mongo;
      const uri = `mongodb://${host}:${port}/${dbName}`;

      await mongoose.connect(uri);

      this.isConnected = true;
      console.log("MongoDB connected successfully");

      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
        this.isConnected = false;
      });

      process.on("SIGINT", async () => {
        await this.close();
        process.exit(0);
      });
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      throw error;
    }
  }

  public isConnectedToMongo(): boolean {
    return this.isConnected;
  }
}

export const mongoConnection = MongoConnection.getInstance();
