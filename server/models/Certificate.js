import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      default: "",
    },
    courseId: {
      type: String,
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    badgeType: {
      type: String,
      default: "CyberNexus Certified Specialist",
    },
    badgeIcon: {
      type: String,
      default: "shield-check",
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    issuer: {
      type: String,
      default: "CyberNexus Academic Board & Examination Council",
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REVOKED"],
      default: "PENDING",
    },
    signatureHash: {
      type: String,
      required: true,
    },
    approvedBy: {
      type: String,
      default: "",
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
export default Certificate;