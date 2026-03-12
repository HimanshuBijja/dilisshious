import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id || session.user.email || "";
    await connectDB();
    const orderCount = await Order.countDocuments({ userId });

    return NextResponse.json({ isFirstOrder: orderCount === 0 });
  } catch (error: unknown) {
    console.error("First order check error:", error);
    const message = error instanceof Error ? error.message : "Failed to check order status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
