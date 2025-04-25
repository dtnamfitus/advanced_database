import crypto from "crypto";

export class Password {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public hash(): string {
    return crypto.createHash("sha256").update(this.value).digest("hex");
  }

  public verify(hashedPassword: string): boolean {
    return this.hash() === hashedPassword;
  }
}
