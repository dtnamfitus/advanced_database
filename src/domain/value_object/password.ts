import crypto from "crypto";

export class Password {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public static hash(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  public static verify(password: string, hashedPassword: string): boolean {
    return this.hash(password) === hashedPassword;
  }
}
