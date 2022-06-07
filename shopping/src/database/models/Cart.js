import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    customerId: { type: String },
    items: [
      {
        product: {
          _id: { type: String, required: true },
          name: { type: String },
          description: { type: String },
          banner: { type: String },
          type: { type: String },
          unit: { type: Number },
          price: { type: Number },
          supplier: { type: String },
        },
        unit: { type: Number, require: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
    collection: "cart",
  }
);

export const CartModel = mongoose.model("cart", CartSchema);
