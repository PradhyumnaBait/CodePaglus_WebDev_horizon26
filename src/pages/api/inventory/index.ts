import type { NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { withAuth, AuthenticatedRequest } from "../../../middleware/auth";
import { IInventory, ApiResponse } from "../../../types";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  const db = await getDb();
  const businessId = new ObjectId(req.user.businessId);

  // ── GET — list all inventory for business ───────────────────────────────────
  if (req.method === "GET") {
    try {
      const { category, search, lowStock, page = "1", limit = "50" } = req.query;

      const filter: Record<string, unknown> = { businessId };

      if (category && typeof category === "string") {
        filter.category = category;
      }

      if (search && typeof search === "string") {
        filter.$or = [
          { productName: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } },
        ];
      }

      if (lowStock === "true") {
        filter.$expr = { $lte: ["$stockQuantity", "$lowStockAlert"] };
      }

      const pageNum = Math.max(1, parseInt(String(page)));
      const limitNum = Math.min(100, Math.max(1, parseInt(String(limit))));
      const skip = (pageNum - 1) * limitNum;

      const [items, total] = await Promise.all([
        db
          .collection<IInventory>("inventory")
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .toArray(),
        db.collection<IInventory>("inventory").countDocuments(filter),
      ]);

      // Add computed margin to each item
      const enriched = items.map((item) => ({
        ...item,
        id: item._id!.toString(),
        grossMarginPct:
          item.salePrice > 0
            ? Math.round(
                ((item.salePrice - item.purchasePrice) / item.salePrice) * 100
              )
            : 0,
        profitPerUnit: item.salePrice - item.purchasePrice,
        stockStatus:
          item.stockQuantity === 0
            ? "out_of_stock"
            : item.stockQuantity <= item.lowStockAlert
            ? "low_stock"
            : "in_stock",
      }));

      return res.status(200).json({
        success: true,
        data: {
          items: enriched,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
          summary: {
            totalProducts: total,
            lowStockCount: enriched.filter((i) => i.stockStatus === "low_stock")
              .length,
            outOfStockCount: enriched.filter(
              (i) => i.stockStatus === "out_of_stock"
            ).length,
            totalInventoryValue: items.reduce(
              (sum, i) => sum + i.purchasePrice * i.stockQuantity,
              0
            ),
            avgMargin:
              enriched.length > 0
                ? Math.round(
                    enriched.reduce((s, i) => s + i.grossMarginPct, 0) /
                      enriched.length
                  )
                : 0,
          },
        },
      });
    } catch (error: unknown) {
      console.error("[GET /api/inventory]", error);
      return res.status(500).json({ success: false, error: "Failed to fetch inventory" });
    }
  }

  // ── POST — create new inventory item ────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const {
        productName,
        sku,
        stockQuantity,
        purchasePrice,
        salePrice,
        category,
        lowStockAlert,
      } = req.body;

      if (!productName || !sku || salePrice === undefined || purchasePrice === undefined) {
        return res.status(400).json({
          success: false,
          error: "productName, sku, salePrice, and purchasePrice are required",
        });
      }

      // Check SKU uniqueness within this business
      const existing = await db
        .collection<IInventory>("inventory")
        .findOne({ businessId, sku: sku.trim().toUpperCase() });

      if (existing) {
        return res
          .status(409)
          .json({ success: false, error: `SKU "${sku}" already exists` });
      }

      const now = new Date();
      const item: IInventory = {
        businessId,
        productName: productName.trim(),
        sku: sku.trim().toUpperCase(),
        stockQuantity: Math.max(0, Number(stockQuantity) || 0),
        purchasePrice: Math.max(0, Number(purchasePrice)),
        salePrice: Math.max(0, Number(salePrice)),
        category: category || "General",
        lowStockAlert: Math.max(0, Number(lowStockAlert) || 10),
        createdAt: now,
        updatedAt: now,
      };

      const result = await db
        .collection<IInventory>("inventory")
        .insertOne(item);

      return res.status(201).json({
        success: true,
        data: { ...item, id: result.insertedId.toString() },
        message: "Product added successfully",
      });
    } catch (error: unknown) {
      console.error("[POST /api/inventory]", error);
      return res.status(500).json({ success: false, error: "Failed to create product" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}

export default withAuth(handler);
