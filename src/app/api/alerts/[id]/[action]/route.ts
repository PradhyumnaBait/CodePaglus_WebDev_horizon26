// ============================================================
// OpsPulse — Alert Action Handler
// ============================================================
// API route: /api/alerts/[id]/action

import { NextRequest, NextResponse } from 'next/server';

// In-memory store (shared with main alerts route in production)
const alertsStore: Map<string, any> = new Map();

/**
 * PATCH /api/alerts/[id]/resolve
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; action: string }> }
) {
  const { id, action } = await context.params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Alert ID is required' },
      { status: 400 }
    );
  }

  // Get alert from store (in production, from DB)
  let alert = alertsStore.get(id);
  
  // For demo, create a mock alert if not found
  if (!alert) {
    alert = {
      id,
      alert_id: id,
      store_id: 'default-store',
      severity: 'anomaly',
      title: 'Demo Alert',
      description: 'This is a demo alert',
      status: 'active',
      timestamp: new Date().toISOString(),
    };
  }

  const body = await request.json().catch(() => ({}));

  // Handle different actions
  if (action === 'resolve') {
    alert.status = 'resolved';
    alert.resolved_at = new Date().toISOString();
  } else if (action === 'escalate') {
    alert.status = 'escalated';
  } else if (action === 'acknowledge') {
    alert.status = 'acknowledged';
    alert.acknowledged_at = new Date().toISOString();
  } else if (action === 'assign') {
    alert.status = 'assigned';
    alert.assigned_to = body.assignee;
  } else {
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  }

  // Store updated alert
  alertsStore.set(id, alert);

  return NextResponse.json({
    success: true,
    data: alert,
  });
}
