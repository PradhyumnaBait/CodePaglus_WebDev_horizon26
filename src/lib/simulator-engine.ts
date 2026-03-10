import { 
  SaleEvent, 
  InventoryUpdateEvent, 
  SupportTicket, 
  EventFeedItem, 
  AlertSeverity 
} from '@/types';
import { DEFAULT_STORE_ID } from './config/constants';

export type Scenario = 'normal' | 'sales_spike' | 'inventory_crisis' | 'support_surge';

export interface SimulatorConfig {
  frequency: number; // events per minute
  storeId: string;
  scenario: Scenario;
}

export class SimulatorEngine {
  private config: SimulatorConfig;
  private timer: NodeJS.Timeout | null = null;
  private onEvent: (event: any) => void;

  private inventoryState: Record<string, number> = {
    'SKU-1001': 15,
    'SKU-1002': 45,
    'SKU-1003': 30,
    'SKU-1004': 8,
    'SKU-1005': 100,
  };

  private skus = [
    { sku: 'SKU-1001', name: 'Gaming Laptop X1', price: 85000, category: 'Electronics' },
    { sku: 'SKU-1002', name: 'Wireless Headset Z', price: 4200, category: 'Electronics' },
    { sku: 'SKU-1003', name: 'Mechanical Keyboard', price: 5500, category: 'Accessories' },
    { sku: 'SKU-1004', name: 'UltraWide Monitor', price: 28000, category: 'Electronics' },
    { sku: 'SKU-1005', name: 'Ergonomic Mouse', price: 3200, category: 'Accessories' },
  ];

  constructor(
    onEvent: (event: any) => void,
    config: Partial<SimulatorConfig> = {}
  ) {
    this.onEvent = onEvent;
    this.config = {
      frequency: 12, // 1 event every 5 seconds
      storeId: DEFAULT_STORE_ID,
      scenario: 'normal',
      ...config,
    };
  }

  public start() {
    if (this.timer) return;
    this.runLoop();
  }

  private runLoop() {
    const interval = (60 / this.config.frequency) * 1000;
    this.timer = setTimeout(() => {
      this.generateEvent();
      this.runLoop();
    }, interval);
  }

  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public setScenario(scenario: Scenario) {
    this.config.scenario = scenario;
    // Adjust frequency based on scenario
    if (scenario === 'sales_spike') this.config.frequency = 40;
    else if (scenario === 'inventory_crisis') this.config.frequency = 20;
    else if (scenario === 'support_surge') this.config.frequency = 25;
    else this.config.frequency = 12;
    
    console.log(`Simulator scenario changed to: ${scenario}`);
  }

  private generateEvent() {
    const rand = Math.random();
    
    let saleWeight = 0.6;
    let supportWeight = 0.2;

    if (this.config.scenario === 'sales_spike') {
        saleWeight = 0.85;
        supportWeight = 0.05;
    }
    if (this.config.scenario === 'support_surge') {
        supportWeight = 0.7;
        saleWeight = 0.2;
    }

    if (rand < saleWeight) {
      this.emitSale();
    } else if (rand < saleWeight + supportWeight) {
      this.emitTicket();
    } else {
      this.emitInventoryUpdate();
    }
  }

  private emitSale() {
    const skuObj = this.skus[Math.floor(Math.random() * this.skus.length)];
    const qty = 1;
    
    this.inventoryState[skuObj.sku] = Math.max(0, this.inventoryState[skuObj.sku] - qty);

    const sale: SaleEvent = {
      type: 'sale',
      order_id: `ORD-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      timestamp: new Date().toISOString(),
      amount: skuObj.price * qty,
      sku: skuObj.sku,
      store_id: this.config.storeId,
      payment_method: Math.random() > 0.3 ? 'card' : 'cash',
    };
    
    this.onEvent(sale);

    // Feed Item
    this.onEvent({
        id: `feed-${Date.now()}`,
        type: 'sale',
        message: `New sale: ${skuObj.name} (₹${sale.amount.toLocaleString()})`,
        timestamp: sale.timestamp,
        store_id: sale.store_id
    } as EventFeedItem);

    if (this.inventoryState[skuObj.sku] < 10) {
        this.emitInventoryUpdate(skuObj.sku);
    }
  }

  private emitInventoryUpdate(sku?: string) {
    const targetSku = sku || this.skus[Math.floor(Math.random() * this.skus.length)].sku;
    const skuObj = this.skus.find(s => s.sku === targetSku);

    if (this.config.scenario === 'inventory_crisis' && !sku) {
        this.inventoryState[targetSku] = Math.floor(Math.random() * 3);
    }

    const inv: InventoryUpdateEvent = {
      type: 'inventory_update',
      sku: targetSku,
      timestamp: new Date().toISOString(),
      on_hand: this.inventoryState[targetSku],
      reorder_point: 10,
      lead_time_days: 3,
      store_id: this.config.storeId,
    };
    
    this.onEvent(inv);

    if (inv.on_hand < inv.reorder_point) {
        this.onEvent({
            id: `feed-${Date.now()}`,
            type: 'inventory_update',
            message: `Low stock alert: ${skuObj?.name} (${inv.on_hand} remaining)`,
            timestamp: inv.timestamp,
            store_id: inv.store_id,
            severity: inv.on_hand === 0 ? 'crisis' : 'anomaly'
        } as EventFeedItem);
    }
  }

  private emitTicket() {
    const categories = ['return', 'damage', 'delivery', 'billing'];
    const event: SupportTicket = {
      ticket_id: `TKT-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
      timestamp: new Date().toISOString(),
      status: 'open',
      priority: Math.random() > 0.8 ? 'high' : 'medium',
      category: categories[Math.floor(Math.random() * categories.length)],
      store_id: this.config.storeId,
    };
    
    this.onEvent(event);

    this.onEvent({
        id: `feed-${Date.now()}`,
        type: 'ticket',
        message: `New support ticket: ${event.category} issue`,
        timestamp: event.timestamp,
        store_id: event.store_id,
        severity: event.priority === 'high' ? 'anomaly' : undefined
    } as EventFeedItem);
  }
}
