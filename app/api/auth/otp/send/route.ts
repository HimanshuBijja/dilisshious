import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Ensure +91 prefix
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

    // Validate Indian phone number
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(formattedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid Indian mobile number" },
        { status: 400 }
      );
    }

    // Lazy-init Twilio client to avoid build-time errors with placeholder creds
    const twilio = (await import("twilio")).default;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: formattedPhone,
        channel: "sms",
      });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: unknown) {
    console.error("OTP send error:", error);
    const message = error instanceof Error ? error.message : "Failed to send OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
