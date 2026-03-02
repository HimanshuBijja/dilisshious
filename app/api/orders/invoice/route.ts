import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { orderId, email, customerName, items, address, deliveryMethod, deliveryCost, subtotal, total } =
      await req.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "Order ID and email are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const itemsRows = items
      .map(
        (item: { name: string; volume: string; quantity: number; price: number }) =>
          `<tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f0e6d8;">${item.name} (${item.volume})</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f0e6d8; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f0e6d8; text-align: right;">₹${item.price * item.quantity}</td>
          </tr>`
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #fdf8f3; font-family: 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdf8f3; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #2d2016, #3d3026); padding: 32px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px;">Dilisshious</h1>
                  <p style="margin: 8px 0 0; font-size: 13px; color: #c8956c;">Handcrafted with Intention</p>
                </td>
              </tr>
              
              <!-- Greeting -->
              <tr>
                <td style="padding: 32px 40px 16px;">
                  <h2 style="margin: 0; font-size: 22px; color: #2d2016;">Thank you, ${customerName || "there"}! 🎉</h2>
                  <p style="margin: 8px 0 0; font-size: 14px; color: #5a4635; line-height: 1.6;">
                    Your order has been confirmed. We're preparing your treats with love and care.
                  </p>
                </td>
              </tr>

              <!-- Order ID -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <div style="background-color: #fdf8f3; border: 1px solid #f0e6d8; border-radius: 12px; padding: 16px 20px; display: inline-block;">
                    <span style="font-size: 12px; color: #5a4635; text-transform: uppercase; letter-spacing: 1px;">Order ID</span>
                    <br>
                    <span style="font-size: 18px; font-weight: 700; color: #c8956c; font-family: monospace;">${orderId}</span>
                  </div>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0e6d8; border-radius: 12px; overflow: hidden;">
                    <tr style="background-color: #fdf8f3;">
                      <td style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px;">Item</td>
                      <td style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Qty</td>
                      <td style="padding: 10px 16px; font-size: 12px; font-weight: 600; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Amount</td>
                    </tr>
                    ${itemsRows}
                  </table>
                </td>
              </tr>

              <!-- Totals -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 4px 0; font-size: 14px; color: #5a4635;">Subtotal</td>
                      <td style="padding: 4px 0; font-size: 14px; color: #5a4635; text-align: right;">₹${subtotal}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-size: 14px; color: #5a4635;">Delivery (${deliveryMethod === "express" ? "Express" : "Standard"})</td>
                      <td style="padding: 4px 0; font-size: 14px; color: #5a4635; text-align: right;">${deliveryCost === 0 ? "Free" : `₹${deliveryCost}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0 0; font-size: 18px; font-weight: 700; color: #2d2016; border-top: 2px solid #f0e6d8;">Total</td>
                      <td style="padding: 12px 0 0; font-size: 18px; font-weight: 700; color: #2d2016; text-align: right; border-top: 2px solid #f0e6d8;">₹${total}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Delivery Address -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <div style="background-color: #fdf8f3; border: 1px solid #f0e6d8; border-radius: 12px; padding: 16px 20px;">
                    <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px;">Delivering to</p>
                    <p style="margin: 0; font-size: 14px; color: #2d2016; font-weight: 600;">${address.fullName}</p>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #5a4635;">${address.address}, ${address.city}, ${address.state} - ${address.pincode}</p>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #5a4635;">${address.phone}</p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fdf8f3; padding: 24px 40px; text-align: center; border-top: 1px solid #f0e6d8;">
                  <p style="margin: 0 0 8px; font-size: 14px; color: #2d2016; font-weight: 600;">Dilisshious</p>
                  <p style="margin: 0; font-size: 12px; color: #5a4635; line-height: 1.5;">
                    Farm not pharma. Small batches. Real ingredients.<br>
                    Food that nourishes beyond the plate.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Dilisshious <noreply@dilisshious.com>",
      to: email,
      subject: `Order Confirmed — ${orderId} | Dilisshious`,
      html,
    });

    return NextResponse.json({ success: true, message: "Invoice sent" });
  } catch (error: unknown) {
    console.error("Invoice email error:", error);
    const message = error instanceof Error ? error.message : "Failed to send invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
