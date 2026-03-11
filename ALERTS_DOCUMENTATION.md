# OpsPulse — Alerts Module Documentation

**Version:** 1.0.0  
**Date:** March 2026  
**Status:** Production Ready

---

## Overview

The **Alerts Module** is a comprehensive, real-time alert detection and management system for the OpsPulse Business Intelligence Dashboard. It continuously monitors three business data streams (Sales, Inventory, Cash Flow) and surfaces actionable notifications across three severity tiers: **Crisis**, **Opportunity**, and **Anomaly**.

Users never need to manually scan charts—the system automatically highlights what requires immediate attention.

---

## Architecture

### 1. **Detection Layer** (`src/lib/alerts/`)

#### `rule-engine.ts`
Core business logic for alert generation. Implements the Alert Rule Engine with three specialized detectors:

**Sales Detector:**
- **Crisis**: Sales drop > 30% below average → Immediate revenue threat
- **Opportunity**: Sales spike > 100% above average → Growth signal
- **Anomaly**: Unusual patterns (±30%) outside expected time windows → Investigation trigger

**Inventory Detector:**
- **Crisis**: Stock < 50% of safety level (risk > 0.5) → Stockout imminent
- **Anomaly**: Stock < 70% of safety level → Early warning

**Cash Flow Detector:**
- **Crisis**: Balance below minimum threshold → Liquidity risk
- **Anomaly**: Elevated outflow (outflow > 1.5× inflow) → Unusual spending pattern

**War Room Trigger:**
- Auto-activates if 3+ crisis alerts are simultaneously active

#### `simulator.ts`
Generates synthetic, realistic alert data for development and demonstration:
- Maintains state of sales baseline, inventory levels, cash balance
- Generates alerts based on configurable scenarios (normal, crisis, opportunity, mixed)
- Decouples alert generation from real data sources in prototype phase

---

### 2. **Backend Layer** (`src/app/api/alerts/`)

#### `route.ts` - Main Alerts API
```
GET    /api/alerts              — Fetch all alerts (with filtering)
POST   /api/alerts              — Create new alert
```

**Query Parameters:**
- `storeId`: Filter by store (required)
- `severity`: Filter by severity (optional: all, crisis, opportunity, anomaly)
- `status`: Filter by status (optional: all, active, resolved, escalated)

**Demo Mode:**
- Initializes with 7 seed alerts on first request
- Demonstrates all severity tiers and states (active, resolved, escalated)

#### `[id]/[action]/route.ts` - Alert Actions
```
PATCH  /api/alerts/[id]/resolve    — Mark as resolved
PATCH  /api/alerts/[id]/escalate   — Escalate to War Room
PATCH  /api/alerts/[id]/acknowledge — Acknowledge receipt
PATCH  /api/alerts/[id]/assign     — Assign to user
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "id": "alert-1234567890",
    "alert_id": "alert-1234567890",
    "store_id": "STORE-01",
    "severity": "crisis",
    "title": "Critical Sales Drop Detected",
    "description": "Sales have dropped 42% from average...",
    "status": "active",
    "timestamp": "2026-03-11T16:41:00Z"
  }
}
```

---

### 3. **State Management** (`src/store/alertsStore.ts`)

**Zustand Store Slice: `AlertsSlice`**

```typescript
{
  alerts: Alert[]                                        // All alerts
  filteredAlerts: Alert[]                               // Filtered results
  severityFilter: AlertSeverity | 'all'                 // Current severity filter
  statusFilter: AlertStatus | 'all'                     // Current status filter
  unreadCount: number                                   // Count of active/open alerts
  
  setAlerts(alerts: Alert[])                           // Replace all alerts
  addAlert(alert: Alert)                               // Add single alert
  updateAlert(id: string, update: Partial<Alert>)      // Update alert properties
  setSeverityFilter(severity: string)                  // Filter by severity
  setStatusFilter(status: string)                      // Filter by status
  markAllRead()                                         // Clear unread count
}
```

