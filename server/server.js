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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:#4f46e5;padding:24px;text-align:center;color:#ffffff;">
              <h1 style="margin:0;font-size:24px;">Shophub</h1>
              <p style="margin:6px 0 0;font-size:14px;color:#e0e7ff;">
                Order Confirmation
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:24px;color:#111827;font-size:14px;line-height:1.6;">
              <p style="font-size:16px;margin-top:0;">
                Hello <strong>${order.address.name}</strong>,
              </p>

              <p>
                Thank you for shopping with <strong>Shophub</strong>.
                Your order has been successfully placed.
              </p>

              <!-- DELIVERY DETAILS -->
              <h3 style="margin:20px 0 8px;font-size:16px;">Delivery Details</h3>
              <p style="margin:4px 0;"><strong>Name:</strong> ${
                order.address.name
              }</p>
              <p style="margin:4px 0;"><strong>Phone:</strong> ${
                order.address.phone
              }</p>
              <p style="margin:4px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin:4px 0;">
                <strong>Address:</strong><br/>
                ${order.address.street}, ${order.address.city},
                ${order.address.state} - ${order.address.pincode}
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

              <!-- ORDER SUMMARY -->
              <h3 style="margin:0 0 10px;font-size:16px;">Order Summary</h3>
              <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td style="border-bottom:1px solid #e5e7eb;">
                      ${item.title} × ${item.quantity || 1}
                    </td>
                    <td align="right" style="border-bottom:1px solid #e5e7eb;">
                      ₹${(
                        Number(item.price || 0) * (item.quantity || 1)
                      ).toFixed(2)}
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </table>

              <!-- TOTAL -->
              <p style="margin:16px 0 6px;font-size:16px;">
                <strong>Total:</strong>
                <span style="float:right;">₹${Number(order.total).toFixed(
                  2
                )}</span>
              </p>
              <div style="clear:both;"></div>

              <p style="margin:6px 0;">
                <strong>Status:</strong> ${order.status || "Order Placed"}
              </p>

              <p style="margin-top:20px;">
                We will notify you once your order is shipped.
              </p>

              <p>
                Thanks &amp; Regards,<br/>
                <strong>Shophub Team</strong>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb;text-align:center;padding:14px;font-size:12px;color:#6b7280;">
              © ${new Date().getFullYear()} Shophub. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
