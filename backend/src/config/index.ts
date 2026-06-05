import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  pythonAiUrl: process.env.PYTHON_AI_SERVICE_URL || "http://localhost:5000",
  uploadDir: process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"),
  reportsDir: process.env.REPORTS_DIR || path.join(process.cwd(), "reports"),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};
