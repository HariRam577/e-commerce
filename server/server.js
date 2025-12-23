const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===========================
   Middleware
=========================== */
app.use(express.json());

// Allow CORS for your frontend domain (update this in production)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // your live frontend URL
    credentials: true,
  })
);

/* ===========================
   SMTP Configuration (Gmail)
=========================== */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Gmail
    pass: process.env.EMAIL_PASS, // App password
  },
});

// Verify SMTP connection
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Error:", error.message);
  } else {
    console.log("✅ SMTP ready to send emails");
  }
});

/* ===========================
   Test GET Route (Optional)
=========================== */
app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Shophub" <${process.env.EMAIL_USER}>`,
      to: "test@example.com",
      subject: "Test Email",
      html: "<h1>Shophub Test Email</h1><p>This is a test.</p>",
    });
    res.json({ success: true, message: "Test email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===========================
   POST /place-order
=========================== */
app.post("/place-order", async (req, res) => {
  const { order, email } = req.body || {};

  if (!order || !order.address || !order.items || !email) {
    return res.status(400).json({
      success: false,
      message: "Invalid order data",
    });
  }

  const safeTotal = Number(order.total || 0);
  const safeStatus = order.status || "Order Placed";

  // HTML email template
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="background-color:#4f46e5;padding:24px 20px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-family:Arial,Helvetica,sans-serif;">Order Confirmed</h1>
              <p style="margin:8px 0 0 0;color:#e0e7ff;font-size:14px;font-family:Arial,Helvetica,sans-serif;">Thank you for shopping with Shophub</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 20px 28px 20px;font-family:Arial,Helvetica,sans-serif;color:#111827;font-size:14px;line-height:1.5;">
              <p style="margin:0 0 16px 0;font-size:16px;"><strong>Hello ${
                order.address.name
              },</strong></p>
              <p style="margin:0 0 20px 0;font-size:14px;">Your order has been successfully placed. Below are your order details:</p>

              <h3 style="margin:0 0 10px 0;font-size:16px;color:#111827;">Delivery Details</h3>
              <p style="margin:0 0 4px 0;"><strong>Name:</strong> ${
                order.address.name
              }</p>
              <p style="margin:0 0 4px 0;"><strong>Phone:</strong> ${
                order.address.phone
              }</p>
              <p style="margin:0 0 4px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin:10px 0 4px 0;"><strong>Address:</strong></p>
              <p style="margin:0 0 16px 0;">${order.address.street},<br/>${
    order.address.city
  }, ${order.address.state} - ${order.address.pincode}</p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;" />

              <h3 style="margin:0 0 10px 0;font-size:16px;color:#111827;">Order Summary</h3>
              <table role="presentation" width="100%" cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;">
                ${order.items
                  .map(
                    (item) => `<tr>
                      <td style="border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${
                        item.title
                      } × ${item.quantity || 1}</td>
                      <td align="right" style="border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">₹${(
                        Number(item.price || 0) * (item.quantity || 1)
                      ).toFixed(2)}</td>
                    </tr>`
                  )
                  .join("")}
              </table>

              <p style="margin:18px 0 6px 0;font-size:16px;">
                <strong>Total:</strong>
                <span style="float:right;">₹${safeTotal.toFixed(2)}</span>
              </p>
              <div style="clear:both;"></div>

              <p style="margin:8px 0 0 0;font-size:14px;"><strong>Status:</strong> ${safeStatus}</p>
              <p style="margin:22px 0 0 0;font-size:14px;">We’ll notify you once your order is shipped.</p>
              <p style="margin:16px 0 0 0;font-size:14px;">Thanks &amp; regards,<br/><strong>Shophub Team</strong></p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:#f9fafb;padding:14px 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">© ${new Date().getFullYear()} Shophub. All rights reserved.</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Shophub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shophub | Order Confirmation",
      html,
    });

    // Return orderId so frontend can remove from cart
    return res.json({
      success: true,
      message: "Order placed & email sent successfully",
      orderId: order.id,
    });
  } catch (err) {
    console.error("📧 Mail error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Mail sending failed",
    });
  }
});

/* ===========================
   Server Start
=========================== */
const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 for live/public access
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on http://0.0.0.0:${PORT}`);
});
