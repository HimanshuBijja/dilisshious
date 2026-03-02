import "server-only";
import { connectDB } from "@/lib/db/mongoose";
import User, { IAddress, IUser } from "@/lib/db/models/user";

export async function findOrCreateUser(data: {
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  provider: "google" | "phone";
}): Promise<IUser> {
  await connectDB();

  // Try to find by email or phone
  const query: Record<string, string>[] = [];
  if (data.email) query.push({ email: data.email });
  if (data.phone) query.push({ phone: data.phone });

  if (query.length > 0) {
    const existing = await User.findOne({ $or: query });
    if (existing) return existing;
  }

  const user = await User.create(data);
  return user;
}

export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB();
  return User.findById(id);
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ email });
}

export async function getUserByPhone(phone: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ phone });
}

export async function getUserAddresses(userId: string): Promise<IAddress[]> {
  await connectDB();
  const user = await User.findById(userId);
  return user?.addresses ?? [];
}

export async function addUserAddress(
  userId: string,
  address: IAddress
): Promise<IAddress[]> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // If this is the first address or marked as default, set it as default
  if (user.addresses.length === 0 || address.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
    address.isDefault = true;
  }

  user.addresses.push(address);
  await user.save();
  return user.addresses;
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  address: Partial<IAddress>
): Promise<IAddress[]> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const idx = user.addresses.findIndex(
    (a) => a._id?.toString() === addressId
  );
  if (idx === -1) throw new Error("Address not found");

  if (address.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  Object.assign(user.addresses[idx], address);
  await user.save();
  return user.addresses;
}

export async function deleteUserAddress(
  userId: string,
  addressId: string
): Promise<IAddress[]> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.addresses = user.addresses.filter(
    (a) => a._id?.toString() !== addressId
  ) as typeof user.addresses;
  await user.save();
  return user.addresses;
}
