import { ProductService } from "../../domain/service/products.service";
import { ProductMongoService } from "../../domain/service/products_mongo.service";
import { ICommand, ICommandHandler } from "./command_bus";

export class CreateProductCommand implements ICommand {
  constructor(public readonly productData: any) {}
}

export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  private productService = new ProductService();

  async execute(command: CreateProductCommand): Promise<any> {
    return this.productService.createProduct(command.productData);
  }
}

export class UpdateProductCommand implements ICommand {
  constructor(public readonly id: number, public readonly productData: any) {}
}

export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  private productService = new ProductService();

  async execute(command: UpdateProductCommand): Promise<any> {
    return this.productService.updateProduct(command.id, command.productData);
  }
}

export class UpdateStockCommand implements ICommand {
  constructor(public readonly id: number, public readonly quantity: number) {}
}

export class UpdateStockHandler implements ICommandHandler<UpdateStockCommand> {
  private productService = new ProductService();

  async execute(command: UpdateStockCommand): Promise<any> {
    return this.productService.updateProductStock(command.id, command.quantity);
  }
}

export class DeleteProductCommand implements ICommand {
  constructor(public readonly id: number) {}
}

export class DeleteProductHandler
  implements ICommandHandler<DeleteProductCommand>
{
  private productService = new ProductService();

  async execute(command: DeleteProductCommand): Promise<any> {
    return this.productService.deleteProduct(command.id);
  }
}

export class GetProductCommand implements ICommand {
  constructor(
    public readonly keyword: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly sort: Record<string, 1 | -1 | "asc" | "desc">
  ) {}
}

export class GetProductHandler implements ICommandHandler<GetProductCommand> {
  private productMongoService = new ProductMongoService();

  async execute(command: GetProductCommand): Promise<any> {
    return this.productMongoService.GetProducts(
      command.keyword,
      command.page,
      command.limit,
      command.sort
    );
  }
}