**Real-Time Synchronization:**
- SocketProvider listens for `alert_created` and `alert_updated` events
- Automatically syncs store when backend notifies of changes
- Graceful fallback to polling if WebSocket unavailable

---

### 4. **UI Layer** (`src/components/alerts/`)

#### Components

**AlertBadge.tsx**
- Displays severity with color-coded indicator
- Sizes: sm, md, lg
- Shows label (Crisis, Opportunity, Anomaly, etc.)

**AlertCard.tsx**
- Individual alert display with:
  - Title and description
  - Severity badge + relative timestamp
  - Action buttons: Resolve, Escalate, Open War Room
  - Status indicator if resolved/escalated

**AlertSummaryBar.tsx**
- Live count statistics:
  - Total active alerts
  - Crisis count (red)
  - Opportunity count (green)
  - Anomaly count (yellow)
- Clickable filters/tabs for quick navigation

**ActiveAlertsList.tsx**
- Master component combining:
  - AlertSummaryBar (top)
  - Severity & Status filters
  - Paginated list of alert cards
  - Resolved alerts history section
- Handles async operations (resolve, escalate)
- Shows empty state when no alerts match filters

**AlertDashboardWidget.tsx**
- Compact summary widget for main dashboard
- Shows: active count, crisis count, recent alerts (max 3)
- Quick link to full Alerts Center
- Renders only if active alerts exist

---

### 5. **Page Integration** (`src/app/dashboard/`)

#### Dashboard Layout Hierarchy
```
DashboardLayout (with AlertProvider, SimulatorProvider)
  ↓
  Navbar (with alert badge)
  ↓
  Main Content
    ↓
    Page Components
```

#### Alerts Page (`alerts/page.tsx`)
- Full-featured alerts management center
- Uses TanStack Query for data fetching & caching
- Polling interval: 10 seconds (auto-refresh)
- Mutation handlers for resolve/escalate actions
- Statistics summary (4-card grid)
- Loading/error states

---

### 6. **Providers** (`src/lib/providers/`)

#### AlertProvider.tsx
- **Purpose**: Initialize alert simulator and seed demo data
- **Lifecycle**:
  1. On mount: Fetch initial alerts from API (seeding)
  2. Start AlertSimulator loop
  3. When alert generated: Add to Zustand store + invalidate queries
  4. On unmount: Stop simulator
- **Configuration**:
  - `enabled`: Toggle simulation (default: true)
  - `scenario`: normal | crisis | opportunity | mixed (default: mixed)

#### SimulatorProvider.tsx (Existing)
- Generates base business metrics (sales, inventory, support)
- Calculates stress score from metrics
- Integrates with dashboard metrics display

#### SocketProvider.tsx (Existing)
- Establishes WebSocket connection
- Listens for `alert_created`, `alert_updated` events
- Auto-syncs store on real-time updates
- Fallback transports: websocket → polling

---

## Data Flow

### Alert Generation Cycle

```
┌─────────────────────────────────────────────────────┐
│                 AlertSimulator                      │
│  (Generates synthetic business metrics)             │
└────────────────────┬────────────────────────────────┘
                     │
                     ├─→ SalesData
                     ├─→ InventoryData
                     └─→ CashFlowData
                              │
                     ┌────────┴────────┐
                     │                 │
      ┌──────────────▼──────┐  ┌──────▼──────────────┐
      │  AlertRuleEngine    │  │  Zustand Store     │
      │  (Detect patterns)  │  │  (State mgmt)      │
      └──────────────┬──────┘  │                    │
                     │         │  addAlert() →      │
                ┌────▼──────────┼──→ alerts: Alert[]│
                │               │  updateAlert() → └────────┐
                │ AlertRuleResult                            │
                │ {severity, message, ...}                   │
                │                                            │
        ┌───────▼────────┐                           ┌──────▼──────┐
        │   API Store    │                           │   UI Layer  │
        │  (persistent)  │◄────── QueryClient────────┤ (Components)│
        │                │     invalidateQueries     │             │
        └────────────────┘                           └─────────────┘
```

