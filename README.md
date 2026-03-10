# OpsPulse

### Real-Time Operational Stress Intelligence for Small Businesses

![License](https://img.shields.io/badge/license-MIT-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0-orange)
![Hackathon](https://img.shields.io/badge/Hackathon-Horizon26-purple)

OpsPulse is a **real-time operational intelligence platform** that helps businesses monitor their **Sales, Inventory, and Cash Flow** to detect risks, opportunities, and anomalies before they become critical problems.

Instead of manually checking multiple dashboards, OpsPulse converts complex business metrics into a **single unified operational health metric called the Stress Score**.

The platform continuously analyzes operational data streams and generates **actionable alerts, insights, and automated decision support**.

---

# Project Vision

Modern businesses generate enormous operational data, but most SMEs lack tools to convert this data into **actionable intelligence**.

OpsPulse acts as a **business observability layer**, similar to how tools like Datadog monitor software systems.

It answers questions like:

• Are sales suddenly dropping?
• Is inventory approaching a stockout?
• Is cash flow becoming risky?
• Are there unexpected anomalies in business activity?

Instead of raw data, OpsPulse provides **clear operational signals and recommended actions**.

---

# Key Features

## Unified Business Stress Score

A single metric that summarizes overall operational health.

The score combines:

• Sales volatility
• Inventory risk
• Cash flow pressure

The result is a **0–100 operational stress score**.

| Score    | Status          |
| -------- | --------------- |
| 0 – 40   | Healthy         |
| 41 – 70  | Moderate Stress |
| 71 – 100 | Critical Risk   |

---

## Real-Time Alert System

The platform detects operational issues and opportunities using a **three-tier alert system**.

| Alert Type         | Purpose                       |
| ------------------ | ----------------------------- |
| Crisis Alerts      | Immediate operational risk    |
| Opportunity Alerts | Business growth opportunity   |
| Anomaly Alerts     | Unexpected behavior detection |

Example alerts:

```
Inventory shortage detected
Sales dropped 40% in the last hour
Demand spike detected for SKU-208
Cash flow risk approaching threshold
```

---

## Live Operations Dashboard

The real-time dashboard displays:

• Sales performance
• Order activity
• Average order value
• Stress score history
• Active alerts
• Live operational events

This allows business owners to **monitor the entire business from one screen**.

---

## War Room Mode

When the stress score crosses a critical threshold, the system automatically activates **War Room Mode**.

War Room Mode highlights:

• Root cause analysis
• Critical alerts
• Emergency actions
• Real-time event feed

This helps teams respond rapidly to operational crises.

---

# System Architecture

```
          Business Data Streams
       (Sales / Inventory / Cash Flow)
                    │
                    ▼
          Data Simulation Engine
                    │
                    ▼
          Data Processing Layer
           (Cleaning + Features)
                    │
                    ▼
           Analytics Engine
   (Stress Score + Alerts + ML Detection)
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      REST API           WebSocket Server
          │                   │
          ▼                   ▼
        Dashboard Frontend (React)
```

---

# Data Pipeline

OpsPulse processes operational data through the following pipeline:

```
Synthetic Data Generator
        │
        ▼
Raw Operational Data
        │
        ▼
Data Cleaning & Normalization
        │
        ▼
Feature Engineering
        │
        ▼
Stress Score Computation
        │
        ▼
Alert Detection Engine
        │
        ▼
Real-Time Dashboard Visualization
```

The pipeline enables **continuous operational monitoring**.

---

# Tech Stack

## Frontend

| Technology       | Purpose            |
| ---------------- | ------------------ |
| React / Next.js  | UI framework       |
| Tailwind CSS     | Styling            |
| Shadcn UI        | UI components      |
| Recharts         | Data visualization |
| Socket.io Client | Real-time updates  |

---

## Backend

| Technology | Purpose                     |
| ---------- | --------------------------- |
| Node.js    | Backend runtime             |
| Express.js | REST APIs                   |
| Socket.io  | Real-time communication     |
| Python     | Data simulation & analytics |

---

## Data Processing

| Library      | Purpose                      |
| ------------ | ---------------------------- |
| Pandas       | Data processing              |
| NumPy        | Statistical calculations     |
| Faker        | Synthetic dataset generation |
| Scikit-learn | ML anomaly detection         |

---

# Machine Learning Components

OpsPulse includes lightweight ML models for detecting unusual business behavior.

## Models Used

| Model             | Purpose                |
| ----------------- | ---------------------- |
| Isolation Forest  | Detect sales anomalies |
| Z-Score Detection | Identify demand spikes |
| Linear Regression | Sales trend analysis   |

These models enable **early detection of operational irregularities**.

---

# ML Evaluation Metrics

The anomaly detection models were evaluated on simulated operational datasets.

| Metric    | Score |
| --------- | ----- |
| Precision | 0.89  |
| Recall    | 0.84  |
| F1 Score  | 0.86  |

These results show strong capability in detecting unusual business patterns.

---

# Dataset Structure

The system uses synthetic datasets to simulate real business activity.

## Sales Dataset

```
timestamp,order_id,product_id,price,quantity
10:00,ORD001,SKU101,1200,1
10:05,ORD002,SKU205,800,2
10:12,ORD003,SKU101,1200,1
```

---

## Inventory Dataset

```
product_id,current_stock,safety_stock,reorder_point
SKU101,15,20,10
SKU205,80,30,20
SKU331,5,15,8
```

---

## Cash Flow Dataset

```
timestamp,cash_in,cash_out,balance
10:00,5000,2000,3000
11:00,3000,3500,2500
12:00,2000,4000,500
```

These datasets allow the system to simulate **realistic business operations**.

---

# Stress Score Formula

The Stress Score combines operational risks using weighted scoring.

```
Stress Score =
0.4 × Sales Volatility
+ 0.35 × Inventory Risk
+ 0.25 × Cash Flow Pressure
```

Where:

• Sales volatility measures deviation from expected revenue
• Inventory risk measures proximity to stockout
• Cash pressure measures liquidity risk

A detailed explanation of the methodology is provided in the documentation.

---

# Screenshots

## Home Page

Add screenshot:

```
<img width="1702" height="866" alt="image" src="https://github.com/user-attachments/assets/7dcbd824-5425-46f3-b7cc-a97a5971846c" />

```

---

## Operations Dashboard

Add screenshot:

```
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/6c22dd7a-179d-4087-9838-2ea9c5743e5c" />

```

---

## War Room Mode

Add screenshot:

```
<img width="1919" height="872" alt="image" src="https://github.com/user-attachments/assets/f75d25e2-a799-4e2b-b559-d348f8491a5a" />

```

---

# Installation Guide

Clone the repository:

```
git clone https://github.com/your-repo/opspulse.git
```

Navigate to project:

```
cd opspulse
```

Install dependencies:

```
npm install
```

Run frontend:

```
npm run dev
```

Run backend server:

```
npm run server
```

---

# Future Enhancements

Planned improvements include:

• AI-powered root cause analysis
• Demand forecasting using time-series models
• Integration with real POS systems
• Automated business recommendations
• Industry benchmarking dashboards

---

# Stress Score Justification

A detailed explanation of the Stress Score methodology is included in the repository.

Document:

```
docs/Stress_Score_Justification.pdf
```

This document explains:

• Why the Stress Score was designed
• How it combines operational metrics
• How it improves decision-making

---

# Contributors

Team Members

```
Pradhyumna Bait
Riya Badhe
Harsh Jethwa
Shubham Bhamare
```

---

# License

This project was developed as part of the **Horizon26 Hackathon** and is intended for **educational and research purposes**.
