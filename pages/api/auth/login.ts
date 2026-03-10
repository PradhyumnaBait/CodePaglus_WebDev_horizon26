import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/mongodb";
import { comparePassword } from "../../../utils/password";
import { signToken } from "../../../utils/jwt";
import { IUser, IBusiness, ApiResponse } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const db = await getDb();

    // ── Find user ────────────────────────────────────────────────────────────
    const user = await db
      .collection<IUser>("users")
      .findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Timing-safe: still run compare to prevent user enumeration
      await comparePassword(password, "$2a$12$invalidhashfortimingnnnnnnnnn");
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // ── Verify password ──────────────────────────────────────────────────────
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // ── Fetch business details ───────────────────────────────────────────────
    const business = await db
      .collection<IBusiness>("businesses")
      .findOne({ _id: user.businessId });

    // ── Generate JWT ─────────────────────────────────────────────────────────
    const token = signToken({
      userId: user._id!.toString(),
      businessId: user.businessId.toString(),
      role: user.role,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id!.toString(),
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          businessId: user.businessId.toString(),
          businessName: business?.name || "Unknown",
          businessType: business?.type || "ecommerce",
        },
      },
      message: "Login successful",
    });
  } catch (error: unknown) {
    console.error("[POST /api/auth/login]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ success: false, error: message });
  }
}
