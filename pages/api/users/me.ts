import type { NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { withAuth, AuthenticatedRequest } from "../../../middleware/auth";
import { IUser, IBusiness, ApiResponse } from "../../../types";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const db = await getDb();

    const user = await db
      .collection<IUser>("users")
      .findOne({ _id: new ObjectId(req.user.userId) });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const business = await db
      .collection<IBusiness>("businesses")
      .findOne({ _id: user.businessId });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id!.toString(),
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          createdAt: user.createdAt,
        },
        business: business
          ? {
              id: business._id!.toString(),
              name: business.name,
              type: business.type,
              createdAt: business.createdAt,
            }
          : null,
      },
    });
  } catch (error: unknown) {
    console.error("[GET /api/users/me]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ success: false, error: message });
  }
}

export default withAuth(handler);
