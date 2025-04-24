import { Request, Response } from "express";
import {
  CreateProductCommand,
  CreateProductHandler,
  DeleteProductCommand,
  DeleteProductHandler,
  GetProductsCommand,
  GetProductsHandler,
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
    this.commandBus.register("GetProductsCommand", new GetProductsHandler());
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

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, filters, sort } = req.query;
      const command = new GetProductsCommand(
        parseInt(page as string),
        parseInt(limit as string),
        filters as Record<string, any>,
        sort as Record<string, 1 | -1 | "asc" | "desc">
      );
      const products = await this.commandBus.execute(command);
      res.status(200).json({
        success: true,
        data: products,
        message: "Products fetched successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch products",
      });
    }
  }
}
