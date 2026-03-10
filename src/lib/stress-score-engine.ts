import { 
  StressScore, 
  SaleEvent, 
  InventoryUpdateEvent, 
  SupportTicket, 
  MetricType,
  ContributingFactor
} from '@/types';
import { SCORING_CONFIG } from './config/scoring';
import { getStressStatus, DEFAULT_STORE_ID } from './config/constants';

export class StressScoreEngine {
  private storeId: string;
  
  // Internal state for rolling calculation
  private state = {
    sales: {
      recentRevenue: 0,
      count: 0,
    },
    inventory: {
      items: new Map<string, number>(),
      reorderPoints: new Map<string, number>(),
    },
    support: {
      openTickets: new Set<string>(),
    }
  };

  constructor(storeId: string = DEFAULT_STORE_ID) {
    this.storeId = storeId;
  }

  /**
   * Updates internal state with a new event
   */
  public update(event: any) {
    if (event.type === 'sale') {
      const sale = event as SaleEvent;
      this.state.sales.recentRevenue += sale.amount;
      this.state.sales.count += 1;
    } 
    else if (event.type === 'inventory_update') {
      const inv = event as InventoryUpdateEvent;
      this.state.inventory.items.set(inv.sku, inv.on_hand);
      this.state.inventory.reorderPoints.set(inv.sku, inv.reorder_point);
    } 
    else if (event.type === 'ticket') {
      const ticket = event as SupportTicket;
      if (ticket.status === 'open') {
        this.state.support.openTickets.add(ticket.ticket_id);
      } else {
        this.state.support.openTickets.delete(ticket.ticket_id);
      }
    }
  }

  /**
   * Computes the current Stress Score based on accumulated state
   */
  public compute(): StressScore {
    // 1. Normalize Sales (0–100)
    // Based on hourly target. For simplicity, we assume this state represents approx current activity.
    const salesHealth = Math.min(100, (this.state.sales.recentRevenue / SCORING_CONFIG.NORMALIZATION.sales.target_hourly_revenue) * 100);

    // 2. Normalize Inventory (0–100)
    // % of monitored items above reorder point
    let inventoryHealth = 100;
    if (this.state.inventory.items.size > 0) {
      let healthyCount = 0;
      this.state.inventory.items.forEach((onHand, sku) => {
        const reorderPoint = this.state.inventory.reorderPoints.get(sku) || 10;
        if (onHand > reorderPoint) healthyCount++;
      });
      inventoryHealth = (healthyCount / this.state.inventory.items.size) * 100;
    }

    // 3. Normalize Support (0–100)
    // Decreases as ticket count increases
    const ticketCount = this.state.support.openTickets.size;
    const supportHealth = Math.max(0, 100 - (ticketCount / SCORING_CONFIG.NORMALIZATION.support.max_tickets_load) * 100);

    // 4. Weighted Health
    const weightedHealth = (
      (salesHealth * SCORING_CONFIG.WEIGHTS.sales) +
      (inventoryHealth * SCORING_CONFIG.WEIGHTS.inventory) +
      (supportHealth * SCORING_CONFIG.WEIGHTS.support)
    );

    // 5. Stress Score (100 - Health)
    const stressScoreValue = Math.round(100 - weightedHealth);
    
    // 6. Identify Top Contributors (where impact is most negative to health)
    const contributors: ContributingFactor[] = [];
    
    if (salesHealth < 70) {
        contributors.push({
            metric: 'sales',
            impact: Math.round((100 - salesHealth) * SCORING_CONFIG.WEIGHTS.sales * -1),
            label: 'Low Sales Momentum'
        });
    }
    if (inventoryHealth < 70) {
        contributors.push({
            metric: 'inventory',
            impact: Math.round((100 - inventoryHealth) * SCORING_CONFIG.WEIGHTS.inventory * -1),
            label: 'Stock-out Risks'
        });
    }
    if (supportHealth < 70) {
        contributors.push({
            metric: 'support',
            impact: Math.round((100 - supportHealth) * SCORING_CONFIG.WEIGHTS.support * -1),
            label: 'High Ticket Volume'
        });
    }

    // Sort by impact (most negative first)
    contributors.sort((a, b) => a.impact - b.impact);

    return {
      store_id: this.storeId,
      timestamp: new Date().toISOString(),
      score: stressScoreValue,
      stress_score: stressScoreValue,
      weighted_health: weightedHealth,
      status: getStressStatus(stressScoreValue),
      kpis: {
        sales: Math.round(salesHealth),
        inventory: Math.round(inventoryHealth),
        support: Math.round(supportHealth),
      },
      top_contributors: contributors.slice(0, 3),
    };
  }

  /**
   * Decay function to be called periodically (e.g., to simulate revenue window passing)
   */
  public decay() {
    this.state.sales.recentRevenue *= 0.9; // 10% decay per cycle
    if (this.state.sales.recentRevenue < 100) this.state.sales.recentRevenue = 0;
  }
}
