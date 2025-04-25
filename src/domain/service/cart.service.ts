import { CartsModel } from "../../infrastructure/database/mysql/model/cart.model";
import { CartsRepository } from "../../infrastructure/database/mysql/repository/cart.repository";
import { ProductsRepository } from "../../infrastructure/database/mysql/repository/products.repository";

export class CartService {
  private readonly cartRepository: CartsRepository;
  private readonly productRepository: ProductsRepository;

  constructor() {
    this.cartRepository = new CartsRepository();
    this.productRepository = new ProductsRepository();
  }

  async addToCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<CartsModel> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const newCart = await this.cartRepository.create({
        user_id: userId,
        product_id: productId,
        quantity: quantity,
        price: product.price,
      });
      if (!newCart) {
        throw new Error("Failed to add to cart");
      }
      return newCart;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding to cart:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to add to cart: " + error);
    }
  }

  async updateCart(cartId: number, quantity: number): Promise<CartsModel> {
    try {
      const cart = await this.cartRepository.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      cart.quantity = quantity;
      return this.cartRepository.update(cart);
    } catch (error) {
      throw new Error("Failed to update cart: " + error);
    }
  }

  async removeFromCart(cartId: number): Promise<boolean> {
    try {
      const cart = await this.cartRepository.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      await this.cartRepository.delete(cart);
      return true;
    } catch (error) {
      throw new Error("Failed to remove from cart: " + error);
    }
  }
}
