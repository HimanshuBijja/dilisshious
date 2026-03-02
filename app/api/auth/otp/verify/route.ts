import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone and OTP code are required" },
        { status: 400 }
      );
    }

    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

    // Lazy-init Twilio client to avoid build-time errors with placeholder creds
    const twilio = (await import("twilio")).default;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: formattedPhone,
        code,
      });

    if (verification.status === "approved") {
      return NextResponse.json({
        success: true,
        verified: true,
        phone: formattedPhone,
      });
    }

    return NextResponse.json(
      { error: "Invalid OTP. Please try again." },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("OTP verify error:", error);
    const message = error instanceof Error ? error.message : "Failed to verify OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
