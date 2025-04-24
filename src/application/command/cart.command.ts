import { CartService } from "../../domain/service/cart.service";
import { CartRedisService } from "../../domain/service/cart_redis.service";

export class AddToCartCommand {
  constructor(
    public readonly userId: number,
    public readonly productId: number,
    public readonly quantity: number
  ) {}
}

export class AddToCartHandler {
  private readonly cartService: CartService = new CartService();

  async execute(command: AddToCartCommand): Promise<void> {
    await this.cartService.addToCart(
      command.userId,
      command.productId,
      command.quantity
    );
  }
}

export class UpdateCartCommand {
  constructor(
    public readonly cartId: number,
    public readonly quantity: number
  ) {}
}

export class UpdateCartHandler {
  private readonly cartService: CartService = new CartService();

  async execute(command: UpdateCartCommand): Promise<void> {
    await this.cartService.updateCart(command.cartId, command.quantity);
  }
}

export class RemoveFromCartCommand {
  constructor(public readonly cartId: number) {}
}

export class RemoveFromCartHandler {
  private readonly cartService: CartService = new CartService();

  async execute(command: RemoveFromCartCommand): Promise<void> {
    await this.cartService.removeFromCart(command.cartId);
  }
}

export class GetCartCommand {
  constructor(public readonly userId: number) {}
}
export class GetCartHandler {
  private readonly cartRedisService: CartRedisService = new CartRedisService();

  async execute(command: GetCartCommand): Promise<any[]> {
    return await this.cartRedisService.getCart(command.userId);
  }
}
