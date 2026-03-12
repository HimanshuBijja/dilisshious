import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOrdersByUser } from "@/lib/db/actions/order-actions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id || session.user.email || "";
    const orders = await getOrdersByUser(userId);

    return NextResponse.json({ orders });
  } catch (error: unknown) {
    console.error("Fetch user orders error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