### Resolution Workflow

```
User Action
    │
    ├─→ "Resolve" button
    │       ↓
    │   PATCH /api/alerts/[id]/resolve
    │       ↓
    │   API updates store + broadcasts event
    │       ↓
    │   SocketProvider.off(alert_updated)
    │       ↓
    │   Zustand.updateAlert() 
    │       ↓
    │   UI re-renders (status: resolved)
    │       ↓
    │   Move to "Resolved Alerts" section
    │
    └─→ "Escalate" button
            ↓
        PATCH /api/alerts/[id]/escalate
            ↓
        WarRoom activation + navigation
```

---

## Alert Severity Tiers

### Crisis (Red) — `#EF4444`
**Immediate action required. Business impact likely.**
- Sales: Revenue drop > 30%
- Inventory: Stock < 50% of safety level
- Cash: Balance below minimum required
- **Actions**: Resolve, Escalate, Open War Room
- **Auto-escalation**: 3+ crisis alerts → War Room auto-activation

### Opportunity (Green) — `#10B981`
**Growth signal. Consider scaling.**
- Sales: Demand spike > 100% (2× average)
- **Actions**: Acknowledge, Resolve
- **Follow-up**: Alert recommends operational scaling

### Anomaly (Yellow) — `#F59E0B`
**Unusual pattern. Requires investigation.**
- Sales: Off-peak surge (±30%)
- Inventory: Unusual depletion rate
- Cash: Elevated outflow (> 1.5× inflow)
- **Actions**: Resolve, Escalate
- **Follow-up**: Root cause analysis recommended

---

## Usage Examples

### 1. Fetch Active Alerts

```typescript
// In component
const { data: alerts } = useQuery({
  queryKey: QUERY_KEYS.alerts('STORE-01'),
  queryFn: async () => {
    const res = await axios.get('/api/alerts?storeId=STORE-01&status=active');
    return res.data.data;
  },
});
```

### 2. Add Alert Programmatically

```typescript
// In AlertSimulator or custom trigger
const alert: Alert = {
  id: `alert-${Date.now()}`,
  store_id: 'STORE-01',
  severity: 'crisis',
  title: 'Critical Cash Position',
  description: 'Balance fallen below minimum...',
  status: 'active',
  timestamp: new Date().toISOString(),
};

await axios.post('/api/alerts', alert);
```

### 3. Resolve Alert

```typescript
// In AlertCard component
const handleResolve = async (alertId: string) => {
  const res = await axios.patch(`/api/alerts/${alertId}/resolve`, {});
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts(storeId) });
};
```

### 4. Listen for Real-Time Updates

```typescript
// In SocketProvider
socket.on('alert_created', (alert: Alert) => {
  addAlert(alert); // Zustand
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts(storeId) });
});
```

---

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api    # Backend API base
NEXT_PUBLIC_WS_URL=http://localhost:3001         # WebSocket server
```

### Feature Flags

```typescript
// In AlertProvider or page components
<AlertProvider
  enabled={true}              // Enable/disable simulator
  scenario="mixed"            // normal | crisis | opportunity | mixed
>
```

### Polling Intervals

```typescript
// src/lib/config/constants.ts
POLLING_INTERVALS = {
  ALERTS: 10_000,  // Refresh alerts every 10 seconds
};

