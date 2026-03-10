import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { signToken } from "../../../utils/jwt";
import { IOTP, IUser, IBusiness, ApiResponse } from "../../../types";

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
    const { userId, otpCode } = req.body;

    if (!userId || !otpCode) {
      return res
        .status(400)
        .json({ success: false, error: "userId and otpCode are required" });
    }

    if (!/^\d{6}$/.test(String(otpCode))) {
      return res
        .status(400)
        .json({ success: false, error: "OTP must be a 6-digit number" });
    }

    if (!ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid userId" });
    }

    const db = await getDb();

    // ── Find the most recent unused, valid OTP ───────────────────────────────
    const otpDoc = await db.collection<IOTP>("otps").findOne({
      userId: new ObjectId(userId),
      otpCode: String(otpCode),
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP" });
    }

    // ── Mark OTP as used ─────────────────────────────────────────────────────
    await db
      .collection<IOTP>("otps")
      .updateOne({ _id: otpDoc._id }, { $set: { used: true } });

    // ── Fetch user and issue JWT ─────────────────────────────────────────────
    const user = await db
      .collection<IUser>("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    const business = await db
      .collection<IBusiness>("businesses")
      .findOne({ _id: user.businessId });

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
        verified: true,
        user: {
          id: user._id!.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          businessId: user.businessId.toString(),
          businessName: business?.name || "Unknown",
        },
      },
      message: "OTP verified successfully",
    });
  } catch (error: unknown) {
    console.error("[POST /api/auth/verify-otp]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ success: false, error: message });
  }
}
