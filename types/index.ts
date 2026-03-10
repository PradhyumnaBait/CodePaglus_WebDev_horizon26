import { ObjectId } from "mongodb";

// ─── Users ───────────────────────────────────────────────────────────────────
export interface IUser {
  _id?: ObjectId;
  fullName: string;
  email: string;
  mobile: string;
  passwordHash: string;
  businessId: ObjectId;
  role: "admin" | "employee";
  createdAt: Date;
  updatedAt: Date;
}

// ─── Businesses ──────────────────────────────────────────────────────────────
export interface IBusiness {
  _id?: ObjectId;
  name: string;
  type:
    | "ecommerce"
    | "retail"
    | "restaurant"
    | "saas"
    | "other";
  ownerUserId: ObjectId;
  createdAt: Date;
}

// ─── Inventory ───────────────────────────────────────────────────────────────
export interface IInventory {
  _id?: ObjectId;
  businessId: ObjectId;
  productName: string;
  sku: string;
  stockQuantity: number;
  purchasePrice: number;
  salePrice: number;
  category: string;
  lowStockAlert: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Reports ─────────────────────────────────────────────────────────────────
export interface ICashFlowEntry {
  date: string; // "YYYY-MM-DD" or day label
  revenue: number;
  expenses: number;
}

export interface IReport {
  _id?: ObjectId;
  businessId: ObjectId;
  reportDate: Date;
  healthScore: number;
  salesSummary: {
    totalRevenue: number;
    totalOrders: number;
  };
  inventorySummary: {
    totalItems: number;
    lowStockItems: number;
  };
  cashFlowSummary: ICashFlowEntry[];
  alerts: string[];
  pdfPath: string;
  createdAt: Date;
}

// ─── OTP ─────────────────────────────────────────────────────────────────────
export interface IOTP {
  _id?: ObjectId;
  userId: ObjectId;
  otpCode: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// ─── JWT Payload ─────────────────────────────────────────────────────────────
export interface JWTPayload {
  userId: string;
  businessId: string;
  role: "admin" | "employee";
  email: string;
}

// ─── API Response helpers ────────────────────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
