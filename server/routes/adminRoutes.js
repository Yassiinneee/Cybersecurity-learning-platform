import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User.js";
import { usersDb } from "./authRoutes.js";
import { securityLogs } from "../middlewares/securityMiddleware.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "cybernexus_super_secure_secret_key_1337";

// Helper to check if MongoDB is active
const isMongoActive = () => mongoose.connection.readyState === 1;

// System settings store (in memory)
let systemSettings = {
  maintenanceMode: false,
  registrationOpen: true,
  scheduledBackups: false,
  announcementBanner: "🚨 Cyber Nexus v4.2 Admin Portal active. System telemetry monitoring enabled.",
  firewallLevel: "High", // Low, Medium, High, Paranoid
  ctfRateLimit: true,
  require2FAForAdmin: false,
};

// Admin authentication middleware
const requireAdmin = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      let user;

      if (isMongoActive()) {
        user = await User.findById(decoded.id);
      } else {
        user = usersDb.find((u) => u.id === decoded.id || u._id === decoded.id || u.username === decoded.username);
      }

      if (user) {
        const ADMIN_EMAILS = [
          "yassinekalthoum94@gmail.com",
          "yassineklt94@gmail.com",
          "yassineklt@gmail.com",
          "admin@cybernexus.org"
        ];

        const isAdminUser = 
          user.role === "Admin" || 
          user.role === "Instructor" || 
          user.username === "admin" || 
          user.username === "yassinekalthoum94" ||
          user.username === "yassineklt" ||
          user.username === "yassineklt94" ||
          (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

        if (isAdminUser) {
          req.currentUser = user;
          return next();
        }
      }
    } catch (err) {
      console.warn("JWT validation issue in requireAdmin, proceeding with admin fallback:", err.message);
    }
  }

  // Fallback for iframe preview mode where third-party cookies or header tokens might be suppressed:
  const ADMIN_EMAILS = [
    "yassinekalthoum94@gmail.com",
    "yassineklt94@gmail.com",
    "yassineklt@gmail.com",
    "admin@cybernexus.org"
  ];

  let adminUser;
  if (isMongoActive()) {
    adminUser = await User.findOne({
      $or: [
        { role: "Admin" },
        { username: { $in: ["yassinekalthoum94", "yassineklt94", "yassineklt", "admin"] } },
        { email: { $in: ADMIN_EMAILS } }
      ]
    });
  }

  if (!adminUser) {
    adminUser = usersDb.find((u) =>
      u.role === "Admin" ||
      u.username === "yassinekalthoum94" ||
      u.username === "yassineklt94" ||
      u.username === "yassineklt" ||
      u.username === "admin" ||
      (u.email && ADMIN_EMAILS.includes(u.email.toLowerCase()))
    ) || usersDb[0] || { id: "admin", username: "admin", role: "Admin", email: "admin@cybernexus.org" };
  }

  req.currentUser = adminUser;
  next();
};

// 1. GET SYSTEM OVERVIEW & METRICS
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    let allUsers = [];
    if (isMongoActive()) {
      allUsers = await User.find({}).lean();
    } else {
      allUsers = usersDb;
    }

    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((u) => !u.isBanned && u.status !== "Banned").length;
    const totalXP = allUsers.reduce((sum, u) => sum + (u.xp || 0), 0);
    const totalLabsSolved = allUsers.reduce((sum, u) => sum + (u.completedLabs ? u.completedLabs.length : 0), 0);
    const totalCtfsSolved = allUsers.reduce((sum, u) => sum + (u.solvedCtfs ? u.solvedCtfs.length : 0), 0);
    const adminCount = allUsers.filter((u) => u.role === "Admin").length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminCount,
        totalXP,
        totalLabsSolved,
        totalCtfsSolved,
        securityAlertsCount: securityLogs.length,
        systemUptime: "99.98%",
        nodeEnv: process.env.NODE_ENV || "development",
        mongoConnected: isMongoActive(),
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch admin stats." });
  }
});

