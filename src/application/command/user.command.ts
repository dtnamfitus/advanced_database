import { UserService } from "../../domain/service/user.service";
import { ICommand } from "./command_bus";

export class CreateUserCommand implements ICommand {
  constructor(public readonly userData: any) {}
}

export class CreateUserHandler {
  private readonly userService: UserService = new UserService();

  async execute(command: CreateUserCommand): Promise<any> {
    return this.userService.createUser(command.userData);
  }
}

export class LoginCommand implements ICommand {
  constructor(public readonly userData: any) {}
}

export class LoginHandler {
  private readonly userService: UserService = new UserService();

  async execute(command: LoginCommand): Promise<any> {
    return this.userService.login(command.userData);
  }
}
