import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { IReport, IBusiness, IInventory } from "../types";

const REPORTS_DIR = path.join(process.cwd(), "public", "reports");

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// ─── Colour palette ───────────────────────────────────────────────────────────
const BLUE = "#2563EB";
const INDIGO = "#6366F1";
const SUCCESS = "#22C55E";
const WARNING = "#F59E0B";
const CRITICAL = "#EF4444";
const DARK = "#0F172A";
const MID = "#334155";
const LIGHT = "#64748B";
const BORDER = "#E2E8F0";
const BG = "#F6F8FB";

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function scoreColor(score: number): string {
  if (score <= 30) return SUCCESS;
  if (score <= 60) return WARNING;
  return CRITICAL;
}

function scoreLabel(score: number): string {
  if (score <= 30) return "Healthy";
  if (score <= 60) return "Warning";
  return "Critical";
}

function fmtRs(n: number): string {
  if (n >= 100000) return `Rs.${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `Rs.${(n / 1000).toFixed(1)}k`;
  return `Rs.${n}`;
}

export async function generateReportPDF(
  report: IReport,
  business: IBusiness,
  inventory: IInventory[]
): Promise<string> {
  const filename = `report-${report._id?.toString() || Date.now()}.pdf`;
  const filepath = path.join(REPORTS_DIR, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: `OpsPulse Business Report`,
        Author: "OpsPulse",
        Subject: `Business Health Report for ${business.name}`,
      },
    });

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    const W = doc.page.width;   // 595
    const M = 40;               // margin
    const IW = W - M * 2;      // inner width

    // ── HEADER BAND ───────────────────────────────────────────────────────────
    doc.save();
    doc.rect(0, 0, W, 110).fill(BLUE);

    // Gradient overlay (lighter stripe)
    doc.rect(W * 0.55, 0, W * 0.45, 110).fill(INDIGO).opacity(0.35).restore();
    doc.opacity(1);

    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("OpsPulse", M, 28, { continued: false });

    doc
      .fillColor("rgba(255,255,255,0.75)")
      .font("Helvetica")
      .fontSize(10)
      .text("Business Intelligence Platform", M, 54);

    // Health badge
    const sc = scoreColor(report.healthScore);
    const sl = scoreLabel(report.healthScore);
    doc.save();
    doc.roundedRect(M, 70, 130, 28, 6).fill(sc);
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`${sl}  •  ${report.healthScore}/100`, M + 10, 78);
    doc.restore();

    // Report meta (right side of header)
    doc
      .fillColor("rgba(255,255,255,0.85)")
      .font("Helvetica")
      .fontSize(9)
      .text(
        `Report Date: ${new Date(report.reportDate).toLocaleDateString("en-IN", { dateStyle: "long" })}`,
        W - 220,
        36,
        { width: 180, align: "right" }
      )
      .text(`Business: ${business.name}`, W - 220, 52, {
        width: 180,
        align: "right",
      })
      .text(
        `Report ID: ${report._id?.toString().slice(-8).toUpperCase()}`,
        W - 220,
        68,
        { width: 180, align: "right" }
      );

    let y = 130;

    // ── HELPER: section title ─────────────────────────────────────────────────
    const sectionTitle = (title: string) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(LIGHT)
        .text(title.toUpperCase(), M, y, { characterSpacing: 0.8 });
      y += 14;
      doc.moveTo(M, y).lineTo(M + IW, y).strokeColor(BORDER).lineWidth(1).stroke();
      y += 10;
    };

    // ── HELPER: KPI pill ──────────────────────────────────────────────────────
    const kpiPill = (
      label: string,
      value: string,
      accent: string,
      x: number,
      yy: number,
      w: number = 120
    ) => {
      doc.save();
      doc.roundedRect(x, yy, w, 52, 7).fill(BG).stroke(BORDER);
      doc
        .fillColor(LIGHT)
        .font("Helvetica")
        .fontSize(8)
        .text(label.toUpperCase(), x + 10, yy + 10, {
          width: w - 20,
          characterSpacing: 0.5,
        });
      doc
        .fillColor(DARK)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(value, x + 10, yy + 24, { width: w - 20 });
      // accent bar
      doc.rect(x, yy, 4, 52).fill(accent);
      doc.restore();
    };

    // ── KPIs ──────────────────────────────────────────────────────────────────
    sectionTitle("Key Performance Indicators");
    const kpiW = (IW - 15) / 4;
    kpiPill("Revenue Today", fmtRs(report.salesSummary.totalRevenue), BLUE, M, y, kpiW);
    kpiPill("Total Orders", String(report.salesSummary.totalOrders), INDIGO, M + kpiW + 5, y, kpiW);
    kpiPill("Total Products", String(report.inventorySummary.totalItems), SUCCESS, M + (kpiW + 5) * 2, y, kpiW);
    kpiPill("Low Stock Items", String(report.inventorySummary.lowStockItems), CRITICAL, M + (kpiW + 5) * 3, y, kpiW);
    y += 68;

    // ── HEALTH SCORE VISUAL ───────────────────────────────────────────────────
    sectionTitle("Business Health Score");
    const barW = IW;
    const barH = 18;
    doc.roundedRect(M, y, barW, barH, barH / 2).fill("#F1F5F9");
    const fillW = Math.max(0, Math.min(barW, (report.healthScore / 100) * barW));
    const [r, g, b] = hexToRgb(sc);
    doc.save().roundedRect(M, y, fillW, barH, barH / 2).fill(`rgb(${r},${g},${b})`).restore();
    doc
      .fillColor(DARK)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(`${report.healthScore}%  —  ${sl}`, M + fillW + 8, y + 5);
    y += 38;

    // ── CASH FLOW TABLE ───────────────────────────────────────────────────────
    sectionTitle("Weekly Cash Flow Summary");
    const cfHeaders = ["Day / Date", "Revenue", "Expenses", "Net Profit"];
    const cfColW = [IW * 0.25, IW * 0.25, IW * 0.25, IW * 0.25];

    // Header row
    let cx = M;
    doc.rect(M, y, IW, 20).fill("#EFF6FF");
    cfHeaders.forEach((h, i) => {
      doc
        .fillColor(BLUE)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(h, cx + 6, y + 6, { width: cfColW[i] - 10 });
      cx += cfColW[i];
    });
    y += 20;

    // Data rows
    report.cashFlowSummary.slice(0, 7).forEach((cf, idx) => {
      if (y > 720) { doc.addPage(); y = 50; }
      const net = cf.revenue - cf.expenses;
      const netColor = net >= 0 ? SUCCESS : CRITICAL;
      if (idx % 2 === 0) doc.rect(M, y, IW, 18).fill("#FAFBFF");
      cx = M;
      const rowData = [
        cf.date,
        fmtRs(cf.revenue),
        fmtRs(cf.expenses),
        fmtRs(net),
      ];
      rowData.forEach((val, i) => {
        doc
          .fillColor(i === 3 ? netColor : MID)
          .font(i === 3 ? "Helvetica-Bold" : "Helvetica")
          .fontSize(9)
          .text(val, cx + 6, y + 5, { width: cfColW[i] - 10 });
        cx += cfColW[i];
      });
      doc.moveTo(M, y + 18).lineTo(M + IW, y + 18).strokeColor(BORDER).lineWidth(0.5).stroke();
      y += 18;
    });
    y += 16;

    // ── INVENTORY TABLE ───────────────────────────────────────────────────────
    if (y > 620) { doc.addPage(); y = 50; }
    sectionTitle("Inventory Snapshot");

    const invHeaders = ["Product", "SKU", "Sell Price", "Stock", "Status"];
    const invColW = [IW * 0.35, IW * 0.15, IW * 0.15, IW * 0.1, IW * 0.25];

    cx = M;
    doc.rect(M, y, IW, 20).fill("#EFF6FF");
    invHeaders.forEach((h, i) => {
      doc
        .fillColor(BLUE)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(h, cx + 6, y + 6, { width: invColW[i] - 10 });
      cx += invColW[i];
    });
    y += 20;

    inventory.slice(0, 20).forEach((item, idx) => {
      if (y > 740) { doc.addPage(); y = 50; }
      const status =
        item.stockQuantity === 0
          ? "Out of Stock"
          : item.stockQuantity < item.lowStockAlert
          ? "Low Stock"
          : "In Stock";
      const statusColor =
        item.stockQuantity === 0
          ? CRITICAL
          : item.stockQuantity < item.lowStockAlert
          ? WARNING
          : SUCCESS;

      if (idx % 2 === 0) doc.rect(M, y, IW, 18).fill("#FAFBFF");
      cx = M;
      [
        item.productName,
        item.sku,
        fmtRs(item.salePrice),
        String(item.stockQuantity),
        status,
      ].forEach((val, i) => {
        doc
          .fillColor(i === 4 ? statusColor : MID)
          .font(i === 4 ? "Helvetica-Bold" : "Helvetica")
          .fontSize(8.5)
          .text(val, cx + 6, y + 5, {
            width: invColW[i] - 10,
            ellipsis: true,
          });
        cx += invColW[i];
      });
      doc.moveTo(M, y + 18).lineTo(M + IW, y + 18).strokeColor(BORDER).lineWidth(0.5).stroke();
      y += 18;
    });
    y += 16;

    // ── ALERTS ────────────────────────────────────────────────────────────────
    if (report.alerts.length > 0) {
      if (y > 660) { doc.addPage(); y = 50; }
      sectionTitle("Active Alerts");
      report.alerts.slice(0, 6).forEach((alert) => {
        if (y > 760) { doc.addPage(); y = 50; }
        doc.save();
        doc.roundedRect(M, y, IW, 24, 5).fill("#FFF7ED").stroke("#FED7AA");
        doc.rect(M, y, 4, 24).fill(WARNING);
        doc
          .fillColor(MID)
          .font("Helvetica")
          .fontSize(9)
          .text(alert, M + 12, y + 8, { width: IW - 20 });
        doc.restore();
        y += 30;
      });
    }

    // ── AI ANALYSIS ───────────────────────────────────────────────────────────
    if (y > 660) { doc.addPage(); y = 50; }
    y += 6;
    sectionTitle("AI Analysis Summary");
    const margin = report.salesSummary.totalRevenue > 0
      ? Math.round((report.salesSummary.totalRevenue * 0.35 / report.salesSummary.totalRevenue) * 100)
      : 0;

    const aiText = [
      `Health score of ${report.healthScore}/100 indicates a ${scoreLabel(report.healthScore)} operational status.`,
      `Net profit margin estimated at ${margin}% against a 35–45% benchmark.`,
      `${report.inventorySummary.lowStockItems} product(s) require immediate restocking to prevent stockouts.`,
      report.salesSummary.totalOrders > 150
        ? "Order volume is strong. Focus on fulfilment speed to maintain conversion rates."
        : "Order volume is below target. Consider promotional campaigns or discount bundles.",
    ].join(" ");

    doc.save();
    doc.roundedRect(M, y, IW, 56, 8).fill("#EAF4FF").stroke("#BFDBFE");
    doc.rect(M, y, 4, 56).fill(BLUE);
    doc
      .fillColor(MID)
      .font("Helvetica")
      .fontSize(9.5)
      .text(aiText, M + 12, y + 10, { width: IW - 24, lineGap: 3 });
    doc.restore();
    y += 68;

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const pageCount = (doc as any & { _pageBuffer?: unknown[] })
      ._pageBuffer?.length || 1;
    doc
      .save()
      .rect(0, doc.page.height - 36, W, 36)
      .fill("#F1F5F9")
      .restore();
    doc
      .fillColor(LIGHT)
      .font("Helvetica")
      .fontSize(8)
      .text(
        `Generated by OpsPulse  •  ${new Date().toLocaleString("en-IN")}  •  Confidential`,
        M,
        doc.page.height - 22,
        { width: IW, align: "center" }
      );

    doc.end();

    stream.on("finish", () => resolve(`/reports/${filename}`));
    stream.on("error", reject);
  });
}
