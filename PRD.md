# OpsPulse — Final Product Requirements Document (PRD)

**Project:** OpsPulse — Retail Pulse Command Center
**Prepared for:** Development / AI-building teams
---

## Contents (quick nav)

1. Project overview & goals
2. Target audience (personas + Real Person Test)
3. Required pages / screens
4. Core features (P0 / P1 expanded)
5. User journeys (A, B, C)
6. Success metrics & acceptance criteria
7. Data model & API contracts (developer-ready)
8. Alerting, War Room & Stress Score justification (summary)
9. Security, privacy & scalability notes
10. Roadmap & implementation plan
11. Competitive analysis (3 competitors)
12. Appendix: UX / design notes, deliverables

> Read this doc as the single authoritative spec for the hackathon MVP. Build P0 first, P1 next. P2 / future items can be roadmap items.

---

# 1. Project overview & goals

**Summary**
OpsPulse is a focused, real-time Business Health Dashboard for **small retail stores**. It ingests live (simulated) streams from Sales, Inventory, and Support, computes a single **Business Stress Score**, raises tiered alerts (Crisis / Anomaly / Opportunity), provides distinct Owner and Operations Manager interfaces, and offers a War Room Mode for crisis response.

**Primary goals**

* Provide a one-screen answer to “How is my business doing right now?”
* Detect operational issues early and deliver actionable steps
* Demonstrate a robust real-time pipeline and War Room workflow for judges/customers

**Non-goals for MVP**

* Full production integrations with third-party POS platforms (future)
* Complex ML models (P2+)

---

# 2. Target audience definition

### Primary persona — Rajesh

Rajesh runs a single-outlet electronics store. He uses a POS, Excel and WhatsApp. Pain: “I only find out about stockouts after customers leave. I need one screen that tells me what to do now.” He will use OpsPulse because it provides instant, actionable alerts.

### Secondary persona — Operations Manager (Anita)

Manages 2–3 stores, needs drilldowns, assignable alerts, War Room coordination.

### Environment & constraints

* Devices: Desktop (primary), tablet/phone (secondary)
* Connectivity: Possibly intermittent — UI must degrade gracefully
* Security: Role-based access for Owner / Ops Manager

---

# 3. Complete list of required pages (screens)

> Each item: purpose + minimum UI elements

**Public / Auth**

1. Landing / Login — email/password + guest/demo mode
2. Onboarding / Demo Setup — choose store profile, scenario controls

**Owner (high level)**
3. Owner Dashboard — Stress Score gauge, 3 KPI cards, top 3 alerts, War Room button
4. Alerts Center (Owner) — timeline, quick actions

**Operations Manager (detailed)**
5. Ops Dashboard — alert queue, KPI panels, event feed, action cards
6. Inventory Detail — SKU table (on_hand, reorder_point, lead_time, projected stockout)
7. Sales Detail — recent transactions, top SKUs, revenue trends
8. Support / Tickets — queue, avg resolution, CSAT (simulated)
9. War Room Mode — crisis summary, action cards, checklist, simulate impact

**Admin & utilities**
10. Simulator Control Panel — start/stop, inject scenarios, message rate
11. Settings / Account — roles, notification preferences (webhook placeholders)
12. One-page Stress Score Justification — downloadable PDF/print
13. Logs & History / Export — CSV / PDF exports

---

# 4. Core features (expanded) — P0 (Must-have) & P1 (Should-have)

Below each feature: functionality, user flow, technical requirements, priority, success criteria.

---

## P0 — Must-Have Features

### 4.1 Real-Time Data Simulation & Ingestion

**Functionality:** Simulate and publish continuous events for Sales, Inventory, Support. Events are timestamped and pushed to backend for processing. Provide admin controls to inject scenarios (stock-out, cash shock, high returns) and control rate.

**User flow:** Admin → Simulator → Start → Events stream → Backend processes → Dashboards update.

**Technical requirements:**

* Simulation service (Node.js or Python) configurable rate & scenarios
* Standardized JSON event schema per vertical
* Pub/Sub or lightweight event bus (Redis Pub/Sub acceptable)
* WebSocket (or SSE) channel for client pushes
* Persist events in DB (Postgres or Timescale) for history

