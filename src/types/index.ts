// ============================================================
// OpsPulse — TypeScript Type Definitions
// ============================================================

// --------------------------------------------------------
// Enums & Unions
// --------------------------------------------------------
export type AlertSeverity    = 'crisis' | 'anomaly' | 'warning' | 'opportunity' | 'info';
export type AlertStatus      = 'active' | 'open' | 'assigned' | 'in_progress' | 'resolved';
export type MetricType       = 'sales' | 'inventory' | 'support';
export type TrendDirection   = 'up' | 'down' | 'stable';
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// --------------------------------------------------------
// Core Domain Models
// --------------------------------------------------------
export interface StressScore {
  store_id:        string;
  timestamp:       string;
  score:           number; // 0–100
  status?:         'healthy' | 'moderate' | 'critical';
  kpis?: {
    sales:     number;
    inventory: number;
    support:   number;
  };
  components?: {
    sales:     number;
    inventory: number;
    support:   number;
  };
  weighted_health?:  number;
  stress_score:      number;
  top_contributors?: ContributingFactor[];
}

export interface ContributingFactor {
  metric: MetricType;
  impact: number;
  label:  string;
}

export interface KPIMetric {
  id:          string;
  label:       string;
  value:       number;
  unit?:       string;
  trend:       number; // percentage change, positive = up
  direction:   TrendDirection;
  sparkline:   number[]; // last N values for mini-chart
  updatedAt:   string;
}

export interface Alert {
  /** Primary ID — can be alert_id or id depending on source */
  id?:                  string;
  alert_id?:            string;
  store_id:             string;
  severity:             AlertSeverity;
  title:                string;
  description:          string;
  timestamp?:           string;
  created_at?:          string;
  recommended_actions?: RecommendedAction[];
  status:               AlertStatus;
  suggested_action?:    string;
  assigned_to?:         string | null;
  acknowledged_at?:     string;
  resolved_at?:         string;
}

export interface RecommendedAction {
  id:               string;
  label:            string;
  impact_estimate:  string;
  completed?:       boolean;
}

export interface EventFeedItem {
  id:        string;
  type:      'sale' | 'inventory_update' | 'ticket' | 'alert' | 'system';
  message:   string;
  detail?:   string;
  timestamp: string;
  severity?: AlertSeverity;
  store_id:  string;
}

// --------------------------------------------------------
// Sales Domain
// --------------------------------------------------------
export interface SaleEvent {
  type:           'sale';
  order_id:       string;
  timestamp:      string;
  amount:         number;
  sku:            string;
  store_id:       string;
  payment_method: string;
}

export interface InventoryUpdateEvent {
  type:           'inventory_update';
  sku:            string;
  timestamp:      string;
  on_hand:        number;
  reorder_point:  number;
  lead_time_days: number;
  store_id:       string;
}

export interface SalesMetric {
  today_revenue:    number;
  today_orders:     number;
  avg_order_value:  number;
  hour_revenue?:    number;
  revenue_trend?:   number;
  top_category?:    string;
  trend_24h?:       number;
  top_skus?:        TopSKU[];
  hourly_data?:     TimeSeriesPoint[];
}

export interface TopSKU {
  sku:      string;
  name:     string;
  revenue:  number;
  units:    number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value:     number;
  label?:    string;
}

// --------------------------------------------------------
// Inventory Domain
// --------------------------------------------------------
export interface InventoryItem {
  sku:                 string;
  name:                string;
  on_hand:             number;
  reorder_point:       number;
  lead_time_days:      number;
  projected_stockout:  string | null; // ISO timestamp or null
  status:              'healthy' | 'low' | 'critical' | 'stockout';
  velocity:            number; // units per day
}

export interface InventoryMetric {
  total_skus:       number;
  healthy:          number;
  low_stock:        number;
  critical:         number;
  health_score:     number; // 0–100
  items:            InventoryItem[];
}

// --------------------------------------------------------
// Support Domain
// --------------------------------------------------------
export interface SupportTicket {
  ticket_id:   string;
  timestamp:   string;
  status:      'open' | 'in_progress' | 'resolved';
  priority:    'low' | 'medium' | 'high' | 'critical';
  category:    string;
  store_id:    string;
}

