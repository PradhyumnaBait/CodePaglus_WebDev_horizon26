# OpsPulse — UI/UX Design Document

## 1. Overall Visual Mood & Aesthetic

**Design Style:**
Modern SaaS dashboard with **clean enterprise analytics aesthetics**.

**Visual Characteristics**

• Minimalist
• Data-focused
• Highly readable
• Modular card layout
• Soft shadows and rounded corners
• High whitespace usage
• Clear information hierarchy

**Design Inspirations**

* Shopify Admin Dashboard
* Square Business Analytics
* Datadog monitoring UI
* PagerDuty Incident Management

**Core Visual Philosophy**

The interface must follow a **"Glanceable Intelligence"** design principle:

Users should understand the **business condition within 5 seconds**.

---

# 2. Color Palette

Based on the provided UI images, the color system follows a **neutral base with accent status colors**.

## Primary Brand Colors

| Color        | Usage                  | Hex         |
| ------------ | ---------------------- | ----------- |
| Primary Blue | Buttons, active states | **#3B82F6** |
| Dark Navy    | Header / hero elements | **#1E3A5F** |
| Soft Blue    | Graph highlights       | **#60A5FA** |

---

## Neutral Interface Colors

| Color              | Usage                | Hex         |
| ------------------ | -------------------- | ----------- |
| Background         | Main page background | **#F8FAFC** |
| Sidebar background | Navigation area      | **#F1F5F9** |
| Card background    | Widget cards         | **#FFFFFF** |
| Border color       | UI separation        | **#E5E7EB** |
| Muted text         | Secondary text       | **#6B7280** |
| Primary text       | Main labels          | **#111827** |

---

## Status Colors (Critical for OpsPulse)

| Status         | Color  | Hex         |
| -------------- | ------ | ----------- |
| Success        | Green  | **#22C55E** |
| Warning        | Orange | **#F59E0B** |
| Error / Crisis | Red    | **#EF4444** |
| Info           | Blue   | **#3B82F6** |
| Neutral        | Gray   | **#9CA3AF** |

---

## Stress Score Gauge Colors

| Score Range | Color       |
| ----------- | ----------- |
| Healthy     | **#22C55E** |
| Moderate    | **#F59E0B** |
| Critical    | **#EF4444** |

---

# 3. Typography

## Font Style

Recommended modern SaaS fonts:

Primary Font

**Inter**

Fallback Fonts

```
Inter, SF Pro Display, Roboto, Helvetica, Arial, sans-serif
```

---

## Typography Scale

| Element       | Size | Weight |
| ------------- | ---- | ------ |
| Page Title    | 28px | 700    |
| Section Title | 20px | 600    |
| Card Title    | 16px | 600    |
| Metric Value  | 26px | 700    |
| Body Text     | 14px | 400    |
| Small Labels  | 12px | 500    |

---

## Typography Guidelines

• Headings must always use **bold weights**
• Numbers should be **large and readable**
• Secondary text must use muted gray
• KPI numbers must always be **dark high-contrast**

Example:

```
Sales Today
$46,720
+12% vs yesterday
```

---

# 4. Layout Structure & Grid System

OpsPulse uses a **12-column responsive dashboard grid**.

---

## Main Layout Structure

```
-----------------------------------------------------
| Sidebar |            Main Dashboard               |
|        |------------------------------------------|
|        |  KPI Cards Row                          |
|        |------------------------------------------|
|        |  Analytics Charts                       |
|        |------------------------------------------|
|        |  Data Tables + Logs                     |
-----------------------------------------------------
```

---

## Sidebar

Width:

```
240px
```

Contains:

• Logo
• Navigation menu
• Settings
• User profile

Navigation items:

```
Dashboard
Sales
Inventory
Support
Analytics
Alerts
Settings
```

---

## Content Area

Max width:

```
1280px
```

Grid system:

```
12 column grid
24px gutter
```

---

## Dashboard Grid Example

Row 1

```
[Sales KPI] [Inventory KPI] [Support KPI] [Stress Score]
```

Row 2

```
[Sales Chart] [Sales Chart] [Customer Activity]
```

Row 3

```
[Product Table] [Event Feed]
```

