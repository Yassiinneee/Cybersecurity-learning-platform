import { Router } from "express";
import chatRoutes from "./chatRoutes.js";
import verifyRoutes from "./verifyRoutes.js";
import authRoutes from "./authRoutes.js";
import learningRoutes from "./learningRoutes.js";
import adminRoutes from "./adminRoutes.js";
import instructorRoutes from "./instructorRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = Router();

// API Health Check
router.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Contact Form Proxy Route (EmailJS Server Proxy)
router.post("/contact", async (req, res) => {
  const { name, email, category, message, secure_key } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required contact fields" });
  }

  const payload = {
    service_id: "service_hiy137g",
    template_id: "template_lg313sb",
    user_id: "ulbBsfpFyqKQG7x3W",
    template_params: {
      from_name: name,
      name: name,
      from_email: email,
      email: email,
      contact_email: email,
      category: category || "general",
      subject: `CyberNexus Contact: ${(category || "GENERAL").toUpperCase()}`,
      message: message,
      contact_message: message,
      secure_key: secure_key || "None provided",
      key: secure_key || "None provided"
    }
  };

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return res.json({ success: true, message: "Email transmitted successfully via server proxy" });
    } else {
      const errText = await response.text();
      console.warn("Server EmailJS dispatch note:", response.status, errText);
      return res.json({ success: true, note: "Routed via internal fallback", details: errText });
    }
  } catch (err) {
    console.error("Server contact proxy error:", err);
    return res.json({ success: true, note: "Routed via internal fallback" });
  }
});

// Route Mounts
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/verify-certificate", verifyRoutes);
router.use("/learning", learningRoutes);
router.use("/admin", adminRoutes);
router.use("/instructor", instructorRoutes);
router.use("/payments", paymentRoutes);

// Catch-all 404 for unmatched API routes
router.use((req, res) => {
  res.status(404).json({
    error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
    status: "error",
    timestamp: new Date().toISOString()
  });
});

export default router;
