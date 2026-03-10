// ============================================================
// OpsPulse — Alert Rule Detection Engine
// ============================================================
// Implements business logic for detecting Crisis, Opportunity,
// and Anomaly alerts based on Sales, Inventory, and Cash Flow data

import type { Alert, AlertSeverity } from '@/types';

// --------------------------------------------------------
// Interfaces
// --------------------------------------------------------

export interface SalesData {
  current_sales: number;
  avg_sales: number;
  expected_window: 'peak' | 'standard' | 'off_peak';
  timestamp: string;
}

export interface InventoryData {
  product_id: string;
  current_stock: number;
  safety_stock: number;
  reorder_point: number;
  timestamp: string;
}

export interface CashFlowData {
  current_balance: number;
  minimum_balance: number;
  cash_in: number;
  cash_out: number;
  timestamp: string;
}

export interface AlertRuleResult {
  type: 'sales_drop' | 'demand_spike' | 'inventory_shortage' | 'cash_crisis' | 'anomaly';
  severity: AlertSeverity;
  message: string;
  description: string;
  source: 'sales' | 'inventory' | 'cashflow';
  metadata: Record<string, any>;
}

// --------------------------------------------------------
// Alert Rule Engine
// --------------------------------------------------------

export class AlertRuleEngine {
  /**
   * Detect sales-related alerts
   * - Crisis: sales_change < -30%
   * - Opportunity: sales_change > +100% (2× avg demand)
   * - Anomaly: |sales_change| > 30% outside expected window
   */
  static detectSalesAlerts(data: SalesData): AlertRuleResult | null {
    const { current_sales, avg_sales, expected_window, timestamp } = data;
    
    // Calculate percentage change
    const sales_change = (current_sales - avg_sales) / avg_sales;
    const change_pct = Math.round(sales_change * 100);

    // Crisis: 30% drop
    if (sales_change < -0.30) {
      return {
        type: 'sales_drop',
        severity: 'crisis',
        message: 'Critical Sales Drop Detected',
        description: `Sales have dropped ${Math.abs(change_pct)}% from average. Current: ₹${current_sales.toLocaleString()} vs Average: ₹${avg_sales.toLocaleString()}. Immediate analysis required.`,
        source: 'sales',
        metadata: {
          current_sales,
          avg_sales,
          change_pct,
          timestamp,
        },
      };
    }

    // Opportunity: 100% spike (2× average)
    if (sales_change > 1.0) {
      return {
        type: 'demand_spike',
        severity: 'opportunity',
        message: 'Exceptional Demand Surge',
        description: `Sales have spiked ${change_pct}% above average! Current: ₹${current_sales.toLocaleString()} vs Average: ₹${avg_sales.toLocaleString()}. Scale operations to capture opportunity.`,
        source: 'sales',
        metadata: {
          current_sales,
          avg_sales,
          change_pct,
          timestamp,
        },
      };
    }

    // Anomaly: unusual pattern outside expected window
    if (Math.abs(sales_change) > 0.30 && expected_window !== 'peak') {
      return {
        type: 'anomaly',
        severity: 'anomaly',
        message: 'Unusual Sales Pattern Detected',
        description: `Unexpected ${change_pct > 0 ? 'surge' : 'drop'} of ${Math.abs(change_pct)}% detected during ${expected_window} hours. This pattern requires investigation.`,
        source: 'sales',
        metadata: {
          current_sales,
          avg_sales,
          expected_window,
          change_pct,
          timestamp,
        },
      };
    }

    return null;
  }

  /**
   * Detect inventory-related alerts
   * - Crisis: inventory_risk > 0.5 (current_stock < 50% of safety_stock)
   */
  static detectInventoryAlerts(data: InventoryData): AlertRuleResult | null {
    const { product_id, current_stock, safety_stock, timestamp } = data;

    const inventory_risk = (safety_stock - current_stock) / safety_stock;
    const risk_pct = Math.round(inventory_risk * 100);

    // Crisis: Risk > 50% (stock < 50% of safety level)
    if (inventory_risk > 0.5) {
      const days_until_stockout = current_stock > 0 
        ? Math.ceil(current_stock / ((safety_stock - current_stock) / 7)) 
        : 0;

      return {
        type: 'inventory_shortage',
        severity: 'crisis',
        message: `${product_id} — Critical Stock Warning`,
        description: `Stock level critically low. Current: ${current_stock} units, Safety Stock: ${safety_stock} units. Risk Level: ${risk_pct}%. ${days_until_stockout > 0 ? `Estimated stockout in ${days_until_stockout} days.` : 'Immediate reorder required.'}`,
        source: 'inventory',
        metadata: {
          product_id,
          current_stock,
          safety_stock,
          inventory_risk,
          risk_pct,
          timestamp,
        },
      };
    }

    // Anomaly: Unexpected stock changes
    // (Product using more stock than typical usage rate)
    if (current_stock < safety_stock * 0.7) {
      return {
        type: 'anomaly',
        severity: 'anomaly',
        message: `${product_id} — Stock Below Threshold`,
        description: `Stock has depleted to ${current_stock} units (${Math.round((current_stock / safety_stock) * 100)}% of safety level). Consider increasing order quantity.`,
        source: 'inventory',
        metadata: {
          product_id,
          current_stock,
          safety_stock,
          timestamp,
        },
      };
    }

    return null;
  }