---

# 5. Page Layouts

## Business Owner View

**Goal:** Quick understanding of business health.

Layout:

```
------------------------------------------------
Stress Score Gauge (Hero Component)
------------------------------------------------
Sales KPI | Inventory KPI | Support KPI
------------------------------------------------
Sales Trend Chart
------------------------------------------------
Top Alerts (3 cards)
------------------------------------------------
```

Key element:

**Large Stress Score Gauge**

Example:

```
Business Health Score

78 / 100

Status: Stable
```

---

## Operations Manager View

**Goal:** Deep operational monitoring.

3-Column Layout

```
----------------------------------------------
Alerts Queue | Operational Data | Event Feed
----------------------------------------------
```

Left Panel

```
Critical Alerts
Opportunity Alerts
Anomaly Alerts
```

Center Panel

```
Sales table
Inventory table
Support tickets
```

Right Panel

```
Live event feed
system updates
stock alerts
sales events
```

---

## War Room Mode

**Crisis Interface**

Layout:

```
----------------------------------------------
CRISIS HEADER (RED)
----------------------------------------------
Root Cause Analysis
----------------------------------------------
Action Buttons
----------------------------------------------
Live Incident Logs
----------------------------------------------
```

Example header:

```
CRISIS MODE ACTIVE
Inventory stockout in 2 hours
Estimated Loss: $3,200
```

---

# 6. Component Design System

## KPI Cards

Structure

```
--------------------------------
Metric Title
Large Value
Small Sparkline
Change Indicator
--------------------------------
```

Example

```
Sales Today
$12,430
↑ 14%
```

---

## Buttons

Primary Button

```
background: #3B82F6
color: white
padding: 10px 16px
border-radius: 8px
```

Hover

```
#2563EB
```

---

Secondary Button

```
border: 1px solid #E5E7EB
background: white
```

---

Danger Button

```
background: #EF4444
color: white
```

---

## Cards

Card style

```
background: white
border-radius: 12px
padding: 20px
box-shadow: 0 2px 6px rgba(0,0,0,0.05)
border: 1px solid #E5E7EB
```

---

## Tables

Tables should follow ERP style.

Structure:

```
------------------------------------------------
Product | Stock | Reorder | Status
------------------------------------------------
```

Row hover:

```
background: #F9FAFB
```

---

## Alert Badges

Critical

```
background: #FEE2E2
color: #B91C1C
```

Warning

```
background: #FEF3C7
color: #92400E
```

Success

```
background: #DCFCE7
color: #166534
```

---

# 7. Chart Style Guidelines

Charts must be simple and readable.

Libraries recommended:

• Recharts
• Tremor charts
• Chart.js

---

Line Chart

```
stroke-width: 2px
color: #3B82F6
```

Area Chart

```
gradient fill
opacity 0.15
```

Bar Chart

```
rounded bars
```

---

# 8. Spacing System

Use a **8px spacing system**.

Spacing scale:

| Size | Value |
| ---- | ----- |
| XS   | 4px   |
| SM   | 8px   |
| MD   | 16px  |
| LG   | 24px  |
| XL   | 32px  |
| XXL  | 48px  |

---

Padding standards

Cards

```
20px
```

Sections

```
32px
```

Page margin

```
24px
```

---

# 9. Icon System

Recommended library:

**Lucide Icons**

Examples

```
shopping-cart
box
alert-triangle
trending-up
users
```

Icon size

```
20px
```

---

# 10. Interaction & Animation

Animations should be **subtle and professional**.

Examples

Hover card lift

```
transform: translateY(-2px)
transition: 0.2s
```

Loading shimmer

```
skeleton loaders
```

Live data update

```
fade transition
```

---

# 11. Recommended Tech Stack

Frontend

```
React
Next.js
Tailwind CSS
Shadcn UI
Tremor Charts
```

Backend

```
Node.js
Express
WebSockets (real-time data)
```

Database

```
PostgreSQL
```

---

# 12. Design System Summary

OpsPulse UI principles:

1. **Glanceable Intelligence**
2. **Minimal cognitive load**
3. **Action-focused dashboards**
4. **Color-driven status communication**
5. **Real-time operational awareness**
