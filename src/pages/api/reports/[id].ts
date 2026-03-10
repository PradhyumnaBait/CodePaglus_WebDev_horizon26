import type { NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { withAuth, AuthenticatedRequest } from "../../../middleware/auth";
import { IReport, ApiResponse } from "../../../types";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { id } = req.query;

  if (!id || !ObjectId.isValid(String(id))) {
    return res
      .status(400)
      .json({ success: false, error: "Valid report id is required" });
  }

  const db = await getDb();
  const businessId = new ObjectId(req.user.businessId);
  const reportId = new ObjectId(String(id));

  if (req.method === "GET") {
    try {
      const report = await db
        .collection<IReport>("reports")
        .findOne({ _id: reportId, businessId });

      if (!report) {
        return res.status(404).json({ success: false, error: "Report not found" });
      }

      return res.status(200).json({
        success: true,
        data: { ...report, id: report._id!.toString() },
      });
    } catch (error: unknown) {
      return res.status(500).json({ success: false, error: "Failed to fetch report" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await db
        .collection<IReport>("reports")
        .deleteOne({ _id: reportId, businessId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: "Report not found" });
      }

      return res.status(200).json({
        success: true,
        data: { deleted: true },
        message: "Report deleted",
      });
    } catch (error: unknown) {
      return res.status(500).json({ success: false, error: "Failed to delete report" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}

export default withAuth(handler);