**Priority:** Must-Have

**Success criteria:**

* 3 streams active simultaneously; events arrive and are processed every 5–10s
* Scenario injection reproducible in demo

---

### 4.2 Stress Score Engine

**Functionality:** Normalize KPIs to 0–100, compute WeightedHealth and StressScore = 100 − WeightedHealth. Store timeseries for trend charts and historical queries.

**User flow:** Event arrives → metric normalization → weighted aggregation → score persisted → clients receive update.

**Technical requirements:**

* Metric normalization functions (configurable)
* Weights stored in config (editable)
* Calculation service (stateless, quick) with caching (Redis)
* Persistence of scores (every N seconds) in DB

**Priority:** Must-Have

**Success criteria:**

* Score updates within 2s of incoming event; remains 0–100; trends reflect events

---

### 4.3 Owner Dashboard (single-screen)

**Functionality:** One-screen summary: large gauge, 3 KPI cards (Sales, Inventory, Support), top alerts, quick recommended actions, War Room trigger.

**User flow:** Owner logs in → sees real-time gauge & KPIs → clicks alert for detail or War Room.

**Technical requirements:**

* React UI with WebSocket client
* Visual components: gauge, sparklines, alerts list
* Lightweight REST API for on-load historical data

**Priority:** Must-Have

**Success criteria:**

* Loads <2s; owner can interpret health in ≤10s; updates visible live

---

### 4.4 Operations Manager Dashboard

**Functionality:** Detailed operational UI: alert queue (filter/sort), per-SKU inventory view, ticket queue, event feed, actions (ack/assign/resolve).

**User flow:** Ops logs in → sees alerts → drills into SKU → assigns action → marks resolved.

**Technical requirements:**

* Alert management API (state transitions)
* Data tables with server-side paging
* WebSocket for live updates

**Priority:** Must-Have

**Success criteria:**

* Alerts shown immediately; manager can assign & log actions; drilldowns load in <3s

---

### 4.5 Three-Tier Intelligent Alert System

**Functionality:** Detect and classify alerts into Crisis / Anomaly / Opportunity using thresholds, rate-of-change, and per-KPI rules. Enrich alerts with top contributing KPIs and recommended actions.

**User flow:** Event triggers alert → alert pushed to Owner & Ops → recommended actions visible → user takes action.

**Technical requirements:**

* Rule engine (configurable rules/thresholds)
* Alert persistence and unique id schema
* Notification push via WebSocket (and webhook placeholders)

**Priority:** Must-Have

**Success criteria:**

* Alerts generate within 5s of trigger; correct classification in demo scenarios; recommendations included

---

### 4.6 War Room Mode

**Functionality:** Auto-activate on Crisis; focused interface showing only urgent items: top 3 root causes, action cards (one-click simulated actions), checklist with owners, live feed, simulate impact toggle.

**User flow:** Crisis fires → War Room appears for Ops/Owner → choose action → system simulates/replays impact → mark tasks resolved.

**Technical requirements:**

* Crisis detection trigger
* Dedicated UI overlay/page
* Action handlers that modify simulator state (for demo)
* Audit trail of actions

**Priority:** Must-Have

**Success criteria:**

* Auto-activation on Crisis; top causes surfaced in ≤2s; actions require ≤3 clicks; stress score shows recovery after simulated action

---

## P1 — Should-Have Features

### 4.7 Alert Acknowledgement & Assignment

**Functionality:** Allow assignment of alerts to team members, track lifecycle (Open → Assigned → In Progress → Resolved), show timestamps, SLA metrics.

**User flow:** Ops picks alert → assigns to user/email → assignee acknowledges → resolves → system logs timeline.

**Technical requirements:**

* Alert state machine in DB
* User management (simple)
* UI for assignment and status changes

**Priority:** Should-Have

**Success criteria:**

* Alerts traceable; assignments recorded; resolution times visible

---

### 4.8 Inventory Stockout Prediction

