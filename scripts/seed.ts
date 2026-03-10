/**
 * OpsPulse — MongoDB Seed Script
 * Run: npx ts-node scripts/seed.ts
 * Or: npm run seed
 */

import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("MONGO_URI not found in .env.local");

// ─── Fixed ObjectIds so references stay consistent ────────────────────────────
const BIZ_IDS = {
  techZone:     new ObjectId("65f000000000000000000001"),
  fashionHub:   new ObjectId("65f000000000000000000002"),
  foodCorner:   new ObjectId("65f000000000000000000003"),
  saasLaunch:   new ObjectId("65f000000000000000000004"),
  retailMart:   new ObjectId("65f000000000000000000005"),
};

const USER_IDS = {
  arjun:   new ObjectId("65f100000000000000000001"),
  priya:   new ObjectId("65f100000000000000000002"),
  rahul:   new ObjectId("65f100000000000000000003"),
  sneha:   new ObjectId("65f100000000000000000004"),
  vikram:  new ObjectId("65f100000000000000000005"),
  ananya:  new ObjectId("65f100000000000000000006"),
  rohan:   new ObjectId("65f100000000000000000007"),
  kavita:  new ObjectId("65f100000000000000000008"),
  siddharth: new ObjectId("65f100000000000000000009"),
  meera:   new ObjectId("65f10000000000000000000a"),
  aakash:  new ObjectId("65f10000000000000000000b"),
  deepika: new ObjectId("65f10000000000000000000c"),
  nikhil:  new ObjectId("65f10000000000000000000d"),
  shruti:  new ObjectId("65f10000000000000000000e"),
  tarun:   new ObjectId("65f10000000000000000000f"),
};

const rand = (a: number, b: number) =>
  Math.floor(Math.random() * (b - a + 1)) + a;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// ─── BUSINESSES ───────────────────────────────────────────────────────────────
const businesses = [
  {
    _id: BIZ_IDS.techZone,
    name: "TechZone Electronics",
    type: "ecommerce",
    ownerUserId: USER_IDS.arjun,
    createdAt: daysAgo(180),
  },
  {
    _id: BIZ_IDS.fashionHub,
    name: "FashionHub India",
    type: "retail",
    ownerUserId: USER_IDS.priya,
    createdAt: daysAgo(150),
  },
  {
    _id: BIZ_IDS.foodCorner,
    name: "The Food Corner",
    type: "restaurant",
    ownerUserId: USER_IDS.rahul,
    createdAt: daysAgo(90),
  },
  {
    _id: BIZ_IDS.saasLaunch,
    name: "SaaSLaunch Tech",
    type: "saas",
    ownerUserId: USER_IDS.sneha,
    createdAt: daysAgo(60),
  },
  {
    _id: BIZ_IDS.retailMart,
    name: "RetailMart Superstore",
    type: "retail",
    ownerUserId: USER_IDS.vikram,
    createdAt: daysAgo(120),
  },
];

