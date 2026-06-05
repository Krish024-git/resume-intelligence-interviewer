import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/upload.middleware";
import * as authController from "../controllers/auth.controller";
import * as resumeController from "../controllers/resume.controller";
import * as interviewController from "../controllers/interview.controller";
import * as analyticsController from "../controllers/analytics.controller";
import * as careerController from "../controllers/career.controller";
import * as reportController from "../controllers/report.controller";

const router = Router();

// Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Protected routes
router.post(
  "/upload-resume",
  authMiddleware,
  uploadResume.single("resume"),
  resumeController.uploadResume
);

router.post(
  "/generate-questions",
  authMiddleware,
  interviewController.generateQuestions
);

router.post(
  "/evaluate-answer",
  authMiddleware,
  interviewController.evaluateAnswer
);

router.post("/followup", authMiddleware, interviewController.followup);

router.post(
  "/career-suggestions",
  authMiddleware,
  careerController.getCareerSuggestions
);

router.get("/history", authMiddleware, analyticsController.getHistory);
router.get("/analytics", authMiddleware, analyticsController.getAnalytics);
router.get("/dashboard", authMiddleware, analyticsController.getDashboard);

router.get(
  "/reports/:sessionId/download",
  authMiddleware,
  reportController.downloadReport
);

router.post(
  "/reports/:sessionId/share",
  authMiddleware,
  reportController.shareReport
);

export default router;