export interface SupportMetric {
  open_tickets:       number;
  avg_resolution_min: number;
  csat_score:         number; // 0–5
  load_score:         number; // 0–100
  open_by_priority:   Record<string, number>;
}

// --------------------------------------------------------
// War Room
// --------------------------------------------------------
export interface WarRoomIncident {
  incident_id:   string;
  store_id:      string;
  activated_at:  string;
  title:         string;
  description:   string;
  estimated_loss: number;
  root_causes:   RootCause[];
  actions:       WarRoomAction[];
  timeline:      IncidentTimelineEntry[];
  resolved_at?:  string;
}

export interface RootCause {
  id:     string;
  metric: MetricType;
  label:  string;
  impact: string;
  detail: string;
}

export interface WarRoomAction {
  id:          string;
  label:       string;
  description: string;
  impact:      string;
  completed:   boolean;
  completed_at?: string;
  assigned_to?:  string;
}

export interface IncidentTimelineEntry {
  id:        string;
  timestamp: string;
  event:     string;
  actor?:    string;
  type:      'auto' | 'manual' | 'system';
}

// --------------------------------------------------------
// Dashboard Store Types
// --------------------------------------------------------
export interface DashboardSlice {
  stressScore:       StressScore | null;
  salesMetric:       SalesMetric | null;
  inventoryMetric:   InventoryMetric | null;
  supportMetric:     SupportMetric | null;
  stressHistory:     TimeSeriesPoint[];
  isWarRoomActive:   boolean;
  activeIncident:    WarRoomIncident | null;
  lastUpdated:       string | null;
  setStressScore:    (score: StressScore) => void;
  setSalesMetric:    (m: SalesMetric) => void;
  setInventoryMetric:(m: InventoryMetric) => void;
  setSupportMetric:  (m: SupportMetric) => void;
  pushStressHistory: (point: TimeSeriesPoint) => void;
  activateWarRoom:   (incident: WarRoomIncident) => void;
  deactivateWarRoom: () => void;
}

export interface AlertsSlice {
  alerts:            Alert[];
  filteredAlerts:    Alert[];
  severityFilter:    AlertSeverity | 'all';
  statusFilter:      AlertStatus   | 'all';
  unreadCount:       number;
  setAlerts:         (alerts: Alert[]) => void;
  addAlert:          (alert: Alert) => void;
  updateAlert:       (id: string, update: Partial<Alert>) => void;
  setSeverityFilter: (f: AlertSeverity | 'all') => void;
  setStatusFilter:   (f: AlertStatus | 'all') => void;
  markAllRead:       () => void;
}

export interface SocketSlice {
  status:        ConnectionStatus;
  storeId:       string;
  eventFeed:     EventFeedItem[];
  /** Alias for eventFeed — used by components */
  events:        EventFeedItem[];
  setStatus:     (s: ConnectionStatus) => void;
  setStoreId:    (id: string) => void;
  pushEvent:     (event: EventFeedItem) => void;
  clearFeed:     () => void;
}

// --------------------------------------------------------
// API Response Wrappers
// --------------------------------------------------------
export interface ApiResponse<T> {
  data:    T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page:  number;
  limit: number;
}

// --------------------------------------------------------
// Component Prop Types
// --------------------------------------------------------
export interface NavItem {
  label:  string;
  href:   string;
  icon:   React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export interface CardProps {
  title?:     string;
  icon?:      React.ReactNode;
  className?: string;
  children:   React.ReactNode;
  action?:    React.ReactNode;
}

export interface KPIStatCardProps {
  title:     string;
  value:     string | number;
  unit?:     string;
  trend:     number;
  sparkline: number[];
  icon?:     React.ReactNode;
  loading?:  boolean;
  className?: string;
}

export interface AlertCardProps {
  alert:      Alert;
  compact?:   boolean;
  onAck?:     (id: string) => void;
  onResolve?: (id: string) => void;
  className?: string;
}
