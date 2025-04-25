import {
  CreateProductDto,
  UpdateProductDto,
} from "../../application/dto/products.dto";
import { ProductsModel } from "../../infrastructure/database/mysql/model/product.model";
import { ProductsRepository } from "../../infrastructure/database/mysql/repository/products.repository";

export interface IProductService {
  createProduct(productData: CreateProductDto): Promise<ProductsModel>;
  updateProduct(
    id: number,
    productData: UpdateProductDto
  ): Promise<ProductsModel | null>;
  updateProductStock(
    id: number,
    quantity: number
  ): Promise<ProductsModel | null>;
  deleteProduct(id: number): Promise<boolean>;
}

export class ProductService implements IProductService {
  private productsRepository = new ProductsRepository();

  async createProduct(productData: CreateProductDto): Promise<ProductsModel> {
    try {
      const product = await this.productsRepository.create(productData);
      return product;
    } catch (error) {
      throw new Error("Failed to create product: " + error);
    }
  }

  async updateProduct(
    id: number,
    productData: UpdateProductDto
  ): Promise<ProductsModel | null> {
    try {
      const product = await this.productsRepository.update(id, productData);
      return product;
    } catch (error) {
      throw new Error("Failed to update product: " + error);
    }
  }

  async updateProductStock(
    id: number,
    quantity: number
  ): Promise<ProductsModel | null> {
    try {
      const product = await this.productsRepository.updateStock(id, quantity);
      return product;
    } catch (error) {
      throw new Error("Failed to update product stock: " + error);
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      await this.productsRepository.delete(id);
      return true;
    } catch (error) {
      throw new Error("Failed to delete product: " + error);
    }
  }
}