**Functionality:** Predict stockout time per SKU using current on_hand, rolling sales velocity and lead_time. Display days until stockout and suggested reorder quantity.

**User flow:** Inventory page shows predicted stockout for SKU → manager clicks reorder suggestion → confirm simulated reorder.

**Technical requirements:**

* Rolling window sales computation
* Prediction algorithm (deterministic formula)
* UI indicators and recommendation buttons

**Priority:** Should-Have

**Success criteria:**

* Predictions accurate for simulated data; early alerts generated ahead of stockout

---

### 4.9 Basic Anomaly Detection

**Functionality:** Simple statistical anomaly detection (moving average, std dev, z-score) to detect sudden drops/spikes in KPIs.

**User flow:** System monitors metric windows, detects anomaly → pushes Anomaly alert → user investigates.

**Technical requirements:**

* Time-series aggregator
* Anomaly detection service running windowed checks
* Integration with alert engine

**Priority:** Should-Have

**Success criteria:**

* Detects injected anomalies with low false positives in demo

---

### 4.10 Data Export (Reports)

**Functionality:** Export Stress Score history, KPI snapshots, and alert logs as CSV/PDF for chosen time ranges.

**User flow:** User selects range → hits Export → file downloads.

**Technical requirements:**

* Export service (CSV/PDF generation)
* REST endpoint for exports

**Priority:** Should-Have

**Success criteria:**

* Exports generated <5s; data accurate & readable

---

# 5. User journey mapping (concise)

### Journey A — Rajesh (Owner) — Morning quick check

1. Login → Owner Dashboard
2. View Stress Score & top alerts (≤10s)
3. Click suggestion → acknowledge/dismiss
   **Goal:** understand status in one glance.

### Journey B — Anita (Ops) — Crisis response

1. Crisis alert → War Room auto-open
2. Review top causes → pick action (reorder / escalate)
3. Apply action (system simulates) → mark done
   **Goal:** coordinate response quickly with minimal noise.

### Journey C — Judge demo / replay

1. Admin opens Simulator → inject inventory crisis
2. Owner sees score jump → Ops War Room opens → perform action
3. Show recovery + download justification PDF
   **Goal:** reproducible demo in <2 minutes.

---

# 6. Success metrics (product & system)

**Demo & product KPIs**

* Demo reliability: 95% success across 3 rehearsals
* Alert accuracy for scenarios: ≥90%
* Owner comprehension: 4/5 owners can read health status in ≤10s
* Actionability: Ops can take action in ≤3 clicks

**System KPIs**

* WebSocket latency median ≤200ms (local demo)
* Score recomputation latency ≤2s per event
* Throughput: 200 events/min without UI lag
* Uptime ≥99% during demo window

---

# 7. Data model & API contracts (developer-friendly)

### Event schemas (JSON)

**Sales event**

```json
{
  "type": "sale",
  "order_id": "ORD12345",
  "timestamp": "2026-03-10T12:23:45+05:30",
  "amount": 4200.00,
  "sku": "SKU-1001",
  "store_id": "STORE-01",
  "payment_method": "card"
}
```

**Inventory event**

```json
{
  "type": "inventory_update",
  "sku": "SKU-1001",
  "timestamp": "2026-03-10T12:20:00+05:30",
  "on_hand": 12,
  "reorder_point": 20,
  "lead_time_days": 5,
  "store_id": "STORE-01"
}
```

**Ticket event**

```json
{
  "type": "ticket",
  "ticket_id": "TKT100",
  "timestamp": "2026-03-10T11:58:00+05:30",
  "status": "open",
  "priority": "high",
  "category": "return",
  "store_id": "STORE-01"
}
```

### Stress Score compute endpoint (internal)

`POST /internal/compute_score`
Payload: `{ "store_id": "STORE-01", "window_seconds": 180 }`
Response:

```json
{
  "store_id": "STORE-01",
  "timestamp": "2026-03-10T12:30:00+05:30",
  "kpis": { "sales": 72, "inventory": 45, "support": 60 },
  "weighted_health": 54.45,
  "stress_score": 45.55,
  "top_contributors": [ { "metric":"inventory", "impact": -18.2 } ]
}
```

