// ============================================================
// OpsPulse — Alerts API Handler
// ============================================================
// API route: /api/alerts/*

import { NextRequest, NextResponse } from 'next/server';
import type { Alert, AlertStatus } from '@/types';

// In-memory store (for demo/prototype)
// In production, this would be a database
const alertsStore: Map<string, Alert> = new Map();
const storeAlertsIndex: Map<string, string[]> = new Map();

/**
 * Initialize demo alerts for a store
 */
function initializeDemoAlerts(storeId: string) {
  if (storeAlertsIndex.has(storeId)) return; // Already initialized

  const demoAlerts: Alert[] = [
    {
      store_id: storeId,
      id: 'alert-001',
      alert_id: 'alert-001',
      severity: 'crisis',
      title: 'Critical Sales Drop Detected',
      description: 'Sales have dropped 42% from average. Immediate analysis required. Current: ₹28,900 vs Average: ₹50,000',
      status: 'active',
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 mins ago
    },
    {
      store_id: storeId,
      id: 'alert-002',
      alert_id: 'alert-002',
      severity: 'crisis',
      title: 'SKU-002 — Critical Stock Warning',
      description: 'Stock level critically low. Current: 5 units, Safety Stock: 50 units. Risk Level: 90%. Immediate reorder required.',
      status: 'active',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    },
    {
      store_id: storeId,
      id: 'alert-003',
      alert_id: 'alert-003',
      severity: 'crisis',
      title: 'Critical Cash Position Alert',
      description: 'Cash balance has fallen below minimum threshold. Current: ₹45,000, Minimum Required: ₹100,000. Stress Level: 55%. Days of runway remaining: 1',
      status: 'active',
      timestamp: new Date(Date.now() - 8 * 60000).toISOString(), // 8 mins ago
    },
    {
      store_id: storeId,
      id: 'alert-004',
      alert_id: 'alert-004',
      severity: 'opportunity',
      title: 'Exceptional Demand Surge',
      description: 'Sales have spiked 125% above average! Current: ₹112,500 vs Average: ₹50,000. Scale operations to capture opportunity.',
      status: 'active',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    },
    {
      store_id: storeId,
      id: 'alert-005',
      alert_id: 'alert-005',
      severity: 'anomaly',
      title: 'Unusual Sales Pattern Detected',
      description: 'Unexpected surge of 45% detected during off-peak hours. This pattern requires investigation.',
      status: 'active',
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    },
    {
      store_id: storeId,
      id: 'alert-006',
      alert_id: 'alert-006',
      severity: 'anomaly',
      title: 'SKU-005 — Stock Below Threshold',
      description: 'Stock has depleted to 120 units (60% of safety level). Consider increasing order quantity.',
      status: 'resolved',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
    },
    {
      store_id: storeId,
      id: 'alert-007',
      alert_id: 'alert-007',
      severity: 'anomaly',
      title: 'Elevated Cash Outflow Detected',
      description: 'Cash outflow has increased significantly. Current: ₹62,000 out vs ₹50,000 in. Review recent transactions for unexpected charges.',
      status: 'resolved',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    },
  ];

  // Store alerts and index by store
  const alertIds: string[] = [];
  demoAlerts.forEach((alert) => {
    const id = alert.id || alert.alert_id || `alert-${Date.now()}`;
    alertsStore.set(id, { ...alert, id });
    alertIds.push(id);
  });
  storeAlertsIndex.set(storeId, alertIds);
}

/**
 * GET /api/alerts
 * Fetch all alerts for a store
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const storeId = url.searchParams.get('storeId') || 'default-store';
  const severity = url.searchParams.get('severity');
  const status = url.searchParams.get('status');

  // Initialize demo alerts if needed
  initializeDemoAlerts(storeId);

  // Get alerts for this store
  const alertIds = storeAlertsIndex.get(storeId) || [];
  let alerts = alertIds
    .map((id) => alertsStore.get(id))
    .filter((a) => a !== undefined) as Alert[];

  // Apply filters
  if (severity && severity !== 'all') {
    alerts = alerts.filter((a) => a.severity === severity);
  }
  if (status && status !== 'all') {
    alerts = alerts.filter((a) => a.status === status);
  }

  // Sort by timestamp (newest first)
  alerts.sort((a, b) => {
    const tsA = new Date(a.timestamp || a.created_at || 0).getTime();
    const tsB = new Date(b.timestamp || b.created_at || 0).getTime();
    return tsB - tsA;
  });

  return NextResponse.json({
    success: true,
    data: alerts,
  });
}

/**
 * POST /api/alerts
 * Create a new alert
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { store_id, severity, title, description, status = 'active' } = body;

  if (!store_id || !severity || !title) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const alert: Alert = {
    id: `alert-${Date.now()}`,
    alert_id: `alert-${Date.now()}`,
    store_id,
    severity,
    title,
    description,
    status: status as AlertStatus,
    timestamp: new Date().toISOString(),
  };

  alertsStore.set(alert.id!, alert);

  // Add to store index
  if (!storeAlertsIndex.has(store_id)) {
    storeAlertsIndex.set(store_id, []);
  }
  storeAlertsIndex.get(store_id)!.push(alert.id!);

  return NextResponse.json(
    {
      success: true,
      data: alert,
    },
    { status: 201 }
  );
}
