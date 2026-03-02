import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddress {
  _id?: string;
  label?: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  provider: "google" | "phone";
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  label: { type: String, default: "Home" },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  formattedAddress: { type: String },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true },
    phone: { type: String, sparse: true },
    image: { type: String },
    provider: { type: String, enum: ["google", "phone"], required: true },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

// Create indexes
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
