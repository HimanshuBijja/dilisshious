import "server-only";
import { connectDB } from "@/lib/db/mongoose";
import Order, { IOrder } from "@/lib/db/models/order";

export async function createOrder(data: {
  orderId: string;
  userId: string;
  items: IOrder["items"];
  address: IOrder["address"];
  deliveryMethod: "standard" | "express";
  deliveryCost: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentScreenshot?: string;
}): Promise<IOrder> {
  await connectDB();
  const order = await Order.create({
    ...data,
    status: "confirmed",
  });
  return order;
}

export async function getOrderById(orderId: string): Promise<IOrder | null> {
  await connectDB();
  return Order.findOne({ orderId });
}

export async function getOrdersByUser(userId: string): Promise<IOrder[]> {
  await connectDB();
  return Order.find({ userId }).sort({ createdAt: -1 });
}