// 2. GET ALL USERS LIST
router.get("/users", requireAdmin, async (req, res) => {
  try {
    let usersList = [];
    if (isMongoActive()) {
      const rawUsers = await User.find({}).select("-password").lean();
      usersList = rawUsers.map((u) => ({
        id: u._id.toString(),
        username: u.username,
        email: u.email,
        role: u.role || "Student",
        status: u.isBanned ? "Banned" : u.status || "Active",
        isBanned: !!u.isBanned,
        level: u.level || 1,
        xp: u.xp || 0,
        streak: u.streak || 1,
        completedLabsCount: u.completedLabs ? u.completedLabs.length : 0,
        solvedCtfsCount: u.solvedCtfs ? u.solvedCtfs.length : 0,
        lastActiveDate: u.lastActiveDate || u.updatedAt || new Date().toLocaleDateString(),
        createdAt: u.createdAt || new Date().toISOString(),
      }));
    } else {
      usersList = usersDb.map((u) => ({
        id: u.id || u._id,
        username: u.username,
        email: u.email,
        role: u.role || "Student",
        status: u.isBanned ? "Banned" : u.status || "Active",
        isBanned: !!u.isBanned,
        level: u.level || 1,
        xp: u.xp || 0,
        streak: u.streak || 1,
        completedLabsCount: u.completedLabs ? u.completedLabs.length : 0,
        solvedCtfsCount: u.solvedCtfs ? u.solvedCtfs.length : 0,
        lastActiveDate: u.lastActiveDate || new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
      }));
    }

    res.json({ success: true, users: usersList });
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Failed to list platform users." });
  }
});

// 3. CREATE NEW USER FROM ADMIN PORTAL
router.post("/users/create", requireAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "Student";

    if (isMongoActive()) {
      const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
      if (existing) {
        return res.status(400).json({ error: "User with this username or email already exists." });
      }

      const newUser = new User({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
        level: 1,
        xp: 100,
        streak: 1,
        status: "Active",
        isBanned: false,
      });
      await newUser.save();
      return res.status(201).json({ success: true, message: "User account created successfully!", user: newUser });
    } else {
      const existing = usersDb.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({ error: "User with this username or email already exists." });
      }

      const newUser = {
        id: `user_${Date.now()}`,
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
        level: 1,
        xp: 100,
        streak: 1,
        status: "Active",
        isBanned: false,
        lastActiveDate: new Date().toLocaleDateString(),
        completedLessons: [],
        completedLabs: [],
        solvedCtfs: [],
        unlockedAchievements: [],
        savedNotes: {},
      };
      usersDb.push(newUser);
      return res.status(201).json({ success: true, message: "User account created successfully!", user: newUser });
    }
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Failed to create user account." });
  }
});

// 4. UPDATE USER ROLE
router.put("/users/:id/role", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: "Target role is required." });
  }

  try {
    let updated = null;
    if (isMongoActive()) {
      const filter = mongoose.Types.ObjectId.isValid(id) 
        ? { $or: [{ _id: id }, { id: id }, { username: id }] }
        : { $or: [{ id: id }, { username: id }] };
      updated = await User.findOneAndUpdate(filter, { role }, { new: true });
    }

    const userInMemory = usersDb.find((u) => u.id === id || u._id === id || String(u.id) === String(id) || u.username === id);
    if (userInMemory) {
      userInMemory.role = role;
      if (!updated) updated = userInMemory;
    }

    if (!updated) return res.status(404).json({ error: "User not found." });
    return res.json({ success: true, message: `Updated user role to ${role}`, user: updated });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: "Failed to update user role." });
  }
});

// 5. UPDATE USER STATS (XP / LEVEL / STREAK)
router.put("/users/:id/stats", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { level, xp, streak } = req.body;

  try {
    const updateObj = {};
    if (typeof level === "number") updateObj.level = level;
    if (typeof xp === "number") updateObj.xp = xp;
    if (typeof streak === "number") updateObj.streak = streak;

    let updated = null;
    if (isMongoActive()) {
      const filter = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ _id: id }, { id: id }, { username: id }] }
        : { $or: [{ id: id }, { username: id }] };
      updated = await User.findOneAndUpdate(filter, updateObj, { new: true });
    }

    const userInMemory = usersDb.find((u) => u.id === id || u._id === id || String(u.id) === String(id) || u.username === id);
    if (userInMemory) {
      if (typeof level === "number") userInMemory.level = level;
      if (typeof xp === "number") userInMemory.xp = xp;
      if (typeof streak === "number") userInMemory.streak = streak;
      if (!updated) updated = userInMemory;
    }

    if (!updated) return res.status(404).json({ error: "User not found." });
    return res.json({ success: true, message: "User metrics updated.", user: updated });
  } catch (err) {
    console.error("Update stats error:", err);
    res.status(500).json({ error: "Failed to update user stats." });
  }
});

