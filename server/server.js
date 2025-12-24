const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* ===========================
   MANUAL CORS (Vercel Safe)
=========================== */
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "https://e-commerce-sooty-xi.vercel.app",
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

/* ===========================
   SMTP CONFIG (GMAIL – VERCEL SAFE)
=========================== */
const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ IMPORTANT FOR VERCEL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/* ===========================
   SMTP VERIFY
=========================== */
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP ready");
  }
});

/* ===========================
   ENV CHECK (DEBUG ROUTE)
=========================== */
app.get("/env-check", (req, res) => {
  res.json({
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_PASS: !!process.env.EMAIL_PASS,
  });
});

/* ===========================
   PLACE ORDER
=========================== */
app.post("/place-order", async (req, res) => {
  console.log("📦 Incoming Order:", req.body);

  const { order, email } = req.body || {};

  if (!order || !order.address || !order.items || !email) {
    return res.status(400).json({
      success: false,
      message: "Invalid order data",
    });
  }

  const safeTotal = Number(order.total || 0);
  const safeStatus = order.status || "Order Placed";

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;background:#f8fafc;padding:20px">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden">
    <div style="background:#4f46e5;color:#fff;padding:20px;text-align:center">
      <h2>Order Confirmed</h2>
      <p>Thank you for shopping with Shophub</p>
    </div>

    <div style="padding:20px">
      <p><strong>Hello ${order.address.name},</strong></p>
      <p>Your order has been placed successfully.</p>

      <h3>Delivery Details</h3>
      <p>${order.address.street}, ${order.address.city}, ${
    order.address.state
  } - ${order.address.pincode}</p>
      <p>Phone: ${order.address.phone}</p>
      <p>Email: ${email}</p>

      <hr />

      <h3>Order Summary</h3>
      <table width="100%" cellpadding="6">
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>${item.title} × ${item.quantity || 1}</td>
            <td align="right">₹${(
              Number(item.price || 0) * (item.quantity || 1)
            ).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </table>

      <p style="font-size:16px"><strong>Total:</strong> ₹${safeTotal.toFixed(
        2
      )}</p>
      <p><strong>Status:</strong> ${safeStatus}</p>

      <p>Thanks,<br/>Shophub Team</p>
    </div>

    <div style="background:#f1f5f9;text-align:center;padding:10px;font-size:12px">
      © ${new Date().getFullYear()} Shophub
    </div>
  </div>
</body>
</html>
`;

  try {
    await transporter.sendMail({
      from: `"Shophub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shophub | Order Confirmation",
      html,
    });

    res.json({
      success: true,
      message: "Order placed & email sent",
      orderId: order.id,
    });
  } catch (err) {
    console.error("📧 ORDER MAIL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Mail sending failed",
    });
  }
});

/* ===========================
   TEST MAIL
=========================== */
app.get("/test-mail", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    await transporter.sendMail({
      from: `"Shophub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Shophub | Test Email",
      html: "<h2>Test Email Successful ✅</h2>",
    });

    res.json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (err) {
    console.error("📧 TEST MAIL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Test mail failed",
    });
  }
});

/* ===========================
   SERVER START
=========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
