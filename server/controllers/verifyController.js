import {
  verifyCertificate,
  generateCertificateHash,
  getCourseMetadata,
  inMemoryCertificates,
} from "../services/verificationService.js";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

/**
 * Controller to handle public certificate verification.
 * GET /api/verify-certificate/:id
 */
export async function handleVerifyCertificate(req, res, next) {
  try {
    const certId = req.params.id;
    if (!certId) {
      return res.status(400).json({ verified: false, error: "Verification ID is required." });
    }

    const verificationResult = await verifyCertificate(certId);
    return res.json(verificationResult);
  } catch (error) {
    next(error);
  }
}

/**
 * Request a certificate upon completing a path or course.
 * POST /api/verify-certificate/request
 */
export async function handleRequestCertificate(req, res, next) {
  try {
    const { username, courseId, email } = req.body;
    if (!username || !courseId) {
      return res.status(400).json({ error: "Username and courseId are required." });
    }

    const meta = getCourseMetadata(courseId);
    const certId = `CN-${username.toUpperCase()}-${courseId.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
    const hash = generateCertificateHash(username, courseId);

    // Check if certificate already exists
    let existing = null;
    try {
      existing = await Certificate.findOne({ certificateId: certId });
    } catch (_) {}

    if (!existing) {
      existing = inMemoryCertificates.find((c) => c.certificateId === certId);
    }

    if (existing) {
      return res.json({
        message: "Certificate request already exists",
        certificate: existing,
      });
    }

    // Check if requester is Admin or if user profile auto-approves
    const requesterRole = req.headers["x-user-role"] || "Student";
    const isAdmin = requesterRole === "Admin" || username === "admin" || username === "yassinekalthoum94" || username === "yassineklt";

    // Create new certificate record
    const certData = {
      certificateId: certId,
      username: username,
      userEmail: email || "",
      courseId: courseId,
      courseTitle: meta.title,
      badgeType: meta.badgeType,
      badgeIcon: meta.badgeIcon,
      issueDate: new Date(),
      issuer: "CyberNexus Academic Board & Examination Council",
      status: isAdmin ? "APPROVED" : "PENDING",
      signatureHash: hash,
      approvedBy: isAdmin ? "Admin (Auto-Issued)" : "",
      approvedAt: isAdmin ? new Date() : null,
    };

    try {
      const newCert = new Certificate(certData);
      await newCert.save();
    } catch (err) {
      console.warn("Saving cert to MongoDB failed, storing in memory:", err.message);
    }

    inMemoryCertificates.unshift(certData);

    return res.status(201).json({
      message: isAdmin
        ? "Certificate & Digital Badge issued successfully!"
        : "Certificate request submitted to Admin for verification and approval.",
      certificate: certData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all certificates and digital badges earned by a user.
 * GET /api/verify-certificate/user/:username
 */
export async function handleGetUserCertificates(req, res, next) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    let userCerts = [];
    try {
      userCerts = await Certificate.find({ username: new RegExp(`^${username}$`, "i") });
    } catch (_) {}

    const inMemUser = inMemoryCertificates.filter(
      (c) => c.username.toLowerCase() === username.toLowerCase()
    );

    // Merge without duplicates
    const certMap = new Map();
    [...userCerts, ...inMemUser].forEach((c) => {
      const obj = c.toObject ? c.toObject() : c;
      certMap.set(obj.certificateId, obj);
    });

    return res.json({ certificates: Array.from(certMap.values()) });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all certificates for Admin management.
 * GET /api/verify-certificate/all
 */
export async function handleGetAllCertificates(req, res, next) {
  try {
    let allCerts = [];
    try {
      allCerts = await Certificate.find().sort({ createdAt: -1 });
    } catch (_) {}

    const certMap = new Map();
    [...allCerts, ...inMemoryCertificates].forEach((c) => {
      const obj = c.toObject ? c.toObject() : c;
      certMap.set(obj.certificateId, obj);
    });

    return res.json({ certificates: Array.from(certMap.values()) });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin approves a pending certificate and awards digital badge.
 * PUT /api/verify-certificate/:id/approve
 */
export async function handleApproveCertificate(req, res, next) {
  try {
    const { id } = req.params;
    const adminUser = req.headers["x-user-name"] || "Admin";

    let cert = null;
    try {
      cert = await Certificate.findOne({ certificateId: id });
      if (cert) {
        cert.status = "APPROVED";
        cert.approvedBy = adminUser;
        cert.approvedAt = new Date();
        await cert.save();
      }
    } catch (_) {}

    // Update in memory if present
    const inMem = inMemoryCertificates.find((c) => c.certificateId === id);
    if (inMem) {
      inMem.status = "APPROVED";
      inMem.approvedBy = adminUser;
      inMem.approvedAt = new Date();
      if (!cert) cert = inMem;
    }

    if (!cert) {
      return res.status(404).json({ error: "Certificate request not found." });
    }

    // Add certificate ID to user profile's certificateVerifyId or completed list if needed
    try {
      await User.findOneAndUpdate(
        { username: cert.username },
        { certificateVerifyId: cert.certificateId }
      );
    } catch (_) {}

    return res.json({
      message: "Certificate & Digital Badge approved and issued!",
      certificate: cert,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin directly issues a certificate and digital badge to any user.
 * POST /api/verify-certificate/issue
 */
export async function handleIssueCertificate(req, res, next) {
  try {
    const { username, courseId, userEmail, issueDate } = req.body;
    const adminUser = req.headers["x-user-name"] || "Admin";

    if (!username || !courseId) {
      return res.status(400).json({ error: "Username and courseId are required." });
    }

    const meta = getCourseMetadata(courseId);
    const certId = `CN-${username.toUpperCase()}-${courseId.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
    const hash = generateCertificateHash(username, courseId);

    const parsedIssueDate = issueDate ? new Date(issueDate) : new Date();

    const certData = {
      certificateId: certId,
      username: username,
      userEmail: userEmail || "",
      courseId: courseId,
      courseTitle: meta.title,
      badgeType: meta.badgeType,
      badgeIcon: meta.badgeIcon,
      issueDate: isNaN(parsedIssueDate.getTime()) ? new Date() : parsedIssueDate,
      issuer: "CyberNexus Academic Board & Examination Council",
      status: "APPROVED",
      signatureHash: hash,
      approvedBy: adminUser,
      approvedAt: new Date(),
    };

    try {
      await Certificate.findOneAndUpdate({ certificateId: certId }, certData, {
        upsert: true,
        new: true,
      });
    } catch (err) {
      console.warn("Database upsert warning:", err.message);
    }

    const existingIdx = inMemoryCertificates.findIndex((c) => c.certificateId === certId);
    if (existingIdx >= 0) {
      inMemoryCertificates[existingIdx] = certData;
    } else {
      inMemoryCertificates.unshift(certData);
    }

    return res.status(201).json({
      message: `Verifiable Certificate & Digital Badge issued directly to @${username}!`,
      certificate: certData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin revokes a certificate.
 * DELETE /api/verify-certificate/:id
 */
export async function handleRevokeCertificate(req, res, next) {
  try {
    const { id } = req.params;
    try {
      await Certificate.deleteOne({ certificateId: id });
    } catch (_) {}

    const idx = inMemoryCertificates.findIndex((c) => c.certificateId === id);
    if (idx >= 0) inMemoryCertificates.splice(idx, 1);

    return res.json({ message: "Certificate revoked and removed." });
  } catch (error) {
    next(error);
  }
}