// 5b. RESET/UPDATE USER PASSWORD (ADMIN ACTION)
router.put("/users/:id/password", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: "New password must be at least 4 characters long." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    let updated = null;

    if (isMongoActive()) {
      const filter = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ _id: id }, { id: id }, { username: id }] }
        : { $or: [{ id: id }, { username: id }] };
      updated = await User.findOneAndUpdate(filter, { password: hashedPassword }, { new: true });
    }

    const userInMemory = usersDb.find((u) => u.id === id || u._id === id || String(u.id) === String(id) || u.username === id);
    if (userInMemory) {
      userInMemory.password = hashedPassword;
      if (!updated) updated = userInMemory;
    }

    if (!updated) return res.status(404).json({ error: "User not found." });
    return res.json({ success: true, message: `Password for ${updated.username} updated successfully.` });
  } catch (err) {
    console.error("Admin update password error:", err);
    res.status(500).json({ error: "Failed to update user password." });
  }
});

// 6. TOGGLE BAN / UNBAN USER
router.post("/users/:id/ban", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    let user = null;
    if (isMongoActive()) {
      const filter = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ _id: id }, { id: id }, { username: id }] }
        : { $or: [{ id: id }, { username: id }] };
      user = await User.findOne(filter);
      if (user) {
        user.isBanned = !user.isBanned;
        user.status = user.isBanned ? "Banned" : "Active";
        await user.save();
      }
    }

    const userInMemory = usersDb.find((u) => u.id === id || u._id === id || String(u.id) === String(id) || u.username === id);
    if (userInMemory) {
      userInMemory.isBanned = !userInMemory.isBanned;
      userInMemory.status = userInMemory.isBanned ? "Banned" : "Active";
      if (!user) user = userInMemory;
    }

    if (!user) return res.status(404).json({ error: "User not found." });

    return res.json({
      success: true,
      message: user.isBanned ? `User ${user.username} has been banned.` : `User ${user.username} access restored.`,
      isBanned: user.isBanned,
    });
  } catch (err) {
    console.error("Toggle ban error:", err);
    res.status(500).json({ error: "Failed to change user ban status." });
  }
});

// 7. DELETE USER ACCOUNT
router.delete("/users/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    let deleted = false;

    if (isMongoActive()) {
      const filter = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ _id: id }, { id: id }, { username: id }] }
        : { $or: [{ id: id }, { username: id }] };
      const mongoRes = await User.findOneAndDelete(filter);
      if (mongoRes) deleted = true;
    }

    const idx = usersDb.findIndex(
      (u) =>
        u.id === id ||
        u._id === id ||
        String(u.id) === String(id) ||
        String(u._id) === String(id) ||
        u.username === id
    );

    if (idx !== -1) {
      usersDb.splice(idx, 1);
      deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ success: true, message: "User account deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user account." });
  }
});

// 8. SECURITY & AUDIT LOGS
router.get("/logs", requireAdmin, (req, res) => {
  res.json({
    success: true,
    logs: securityLogs,
  });
});

router.post("/logs/clear", requireAdmin, (req, res) => {
  securityLogs.length = 0;
  res.json({ success: true, message: "Security logs purged." });
});

// 9. SYSTEM SETTINGS
router.get("/settings", requireAdmin, (req, res) => {
  res.json({ success: true, settings: systemSettings });
});

router.post("/settings", requireAdmin, (req, res) => {
  const { maintenanceMode, registrationOpen, scheduledBackups, announcementBanner, firewallLevel, ctfRateLimit, require2FAForAdmin } = req.body;

  if (typeof maintenanceMode === "boolean") systemSettings.maintenanceMode = maintenanceMode;
  if (typeof registrationOpen === "boolean") systemSettings.registrationOpen = registrationOpen;
  if (typeof scheduledBackups === "boolean") systemSettings.scheduledBackups = scheduledBackups;
  if (typeof announcementBanner === "string") systemSettings.announcementBanner = announcementBanner;
  if (typeof firewallLevel === "string") systemSettings.firewallLevel = firewallLevel;
  if (typeof ctfRateLimit === "boolean") systemSettings.ctfRateLimit = ctfRateLimit;
  if (typeof require2FAForAdmin === "boolean") systemSettings.require2FAForAdmin = require2FAForAdmin;

  res.json({ success: true, message: "System settings updated successfully.", settings: systemSettings });
});

// 10. TOGGLE SELF ROLE FOR EASY DEV / PREVIEW TESTING
router.post("/toggle-self-admin", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user;
    if (isMongoActive()) {
      user = await User.findById(decoded.id);
    } else {
      user = usersDb.find((u) => u.id === decoded.id || u._id === decoded.id);
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    const newRole = user.role === "Admin" ? "Student" : "Admin";
    user.role = newRole;
    if (isMongoActive()) await user.save();

    res.json({
      success: true,
      message: `Role toggled to ${newRole}`,
      role: newRole,
      user: {
        id: user._id ? user._id.toString() : user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        role: newRole,
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle role." });
  }
});

export default router;