  /**
   * Detect cash flow-related alerts
   * - Crisis: cash_stress > 0 (balance < minimum_balance)
   */
  static detectCashFlowAlerts(data: CashFlowData): AlertRuleResult | null {
    const { current_balance, minimum_balance, cash_in, cash_out, timestamp } = data;

    const cash_stress = (minimum_balance - current_balance) / minimum_balance;

    // Crisis: balance below minimum
    if (cash_stress > 0) {
      const stress_pct = Math.round(cash_stress * 100);
      const daily_burn = cash_out - cash_in;
      const days_until_empty = current_balance > 0 && daily_burn > 0
        ? Math.ceil(current_balance / daily_burn)
        : 0;

      return {
        type: 'cash_crisis',
        severity: 'crisis',
        message: 'Critical Cash Position Alert',
        description: `Cash balance has fallen below minimum threshold. Current: ₹${current_balance.toLocaleString()}, Minimum Required: ₹${minimum_balance.toLocaleString()}. Stress Level: ${stress_pct}%. ${daily_burn > 0 && days_until_empty > 0 ? `Days of runway remaining: ${days_until_empty}` : 'Monitor cash flow closely.'}`,
        source: 'cashflow',
        metadata: {
          current_balance,
          minimum_balance,
          cash_stress,
          stress_pct,
          daily_burn,
          days_until_empty,
          timestamp,
        },
      };
    }

    // Anomaly: unusual cash out spike
    if (cash_out > cash_in * 1.5) {
      return {
        type: 'anomaly',
        severity: 'anomaly',
        message: 'Elevated Cash Outflow Detected',
        description: `Cash outflow has increased significantly. Current: ₹${cash_out.toLocaleString()} out vs ₹${cash_in.toLocaleString()} in. Review recent transactions for unexpected charges.`,
        source: 'cashflow',
        metadata: {
          cash_in,
          cash_out,
          ratio: Math.round((cash_out / cash_in) * 100) / 100,
          timestamp,
        },
      };
    }

    return null;
  }

  /**
   * Check if War Room activation is warranted
   * - Activate if 3+ crisis alerts are active
   */
  static shouldActivateWarRoom(activeAlerts: AlertRuleResult[]): boolean {
    const crisisCount = activeAlerts.filter((a) => a.severity === 'crisis').length;
    return crisisCount >= 3;
  }

  /**
   * Get icon for alert type
   */
  static getAlertIcon(type: AlertRuleResult['type']): string {
    const icons: Record<AlertRuleResult['type'], string> = {
      'sales_drop': '📉',
      'demand_spike': '📈',
      'inventory_shortage': '📦',
      'cash_crisis': '💰',
      'anomaly': '⚠️',
    };
    return icons[type];
  }

  /**
   * Get color for severity
   */
  static getSeverityColor(severity: AlertSeverity): string {
    const colors: Record<AlertSeverity, string> = {
      'crisis': '#EF4444',      // red-500
      'opportunity': '#22C55E',  // green-500
      'anomaly': '#EAB308',      // yellow-500
      'warning': '#F97316',      // orange-500
      'info': '#3B82F6',         // blue-500
    };
    return colors[severity];
  }
}

// --------------------------------------------------------
// Utility: Convert rule result to Alert entity
// --------------------------------------------------------
export function ruleResultToAlert(
  result: AlertRuleResult,
  storeId: string,
): Omit<Alert, 'id' | 'alert_id'> {
  return {
    store_id: storeId,
    severity: result.severity,
    title: result.message,
    description: result.description,
    status: 'active',
    timestamp: new Date().toISOString(),
  };
}
