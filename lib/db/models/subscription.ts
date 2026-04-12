import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  bundleId: string;
  bundleName: string;
  planId: string;
  planName: string;
  frequency: string;
  bundlePrice: number;
  addOns: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
  status: "active" | "paused" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, index: true },
    bundleId: { type: String, required: true },
    bundleName: { type: String, required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    frequency: { type: String, required: true },
    bundlePrice: { type: Number, required: true },
    addOns: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