// ─── USERS ────────────────────────────────────────────────────────────────────
async function buildUsers() {
  const pw = await bcrypt.hash("Password@123", 12);
  const now = new Date();

  return [
    { _id: USER_IDS.arjun,    fullName: "Arjun Sharma",      email: "arjun@techzone.in",      mobile: "+91 98765 43210", passwordHash: pw, businessId: BIZ_IDS.techZone,   role: "admin",    createdAt: daysAgo(180), updatedAt: now },
    { _id: USER_IDS.priya,    fullName: "Priya Patel",        email: "priya@fashionhub.in",    mobile: "+91 87654 32109", passwordHash: pw, businessId: BIZ_IDS.fashionHub, role: "admin",    createdAt: daysAgo(150), updatedAt: now },
    { _id: USER_IDS.rahul,    fullName: "Rahul Verma",        email: "rahul@foodcorner.in",    mobile: "+91 76543 21098", passwordHash: pw, businessId: BIZ_IDS.foodCorner, role: "admin",    createdAt: daysAgo(90),  updatedAt: now },
    { _id: USER_IDS.sneha,    fullName: "Sneha Iyer",         email: "sneha@saaslaunch.io",    mobile: "+91 65432 10987", passwordHash: pw, businessId: BIZ_IDS.saasLaunch, role: "admin",    createdAt: daysAgo(60),  updatedAt: now },
    { _id: USER_IDS.vikram,   fullName: "Vikram Singh",       email: "vikram@retailmart.in",   mobile: "+91 54321 09876", passwordHash: pw, businessId: BIZ_IDS.retailMart, role: "admin",    createdAt: daysAgo(120), updatedAt: now },
    { _id: USER_IDS.ananya,   fullName: "Ananya Gupta",       email: "ananya@techzone.in",     mobile: "+91 93456 78901", passwordHash: pw, businessId: BIZ_IDS.techZone,   role: "employee", createdAt: daysAgo(90),  updatedAt: now },
    { _id: USER_IDS.rohan,    fullName: "Rohan Mehta",        email: "rohan@techzone.in",      mobile: "+91 82345 67890", passwordHash: pw, businessId: BIZ_IDS.techZone,   role: "employee", createdAt: daysAgo(60),  updatedAt: now },
    { _id: USER_IDS.kavita,   fullName: "Kavita Nair",        email: "kavita@fashionhub.in",   mobile: "+91 71234 56789", passwordHash: pw, businessId: BIZ_IDS.fashionHub, role: "employee", createdAt: daysAgo(80),  updatedAt: now },
    { _id: USER_IDS.siddharth,fullName: "Siddharth Joshi",   email: "sid@foodcorner.in",      mobile: "+91 60123 45678", passwordHash: pw, businessId: BIZ_IDS.foodCorner, role: "employee", createdAt: daysAgo(45),  updatedAt: now },
    { _id: USER_IDS.meera,    fullName: "Meera Krishnan",     email: "meera@retailmart.in",    mobile: "+91 59012 34567", passwordHash: pw, businessId: BIZ_IDS.retailMart, role: "employee", createdAt: daysAgo(70),  updatedAt: now },
    { _id: USER_IDS.aakash,   fullName: "Aakash Tiwari",     email: "aakash@saaslaunch.io",   mobile: "+91 48901 23456", passwordHash: pw, businessId: BIZ_IDS.saasLaunch, role: "employee", createdAt: daysAgo(30),  updatedAt: now },
    { _id: USER_IDS.deepika,  fullName: "Deepika Reddy",      email: "deepika@techzone.in",    mobile: "+91 37890 12345", passwordHash: pw, businessId: BIZ_IDS.techZone,   role: "employee", createdAt: daysAgo(40),  updatedAt: now },
    { _id: USER_IDS.nikhil,   fullName: "Nikhil Bose",        email: "nikhil@fashionhub.in",   mobile: "+91 96789 01234", passwordHash: pw, businessId: BIZ_IDS.fashionHub, role: "employee", createdAt: daysAgo(55),  updatedAt: now },
    { _id: USER_IDS.shruti,   fullName: "Shruti Agarwal",     email: "shruti@foodcorner.in",   mobile: "+91 85678 90123", passwordHash: pw, businessId: BIZ_IDS.foodCorner, role: "employee", createdAt: daysAgo(25),  updatedAt: now },
    { _id: USER_IDS.tarun,    fullName: "Tarun Malhotra",     email: "tarun@retailmart.in",    mobile: "+91 74567 89012", passwordHash: pw, businessId: BIZ_IDS.retailMart, role: "employee", createdAt: daysAgo(65),  updatedAt: now },
  ];
}

