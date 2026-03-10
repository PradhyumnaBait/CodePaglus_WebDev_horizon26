import type { NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";
import { withAuth, AuthenticatedRequest } from "../../../middleware/auth";
import { IInventory, ApiResponse } from "../../../types";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { id } = req.query;

  if (!id || !ObjectId.isValid(String(id))) {
    return res
      .status(400)
      .json({ success: false, error: "Valid product id is required" });
  }

  const db = await getDb();
  const businessId = new ObjectId(req.user.businessId);
  const productId = new ObjectId(String(id));

  // ── GET — single product ─────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const item = await db
        .collection<IInventory>("inventory")
        .findOne({ _id: productId, businessId });

      if (!item) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      return res.status(200).json({
        success: true,
        data: {
          ...item,
          id: item._id!.toString(),
          grossMarginPct:
            item.salePrice > 0
              ? Math.round(
                  ((item.salePrice - item.purchasePrice) / item.salePrice) * 100
                )
              : 0,
          profitPerUnit: item.salePrice - item.purchasePrice,
        },
      });
    } catch (error: unknown) {
      return res.status(500).json({ success: false, error: "Failed to fetch product" });
    }
  }

  // ── PUT — update product ──────────────────────────────────────────────────
  if (req.method === "PUT") {
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

      // Build update object with only provided fields
      const updates: Partial<IInventory> = { updatedAt: new Date() };
      if (productName !== undefined) updates.productName = productName.trim();
      if (sku !== undefined) {
        // Check SKU conflict (only if changing SKU)
        const conflict = await db.collection<IInventory>("inventory").findOne({
          businessId,
          sku: sku.trim().toUpperCase(),
          _id: { $ne: productId },
        });
        if (conflict) {
          return res
            .status(409)
            .json({ success: false, error: `SKU "${sku}" already in use` });
        }
        updates.sku = sku.trim().toUpperCase();
      }
      if (stockQuantity !== undefined)
        updates.stockQuantity = Math.max(0, Number(stockQuantity));
      if (purchasePrice !== undefined)
        updates.purchasePrice = Math.max(0, Number(purchasePrice));
      if (salePrice !== undefined)
        updates.salePrice = Math.max(0, Number(salePrice));
      if (category !== undefined) updates.category = category;
      if (lowStockAlert !== undefined)
        updates.lowStockAlert = Math.max(0, Number(lowStockAlert));

      const result = await db
        .collection<IInventory>("inventory")
        .findOneAndUpdate(
          { _id: productId, businessId },
          { $set: updates },
          { returnDocument: "after" }
        );

      if (!result) {
        return res
          .status(404)
          .json({ success: false, error: "Product not found" });
      }

      return res.status(200).json({
        success: true,
        data: { ...result, id: result._id!.toString() },
        message: "Product updated successfully",
      });
    } catch (error: unknown) {
      console.error("[PUT /api/inventory/[id]]", error);
      return res.status(500).json({ success: false, error: "Failed to update product" });
    }
  }

  // ── DELETE — remove product ───────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      const result = await db
        .collection<IInventory>("inventory")
        .deleteOne({ _id: productId, businessId });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Product not found" });
      }

      return res.status(200).json({
        success: true,
        data: { deleted: true, id: String(id) },
        message: "Product deleted successfully",
      });
    } catch (error: unknown) {
      console.error("[DELETE /api/inventory/[id]]", error);
      return res.status(500).json({ success: false, error: "Failed to delete product" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}

export default withAuth(handler);
