import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  userName: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
