import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  volume: string;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  items: IOrderItem[];
  address: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    formattedAddress?: string;
  };
  deliveryMethod: "standard" | "express";
  deliveryCost: number;
  subtotal: number;
  total: number;
  couponCode?: string;
  discount?: number;
  paymentMethod: string;
  paymentScreenshot?: string;
  status: "pending" | "confirmed" | "preparing" | "dispatched" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  slug: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  volume: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      formattedAddress: { type: String },
    },
    deliveryMethod: {
      type: String,
      enum: ["standard", "express"],
      required: true,
    },
    deliveryCost: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    couponCode: { type: String },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    paymentScreenshot: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "dispatched", "delivered", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
