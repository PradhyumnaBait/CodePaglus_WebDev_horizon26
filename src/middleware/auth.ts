import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt";
import { JWTPayload } from "../types";

export interface AuthenticatedRequest extends NextApiRequest {
  user: JWTPayload;
}

type Handler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

export function withAuth(handler: Handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = extractTokenFromHeader(
        req.headers.authorization as string | undefined
      );
      const payload = verifyToken(token);
      (req as AuthenticatedRequest).user = payload;
      return handler(req as AuthenticatedRequest, res);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unauthorized";
      return res.status(401).json({ success: false, error: message });
    }
  };
}

export function withAdminAuth(handler: Handler) {
  return withAuth(async (req, res) => {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }
    return handler(req, res);
  });
}
