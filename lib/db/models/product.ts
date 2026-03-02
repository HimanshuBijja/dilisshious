import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductVolume {
  label: string;
  price: number;
  originalPrice?: number;
}

export interface IProduct extends Document {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  volumes: IProductVolume[];
  description: string;
  ingredients: string;
  howToEnjoy: string;
  storage: string;
  bestBefore: string;
  deliveryDetails: string;
  tags: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVolumeSchema = new Schema<IProductVolume>({
  label: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
});

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    volumes: { type: [ProductVolumeSchema], required: true },
    description: { type: String, required: true },
    ingredients: { type: String, default: "" },
    howToEnjoy: { type: String, default: "" },
    storage: { type: String, default: "" },
    bestBefore: { type: String, default: "" },
    deliveryDetails: { type: String, default: "" },
    tags: { type: [String], default: [] },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
