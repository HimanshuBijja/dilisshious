import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongoose";
import Subscription from "@/lib/db/models/subscription";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  await connectDB();
  const subscriptions = await Subscription.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ subscriptions });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  const body = await req.json();
  const { bundleId, bundleName, planId, planName, frequency, bundlePrice, addOns, total } = body;

  if (!bundleId || !planId || !bundlePrice) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await connectDB();
  const subscription = await Subscription.create({
    userId,
    bundleId,
    bundleName,
    planId,
    planName,
    frequency,
    bundlePrice,
    addOns: addOns || [],
    total,
    status: "active",
  });

  return NextResponse.json({ subscription });
}
