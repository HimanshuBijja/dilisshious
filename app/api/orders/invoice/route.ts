import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    // Get the customer's actual email from the server-side session (Google sign-in)
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email;

    const { orderId, customerName, items, address, deliveryMethod, deliveryCost, subtotal, total } =
      await req.json();

    // Use session email (Google sign-in) as the customer email — never trust client-sent email
    const email = sessionEmail;

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "Order ID and authenticated email are required" },
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
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0e6d8; font-size: 14px; color: #2d2016;">${escapeHtml(item.name)} <span style="color: #5a4635; font-size: 12px;">(${escapeHtml(item.volume)})</span></td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0e6d8; text-align: center; font-size: 14px; color: #2d2016;">${item.quantity}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0e6d8; text-align: right; font-size: 14px; font-weight: 600; color: #2d2016;">₹${item.price * item.quantity}</td>
          </tr>`
      )
      .join("");

    const orderDate = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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
                    Your order has been confirmed and we're already preparing your treats fresh with love and care.
                  </p>
                </td>
              </tr>

              <!-- Order ID & Date -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #fdf8f3; border: 1px solid #f0e6d8; border-radius: 12px; padding: 16px 20px; width: 48%;">
                        <span style="font-size: 11px; color: #5a4635; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order ID</span>
                        <br>
                        <span style="font-size: 18px; font-weight: 700; color: #c8956c; font-family: monospace;">${orderId}</span>
                      </td>
                      <td style="width: 4%"></td>
                      <td style="background-color: #fdf8f3; border: 1px solid #f0e6d8; border-radius: 12px; padding: 16px 20px; width: 48%;">
                        <span style="font-size: 11px; color: #5a4635; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Date</span>
                        <br>
                        <span style="font-size: 14px; font-weight: 600; color: #2d2016;">${orderDate}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #5a4635; text-transform: uppercase; letter-spacing: 1px;">Order Details</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0e6d8; border-radius: 12px; overflow: hidden;">
                    <tr style="background-color: #fdf8f3;">
                      <td style="padding: 10px 16px; font-size: 11px; font-weight: 700; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px;">Item</td>
                      <td style="padding: 10px 16px; font-size: 11px; font-weight: 700; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Qty</td>
                      <td style="padding: 10px 16px; font-size: 11px; font-weight: 700; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Amount</td>
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
                      <td style="padding: 6px 0; font-size: 14px; color: #5a4635;">Subtotal</td>
                      <td style="padding: 6px 0; font-size: 14px; color: #5a4635; text-align: right;">₹${subtotal}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-size: 14px; color: #5a4635;">Delivery (${deliveryMethod === "express" ? "Express" : "Standard"})</td>
                      <td style="padding: 6px 0; font-size: 14px; color: #5a4635; text-align: right;">${deliveryCost === 0 ? "Free" : `₹${deliveryCost}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 14px 0 0; font-size: 20px; font-weight: 700; color: #2d2016; border-top: 2px solid #f0e6d8;">Total Paid</td>
                      <td style="padding: 14px 0 0; font-size: 20px; font-weight: 700; color: #2d2016; text-align: right; border-top: 2px solid #f0e6d8;">₹${total}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Payment & Delivery Info -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background-color: #fdf8f3; border: 1px solid #f0e6d8; border-radius: 12px; padding: 16px 20px; width: 48%;">
                        <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</p>
                        <p style="margin: 0; font-size: 14px; color: #2d2016; font-weight: 600;">UPI Payment</p>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #c8956c;">✓ Screenshot submitted</p>
                      </td>
                      <td style="width: 4%"></td>
                      <td style="background-color: #fdf8f3; border: 1px solid #f0e6d8; border-radius: 12px; padding: 16px 20px; width: 48%;">
                        <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Method</p>
                        <p style="margin: 0; font-size: 14px; color: #2d2016; font-weight: 600;">${deliveryMethod === "express" ? "Express Delivery" : "Standard Delivery"}</p>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #5a4635;">${deliveryMethod === "express" ? "Same day / Next day" : "Wed & Sun schedule"}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Delivery Address -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <div style="background-color: #fdf8f3; border: 1px solid #f0e6d8; border-radius: 12px; padding: 16px 20px;">
                    <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #5a4635; text-transform: uppercase; letter-spacing: 0.5px;">Delivering to</p>
                    <p style="margin: 0; font-size: 15px; color: #2d2016; font-weight: 600;">${escapeHtml(address.fullName)}</p>
                    <p style="margin: 6px 0 0; font-size: 13px; color: #5a4635;">${escapeHtml(address.address)}, ${escapeHtml(address.city)}, ${escapeHtml(address.state)} - ${escapeHtml(address.pincode)}</p>
                    ${address.formattedAddress ? `<p style="margin: 4px 0 0; font-size: 12px; color: #5a4635; font-style: italic;">📍 ${escapeHtml(address.formattedAddress)}</p>` : ""}
                    ${address.latitude && address.longitude ? `<p style="margin: 4px 0 0;"><a href="https://www.google.com/maps?q=${address.latitude},${address.longitude}" target="_blank" style="font-size: 12px; color: #c8956c; text-decoration: underline;">View on Google Maps</a></p>` : ""}
                    <p style="margin: 4px 0 0; font-size: 13px; color: #5a4635;">📞 ${escapeHtml(address.phone)}</p>
                    ${address.email ? `<p style="margin: 4px 0 0; font-size: 13px; color: #5a4635;">✉️ ${escapeHtml(address.email)}</p>` : ""}
                  </div>
                </td>
              </tr>

              <!-- What's Next -->
              <tr>
                <td style="padding: 0 40px 24px;">
                  <div style="background: linear-gradient(135deg, #c8956c15, #c8956c08); border: 1px solid #c8956c30; border-radius: 12px; padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #2d2016; font-weight: 700;">What happens next? 📦</p>
                    <p style="margin: 0; font-size: 13px; color: #5a4635; line-height: 1.6;">
                      We'll verify your payment and begin preparing your treats fresh. You'll receive updates at <strong>${email}</strong>. Your order will be delivered on the next scheduled delivery day.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Thank You -->
              <tr>
                <td style="padding: 0 40px 32px; text-align: center;">
                  <p style="margin: 0; font-size: 16px; color: #2d2016; font-weight: 600;">
                    Thank you for choosing Dilisshious! 💛
                  </p>
                  <p style="margin: 8px 0 0; font-size: 13px; color: #5a4635;">
                    Every bite is crafted with real ingredients and real love.
                  </p>
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

    const fromAddress = process.env.SMTP_FROM || "Dilisshious <noreply@dilisshious.com>";
    const adminEmail = process.env.SMTP_USER;

    // Send email to customer
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: `Order Confirmed — ${orderId} | Dilisshious`,
      html,
    });

    // Send email to admin (always notify owner of new orders)
    if (adminEmail) {
      await transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        subject: `🆕 New Order — ${orderId} | ${customerName || "Customer"} | ₹${total}`,
        html,
      });
    }

    return NextResponse.json({ success: true, message: "Invoice sent" });
  } catch (error: unknown) {
    console.error("Invoice email error:", error);
    const message = error instanceof Error ? error.message : "Failed to send invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
