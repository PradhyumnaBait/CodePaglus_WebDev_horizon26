'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Plus,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { DashboardCard } from '@/components/cards/DashboardCard';
import { generateBusinessHealthPDF } from '@/lib/pdfGenerator';

interface Report {
  id: string;
  date: string;
  healthScore: number;
  status: 'generated' | 'pending';
  generatedAt: string;
}

const SEED_REPORTS: Report[] = [
  { id: '1', date: '2026-03-10', healthScore: 42, status: 'generated', generatedAt: '2026-03-10T10:00:00Z' },
  { id: '2', date: '2026-03-09', healthScore: 55, status: 'generated', generatedAt: '2026-03-09T10:00:00Z' },
  { id: '3', date: '2026-03-08', healthScore: 38, status: 'generated', generatedAt: '2026-03-08T10:00:00Z' },
  { id: '4', date: '2026-03-07', healthScore: 61, status: 'generated', generatedAt: '2026-03-07T10:00:00Z' },
  { id: '5', date: '2026-03-06', healthScore: 48, status: 'generated', generatedAt: '2026-03-06T10:00:00Z' },
];

function getScoreColor(score: number): string {
  if (score <= 25) return '#22C55E';
  if (score <= 75) return '#F59E0B';
  return '#EF4444';
}

function getScoreLabel(score: number): string {
  if (score <= 25) return 'Healthy';
  if (score <= 75) return 'Moderate';
  return 'Critical';
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulate generation delay
    await new Promise((r) => setTimeout(r, 600));

    const healthScore = Math.floor(Math.random() * 60) + 20;
    const now = new Date();
    const newReport: Report = {
      id: String(Date.now()),
      date: now.toISOString().split('T')[0],
      healthScore,
      status: 'generated',
      generatedAt: now.toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    setGenerating(false);
  };

  const handleDownload = (report: Report) => {
    generateBusinessHealthPDF({
      businessName: 'Main Branch — STORE-01',
      reportDate: formatDate(report.date),
      healthScore: report.healthScore,
      sales: {
        totalRevenue: 345600,
        totalOrders: 127,
        avgOrderValue: 2721,
      },
      inventory: {
        totalSkus: 10,
        inStock: 6,
        lowStock: 2,
        critical: 2,
      },
      support: {
        openTickets: 12,
        avgResolutionMin: 45,
        csatScore: 4.2,
      },
      cashFlow: {
        revenue: 345600,
        expenses: 211900,
        netProfit: 133700,
      },
      alerts: {
        crisis: 1,
        warning: 3,
        info: 5,
      },
    });
  };

  const avgScore = useMemo(() => {
    if (reports.length === 0) return 0;
    return Math.round(reports.reduce((sum, r) => sum + r.healthScore, 0) / reports.length);
  }, [reports]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-page-title text-[#0F172A]">Reports</h1>
          <p className="text-[12px] text-[#64748B] mt-1 flex items-center gap-1.5">
            <FileText size={11} />
            Generate and download business health reports
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold disabled:opacity-60"
          style={{
            background: 'linear-gradient(120deg, #2563EB 0%, #3B82F6 100%)',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
          }}
        >
          {generating ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus size={15} />
          )}
          Generate Report
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total Reports', value: reports.length, color: '#3B82F6', icon: FileText },
          { label: 'Avg Health Score', value: `${avgScore}/100`, color: getScoreColor(avgScore), icon: TrendingUp },
          { label: 'Latest Report', value: reports.length > 0 ? formatDate(reports[0].date) : 'N/A', color: '#6366F1', icon: Calendar },
          { label: 'Status', value: 'Available', color: '#22C55E', icon: CheckCircle2 },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <DashboardCard key={stat.label} variant="flat" delay={0.05 + i * 0.05}>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={12} style={{ color: stat.color }} />
                <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
              <p className="text-[20px] font-bold text-[#0F172A]">{stat.value}</p>
            </DashboardCard>
          );
        })}
      </div>

      {/* Reports Table */}
      <DashboardCard delay={0.15}>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={14} className="text-[#6366F1]" />
          <span className="text-[13px] font-semibold text-[#0F172A]">Report History</span>
          <span className="ml-auto text-[11px] text-[#64748B]">{reports.length} reports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {['Report Date', 'Health Score', 'Status', 'Generated At', 'Action'].map(
                  (col) => (
                    <th
                      key={col}
                      className="pb-3 text-[10px] font-semibold text-[#475569] uppercase tracking-wider pr-4"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              <AnimatePresence>
                {reports.map((report, i) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#64748B]" />
                        <span className="text-[13px] font-semibold text-[#0F172A]">
                          {formatDate(report.date)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[14px] font-bold tabular-nums"
                          style={{ color: getScoreColor(report.healthScore) }}
                        >
                          {report.healthScore}/100
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                          style={{
                            color: getScoreColor(report.healthScore),
                            backgroundColor: `${getScoreColor(report.healthScore)}15`,
                          }}
                        >
                          {getScoreLabel(report.healthScore)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5 text-[12px] text-[#22C55E] font-medium">
                        <CheckCircle2 size={12} />
                        Generated
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
                        <Clock size={11} />
                        {formatDate(report.generatedAt)}
                      </span>
                    </td>
                    <td className="py-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(report)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#3B82F6] bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] hover:bg-[rgba(59,130,246,0.2)] transition-colors"
                      >
                        <Download size={13} />
                        PDF
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {reports.length === 0 && (
            <div className="text-center py-12">
              <FileText size={32} className="mx-auto text-[#334155] mb-3" />
              <p className="text-[14px] text-[#64748B]">No reports generated yet</p>
              <p className="text-[12px] text-[#475569] mt-1">
                Click &ldquo;Generate Report&rdquo; to create your first report
              </p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
