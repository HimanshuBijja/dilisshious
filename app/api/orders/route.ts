import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createOrder } from "@/lib/db/actions/order-actions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, address, deliveryMethod, deliveryCost, subtotal, total, paymentMethod } = body;

    if (!items?.length || !address || !deliveryMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderId = "DLS" + Date.now().toString(36).toUpperCase();
    const userId = (session.user as { id?: string }).id || session.user.email || "";

    const order = await createOrder({
      orderId,
      userId,
      items,
      address,
      deliveryMethod,
      deliveryCost,
      subtotal,
      total,
      paymentMethod,
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      id: order._id,
    });
  } catch (error: unknown) {
    console.error("Order creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
