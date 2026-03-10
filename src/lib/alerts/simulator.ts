// ============================================================
// OpsPulse — Alert Simulator
// ============================================================
// Generates realistic alert scenarios for testing and demo

import { AlertRuleEngine, type AlertRuleResult } from './rule-engine';
import { DEFAULT_STORE_ID } from '@/lib/config/constants';

export interface AlertSimulatorConfig {
  enabled: boolean;
  frequency: number; // milliseconds between checks
  scenario: 'normal' | 'crisis' | 'opportunity' | 'mixed';
  storeId: string;
}

export class AlertSimulator {
  private config: AlertSimulatorConfig;
  private timer: NodeJS.Timeout | null = null;
  private onAlert: (alert: AlertRuleResult) => void;

  // State for realistic data generation
  private salesBaseline = 50000;
  private inventoryLevels: Record<string, number> = {
    'SKU-001': 150,
    'SKU-002': 45,
    'SKU-003': 300,
    'SKU-004': 8,
    'SKU-005': 200,
  };
  private cashBalance = 500000;

  constructor(
    onAlert: (alert: AlertRuleResult) => void,
    config: Partial<AlertSimulatorConfig> = {}
  ) {
    this.onAlert = onAlert;
    this.config = {
      enabled: true,
      frequency: 8000, // Check every 8 seconds
      scenario: 'normal',
      storeId: DEFAULT_STORE_ID,
      ...config,
    };
  }

  /**
   * Start the alert simulation loop
   */
  public start() {
    if (this.timer) return;
    console.log('[AlertSimulator] Starting with scenario:', this.config.scenario);
    this.simulationLoop();
  }

  /**
   * Stop the alert simulation
   */
  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      console.log('[AlertSimulator] Stopped');
    }
  }

  /**
   * Set scenario and restart
   */
  public setScenario(scenario: AlertSimulatorConfig['scenario']) {
    this.config.scenario = scenario;
    console.log('[AlertSimulator] Scenario changed to:', scenario);
  }

  /**
   * Main simulation loop
   */
  private simulationLoop() {
    this.generateAlerts();
    this.timer = setTimeout(() => {
      this.simulationLoop();
    }, this.config.frequency);
  }

  /**
   * Generate alerts based on current scenario
   */
  private generateAlerts() {
    const now = new Date();
    const hour = now.getHours();
    const isPeakHours = hour >= 10 && hour <= 20;

    // Determine expected window
    const expected_window: 'peak' | 'standard' | 'off_peak' = 
      isPeakHours ? 'peak' : (hour >= 18 && hour <= 22 ? 'standard' : 'off_peak');

    // Generate sales alert
    const salesAlert = this.generateSalesAlert(expected_window);
    if (salesAlert) {
      this.onAlert(salesAlert);
    }

    // Generate inventory alert
    const inventoryAlert = this.generateInventoryAlert();
    if (inventoryAlert) {
      this.onAlert(inventoryAlert);
    }

    // Generate cash flow alert
    const cashAlert = this.generateCashFlowAlert();
    if (cashAlert) {
      this.onAlert(cashAlert);
    }
  }

  /**
   * Generate sales-related alerts
   */
  private generateSalesAlert(
    expected_window: 'peak' | 'standard' | 'off_peak'
  ): AlertRuleResult | null {
    const variance = this.getVarianceForScenario();
    const current_sales = this.salesBaseline * (1 + variance);
    const avg_sales = this.salesBaseline;

    return AlertRuleEngine.detectSalesAlerts({
      current_sales,
      avg_sales,
      expected_window,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Generate inventory-related alerts
   */
  private generateInventoryAlert(): AlertRuleResult | null {
    // Pick random SKU
    const skus = Object.keys(this.inventoryLevels);
    const sku = skus[Math.floor(Math.random() * skus.length)];
    let stock = this.inventoryLevels[sku];

    // Simulate stock depletion based on scenario
    if (this.config.scenario === 'crisis') {
      stock = Math.max(0, stock - Math.random() * 30);
    } else if (this.config.scenario === 'opportunity') {
      stock = Math.min(500, stock + Math.random() * 20);
    } else {
      stock = stock - Math.random() * 5 + Math.random() * 3;
    }

    this.inventoryLevels[sku] = stock;

    // Safety stock threshold (typically 30% of max)
    const safety_stock = 50;

    return AlertRuleEngine.detectInventoryAlerts({
      product_id: sku,
      current_stock: Math.max(0, stock),
      safety_stock,
      reorder_point: safety_stock * 0.5,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Generate cash flow-related alerts
   */
  private generateCashFlowAlert(): AlertRuleResult | null {
    // Simulate cash in/out
    const cash_in = 50000 + Math.random() * 30000;
    const daily_variance = this.getVarianceForScenario();
    const cash_out = 40000 * (1 + daily_variance * 0.5);

    // Update balance
    this.cashBalance = this.cashBalance + cash_in - cash_out;

    const minimum_balance = 100000;

    return AlertRuleEngine.detectCashFlowAlerts({
      current_balance: Math.max(0, this.cashBalance),
      minimum_balance,
      cash_in,
      cash_out,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get variance multiplier based on scenario
   */
  private getVarianceForScenario(): number {
    switch (this.config.scenario) {
      case 'crisis':
        // Large negative variance: -40% to -60%
        return -0.4 - Math.random() * 0.2;
      case 'opportunity':
        // Large positive variance: +80% to +150%
        return 0.8 + Math.random() * 0.7;
      case 'mixed':
        // Random variance: -50% to +150%
        return -0.5 + Math.random() * 2.0;
      default:
        // Small variance: -20% to +20%
        return -0.2 + Math.random() * 0.4;
    }
  }
}
