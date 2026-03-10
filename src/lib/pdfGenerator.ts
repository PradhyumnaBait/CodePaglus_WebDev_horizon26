// ============================================================
// OpsPulse — PDF Report Generator (client-side)
// Uses jsPDF + jspdf-autotable for professional report output
// ============================================================

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  businessName: string;
  reportDate: string;
  healthScore: number;
  sales: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  inventory: {
    totalSkus: number;
    inStock: number;
    lowStock: number;
    critical: number;
  };
  support: {
    openTickets: number;
    avgResolutionMin: number;
    csatScore: number;
  };
  cashFlow: {
    revenue: number;
    expenses: number;
    netProfit: number;
  };
  alerts: {
    crisis: number;
    warning: number;
    info: number;
  };
}

export function generateBusinessHealthPDF(data: ReportData): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ---- Header ----
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('OpsPulse', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Business Health Report', 15, 26);

  doc.setFontSize(9);
  doc.text(`Generated: ${data.reportDate}`, 15, 33);
  doc.text(data.businessName, pageWidth - 15, 18, { align: 'right' });

  y = 52;

  // ---- Health Score Section ----
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Business Health Score', 15, y);
  y += 8;

  const scoreColor = data.healthScore <= 25 ? [34, 197, 94] : data.healthScore <= 75 ? [245, 158, 11] : [239, 68, 68];
  const scoreLabel = data.healthScore <= 25 ? 'Healthy' : data.healthScore <= 75 ? 'Moderate' : 'Critical';

  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(15, y, 60, 14, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.healthScore}/100 — ${scoreLabel}`, 20, y + 9.5);

  y += 24;

  // ---- Sales Summary ----
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Sales Summary', 15, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Revenue', `INR ${data.sales.totalRevenue.toLocaleString('en-IN')}`],
      ['Total Orders', String(data.sales.totalOrders)],
      ['Avg Order Value', `INR ${data.sales.avgOrderValue.toLocaleString('en-IN')}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    margin: { left: 15, right: 15 },
  });

  y = (doc as any).lastAutoTable?.finalY ?? y + 30;
  y += 10;

  // ---- Inventory Summary ----
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Inventory Summary', 15, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total SKUs', String(data.inventory.totalSkus)],
      ['In Stock', String(data.inventory.inStock)],
      ['Low Stock', String(data.inventory.lowStock)],
      ['Critical', String(data.inventory.critical)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    margin: { left: 15, right: 15 },
  });

  y = (doc as any).lastAutoTable?.finalY ?? y + 30;
  y += 10;

  // ---- Support Metrics ----
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Support Metrics', 15, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Open Tickets', String(data.support.openTickets)],
      ['Avg Resolution Time', `${data.support.avgResolutionMin} min`],
      ['CSAT Score', `${data.support.csatScore}/5`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [6, 182, 212], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    margin: { left: 15, right: 15 },
  });

  y = (doc as any).lastAutoTable?.finalY ?? y + 30;
  y += 10;

  // Check if we need a new page
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  // ---- Cash Flow Summary ----
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Cash Flow Summary', 15, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Revenue', `INR ${data.cashFlow.revenue.toLocaleString('en-IN')}`],
      ['Expenses', `INR ${data.cashFlow.expenses.toLocaleString('en-IN')}`],
      ['Net Profit', `INR ${data.cashFlow.netProfit.toLocaleString('en-IN')}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    margin: { left: 15, right: 15 },
  });

  y = (doc as any).lastAutoTable?.finalY ?? y + 30;
  y += 10;

  // ---- Alert Summary ----
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Alert Summary', 15, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Severity', 'Count']],
    body: [
      ['Crisis', String(data.alerts.crisis)],
      ['Warning', String(data.alerts.warning)],
      ['Info', String(data.alerts.info)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [239, 68, 68], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    margin: { left: 15, right: 15 },
  });

  // ---- Footer ----
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `OpsPulse Business Health Report — Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' },
    );
  }

  // Save
  const filename = `OpsPulse_Report_${data.reportDate.replace(/[/\s,]/g, '_')}.pdf`;
  doc.save(filename);
}
