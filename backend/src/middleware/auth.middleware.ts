import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthRequest, JwtPayload } from "../types";

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    const token = header.split(" ")[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.userId = decoded.userId;
    } catch {
      // Continue without auth
    }
  }

  next();
}
