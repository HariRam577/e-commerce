const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===========================
   Middleware
=========================== */
// ✅ MANUAL CORS - Replace ALL cors() middleware with this
app.use((req, res, next) => {
  // Allow these exact origins
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174", // Vite sometimes uses this
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    // ✅ CRITICAL: Send the EXACT requesting origin back
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json()); // After manual CORS

// enable CORS for all routes
// app.use(express.json());
// app.options("*", cors()); // handle preflight requests globally

/* ===========================
   SMTP Configuration (Gmail)
=========================== */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

// Verify SMTP
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Error:", error.message);
  } else {
    console.log("✅ SMTP ready to send emails");
  }
});

/* ===========================
   POST /place-order
   Expects: { order, email }
=========================== */
app.post("/place-order", async (req, res) => {
  console.log("📦 Incoming order:", req.body);
  console.log("🌐 Origin:", req.headers.origin);
  console.log("📦 Request body:", req.body);
  const { order, email } = req.body || {};

  if (!order || !order.address || !order.items || !email) {
    return res.status(400).json({
      success: false,
      message: "Invalid order data",
    });
  }

  const safeTotal = Number(order.total || 0);
  const safeStatus = order.status || "Order Placed";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
          <tr>
            <td align="center" style="background-color:#4f46e5;padding:24px 20px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">Order Confirmed</h1>
              <p style="margin:8px 0 0 0;color:#e0e7ff;font-size:14px;">
                Thank you for shopping with Shophub
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 20px;font-family:Arial,sans-serif;color:#111827;font-size:14px;line-height:1.5;">
              <p style="margin:0 0 16px 0;font-size:16px;"><strong>Hello ${
                order.address.name
              },</strong></p>
              <p>Your order has been successfully placed. Below are your order details:</p>

              <h3 style="margin:0 0 10px 0;font-size:16px;">Delivery Details</h3>
              <p><strong>Name:</strong> ${order.address.name}</p>
              <p><strong>Phone:</strong> ${order.address.phone}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Address:</strong></p>
              <p>${order.address.street}, ${order.address.city}, ${
    order.address.state
  } - ${order.address.pincode}</p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:18px 0;" />

              <h3 style="margin:0 0 10px 0;font-size:16px;">Order Summary</h3>
              <table role="presentation" width="100%" cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;">
                ${order.items
                  .map(
                    (item) => `<tr>
                      <td style="border-bottom:1px solid #e5e7eb;">${
                        item.title
                      } × ${item.quantity || 1}</td>
                      <td align="right" style="border-bottom:1px solid #e5e7eb;">₹${(
                        Number(item.price || 0) * (item.quantity || 1)
                      ).toFixed(2)}</td>
                    </tr>`
                  )
                  .join("")}
              </table>

              <p style="margin:18px 0 6px 0;font-size:16px;"><strong>Total:</strong> <span style="float:right;">₹${safeTotal.toFixed(
                2
              )}</span></p>
              <div style="clear:both;"></div>

              <p><strong>Status:</strong> ${safeStatus}</p>
              <p>We’ll notify you once your order is shipped.</p>
              <p>Thanks &amp; regards,<br /><strong>Shophub Team</strong></p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:#f9fafb;padding:14px 10px;font-size:12px;color:#6b7280;">
              © ${new Date().getFullYear()} Shophub. All rights reserved.
            </td>
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
   Start Server
=========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