// In useQuery
refetchInterval: POLLING_INTERVALS.ALERTS
```

---

## Testing

### Manual Testing Checklist

#### 1. Alert Generation
- [ ] Navigate to `/dashboard/alerts`
- [ ] Verify demo alerts loaded (7 total)
- [ ] Check severity distribution: 3 crisis, 1 opportunity, 3 anomaly
- [ ] Verify timestamps are recent

#### 2. Filtering
- [ ] Click "Crisis" card → shows only crisis alerts
- [ ] Click "Opportunity" → shows only opportunity alerts
- [ ] Toggle "Active" / "All" → includes/excludes resolved

#### 3. Alert Actions
- [ ] Click "Resolve" on active alert
- [ ] Verify status changes to "resolved"
- [ ] Verify moved to "Resolved Alerts" section
- [ ] Click "Escalate" on crisis alert
- [ ] Verify status changes to "escalated"

#### 4. Real-Time Updates
- [ ] Leave Alerts page open for 60 seconds
- [ ] Verify new alerts appear automatically
- [ ] No page refresh needed
- [ ] Counts update in summary bar

#### 5. War Room Integration
- [ ] Click "War Room" button on crisis alert
- [ ] Verify navigation to `/dashboard/war-room`
- [ ] Verify alert context passed (if implemented)

#### 6. Dashboard Integration
- [ ] View main dashboard
- [ ] Verify alert badge appears in navbar
- [ ] Click "View Alerts" in dashboard widget
- [ ] Navigate to Alerts Center

### Automated Testing (Future)

```typescript
// Example test structure
describe('AlertRuleEngine', () => {
  test('detects sales crisis at -30%', () => {
    const result = AlertRuleEngine.detectSalesAlerts({
      current_sales: 35000,
      avg_sales: 50000,
      expected_window: 'standard',
      timestamp: new Date().toISOString(),
    });
    
    expect(result?.severity).toBe('crisis');
    expect(result?.type).toBe('sales_drop');
  });
});
```

---

## Troubleshooting

### No Alerts Displayed

**Cause**: API not initialized  
**Fix**: Check `/api/alerts` returns demo data

```bash
curl http://localhost:3000/api/alerts?storeId=STORE-01
```

### Alerts Not Updating

**Cause**: Polling interval too long or simulator stopped  
**Fix**: Check browser console for errors, verify AlertProvider mounted

```typescript
// Check simulator status
console.log(simulatorRef.current?.timer);
```

### Real-Time Not Working

**Cause**: WebSocket connection failed  
**Fix**: Check `socketStore.status === 'connected'`

```typescript
// In component
useEffect(() => {
  const status = useSocketStore((s) => s.status);
  console.log('Socket status:', status);
}, []);
```

---

## Performance Considerations

### Polling
- Interval: 10 seconds (configurable)
- Prevents excessive network traffic
- Caching: 5-second stale-time

### Real-Time Fallback
- Primary: WebSocket (`socket.io`)
- Fallback: HTTP Long-polling
- Auto-reconnect: 5 attempts with exponential backoff

### Memory
- Max alerts stored: Unlimited (consider pagination for 1000+)
- Zustand store: Unbounded growth (manual cleanup recommended)

### Optimization Tips
1. **Pagination**: Implement cursor-based pagination for alert history
2. **Archival**: Move resolved alerts to separate table after 30 days
3. **Aggregation**: Group similar alerts (e.g., "5 inventory shortages" → 1 alert)

---

## Future Enhancements

1. **Alert Suppression**: Mute low-priority alerts during maintenance windows
2. **Smart Routing**: Route alerts to specific team members based on severity
3. **Alert Webhooks**: Trigger external systems (Slack, PagerDuty, etc.)
4. **Custom Rules**: Users define custom alert triggers via UI
5. **Machine Learning**: Anomaly detection using historical patterns
6. **Predictive Alerts**: Forecast issues before they become critical
7. **Alert Analytics**: Track alert frequency, resolution time, etc.

---

## Support & Contributions

For issues, feature requests, or contributions:
- Create GitHub issue with `[alerts]` prefix
- Include reproduction steps and error logs
- Reference this documentation

---

**Last Updated:** March 2026  
**Maintainer:** OpsPulse Engineering Team
