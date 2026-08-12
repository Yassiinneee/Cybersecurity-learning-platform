import { Router } from "express";
import {
  handleVerifyCertificate,
  handleRequestCertificate,
  handleGetUserCertificates,
  handleGetAllCertificates,
  handleApproveCertificate,
  handleIssueCertificate,
  handleRevokeCertificate,
} from "../controllers/verifyController.js";

const router = Router();

router.get("/all", handleGetAllCertificates);
router.get("/user/:username", handleGetUserCertificates);
router.post("/request", handleRequestCertificate);
router.post("/issue", handleIssueCertificate);
router.put("/:id/approve", handleApproveCertificate);
router.delete("/:id", handleRevokeCertificate);
router.get("/:id", handleVerifyCertificate);

export default router;