// ─── INVENTORY ────────────────────────────────────────────────────────────────
const inventoryItems = [
  // ── TechZone Electronics ──────────────────────────────────────────────────
  { businessId: BIZ_IDS.techZone, productName: "Wireless Headphones Pro",       sku: "TZ-WH-001", stockQuantity: 4,   purchasePrice: 1400,  salePrice: 2999,  category: "Electronics",  lowStockAlert: 10 },
  { businessId: BIZ_IDS.techZone, productName: "Smart Watch Series X",           sku: "TZ-SW-002", stockQuantity: 12,  purchasePrice: 4200,  salePrice: 8499,  category: "Electronics",  lowStockAlert: 8  },
  { businessId: BIZ_IDS.techZone, productName: "USB-C Hub 7-in-1",               sku: "TZ-UC-003", stockQuantity: 67,  purchasePrice: 600,   salePrice: 1499,  category: "Accessories",  lowStockAlert: 15 },
  { businessId: BIZ_IDS.techZone, productName: "Laptop Stand Aluminium",         sku: "TZ-LS-004", stockQuantity: 89,  purchasePrice: 900,   salePrice: 2199,  category: "Accessories",  lowStockAlert: 20 },
  { businessId: BIZ_IDS.techZone, productName: "Mechanical Keyboard RGB",        sku: "TZ-MK-005", stockQuantity: 23,  purchasePrice: 1800,  salePrice: 3799,  category: "Peripherals",  lowStockAlert: 12 },
  { businessId: BIZ_IDS.techZone, productName: "HD Webcam 1080p",                sku: "TZ-WC-006", stockQuantity: 8,   purchasePrice: 800,   salePrice: 1899,  category: "Peripherals",  lowStockAlert: 10 },
  { businessId: BIZ_IDS.techZone, productName: "Bluetooth Speaker Mini",         sku: "TZ-BS-007", stockQuantity: 34,  purchasePrice: 750,   salePrice: 1699,  category: "Electronics",  lowStockAlert: 10 },
  { businessId: BIZ_IDS.techZone, productName: "Portable SSD 1TB",               sku: "TZ-PS-008", stockQuantity: 0,   purchasePrice: 3200,  salePrice: 5999,  category: "Storage",      lowStockAlert: 5  },
  { businessId: BIZ_IDS.techZone, productName: "Gaming Mouse Wireless",          sku: "TZ-GM-009", stockQuantity: 19,  purchasePrice: 1100,  salePrice: 2499,  category: "Peripherals",  lowStockAlert: 10 },
  { businessId: BIZ_IDS.techZone, productName: "4K Monitor 27-inch",             sku: "TZ-MN-010", stockQuantity: 6,   purchasePrice: 14000, salePrice: 24999, category: "Electronics",  lowStockAlert: 5  },
  { businessId: BIZ_IDS.techZone, productName: "Wireless Charging Pad",          sku: "TZ-CP-011", stockQuantity: 55,  purchasePrice: 350,   salePrice: 899,   category: "Accessories",  lowStockAlert: 20 },
  { businessId: BIZ_IDS.techZone, productName: "Laptop Sleeve 15-inch",          sku: "TZ-SL-012", stockQuantity: 74,  purchasePrice: 280,   salePrice: 699,   category: "Accessories",  lowStockAlert: 25 },
  { businessId: BIZ_IDS.techZone, productName: "USB Flash Drive 128GB",          sku: "TZ-FD-013", stockQuantity: 120, purchasePrice: 220,   salePrice: 599,   category: "Storage",      lowStockAlert: 30 },
  { businessId: BIZ_IDS.techZone, productName: "HDMI Cable 2m",                  sku: "TZ-HC-014", stockQuantity: 200, purchasePrice: 80,    salePrice: 249,   category: "Cables",       lowStockAlert: 50 },
  { businessId: BIZ_IDS.techZone, productName: "Type-C Fast Charger 65W",        sku: "TZ-FC-015", stockQuantity: 48,  purchasePrice: 420,   salePrice: 999,   category: "Accessories",  lowStockAlert: 15 },
  { businessId: BIZ_IDS.techZone, productName: "Noise Cancelling Earbuds",       sku: "TZ-NE-016", stockQuantity: 3,   purchasePrice: 1600,  salePrice: 3299,  category: "Electronics",  lowStockAlert: 8  },
  { businessId: BIZ_IDS.techZone, productName: "Ergonomic Mouse Pad XL",         sku: "TZ-MP-017", stockQuantity: 62,  purchasePrice: 180,   salePrice: 449,   category: "Accessories",  lowStockAlert: 20 },
  { businessId: BIZ_IDS.techZone, productName: "Mini Projector Portable",        sku: "TZ-PJ-018", stockQuantity: 7,   purchasePrice: 6500,  salePrice: 12999, category: "Electronics",  lowStockAlert: 5  },
  { businessId: BIZ_IDS.techZone, productName: "Action Camera 4K",               sku: "TZ-AC-019", stockQuantity: 9,   purchasePrice: 5800,  salePrice: 10999, category: "Electronics",  lowStockAlert: 5  },
  { businessId: BIZ_IDS.techZone, productName: "Smart Home Hub",                 sku: "TZ-SH-020", stockQuantity: 14,  purchasePrice: 2200,  salePrice: 4499,  category: "Electronics",  lowStockAlert: 8  },

  // ── FashionHub India ──────────────────────────────────────────────────────
  { businessId: BIZ_IDS.fashionHub, productName: "Men's Classic Oxford Shirt",    sku: "FH-MOS-001", stockQuantity: 45,  purchasePrice: 350,   salePrice: 899,   category: "Men's Wear",   lowStockAlert: 15 },
  { businessId: BIZ_IDS.fashionHub, productName: "Women's Silk Kurti",             sku: "FH-WSK-002", stockQuantity: 38,  purchasePrice: 420,   salePrice: 1199,  category: "Women's Wear", lowStockAlert: 12 },
  { businessId: BIZ_IDS.fashionHub, productName: "Slim Fit Chinos (Men)",          sku: "FH-MFC-003", stockQuantity: 0,   purchasePrice: 480,   salePrice: 1299,  category: "Men's Wear",   lowStockAlert: 10 },
  { businessId: BIZ_IDS.fashionHub, productName: "Designer Saree Printed",        sku: "FH-DSP-004", stockQuantity: 22,  purchasePrice: 800,   salePrice: 2499,  category: "Women's Wear", lowStockAlert: 8  },
  { businessId: BIZ_IDS.fashionHub, productName: "Leather Belt Black",            sku: "FH-LBB-005", stockQuantity: 60,  purchasePrice: 220,   salePrice: 599,   category: "Accessories",  lowStockAlert: 20 },
  { businessId: BIZ_IDS.fashionHub, productName: "Sports Sneakers Unisex",        sku: "FH-SSU-006", stockQuantity: 5,   purchasePrice: 1200,  salePrice: 2999,  category: "Footwear",     lowStockAlert: 10 },
  { businessId: BIZ_IDS.fashionHub, productName: "Woollen Shawl Premium",         sku: "FH-WSP-007", stockQuantity: 30,  purchasePrice: 650,   salePrice: 1699,  category: "Women's Wear", lowStockAlert: 10 },
  { businessId: BIZ_IDS.fashionHub, productName: "Canvas Tote Bag",               sku: "FH-CTB-008", stockQuantity: 80,  purchasePrice: 180,   salePrice: 499,   category: "Accessories",  lowStockAlert: 25 },
  { businessId: BIZ_IDS.fashionHub, productName: "Sunglasses Polarised",          sku: "FH-SGP-009", stockQuantity: 28,  purchasePrice: 320,   salePrice: 899,   category: "Accessories",  lowStockAlert: 10 },
  { businessId: BIZ_IDS.fashionHub, productName: "Kids Party Wear Set",           sku: "FH-KPW-010", stockQuantity: 17,  purchasePrice: 550,   salePrice: 1499,  category: "Kids Wear",    lowStockAlert: 8  },

  // ── The Food Corner ───────────────────────────────────────────────────────
  { businessId: BIZ_IDS.foodCorner, productName: "Basmati Rice Premium 5kg",      sku: "FC-BRP-001", stockQuantity: 50,  purchasePrice: 280,   salePrice: 450,   category: "Grains",       lowStockAlert: 15 },
  { businessId: BIZ_IDS.foodCorner, productName: "Extra Virgin Olive Oil 500ml",  sku: "FC-OVO-002", stockQuantity: 35,  purchasePrice: 380,   salePrice: 649,   category: "Oils",         lowStockAlert: 12 },
  { businessId: BIZ_IDS.foodCorner, productName: "Organic Honey Wild 500g",       sku: "FC-OHW-003", stockQuantity: 42,  purchasePrice: 220,   salePrice: 399,   category: "Condiments",   lowStockAlert: 10 },
  { businessId: BIZ_IDS.foodCorner, productName: "Cold Brew Coffee Concentrate",  sku: "FC-CBC-004", stockQuantity: 0,   purchasePrice: 180,   salePrice: 349,   category: "Beverages",    lowStockAlert: 10 },
  { businessId: BIZ_IDS.foodCorner, productName: "Dark Chocolate 70% 200g",       sku: "FC-DC7-005", stockQuantity: 65,  purchasePrice: 120,   salePrice: 249,   category: "Snacks",       lowStockAlert: 20 },
  { businessId: BIZ_IDS.foodCorner, productName: "Multigrain Bread Loaf",         sku: "FC-MBL-006", stockQuantity: 28,  purchasePrice: 45,    salePrice: 89,    category: "Bakery",       lowStockAlert: 15 },
  { businessId: BIZ_IDS.foodCorner, productName: "Greek Yoghurt 400g",            sku: "FC-GYO-007", stockQuantity: 40,  purchasePrice: 65,    salePrice: 129,   category: "Dairy",        lowStockAlert: 15 },
  { businessId: BIZ_IDS.foodCorner, productName: "Mixed Nut Trail Pack 200g",     sku: "FC-MNT-008", stockQuantity: 55,  purchasePrice: 180,   salePrice: 349,   category: "Snacks",       lowStockAlert: 20 },
  { businessId: BIZ_IDS.foodCorner, productName: "Himalayan Pink Salt 1kg",       sku: "FC-HPS-009", stockQuantity: 70,  purchasePrice: 85,    salePrice: 179,   category: "Condiments",   lowStockAlert: 25 },
  { businessId: BIZ_IDS.foodCorner, productName: "Kombucha Original 330ml",       sku: "FC-KOM-010", stockQuantity: 6,   purchasePrice: 95,    salePrice: 199,   category: "Beverages",    lowStockAlert: 12 },

  // ── RetailMart Superstore ─────────────────────────────────────────────────
  { businessId: BIZ_IDS.retailMart, productName: "Vacuum Cleaner Robot",          sku: "RM-VCR-001", stockQuantity: 10,  purchasePrice: 8500,  salePrice: 15999, category: "Appliances",   lowStockAlert: 5  },
  { businessId: BIZ_IDS.retailMart, productName: "Air Purifier HEPA",             sku: "RM-APH-002", stockQuantity: 7,   purchasePrice: 6800,  salePrice: 12499, category: "Appliances",   lowStockAlert: 5  },
  { businessId: BIZ_IDS.retailMart, productName: "Non-Stick Cookware Set 5pc",    sku: "RM-NSC-003", stockQuantity: 22,  purchasePrice: 1200,  salePrice: 2799,  category: "Kitchen",      lowStockAlert: 8  },
  { businessId: BIZ_IDS.retailMart, productName: "Bedsheet Set King 300TC",       sku: "RM-BSK-004", stockQuantity: 35,  purchasePrice: 650,   salePrice: 1499,  category: "Home Linen",   lowStockAlert: 12 },
  { businessId: BIZ_IDS.retailMart, productName: "Hand Sanitiser 500ml Pack of 6",sku: "RM-HS5-005", stockQuantity: 90,  purchasePrice: 120,   salePrice: 299,   category: "Healthcare",   lowStockAlert: 30 },
  { businessId: BIZ_IDS.retailMart, productName: "Stainless Steel Water Bottle 1L",sku: "RM-SSW-006",stockQuantity: 75,  purchasePrice: 180,   salePrice: 449,   category: "Kitchen",      lowStockAlert: 20 },
  { businessId: BIZ_IDS.retailMart, productName: "LED Desk Lamp USB",             sku: "RM-LDL-007", stockQuantity: 44,  purchasePrice: 380,   salePrice: 899,   category: "Electronics",  lowStockAlert: 15 },
  { businessId: BIZ_IDS.retailMart, productName: "Yoga Mat 6mm Thick",            sku: "RM-YMT-008", stockQuantity: 33,  purchasePrice: 280,   salePrice: 699,   category: "Sports",       lowStockAlert: 10 },
  { businessId: BIZ_IDS.retailMart, productName: "Digital Kitchen Scale",         sku: "RM-DKS-009", stockQuantity: 28,  purchasePrice: 220,   salePrice: 549,   category: "Kitchen",      lowStockAlert: 10 },
  { businessId: BIZ_IDS.retailMart, productName: "Garden Hose 15m Expandable",   sku: "RM-GHE-010", stockQuantity: 15,  purchasePrice: 480,   salePrice: 1099,  category: "Garden",       lowStockAlert: 8  },

  // ── SaaSLaunch Tech (digital products / merch) ────────────────────────────
  { businessId: BIZ_IDS.saasLaunch, productName: "Developer Mug Premium",         sku: "SL-DMP-001", stockQuantity: 50,  purchasePrice: 120,   salePrice: 349,   category: "Merchandise",  lowStockAlert: 15 },
  { businessId: BIZ_IDS.saasLaunch, productName: "SaaSLaunch Hoodie L",           sku: "SL-SHL-002", stockQuantity: 20,  purchasePrice: 450,   salePrice: 1299,  category: "Merchandise",  lowStockAlert: 8  },
  { businessId: BIZ_IDS.saasLaunch, productName: "Annual Pro Plan License",       sku: "SL-APL-003", stockQuantity: 999, purchasePrice: 0,     salePrice: 9999,  category: "Software",     lowStockAlert: 0  },
  { businessId: BIZ_IDS.saasLaunch, productName: "Team Starter Pack 5 Seats",     sku: "SL-TSP-004", stockQuantity: 999, purchasePrice: 0,     salePrice: 29999, category: "Software",     lowStockAlert: 0  },
  { businessId: BIZ_IDS.saasLaunch, productName: "Sticker Pack Set",              sku: "SL-SPS-005", stockQuantity: 180, purchasePrice: 15,    salePrice: 49,    category: "Merchandise",  lowStockAlert: 50 },
];

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function genCashFlow(daysBack: number) {
  return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => {
    const revenue = rand(28000, 72000);
    const expenses = rand(12000, 36000);
    return { date: day, revenue, expenses };
  });
}

