// ============================================================
// OpsPulse — API Client (Axios instance + typed helpers)
// ============================================================
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import type {
  ApiResponse,
  StressScore,
  Alert,
  SalesMetric,
  InventoryMetric,
  SupportMetric,
  WarRoomIncident,
  EventFeedItem,
  PaginatedResponse,
} from '@/types';

// --------------------------------------------------------
// Axios Instance
// --------------------------------------------------------
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    // TODO: attach JWT token when auth is implemented
    // const token = localStorage.getItem('ops_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — unwrap data
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('[API Error]', error?.response?.data ?? error.message);
    return Promise.reject(error);
  },
);

// --------------------------------------------------------
// Stress Score
// --------------------------------------------------------
export const fetchStressScore = async (storeId: string): Promise<StressScore> => {
  const res = await apiClient.get<ApiResponse<StressScore>>(`/stores/${storeId}/score`);
  return (res.data as any).data;
};

// --------------------------------------------------------
// Alerts
// --------------------------------------------------------
export const fetchAlerts = async (storeId: string): Promise<Alert[]> => {
  const res = await apiClient.get<ApiResponse<Alert[]>>(`/stores/${storeId}/alerts`);
  return (res.data as any).data;
};

export const acknowledgeAlert = async (alertId: string): Promise<Alert> => {
  const res = await apiClient.patch<ApiResponse<Alert>>(`/alerts/${alertId}/acknowledge`);
  return (res.data as any).data;
};

export const resolveAlert = async (alertId: string): Promise<Alert> => {
  const res = await apiClient.patch<ApiResponse<Alert>>(`/alerts/${alertId}/resolve`);
  return (res.data as any).data;
};

export const assignAlert = async (alertId: string, assignee: string): Promise<Alert> => {
  const res = await apiClient.patch<ApiResponse<Alert>>(`/alerts/${alertId}/assign`, { assignee });
  return (res.data as any).data;
};

// --------------------------------------------------------
// Metrics
// --------------------------------------------------------
export const fetchSalesMetric = async (storeId: string): Promise<SalesMetric> => {
  const res = await apiClient.get<ApiResponse<SalesMetric>>(`/stores/${storeId}/metrics/sales`);
  return (res.data as any).data;
};

export const fetchInventoryMetric = async (storeId: string): Promise<InventoryMetric> => {
  const res = await apiClient.get<ApiResponse<InventoryMetric>>(`/stores/${storeId}/metrics/inventory`);
  return (res.data as any).data;
};

export const fetchSupportMetric = async (storeId: string): Promise<SupportMetric> => {
  const res = await apiClient.get<ApiResponse<SupportMetric>>(`/stores/${storeId}/metrics/support`);
  return (res.data as any).data;
};

// --------------------------------------------------------
// War Room
// --------------------------------------------------------
export const fetchActiveIncident = async (storeId: string): Promise<WarRoomIncident | null> => {
  const res = await apiClient.get<ApiResponse<WarRoomIncident | null>>(`/stores/${storeId}/war-room`);
  return (res.data as any).data;
};

export const completeWarRoomAction = async (incidentId: string, actionId: string): Promise<void> => {
  await apiClient.post(`/war-room/${incidentId}/actions/${actionId}/complete`);
};

// --------------------------------------------------------
// Events
// --------------------------------------------------------
export const postEvent = async (payload: Record<string, unknown>): Promise<void> => {
  await apiClient.post('/events', payload);
};

export const fetchEventFeed = async (
  storeId: string,
  limit = 20,
): Promise<EventFeedItem[]> => {
  const res = await apiClient.get<PaginatedResponse<EventFeedItem>>(
    `/stores/${storeId}/events?limit=${limit}`,
  );
  return (res.data as any).data;
};
