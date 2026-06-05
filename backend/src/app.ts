import express from "express";
import cors from "cors";
import path from "path";
import { config } from "./config";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(config.uploadDir)));

app.get("/", (_req, res) => {
  res.json({
    service: "ai-interview-backend",
    status: "ok",
    message: "This server provides the API. Open the frontend at http://localhost:3000.",
    health: "/health",
    apiBase: "/api",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
