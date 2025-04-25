import { config } from "../../config/config";
import { UsersModel } from "../../infrastructure/database/mysql/model/users.model";
import { UsersRepository } from "../../infrastructure/database/mysql/repository/users.repository";
import { Password } from "../value_object/password";
import * as jwt from "jsonwebtoken";

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface IUserService {
  createUser(userData: any): Promise<UsersModel>;
  login(userData: any): Promise<TokenResponse>;
}

export class UserService implements IUserService {
  private readonly userRepository: UsersRepository = new UsersRepository();

  async createUser(userData: any): Promise<UsersModel> {
    try {
      const password = new Password(userData.password);

      const user = await this.userRepository.create({
        password_hash: password.hash(),
        ...userData,
      });
      const userDataWithoutPassword = { ...user, password_hash: "" };
      return userDataWithoutPassword;
    } catch (error) {
      throw new Error("Failed to create user: " + error);
    }
  }

  private generateTokens(user: UsersModel): TokenResponse {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiration,
    });

    return {
      accessToken,
      expiresIn: config.jwt.accessExpiration,
    };
  }

  async login(userData: any): Promise<TokenResponse> {
    try {
      const user = await this.userRepository.findByUsername(userData.username);
      if (!user) {
        throw new Error("User not found");
      }
      const password = new Password(userData.password);
      console.log(user.password_hash, password.hash());
      if (user.password_hash !== password.hash()) {
        throw new Error("Invalid password");
      }
      return this.generateTokens(user);
    } catch (error) {
      throw new Error("Failed to login: " + error);
    }
  }
}