function buildReports() {
  const reports = [];
  const businesses_list = [
    { id: BIZ_IDS.techZone,   scoreBase: 25 },
    { id: BIZ_IDS.fashionHub, scoreBase: 40 },
    { id: BIZ_IDS.foodCorner, scoreBase: 55 },
    { id: BIZ_IDS.saasLaunch, scoreBase: 15 },
    { id: BIZ_IDS.retailMart, scoreBase: 35 },
  ];

  for (const biz of businesses_list) {
    // 10 reports per business = 50 total
    for (let i = 9; i >= 0; i--) {
      const date = daysAgo(i * 3);
      const rev = rand(38000, 95000);
      const orders = rand(85, 280);
      const totalItems = rand(20, 60);
      const lowStock = rand(1, 6);
      const score = Math.min(99, Math.max(1, biz.scoreBase + rand(-15, 20)));
      const alerts = [];
      if (score > 60) alerts.push("Critical: Multiple inventory items below safety stock");
      if (score > 40) alerts.push("Warning: Support ticket volume elevated");
      alerts.push(`Revenue trend: ${rev > 60000 ? "Strong" : "Moderate"} performance this period`);

      reports.push({
        businessId: biz.id,
        reportDate: date,
        healthScore: score,
        salesSummary: {
          totalRevenue: rev,
          totalOrders: orders,
        },
        inventorySummary: {
          totalItems,
          lowStockItems: lowStock,
        },
        cashFlowSummary: genCashFlow(i * 3),
        alerts,
        pdfPath: `/reports/report-${biz.id.toString().slice(-4)}-${i}.pdf`,
        createdAt: date,
      });
    }
  }

  return reports;
}

// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────
async function seed() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✓  Connected to MongoDB");

    const db = client.db("OpsPulseDB");

    // Drop existing collections (clean slate)
    const collections = ["users", "businesses", "inventory", "reports", "otps"];
    for (const col of collections) {
      try {
        await db.collection(col).drop();
        console.log(`  ✓ Dropped collection: ${col}`);
      } catch {
        // Collection may not exist on first run
      }
    }

    // ── Create indexes ────────────────────────────────────────────────────────
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ businessId: 1 });
    await db.collection("businesses").createIndex({ ownerUserId: 1 });
    await db.collection("inventory").createIndex(
      { businessId: 1, sku: 1 },
      { unique: true }
    );
    await db.collection("inventory").createIndex({ businessId: 1, category: 1 });
    await db.collection("inventory").createIndex({ businessId: 1, stockQuantity: 1 });
    await db.collection("reports").createIndex({ businessId: 1, reportDate: -1 });
    await db.collection("otps").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 } // TTL index — auto-purge expired OTPs
    );
    await db.collection("otps").createIndex({ userId: 1, used: 1 });
    console.log("  ✓ Indexes created");

    // ── Insert data ───────────────────────────────────────────────────────────
    await db.collection("businesses").insertMany(businesses);
    console.log(`  ✓ Inserted ${businesses.length} businesses`);

    const users = await buildUsers();
    await db.collection("users").insertMany(users);
    console.log(`  ✓ Inserted ${users.length} users`);

    // Add timestamps to inventory items
    const now = new Date();
    const inventoryWithTimestamps = inventoryItems.map((item) => ({
      ...item,
      createdAt: daysAgo(rand(10, 90)),
      updatedAt: now,
    }));
    await db.collection("inventory").insertMany(inventoryWithTimestamps);
    console.log(`  ✓ Inserted ${inventoryItems.length} inventory items`);

    const reports = buildReports();
    await db.collection("reports").insertMany(reports);
    console.log(`  ✓ Inserted ${reports.length} reports`);

    // Demo OTP for testing
    await db.collection("otps").insertOne({
      userId: USER_IDS.arjun,
      otpCode: "123456",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
      createdAt: now,
    });
    console.log("  ✓ Inserted demo OTP (123456 for arjun@techzone.in)");

    console.log("\n✅ Seed complete!");
    console.log("\n── Test Credentials ──────────────────────────────────");
    console.log("  Email:    arjun@techzone.in");
    console.log("  Password: Password@123");
    console.log("  Business: TechZone Electronics");
    console.log("─────────────────────────────────────────────────────\n");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
