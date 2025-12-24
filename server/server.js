const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

/* ===========================
   MANUAL CORS
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
   🔐 HARDCODED EMAIL CONFIG
=========================== */
const EMAIL_USER = "hariram.dev18@gmail.com";
const EMAIL_PASS = "cdgfyhqeyknbphbh"; // 🔴 use new one

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/* ===========================
   SMTP VERIFY
=========================== */
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

/* ===========================
   PLACE ORDER
=========================== */
app.post("/place-order", async (req, res) => {
  const { order, email } = req.body || {};

  if (!order || !order.address || !order.items || !email) {
    return res.status(400).json({
      success: false,
      message: "Invalid order data",
    });
  }

  const html = `
    <h2>Order Confirmed</h2>
    <p>Hello ${order.address.name}</p>
    <p>Total: ₹${order.total}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Shophub" <${EMAIL_USER}>`,
      to: email,
      subject: "Shophub | Order Confirmation",
      html,
    });

    res.json({
      success: true,
      message: "Order placed & email sent",
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
      from: `"Shophub" <${EMAIL_USER}>`,
      to: email,
      subject: "Shophub | Test Email",
      html: "<h3>Test email successful ✅</h3>",
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
   START SERVER
=========================== */
const PORT = 5000; // ignored on Vercel, works locally
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
