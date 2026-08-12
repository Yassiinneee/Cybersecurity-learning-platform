import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { usersDb } from "./authRoutes.js";

const router = Router();

const isMongoActive = () => mongoose.connection.readyState === 1;

// In-memory payment transactions store
export let paymentsDb = [
  {
    id: "pay_sample_1",
    userId: "user_student_1",
    username: "hax0r_god",
    userEmail: "hax0r@cybernexus.org",
    courseId: "expert-vpn-port-sec",
    courseTitle: "VPN Creation & Port Security",
    txId: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    network: "POLYGON",
    cryptoToken: "USDT",
    amountCrypto: "10.00",
    amountUsd: 10,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Helper middleware to check admin
const requireAdmin = (req, res, next) => {
  const role = req.headers["x-user-role"] || req.user?.role;
  const username = req.headers["x-user-name"] || req.user?.username;
  const adminEmails = ["yassinekalthoum94@gmail.com", "yassineklt94@gmail.com", "admin@cybernexus.org"];
  const userEmail = req.headers["x-user-email"] || req.user?.email;

  const isAdmin =
    role === "Admin" ||
    username === "admin" ||
    username === "yassinekalthoum94" ||
    username === "yassineklt94" ||
    (userEmail && adminEmails.includes(userEmail.toLowerCase()));

  if (!isAdmin) {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
  next();
};

// 1. DYNAMIC CRYPTO RATES ($10 USD equivalent)
router.get("/rates", async (req, res) => {
  try {
    let bnbUsd = 580.0;
    let ltcUsd = 68.0;
    let usdtUsd = 1.0;

    try {
      const cgRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,litecoin,tether&vs_currencies=usd", { signal: AbortSignal.timeout(3000) });
      if (cgRes.ok) {
        const data = await cgRes.json();
        if (data.binancecoin?.usd) bnbUsd = data.binancecoin.usd;
        if (data.litecoin?.usd) ltcUsd = data.litecoin.usd;
        if (data.tether?.usd) usdtUsd = data.tether.usd;
      }
    } catch (_) {
      // Fallback to stable default market estimates
    }

    const bnbAmount = (10 / bnbUsd).toFixed(4);
    const ltcAmount = (10 / ltcUsd).toFixed(4);
    const usdtAmount = (10 / usdtUsd).toFixed(2);

    res.json({
      success: true,
      rates: { BNB: bnbUsd, LTC: ltcUsd, USDT: usdtUsd },
      cryptoAmounts: {
        USDT: usdtAmount,
        BNB: bnbAmount,
        LTC: ltcAmount
      },
      addresses: {
        USDT_POLYGON: "0x50ad85d9488ef6b690834c20635b1a6fbc97e545",
        BNB_BEP20: "0x50ad85d9488ef6b690834c20635b1a6fbc97e545",
        LTC_NATIVE: "MGDCwiQm7o4v7Tgp9Y8LKLWnRpUvvvCy7V"
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

// 2. SUBMIT PAYMENT PROOF
router.post("/submit", async (req, res) => {
  const { userId, username, userEmail, courseId, courseTitle, txId, network, cryptoToken, amountCrypto } = req.body;

  if (!courseId || !txId || !txId.trim()) {
    return res.status(400).json({ error: "Transaction ID and Course ID are required." });
  }

  const cleanTxId = txId.trim();

  // Check if txId already submitted
  const existing = paymentsDb.find((p) => p.txId.toLowerCase() === cleanTxId.toLowerCase() && p.courseId === courseId);
  if (existing) {
    return res.status(400).json({ error: "This Transaction ID has already been submitted for this course." });
  }

  const newPayment = {
    id: "pay_" + Date.now(),
    userId: userId || "user_" + Date.now(),
    username: username || "Operative",
    userEmail: userEmail || "",
    courseId,
    courseTitle: courseTitle || courseId,
    txId: cleanTxId,
    network: network || "POLYGON",
    cryptoToken: cryptoToken || "USDT",
    amountCrypto: amountCrypto || "10.00",
    amountUsd: 10,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  paymentsDb.unshift(newPayment);

  return res.json({
    success: true,
    message: "Payment submitted successfully! Admin verification pending.",
    payment: newPayment
  });
});

// 3. GET USER PAYMENTS STATUS
router.get("/user/:username", (req, res) => {
  const { username } = req.params;
  const userPayments = paymentsDb.filter((p) => p.username.toLowerCase() === username.toLowerCase());
  res.json({ success: true, payments: userPayments });
});

// 4. ADMIN GET ALL PAYMENTS
router.get("/all", requireAdmin, (req, res) => {
  res.json({ success: true, payments: paymentsDb });
});

// 5. ADMIN APPROVE PAYMENT & UNLOCK COURSE
router.put("/:id/approve", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const payment = paymentsDb.find((p) => p.id === id);

  if (!payment) {
    return res.status(404).json({ error: "Payment record not found." });
  }

  payment.status = "approved";
  payment.approvedAt = new Date().toISOString();

  // Unlock course in memory user
  const userInMemory = usersDb.find(
    (u) => u.username.toLowerCase() === payment.username.toLowerCase() || (u.email && u.email.toLowerCase() === payment.userEmail.toLowerCase())
  );
  if (userInMemory) {
    if (!userInMemory.unlockedCourses) userInMemory.unlockedCourses = [];
    if (!userInMemory.unlockedCourses.includes(payment.courseId)) {
      userInMemory.unlockedCourses.push(payment.courseId);
    }
  }

  // Unlock course in MongoDB if active
  if (isMongoActive()) {
    try {
      await User.findOneAndUpdate(
        { $or: [{ username: payment.username }, { email: payment.userEmail }] },
        { $addToSet: { unlockedCourses: payment.courseId } }
      );
    } catch (err) {
      console.warn("MongoDB course unlock update note:", err.message);
    }
  }

  res.json({
    success: true,
    message: `Payment approved! Course '${payment.courseTitle}' unlocked for ${payment.username}.`,
    payment
  });
});

// 6. ADMIN REJECT PAYMENT
router.put("/:id/reject", requireAdmin, (req, res) => {
  const { id } = req.params;
  const payment = paymentsDb.find((p) => p.id === id);

  if (!payment) {
    return res.status(404).json({ error: "Payment record not found." });
  }

  payment.status = "rejected";
  payment.rejectedAt = new Date().toISOString();

  res.json({
    success: true,
    message: `Payment rejected for ${payment.username}.`,
    payment
  });
});

export default router;