### WebSocket push message

Channel: `store-STORE-01`
Message type: `score_update` with payload as above.

### Alert object

```json
{
  "alert_id": "ALERT-20260310-0001",
  "store_id": "STORE-01",
  "severity": "crisis",
  "title": "Stock-out risk for SKU-1001",
  "description": "Projected stockout in 2 hours while sales velocity increased 40%",
  "timestamp": "...",
  "recommended_actions": [ { "id":"act1", "label":"Emergency reorder", "impact_estimate":"−15 stress pts" } ],
  "status": "open",
  "assigned_to": null
}
```

---

# 8. Alerting, War Room & Stress Score (summary & judge-ready points)

**Stress Score pattern**

* Normalize KPIs to 0–100, compute WeightedHealth (weights configurable), StressScore = 100 − WeightedHealth. Provide one-page justification with weights, formulas, thresholds, and robustness handling (last-known-value, missing data handling).

**Alert tiers**

* Crisis: StressScore ≥ 80 or large jump in short window or critical cash/stock risk. → War Room.
* Anomaly: Statistical deviation (e.g., >3σ or z-score threshold) → investigate.
* Opportunity: Positive spikes (Sales Momentum ↑ while inventory healthy) → recommend action.

**War Room**

* Auto-activate on Crisis, show root causes, one-click actions, simulated impact, and checklist with assignment + audit trail.

---

# 9. Security, privacy & scalability notes

**Security (MVP)**

* Basic auth; store hashed passwords
* Role-based access (Owner / Ops)
* Use HTTPS in production; local demo can be HTTP

**Privacy**

* Demo uses simulated data. For future real data: opt-in, retention policy, ability to delete data.

**Scalability (future)**

* Stateless API + Redis Pub/Sub for event distribution
* Postgres/TimescaleDB for persistence
* WebSocket layer behind load balancer

---

# 10. Roadmap & implementation plan (high level)

**Sprint 0 (Design)**

* Finalize data model, wireframes, simulator stubs

**Week 1 (Core)**

* Simulator → backend processing → Stress Score engine → Owner Dashboard (P0)

**Week 2 (Ops & Alerts)**

* Alert engine, Ops Dashboard, War Room logic (P0)

**Week 3 (Polish & Deliverables)**

* Simulator control, Stress Score one-pager, exports, demo rehearsals (P1 features)

**Future (P2)**

* ML demand prediction, real integrations (Shopify, POS), mobile app

---

# 11. Competitive analysis (concise comparisons)

**Competitors analyzed:** Looker Studio, Metabase, Scoro

### Looker Studio — what they do well

* Extensive connectors, flexible visualizations, Google Workspace sharing.

**Missing / opportunity**

* No real-time operational health score, no War Room, no role-specific operational UX.

**OpsPulse differentiation**

* Business Stress Score, real-time alerts, War Room, Owner vs Ops UIs.

---

### Metabase — what they do well

* Self-service analysis, open-source, easy DB connectivity.

**Missing / opportunity**

* Requires manual interpretation; not operations-first.

**OpsPulse differentiation**

* Automated interpretation, business-specific KPIs, action recommendations.

---

### Scoro — what they do well

* Unified business workflows for services; project & finance visibility.

**Missing / opportunity**

* Not retail-centric; not real-time crisis management.

**OpsPulse differentiation**

* Retail command center, stockout prediction, War Room.

---

# 12. Appendix — UX / design notes, acceptance & deliverables

**Design tone**

* Minimal, high-contrast for alerts, large gauge for Stress Score
* Color rule: Stress ≤25 (green), 25–75 (amber), ≥75 (red)

**Animations**

* Subtle gauge transitions, avoid flashy effects during War Room

**Accessibility**

* Keyboard focusable actions; clear labels on War Room buttons

**MVP deliverables**

* Source repo + README + Docker Compose run instructions
* Live demo URL (or instructions to run locally)
* One-page Stress Score justification PDF
* 2–3 canned scenario payloads for judging

---

