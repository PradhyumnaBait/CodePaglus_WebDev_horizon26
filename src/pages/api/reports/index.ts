import type { NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { withAuth, AuthenticatedRequest } from "../../../middleware/auth";
import { generateReportPDF } from "../../../utils/pdfGenerator";
import { IReport, IInventory, IBusiness, ApiResponse } from "../../../types";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  const db = await getDb();
  const businessId = new ObjectId(req.user.businessId);

  // ── GET — list reports ────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const { page = "1", limit = "20" } = req.query;
      const pageNum = Math.max(1, parseInt(String(page)));
      const limitNum = Math.min(50, parseInt(String(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [reports, total] = await Promise.all([
        db
          .collection<IReport>("reports")
          .find({ businessId })
          .sort({ reportDate: -1 })
          .skip(skip)
          .limit(limitNum)
          .toArray(),
        db.collection<IReport>("reports").countDocuments({ businessId }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          reports: reports.map((r) => ({
            ...r,
            id: r._id!.toString(),
          })),
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error: unknown) {
      console.error("[GET /api/reports]", error);
      return res.status(500).json({ success: false, error: "Failed to fetch reports" });
    }
  }

  // ── POST — generate a new report ─────────────────────────────────────────
  if (req.method === "POST") {
    try {
      // Fetch inventory for this business
      const inventory = await db
        .collection<IInventory>("inventory")
        .find({ businessId })
        .toArray();

      // Fetch business info
      const business = await db
        .collection<IBusiness>("businesses")
        .findOne({ _id: businessId });

      if (!business) {
        return res.status(404).json({ success: false, error: "Business not found" });
      }

      // ── Compute health score and summary ──────────────────────────────────
      const totalItems = inventory.length;
      const lowStockItems = inventory.filter(
        (i) => i.stockQuantity <= i.lowStockAlert
      ).length;
      const outOfStockItems = inventory.filter(
        (i) => i.stockQuantity === 0
      ).length;

      // Simulate last 7 days cash flow from existing reports or generate fresh
      const existingReports = await db
        .collection<IReport>("reports")
        .find({ businessId })
        .sort({ reportDate: -1 })
        .limit(7)
        .toArray();

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const cashFlowSummary = days.map((day, i) => {
        const rev = 28000 + Math.floor(Math.random() * 44000);
        const exp = 12000 + Math.floor(Math.random() * 24000);
        return { date: day, revenue: rev, expenses: exp };
      });

      const totalRevenue = cashFlowSummary.reduce((s, d) => s + d.revenue, 0);
      const totalExpenses = cashFlowSummary.reduce(
        (s, d) => s + d.expenses,
        0
      );
      const totalOrders = 85 + Math.floor(Math.random() * 180);

      // Health score calculation (lower = healthier, matching frontend logic)
      const inventoryScore = totalItems > 0
        ? Math.round(((totalItems - lowStockItems) / totalItems) * 100)
        : 100;
      const salesPerf = Math.min(1, totalRevenue / 350000);
      const supportLoad = Math.random() * 0.38;
      const cashFlowStab = 0.65 + Math.random() * 0.28;
      const healthScore = Math.max(
        1,
        Math.min(
          99,
          Math.round(
            (1 - salesPerf) * 40 +
              (1 - inventoryScore / 100) * 30 +
              supportLoad * 20 +
              (1 - cashFlowStab) * 10
          )
        )
      );

      // Build alerts
      const alerts: string[] = [];
      const outOfStock = inventory.filter((i) => i.stockQuantity === 0);
      const lowStock = inventory.filter(
        (i) => i.stockQuantity > 0 && i.stockQuantity <= i.lowStockAlert
      );
      outOfStock.forEach((i) =>
        alerts.push(`OUT OF STOCK: ${i.productName} (${i.sku}) — reorder immediately`)
      );
      lowStock.forEach((i) =>
        alerts.push(
          `LOW STOCK: ${i.productName} — only ${i.stockQuantity} units remaining`
        )
      );
      if (totalExpenses > totalRevenue * 0.8) {
        alerts.push(
          "HIGH EXPENSES: Operating costs are above 80% of revenue. Review expense categories."
        );
      }

      const now = new Date();
      const reportData: IReport = {
        businessId,
        reportDate: now,
        healthScore,
        salesSummary: {
          totalRevenue,
          totalOrders,
        },
        inventorySummary: {
          totalItems,
          lowStockItems: lowStockItems + outOfStockItems,
        },
        cashFlowSummary,
        alerts,
        pdfPath: "", // Will be updated after PDF generation
        createdAt: now,
      };

      // Insert report to DB first to get _id
      const insertResult = await db
        .collection<IReport>("reports")
        .insertOne(reportData);
      reportData._id = insertResult.insertedId;

      // ── Generate PDF ────────────────────────────────────────────────────
      let pdfPath = "";
      try {
        pdfPath = await generateReportPDF(reportData, business, inventory);
        await db
          .collection<IReport>("reports")
          .updateOne(
            { _id: insertResult.insertedId },
            { $set: { pdfPath } }
          );
      } catch (pdfError) {
        console.error("[PDF generation failed]", pdfError);
        // Report is still saved even if PDF fails
        pdfPath = "";
      }

      return res.status(201).json({
        success: true,
        data: {
          report: {
            ...reportData,
            id: insertResult.insertedId.toString(),
            pdfPath,
          },
        },
        message: "Report generated successfully",
      });
    } catch (error: unknown) {
      console.error("[POST /api/reports]", error);
      const message =
        error instanceof Error ? error.message : "Failed to generate report";
      return res.status(500).json({ success: false, error: message });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}

export default withAuth(handler);
