import { Request, Response } from "express";
import {
  CreateProductCommand,
  CreateProductHandler,
  DeleteProductCommand,
  DeleteProductHandler,
  GetProductCommand,
  GetProductHandler,
  UpdateProductCommand,
  UpdateProductHandler,
  UpdateStockCommand,
  UpdateStockHandler,
} from "../command/products.command";
import { CommandBus } from "../command/command_bus";

export class ProductsController {
  private commandBus: CommandBus;

  constructor() {
    this.commandBus = new CommandBus();
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.commandBus.register(
      "CreateProductCommand",
      new CreateProductHandler()
    );
    this.commandBus.register(
      "UpdateProductCommand",
      new UpdateProductHandler()
    );
    this.commandBus.register("UpdateStockCommand", new UpdateStockHandler());
    this.commandBus.register(
      "DeleteProductCommand",
      new DeleteProductHandler()
    );
    this.commandBus.register("GetProductCommand", new GetProductHandler());
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const command = new CreateProductCommand(req.body);
      const newProduct = await this.commandBus.execute(command);
      res.status(201).json({
        success: true,
        data: newProduct,
        message: "Product created successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create product",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const command = new UpdateProductCommand(productId, req.body);
      const updatedProduct = await this.commandBus.execute(command);
      if (!updatedProduct) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: updatedProduct,
        message: "Product updated successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update product",
      });
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const { quantity } = req.body;
      if (quantity === undefined) {
        res.status(400).json({
          success: false,
          message: "Quantity is required",
        });
        return;
      }
      const command = new UpdateStockCommand(productId, quantity);
      const updatedProduct = await this.commandBus.execute(command);
      if (!updatedProduct) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: updatedProduct,
        message: "Product stock updated successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update product stock",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const command = new DeleteProductCommand(productId);
      const result = await this.commandBus.execute(command);
      if (!result) {
        res.status(404).json({
          success: false,
          message: "Product not found or already deleted",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete product",
      });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const command = new GetProductCommand(
        req.query.page ? parseInt(req.query.page as string) : 1,
        req.query.limit ? parseInt(req.query.limit as string) : 10,
        req.query.sort ? JSON.parse(req.query.sort as string) : { id: -1 }
      );
      const products = await this.commandBus.execute(command);
      res.status(200).json({
        success: true,
        data: products,
        message: "Products retrieved successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve products",
      });
    }
  }
}
