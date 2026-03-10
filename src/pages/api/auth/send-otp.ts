import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { generateOTP, otpExpiryDate } from "../../../utils/otp";
import { IOTP, IUser, ApiResponse } from "../../../types";

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
    const { userId } = req.body;

    if (!userId || !ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "Valid userId is required" });
    }

    const db = await getDb();

    // ── Verify user exists ───────────────────────────────────────────────────
    const user = await db
      .collection<IUser>("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    // ── Invalidate any existing unused OTPs ──────────────────────────────────
    await db
      .collection<IOTP>("otps")
      .updateMany(
        { userId: new ObjectId(userId), used: false },
        { $set: { used: true } }
      );

    // ── Generate new OTP ─────────────────────────────────────────────────────
    const otpCode = generateOTP(6);
    const otp: IOTP = {
      userId: new ObjectId(userId),
      otpCode,
      expiresAt: otpExpiryDate(10), // 10 minutes
      used: false,
      createdAt: new Date(),
    };

    await db.collection<IOTP>("otps").insertOne(otp);

    // ── In production, send via SMS/email here ───────────────────────────────
    // Example: await sendSMS(user.mobile, `Your OpsPulse OTP is ${otpCode}. Valid for 10 minutes.`);
    // For development, log to console:
    console.log(
      `[OTP] User: ${user.email} | Mobile: ${user.mobile} | Code: ${otpCode}`
    );

    return res.status(200).json({
      success: true,
      data: {
        message: `OTP sent to mobile ending in ${user.mobile.slice(-4)}`,
        // Only expose OTP in development for testing
        ...(process.env.NODE_ENV === "development" && { otpCode }),
      },
      message: "OTP sent successfully",
    });
  } catch (error: unknown) {
    console.error("[POST /api/auth/send-otp]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ success: false, error: message });
  }
}
