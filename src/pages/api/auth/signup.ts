import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { hashPassword } from "../../../utils/password";
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
    const { fullName, email, mobile, password, businessName, businessType } =
      req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!fullName || !email || !mobile || !password || !businessName) {
      return res.status(400).json({
        success: false,
        error: "fullName, email, mobile, password, and businessName are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    const db = await getDb();

    // ── Check duplicate email ────────────────────────────────────────────────
    const existingUser = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "An account with this email already exists" });
    }

    // ── Create business first ────────────────────────────────────────────────
    const now = new Date();
    const businessId = new ObjectId();

    // ── Hash password ────────────────────────────────────────────────────────
    const passwordHash = await hashPassword(password);

    // ── Create user document ─────────────────────────────────────────────────
    const userId = new ObjectId();

    const business: IBusiness = {
      _id: businessId,
      name: businessName.trim(),
      type: businessType || "ecommerce",
      ownerUserId: userId,
      createdAt: now,
    };

    const user: IUser = {
      _id: userId,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      passwordHash,
      businessId,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    };

    // ── Insert into DB (business first, then user) ───────────────────────────
    await db.collection<IBusiness>("businesses").insertOne(business);
    await db.collection<IUser>("users").insertOne(user);

    // ── Generate JWT ─────────────────────────────────────────────────────────
    const token = signToken({
      userId: userId.toString(),
      businessId: businessId.toString(),
      role: "admin",
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: userId.toString(),
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          businessId: businessId.toString(),
          businessName: business.name,
          businessType: business.type,
        },
      },
      message: "Account created successfully",
    });
  } catch (error: unknown) {
    console.error("[POST /api/auth/signup]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ success: false, error: message });
  }
}
