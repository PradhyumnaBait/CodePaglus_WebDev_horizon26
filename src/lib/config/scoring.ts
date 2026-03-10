// ============================================================
// OpsPulse — Stress Score Configuration
// Weights, Thresholds, and Normalization Rules
// ============================================================

export const SCORING_CONFIG = {
  // Relative importance of each vertical (must sum to 1.0)
  WEIGHTS: {
    sales:     0.5,
    inventory: 0.3,
    support:   0.2,
  },

  // Normalization parameters for raw metrics
  NORMALIZATION: {
    sales: {
      target_hourly_revenue: 25000, // ₹25K average per hour
      min_revenue: 0,
    },
    inventory: {
      critical_stock_threshold: 5,  // Below this is critical
      low_stock_threshold: 20,     // Below this is low
    },
    support: {
      max_tickets_load: 50,         // Beyond 50 open tickets is critical
      avg_resolution_target: 60,    // 60 minutes resolution target
    }
  },

  // Window for statistical calculations (seconds)
  CALCULATION_WINDOW: 180, // 3 minutes
};

export type ScoringWeights = typeof SCORING_CONFIG.WEIGHTS;
