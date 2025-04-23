import { Schema, model, Document } from "mongoose";

interface ICart extends Document {
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}

const CartSchema = new Schema<ICart>(
  {
    user_id: { type: Number, required: true },
    product_id: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const CartMongoModel = model<ICart>("Cart", CartSchema);
export default CartMongoModel;
