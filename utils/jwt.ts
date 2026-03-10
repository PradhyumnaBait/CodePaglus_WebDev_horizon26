import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "opspulse-super-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "opspulse",
    audience: "opspulse-client",
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "opspulse",
      audience: "opspulse-client",
    }) as JWTPayload;
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

export function extractTokenFromHeader(
  authHeader: string | undefined
): string {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header missing or malformed");
  }
  return authHeader.slice(7);
}
