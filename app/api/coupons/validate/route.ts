import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongoose";
import Coupon from "@/lib/db/models/coupon";
import Order from "@/lib/db/models/order";

// POST — validate a coupon code for the current user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ valid: false, error: "Please sign in to apply coupons" });
    }

    const userId = (session.user as { id?: string }).id || session.user.email || "";
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: "Coupon code is required" });
    }

    await connectDB();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active" });
    }

    if (new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json({ valid: false, error: "This coupon has expired" });
    }

    if (new Date(coupon.validFrom) > new Date()) {
      return NextResponse.json({ valid: false, error: "This coupon is not yet valid" });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
    }

    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of ₹${coupon.minOrderAmount} required`,
      });
    }

    // Check firstOrderOnly
    if (coupon.firstOrderOnly) {
      const orderCount = await Order.countDocuments({ userId });
      if (orderCount > 0) {
        return NextResponse.json({ valid: false, error: "This coupon is only valid for first-time orders" });
      }
    }

    // Check perUserLimit
    if (coupon.perUserLimit > 0) {
      const userUsageCount = await Order.countDocuments({
        userId,
        couponCode: coupon.code,
      });
      if (userUsageCount >= coupon.perUserLimit) {
        return NextResponse.json({ valid: false, error: "You have already used this coupon" });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round(subtotal * (coupon.discountValue / 100));
      if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      description: coupon.description,
    });
  } catch (error: unknown) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ valid: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}
