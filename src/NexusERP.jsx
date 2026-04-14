/**
 * NexusERP — Complete Production Frontend
 * React + Recharts + Framer Motion-style CSS animations
 * Full API integration layer, RBAC, modals, forms, all 7 modules
 */
import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar
} from "recharts";
import {
  LayoutDashboard, Package, DollarSign, Users, ShoppingCart,
  CheckSquare, BarChart2, Bell, Settings, LogOut, Menu, X,
  Sun, Moon, TrendingUp, TrendingDown, AlertTriangle, Clock,
  ChevronRight, Plus, Search, Filter, Download, Edit,
  Trash2, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight,
  Calendar, FileText, Briefcase, Award, Target, Zap, Shield,
  Building2, UserCheck, CreditCard, Truck, RefreshCw, Star,
  Mail, Phone, MapPin, ChevronDown, MoreVertical, Inbox,
  PieChart as PieIcon, Activity, Layers, Globe, Hash,
  ArrowRight, Wallet, Receipt, UserPlus, ClipboardList,
  TrendingUp as Trend, Check, AlertCircle, Info, Copy, Save
} from "lucide-react";

/* ─── Theme Context ──────────────────────────────────────────── */
const ThemeCtx  = createContext();
const AuthCtx   = createContext();
const ToastCtx  = createContext();
const useTheme  = () => useContext(ThemeCtx);
const useAuth   = () => useContext(AuthCtx);
const useToast  = () => useContext(ToastCtx);

/* ─── Mock API Layer (replace with real api.js in production) ── */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const mockApi = {
  login: async (email, password) => {
    await sleep(900);
    if (email === "vedant@vt.in" && password === "ved1423")
      return { user: { id: "u0", email, firstName: "VT", lastName: "Company", role: "OWNER", avatarUrl: null }, accessToken: "mock-token-vedant", refreshToken: "mock-refresh-vedant" };
    if (email === "owner@nexuserp.com" && password === "Owner@123")
      return { user: { id: "u1", email, firstName: "VT", lastName: "Company", role: "OWNER", avatarUrl: null }, accessToken: "mock-token", refreshToken: "mock-refresh" };
    if (email === "sarah@nexuserp.com" && password === "Employee@123")
      return { user: { id: "u2", email, firstName: "Sarah", lastName: "Johnson", role: "EMPLOYEE", avatarUrl: null }, accessToken: "mock-token-emp", refreshToken: "mock-refresh-emp" };
    throw new Error("Invalid credentials");
  },
  ownerDashboard: async () => { await sleep(600); return ownerDashboardData; },
  employeeDashboard: async () => { await sleep(600); return employeeDashboardData; },
  getProducts: async () => { await sleep(400); return { products: inventoryData, pagination: { total: inventoryData.length, page: 1, limit: 20 } }; },
  getEmployees: async () => { await sleep(400); return { employees: employeesData, pagination: { total: employeesData.length } }; },
  getTransactions: async () => { await sleep(400); return { transactions: transactionsData, pagination: { total: transactionsData.length } }; },
  getInvoices: async () => { await sleep(400); return { invoices: invoicesData, pagination: { total: invoicesData.length } }; },
  getOrders: async () => { await sleep(400); return { orders: ordersData, pagination: { total: ordersData.length } }; },
  getCustomers: async () => { await sleep(400); return { customers: customersData, pagination: { total: customersData.length } }; },
  getTasks: async () => { await sleep(400); return { tasks: tasksData, pagination: { total: tasksData.length } }; },
  getReports: async () => { await sleep(700); return reportsData; },
  getDeals: async () => { await sleep(400); return dealsData; },
};

/* ─── Mock Data ──────────────────────────────────────────────── */
const revenueChartData = [
  { month: "Jan", revenue: 42000, expenses: 28000, profit: 14000 },
  { month: "Feb", revenue: 38000, expenses: 24000, profit: 14000 },
  { month: "Mar", revenue: 55000, expenses: 31000, profit: 24000 },
  { month: "Apr", revenue: 61000, expenses: 35000, profit: 26000 },
  { month: "May", revenue: 48000, expenses: 29000, profit: 19000 },
  { month: "Jun", revenue: 72000, expenses: 38000, profit: 34000 },
  { month: "Jul", revenue: 68000, expenses: 41000, profit: 27000 },
  { month: "Aug", revenue: 83000, expenses: 44000, profit: 39000 },
];
const categoryData = [
  { name: "Electronics", value: 35, color: "#06b6d4" },
  { name: "Clothing",    value: 25, color: "#8b5cf6" },
  { name: "Home",        value: 20, color: "#10b981" },
  { name: "Sports",      value: 12, color: "#f59e0b" },
  { name: "Other",       value: 8,  color: "#ef4444"  },
];
const ownerDashboardData = {
  kpis: { revenue: { current: 83200, prev: 70500, change: 18 }, expenses: { current: 44000, prev: 39000, change: 12.8 }, profit: { current: 39200 }, activeEmployees: 48, totalOrders: 1247, lowStockProducts: 3, pendingTasks: 14 },
  recentTransactions: [
    { id: "TXN-8841", description: "Acme Corp Q3 Payment",  type: "INCOME",  amount: 12450, category: "Sales",      status: "COMPLETED", createdAt: "2024-08-14" },
    { id: "TXN-8840", description: "Office Supplies",        type: "EXPENSE", amount: 3200,  category: "Operations", status: "COMPLETED", createdAt: "2024-08-14" },
    { id: "TXN-8839", description: "GlobalTech Contract",   type: "INCOME",  amount: 28900, category: "Sales",      status: "COMPLETED", createdAt: "2024-08-13" },
    { id: "TXN-8838", description: "AWS Services",           type: "EXPENSE", amount: 1840,  category: "Infra",      status: "PENDING",   createdAt: "2024-08-13" },
    { id: "TXN-8837", description: "StartupXYZ Consulting", type: "INCOME",  amount: 5600,  category: "Consulting", status: "COMPLETED", createdAt: "2024-08-12" },
  ],
  monthlyRevenue: revenueChartData,
};
const employeeDashboardData = {
  myTasks: [
    { id: "t1", title: "Finalize Q3 Budget Report",        status: "IN_PROGRESS", priority: "HIGH",   progress: 75, dueDate: "2024-08-20" },
    { id: "t2", title: "Client Presentation - GlobalTech", status: "TODO",        priority: "HIGH",   progress: 30, dueDate: "2024-08-18" },
    { id: "t3", title: "Weekly Sales Report",              status: "COMPLETED",   priority: "MEDIUM", progress: 100, dueDate: "2024-08-16" },
  ],
  stats: { total: 8, completed: 5, hoursThisWeek: "38.5" },
  attendance: [],
};
const inventoryData = [
  { id: "PRD-001", sku: "WHP-2024", name: "Wireless Headphones Pro", category: "Electronics",   stockQty: 145, reorderPoint: 50,  unitPrice: 299.99, costPrice: 180.00, supplier: { name: "TechSource Inc" } },
  { id: "PRD-002", sku: "EOC-X1",   name: "Ergonomic Office Chair",  category: "Home & Garden", stockQty: 28,  reorderPoint: 30,  unitPrice: 449.99, costPrice: 270.00, supplier: { name: "FurniWorld" }     },
  { id: "PRD-003", sku: "RSF-42",   name: "Running Shoes Air Flex",  category: "Sports",        stockQty: 312, reorderPoint: 100, unitPrice: 129.99, costPrice: 65.00,  supplier: { name: "SportsPro" }      },
  { id: "PRD-004", sku: "4KGM-27",  name: "4K Gaming Monitor",       category: "Electronics",   stockQty: 67,  reorderPoint: 25,  unitPrice: 699.99, costPrice: 420.00, supplier: { name: "TechSource Inc" } },
  { id: "PRD-005", sku: "YMP-001",  name: "Yoga Mat Premium",         category: "Sports",        stockQty: 18,  reorderPoint: 50,  unitPrice: 79.99,  costPrice: 35.00,  supplier: { name: "SportsPro" }      },
  { id: "PRD-006", sku: "SHH-V3",   name: "Smart Home Hub",           category: "Electronics",   stockQty: 89,  reorderPoint: 40,  unitPrice: 199.99, costPrice: 110.00, supplier: { name: "SmartTech" }      },
];
const employeesData = [
  { id: "e1", user: { firstName: "Sarah",  lastName: "Johnson", email: "sarah@nexuserp.com"  }, employeeCode: "EMP-001", department: "Sales",       designation: "Sales Manager", salary: 85000,  status: "ACTIVE",    performanceReviews: [{ score: 94 }] },
  { id: "e2", user: { firstName: "Marcus", lastName: "Chen",    email: "marcus@nexuserp.com" }, employeeCode: "EMP-002", department: "Engineering", designation: "Lead Developer",salary: 110000, status: "ACTIVE",    performanceReviews: [{ score: 97 }] },
  { id: "e3", user: { firstName: "Priya",  lastName: "Patel",   email: "priya@nexuserp.com"  }, employeeCode: "EMP-003", department: "Finance",     designation: "Finance Analyst",salary: 78000, status: "ACTIVE",    performanceReviews: [{ score: 89 }] },
  { id: "e4", user: { firstName: "James",  lastName: "Wilson",  email: "james@nexuserp.com"  }, employeeCode: "EMP-004", department: "HR",          designation: "HR Specialist", salary: 65000,  status: "ON_LEAVE",  performanceReviews: [{ score: 82 }] },
  { id: "e5", user: { firstName: "Elena",  lastName: "Russo",   email: "elena@nexuserp.com"  }, employeeCode: "EMP-005", department: "Marketing",   designation: "Marketing Lead", salary: 88000, status: "ACTIVE",    performanceReviews: [{ score: 91 }] },
  { id: "e6", user: { firstName: "David",  lastName: "Kim",     email: "david@nexuserp.com"  }, employeeCode: "EMP-006", department: "Operations",  designation: "Operations Mgr", salary: 92000, status: "ACTIVE",    performanceReviews: [{ score: 88 }] },
];
const transactionsData = [
  { id: "t1", reference: "TXN-8841", description: "Acme Corp Q3 Payment",    type: "INCOME",  amount: 12450, category: "Sales",      status: "COMPLETED", createdAt: "2024-08-14" },
  { id: "t2", reference: "TXN-8840", description: "Office Supplies",          type: "EXPENSE", amount: 3200,  category: "Operations", status: "COMPLETED", createdAt: "2024-08-14" },
  { id: "t3", reference: "TXN-8839", description: "GlobalTech Contract",      type: "INCOME",  amount: 28900, category: "Sales",      status: "COMPLETED", createdAt: "2024-08-13" },
  { id: "t4", reference: "TXN-8838", description: "AWS Services",             type: "EXPENSE", amount: 1840,  category: "Infra",      status: "PENDING",   createdAt: "2024-08-13" },
  { id: "t5", reference: "TXN-8837", description: "StartupXYZ Consulting",   type: "INCOME",  amount: 5600,  category: "Consulting", status: "COMPLETED", createdAt: "2024-08-12" },
  { id: "t6", reference: "TXN-8836", description: "Marketing Agency",         type: "EXPENSE", amount: 8500,  category: "Marketing",  status: "COMPLETED", createdAt: "2024-08-12" },
];
const invoicesData = [
  { id: "i1", invoiceNumber: "INV-2024-089", customer: { name: "Acme Corp"      }, totalAmount: 13695, status: "PAID",    dueDate: "2024-08-31", issueDate: "2024-08-01" },
  { id: "i2", invoiceNumber: "INV-2024-090", customer: { name: "GlobalTech Ltd" }, totalAmount: 31790, status: "SENT",    dueDate: "2024-09-04", issueDate: "2024-08-05" },
  { id: "i3", invoiceNumber: "INV-2024-091", customer: { name: "StartupXYZ"    }, totalAmount: 6160,  status: "OVERDUE", dueDate: "2024-08-01", issueDate: "2024-08-10" },
  { id: "i4", invoiceNumber: "INV-2024-092", customer: { name: "Retail Masters" }, totalAmount: 20625, status: "SENT",    dueDate: "2024-09-11", issueDate: "2024-08-12" },
  { id: "i5", invoiceNumber: "INV-2024-093", customer: { name: "Tech Ventures"  }, totalAmount: 10120, status: "PAID",    dueDate: "2024-09-13", issueDate: "2024-08-14" },
];
const ordersData = [
  { id: "o1", orderNumber: "ORD-A1B2C", customer: { name: "Acme Corp"       }, totalAmount: 8430,  status: "DELIVERED", createdAt: "2024-08-14", items: [] },
  { id: "o2", orderNumber: "ORD-D3E4F", customer: { name: "GlobalTech Ltd"  }, totalAmount: 21500, status: "SHIPPED",   createdAt: "2024-08-13", items: [] },
  { id: "o3", orderNumber: "ORD-G5H6I", customer: { name: "StartupXYZ"     }, totalAmount: 3200,  status: "PENDING",   createdAt: "2024-08-13", items: [] },
  { id: "o4", orderNumber: "ORD-J7K8L", customer: { name: "Retail Masters"  }, totalAmount: 15800, status: "CONFIRMED", createdAt: "2024-08-12", items: [] },
  { id: "o5", orderNumber: "ORD-M9N0O", customer: { name: "Tech Ventures"   }, totalAmount: 6700,  status: "CANCELLED", createdAt: "2024-08-11", items: [] },
];
const customersData = [
  { id: "c1", name: "Acme Corp",       email: "orders@acme.com",        company: "Acme Corporation",   totalSpent: 48000, _count: { orders: 12 }, createdAt: "2023-01-15" },
  { id: "c2", name: "GlobalTech Ltd",  email: "buy@globaltech.com",     company: "GlobalTech Ltd",     totalSpent: 82000, _count: { orders: 28 }, createdAt: "2023-03-08" },
  { id: "c3", name: "StartupXYZ",      email: "purchase@startupxyz.io", company: "StartupXYZ Inc",     totalSpent: 12500, _count: { orders: 5  }, createdAt: "2024-01-20" },
  { id: "c4", name: "Retail Masters",  email: "supply@retailmasters.com",company: "Retail Masters",     totalSpent: 35000, _count: { orders: 9  }, createdAt: "2023-06-12" },
  { id: "c5", name: "Tech Ventures",   email: "ops@techventures.com",   company: "Tech Ventures LLC",  totalSpent: 21000, _count: { orders: 7  }, createdAt: "2023-09-30" },
];
const tasksData = [
  { id: "t1", title: "Finalize Q3 Budget Report",        priority: "HIGH",     status: "IN_PROGRESS", progress: 75,  assignee: { firstName: "Priya",  lastName: "Patel"   }, dueDate: "2024-08-20", tags: ["Finance", "Reports"],   project: null },
  { id: "t2", title: "Deploy v2.4 to Production",        priority: "CRITICAL", status: "IN_PROGRESS", progress: 90,  assignee: { firstName: "Marcus", lastName: "Chen"    }, dueDate: "2024-08-16", tags: ["Engineering", "Deploy"], project: null },
  { id: "t3", title: "Onboard New Sales Reps",           priority: "MEDIUM",   status: "TODO",        progress: 0,   assignee: { firstName: "James",  lastName: "Wilson"  }, dueDate: "2024-08-25", tags: ["HR", "Training"],        project: null },
  { id: "t4", title: "Client Presentation - GlobalTech", priority: "HIGH",     status: "TODO",        progress: 30,  assignee: { firstName: "Sarah",  lastName: "Johnson" }, dueDate: "2024-08-18", tags: ["Sales", "Client"],       project: null },
  { id: "t5", title: "Launch Email Campaign",            priority: "MEDIUM",   status: "COMPLETED",   progress: 100, assignee: { firstName: "Elena",  lastName: "Russo"   }, dueDate: "2024-08-22", tags: ["Marketing"],             project: null },
  { id: "t6", title: "Server Infrastructure Audit",      priority: "LOW",      status: "TODO",        progress: 10,  assignee: { firstName: "David",  lastName: "Kim"     }, dueDate: "2024-08-30", tags: ["Ops", "Audit"],          project: null },
];
const dealsData = [
  { id: "d1", title: "Enterprise License Deal",    customer: { name: "GlobalTech Ltd" }, stage: "NEGOTIATION",  value: 85000,  probability: 70, expectedClose: "2024-09-15" },
  { id: "d2", title: "Annual Support Contract",    customer: { name: "Acme Corp"      }, stage: "PROPOSAL",     value: 24000,  probability: 55, expectedClose: "2024-09-30" },
  { id: "d3", title: "Cloud Migration Services",   customer: { name: "StartupXYZ"    }, stage: "DISCOVERY",    value: 15000,  probability: 35, expectedClose: "2024-10-15" },
  { id: "d4", title: "Bulk Hardware Purchase",     customer: { name: "Retail Masters" }, stage: "CLOSED_WON",   value: 42000,  probability: 100, expectedClose: "2024-08-10" },
  { id: "d5", title: "Training & Onboarding",      customer: { name: "Tech Ventures"  }, stage: "LEAD",         value: 8000,   probability: 20, expectedClose: "2024-10-30" },
];
const reportsData = {
  revenue: revenueChartData,
  categoryDistribution: categoryData,
  kpi: { monthlyRevenue: 83200, activeEmployees: 48, ordersThisMonth: 267, taskCompletion: 5, taskPending: 14, lowStockAlerts: 3 },
};

/* ─── Utilities ──────────────────────────────────────────────── */
const fmt$  = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
const fmtK  = (v) => {
  if (v >= 10000000) return `₹${(v/10000000).toFixed(1)}Cr`;
  if (v >= 100000)   return `₹${(v/100000).toFixed(1)}L`;
  if (v >= 1000)     return `₹${(v/1000).toFixed(0)}k`;
  return `₹${v}`;
};
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const initials = (u) => `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.toUpperCase();

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--sw:260px;--hh:64px;--r:12px;--r2:8px;--tr:0.22s cubic-bezier(.4,0,.2,1)}
    body{font-family:'DM Sans',sans-serif;overflow-x:hidden}
    .r{min-height:100vh;transition:background var(--tr),color var(--tr)}
    .r.dark{background:#09101f;color:#e2e8f0}
    .r.light{background:#f1f5f9;color:#1a202c}

    /* Sidebar */
    .sb{position:fixed;top:0;left:0;height:100vh;width:var(--sw);display:flex;flex-direction:column;z-index:50;transition:transform var(--tr),background var(--tr)}
    .dark .sb{background:#070d1b;border-right:1px solid rgba(255,255,255,0.05)}
    .light .sb{background:#fff;border-right:1px solid rgba(0,0,0,0.07)}
    .sb.off{transform:translateX(-260px)}
    .mc{margin-left:var(--sw);min-height:100vh;transition:margin var(--tr)}
    .mc.full{margin-left:0}

    /* Topbar */
    .tb{position:sticky;top:0;height:var(--hh);z-index:40;display:flex;align-items:center;justify-content:space-between;padding:0 24px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
    .dark .tb{background:rgba(7,13,27,0.88);border-bottom:1px solid rgba(255,255,255,0.05)}
    .light .tb{background:rgba(255,255,255,0.88);border-bottom:1px solid rgba(0,0,0,0.07)}

    /* Cards */
    .card{border-radius:var(--r);padding:20px;transition:transform .2s ease,box-shadow .2s ease,background var(--tr)}
    .card:hover{transform:translateY(-2px)}
    .dark .card{background:#0c1429;border:1px solid rgba(255,255,255,0.06);box-shadow:0 4px 24px rgba(0,0,0,0.25)}
    .light .card{background:#fff;border:1px solid rgba(0,0,0,0.06);box-shadow:0 2px 12px rgba(0,0,0,0.05)}
    .dark .card:hover{box-shadow:0 8px 40px rgba(0,0,0,0.35);border-color:rgba(255,255,255,0.1)}
    .light .card:hover{box-shadow:0 8px 32px rgba(0,0,0,0.09)}

    /* Stat card */
    .sc{border-radius:var(--r);padding:20px 22px;position:relative;overflow:hidden;transition:transform .2s,background var(--tr)}
    .sc:hover{transform:translateY(-3px)}
    .dark .sc{background:#0c1429;border:1px solid rgba(255,255,255,0.06)}
    .light .sc{background:#fff;border:1px solid rgba(0,0,0,0.06);box-shadow:0 2px 12px rgba(0,0,0,0.04)}

    /* Nav */
    .ni{display:flex;align-items:center;gap:12px;padding:9px 14px;border-radius:var(--r2);cursor:pointer;font-size:13.5px;font-weight:500;transition:background .15s,color .15s;margin:1px 10px;white-space:nowrap}
    .dark .ni{color:#64748b}
    .light .ni{color:#64748b}
    .dark .ni:hover{background:rgba(255,255,255,0.05);color:#cbd5e1}
    .light .ni:hover{background:rgba(0,0,0,0.04);color:#1a202c}
    .ni.on{background:linear-gradient(135deg,#0891b2,#6366f1)!important;color:#fff!important}

    /* Buttons */
    .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:var(--r2);font-size:13.5px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:'DM Sans',sans-serif}
    .btn-p{background:linear-gradient(135deg,#0891b2,#6366f1);color:#fff}
    .btn-p:hover{opacity:.88;transform:translateY(-1px)}
    .btn-g{background:transparent}
    .dark .btn-g{color:#94a3b8;border:1px solid rgba(255,255,255,0.1)}
    .light .btn-g{color:#64748b;border:1px solid rgba(0,0,0,0.1)}
    .dark .btn-g:hover{background:rgba(255,255,255,0.05);color:#e2e8f0}
    .light .btn-g:hover{background:rgba(0,0,0,0.04);color:#1a202c}
    .btn-d{background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2)}
    .btn-d:hover{background:rgba(239,68,68,0.2)}
    .btn-sm{padding:6px 12px;font-size:12px}

    /* Badges */
    .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:.02em}
    .bs{background:rgba(16,185,129,.15);color:#10b981}
    .bw{background:rgba(245,158,11,.15);color:#f59e0b}
    .bd{background:rgba(239,68,68,.15);color:#ef4444}
    .bi{background:rgba(6,182,212,.15);color:#06b6d4}
    .bp{background:rgba(139,92,246,.15);color:#8b5cf6}
    .bg-gray{background:rgba(100,116,139,.12);color:#94a3b8}

    /* Input */
    .inp{padding:9px 14px;border-radius:var(--r2);font-size:13.5px;outline:none;font-family:'DM Sans',sans-serif;width:100%;transition:border-color .15s,background .15s}
    .dark .inp{background:#09101f;border:1px solid rgba(255,255,255,0.09);color:#e2e8f0}
    .light .inp{background:#f8fafc;border:1px solid rgba(0,0,0,0.1);color:#1a202c}
    .dark .inp:focus{border-color:#0891b2;background:#0c1429}
    .light .inp:focus{border-color:#0891b2}
    .inp-wrap{position:relative}
    .inp-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none}
    .inp.pl{padding-left:36px}

    /* Table */
    .dt{width:100%;border-collapse:separate;border-spacing:0}
    .dt th{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;padding:11px 14px;text-align:left}
    .dt td{padding:13px 14px;font-size:13.5px}
    .dark .dt th{color:#3d5068;border-bottom:1px solid rgba(255,255,255,0.05)}
    .light .dt th{color:#94a3b8;border-bottom:1px solid rgba(0,0,0,0.05)}
    .dark .dt td{color:#b0bec5;border-bottom:1px solid rgba(255,255,255,0.03)}
    .light .dt td{color:#475569;border-bottom:1px solid rgba(0,0,0,0.04)}
    .dt tr:hover td{background:rgba(6,182,212,0.025)}

    /* Progress */
    .pt{height:6px;border-radius:100px;overflow:hidden}
    .dark .pt{background:rgba(255,255,255,0.07)}
    .light .pt{background:rgba(0,0,0,0.07)}
    .pf{height:100%;border-radius:100px;background:linear-gradient(90deg,#0891b2,#6366f1);transition:width .8s cubic-bezier(.34,1.56,.64,1)}

    /* Grid */
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
    @media(max-width:1200px){.g4{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:900px){.g2,.g3,.g4{grid-template-columns:1fr}.sb{transform:translateX(-260px)}.mc{margin-left:0}}

    /* Animations */
    @keyframes fi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes si{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pr{0%{transform:scale(1);opacity:1}100%{transform:scale(1.45);opacity:0}}
    @keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes toast-in{from{opacity:0;transform:translateY(12px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes modal-in{from{opacity:0;transform:scale(.93) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .fi{animation:fi .35s ease forwards}
    .s1{animation-delay:.05s} .s2{animation-delay:.1s} .s3{animation-delay:.15s}
    .s4{animation-delay:.2s}  .s5{animation-delay:.25s} .s6{animation-delay:.3s}
    .sk{border-radius:8px;background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:sh 1.5s infinite}
    .light .sk{background:linear-gradient(90deg,rgba(0,0,0,.04) 25%,rgba(0,0,0,.07) 50%,rgba(0,0,0,.04) 75%);background-size:200% 100%}

    /* Login */
    .lp{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .dark .lp{background:radial-gradient(ellipse at 30% 20%,rgba(99,102,241,.16) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(6,182,212,.11) 0%,transparent 50%),#070d1b}
    .light .lp{background:radial-gradient(ellipse at 30% 20%,rgba(99,102,241,.08) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(6,182,212,.06) 0%,transparent 50%),#f1f5f9}
    .lc{width:430px;max-width:95vw;padding:40px;border-radius:20px;animation:fi .55s ease}
    .dark .lc{background:#0c1429;border:1px solid rgba(255,255,255,0.07)}
    .light .lc{background:#fff;border:1px solid rgba(0,0,0,0.08);box-shadow:0 20px 60px rgba(0,0,0,0.1)}

    /* Scrollbar */
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(100,116,139,.28);border-radius:100px}

    /* Notification dot */
    .nd{width:8px;height:8px;border-radius:50%;background:#ef4444;position:absolute;top:6px;right:6px}
    .nd::after{content:'';position:absolute;inset:-2px;border-radius:50%;background:rgba(239,68,68,.3);animation:pr 1.5s infinite}

    /* Toast */
    .toast-container{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px}
    .toast{display:flex;align-items:center;gap:12px;padding:12px 18px;border-radius:12px;min-width:280px;max-width:380px;animation:toast-in .3s ease;font-size:14px;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.25)}
    .toast-success{background:#064e3b;color:#6ee7b7;border:1px solid rgba(16,185,129,.3)}
    .toast-error{background:#450a0a;color:#fca5a5;border:1px solid rgba(239,68,68,.3)}
    .toast-info{background:#0c2a4a;color:#7dd3fc;border:1px solid rgba(59,130,246,.3)}
    .toast-warning{background:#451a03;color:#fcd34d;border:1px solid rgba(245,158,11,.3)}

    /* Modal */
    .mo{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
    .mo-bg{position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(8px)}
    .mo-box{position:relative;width:100%;max-width:520px;border-radius:20px;padding:32px;animation:modal-in .25s ease;max-height:88vh;overflow-y:auto}
    .dark .mo-box{background:#0c1429;border:1px solid rgba(255,255,255,.09)}
    .light .mo-box{background:#fff;box-shadow:0 32px 80px rgba(0,0,0,.18)}
    .mo-lg{max-width:700px}

    /* Avatar */
    .av{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-family:'Syne',sans-serif;flex-shrink:0}

    /* Divider */
    .div{margin:16px 0}
    .dark .div{border-top:1px solid rgba(255,255,255,.06)}
    .light .div{border-top:1px solid rgba(0,0,0,.06)}

    /* KPI ring */
    .kpi-ring{position:relative;display:inline-flex;align-items:center;justify-content:center}

    /* Section header */
    .sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}

    /* Pill tab */
    .ptab{display:flex;gap:4px;padding:4px;border-radius:10px}
    .dark .ptab{background:rgba(255,255,255,.05)}
    .light .ptab{background:rgba(0,0,0,.05)}
    .ptab-item{padding:6px 14px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s}
    .dark .ptab-item{color:#64748b}
    .light .ptab-item{color:#94a3b8}
    .ptab-item.on{background:linear-gradient(135deg,#0891b2,#6366f1);color:#fff}

    /* Pipeline kanban */
    .kboard{display:flex;gap:14px;overflow-x:auto;padding-bottom:12px}
    .kcol{min-width:220px;border-radius:12px;padding:14px}
    .dark .kcol{background:rgba(255,255,255,.025)}
    .light .kcol{background:rgba(0,0,0,.03)}

    /* Glow accent */
    .glow{box-shadow:0 0 22px rgba(6,182,212,.22)}
    .spinning{animation:spin 1s linear infinite}
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   TOAST SYSTEM
═══════════════════════════════════════════════════════════════ */
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info", dur = 3500) => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), dur);
  }, []);
  const icons = { success: <Check size={16}/>, error: <XCircle size={16}/>, info: <Info size={16}/>, warning: <AlertTriangle size={16}/> };
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {icons[t.type]}<span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════════ */
function Modal({ open, onClose, title, children, size = "" }) {
  const { dark } = useTheme();
  if (!open) return null;
  return (
    <div className="mo" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mo-bg" onClick={onClose} />
      <div className={`mo-box ${size}`} style={{ color: dark ? "#e2e8f0" : "#1a202c" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div style={{ fontSize:18, fontWeight:700, fontFamily:"Syne,sans-serif" }}>{title}</div>
          <button className="btn btn-g btn-sm" onClick={onClose} style={{ padding:"5px" }}><X size={16}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */
const CustomTooltip = ({ active, payload, label }) => {
  const { dark } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: dark ? "#0c1429" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`, borderRadius:10, padding:"10px 14px", fontSize:12, boxShadow:"0 8px 24px rgba(0,0,0,.2)" }}>
      {label && <div style={{ fontWeight:700, marginBottom:6, color: dark ? "#f1f5f9" : "#0f172a" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:p.color || p.fill }} />
          <span style={{ color: dark ? "#94a3b8" : "#64748b" }}>{p.name}:</span>
          <span style={{ fontWeight:600, color: dark ? "#f1f5f9" : "#0f172a" }}>{typeof p.value === "number" && p.value > 999 ? fmt$(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

function StatCard({ icon: Icon, label, value, change, changeLabel, color, idx = 0 }) {
  const { dark } = useTheme();
  const isPos = change >= 0;
  return (
    <div className={`sc fi s${idx + 1}`} style={{ opacity:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={20} style={{ color }} />
        </div>
        <span className={`badge ${isPos ? "bs" : "bd"}`}>
          {isPos ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
          {Math.abs(change)}%
        </span>
      </div>
      <div style={{ fontSize:24, fontWeight:700, fontFamily:"Syne,sans-serif", color: dark ? "#f1f5f9" : "#0f172a", marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:13, color: dark ? "#475569" : "#94a3b8" }}>{label}</div>
      {changeLabel && <div style={{ fontSize:11, color: dark ? "#334155" : "#cbd5e1", marginTop:4 }}>{changeLabel}</div>}
    </div>
  );
}

function Skeleton({ h = 120, mb = 0 }) {
  return <div className="sk" style={{ height: h, borderRadius:12, marginBottom: mb }} />;
}

function Avatar({ user, size = 36 }) {
  const colors = ["#06b6d4","#8b5cf6","#10b981","#f59e0b","#ef4444","#6366f1"];
  const color = colors[(user?.firstName?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className="av" style={{ width:size, height:size, background:`${color}22`, color, fontSize:size * 0.36, border:`1.5px solid ${color}44` }}>
      {initials(user) || "?"}
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  const { dark } = useTheme();
  return (
    <div className="sh">
      <div>
        <h1 style={{ fontSize:22, fontWeight:800, fontFamily:"Syne,sans-serif", color: dark ? "#f1f5f9" : "#0f172a", marginBottom:3 }}>{title}</h1>
        {subtitle && <p style={{ fontSize:13, color: dark ? "#475569" : "#94a3b8" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle, action }) {
  const { dark } = useTheme();
  return (
    <div style={{ textAlign:"center", padding:"60px 20px" }}>
      <div style={{ width:64, height:64, borderRadius:16, background:"rgba(6,182,212,.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
        <Icon size={28} style={{ color:"#06b6d4" }} />
      </div>
      <div style={{ fontSize:16, fontWeight:600, color: dark ? "#e2e8f0" : "#1a202c", marginBottom:6 }}>{title}</div>
      <div style={{ fontSize:13, color: dark ? "#475569" : "#94a3b8", marginBottom:16 }}>{subtitle}</div>
      {action}
    </div>
  );
}

/* ─── Eye / EyeOff SVG icons (defined BEFORE Login uses them) ── */
const Eye    = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

/* Google & Facebook SVG brand icons */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const { dark, toggleTheme } = useTheme();
  const toast = useToast();
  const [email,    setEmail]    = useState("vedant@vt.in");
  const [pass,     setPass]     = useState("ved1423");
  const [loading,  setLoading]  = useState(false);
  const [oauthLoading, setOauth] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");

  /* Core sign-in logic — used by the email/password form */
  const doLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await mockApi.login(email, pass);
      toast("Welcome back, " + res.user.firstName + "! 🎉", "success");
      setTimeout(() => onLogin(res.user), 350);
    } catch (err) {
      setError(err.message || "Invalid email or password");
      toast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Quick-fill AND immediately sign in */
  const demoLogin = async (cred) => {
    setError("");
    setEmail(cred.email);
    setPass(cred.pass);
    setLoading(true);
    try {
      const res = await mockApi.login(cred.email, cred.pass);
      toast("Welcome back, " + res.user.firstName + "! 🎉", "success");
      setTimeout(() => onLogin(res.user), 350);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* Simulated OAuth — shows spinner then logs in as Owner */
  const oauthLogin = async (provider) => {
    setOauth(provider);
    setError("");
    await sleep(1400);
    try {
      const res = await mockApi.login("owner@nexuserp.com", "Owner@123");
      toast(`Signed in with ${provider}! 🎉`, "success");
      setTimeout(() => onLogin(res.user), 350);
    } catch {
      toast(`${provider} login failed`, "error");
    } finally {
      setOauth("");
    }
  };

  const lc  = dark ? "#475569" : "#94a3b8";
  const bdr = dark ? "rgba(255,255,255,.09)" : "rgba(0,0,0,.1)";

  return (
    <div className="lp">
      {/* Background orbs */}
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.13),transparent 65%)", top:-150, right:-100, pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,.1),transparent 65%)", bottom:-100, left:-80, pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.08),transparent 65%)", bottom:100, right:80, pointerEvents:"none" }} />

      <div className="lc">
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,#0891b2,#6366f1)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:14, boxShadow:"0 8px 28px rgba(99,102,241,.4)" }}>
            <Building2 size={26} color="#fff" />
          </div>
          <div style={{ fontSize:28, fontWeight:800, fontFamily:"Syne,sans-serif", background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-.02em" }}>NexusERP</div>
          <div style={{ fontSize:13, color:lc, marginTop:4 }}>Enterprise Resource Planning</div>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          {[
            { provider:"Google",   Icon:GoogleIcon,   bg: dark ? "rgba(255,255,255,.06)" : "#fff", border: bdr, color: dark ? "#e2e8f0" : "#1a202c" },
            { provider:"Facebook", Icon:FacebookIcon, bg: dark ? "rgba(24,119,242,.12)" : "#e7f0fd", border: dark ? "rgba(24,119,242,.3)" : "rgba(24,119,242,.25)", color: dark ? "#93c5fd" : "#1877F2" },
          ].map(({ provider, Icon, bg, border, color }) => (
            <button
              key={provider}
              onClick={() => oauthLogin(provider)}
              disabled={!!oauthLoading || loading}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"10px 16px", borderRadius:10, border:`1px solid ${border}`, background:bg, cursor:(oauthLoading||loading)?"not-allowed":"pointer", transition:"all .15s", fontSize:14, fontWeight:500, color, fontFamily:"'DM Sans',sans-serif", opacity:(oauthLoading&&oauthLoading!==provider)?.5:1 }}>
              {oauthLoading === provider
                ? <div style={{ width:18, height:18, border:"2px solid rgba(99,102,241,.3)", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
                : <Icon/>}
              {oauthLoading === provider ? `Connecting to ${provider}…` : `Continue with ${provider}`}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background: dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)" }}/>
          <span style={{ fontSize:11, color:lc, fontWeight:600, letterSpacing:".05em", textTransform:"uppercase" }}>or with email</span>
          <div style={{ flex:1, height:1, background: dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)" }}/>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:8, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.25)", marginBottom:14, fontSize:13, color:"#f87171" }}>
            <XCircle size={14}/>{error}
          </div>
        )}

        {/* Email / Password form */}
        <form onSubmit={(e) => doLogin(e)}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:lc, marginBottom:6, letterSpacing:".05em", textTransform:"uppercase" }}>Email Address</label>
            <input
              className="inp"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="your@company.com"
              required
              autoComplete="email"
            />
          </div>
          <div style={{ marginBottom:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <label style={{ fontSize:11, fontWeight:600, color:lc, letterSpacing:".05em", textTransform:"uppercase" }}>Password</label>
              <button type="button" style={{ fontSize:11, color:"#06b6d4", background:"none", border:"none", cursor:"pointer", padding:0 }}
                onClick={() => toast("Password reset link sent (demo)", "info")}>
                Forgot password?
              </button>
            </div>
            <div style={{ position:"relative" }}>
              <input
                className="inp"
                type={showPass ? "text" : "password"}
                value={pass}
                onChange={e => { setPass(e.target.value); setError(""); }}
                placeholder="••••••••"
                style={{ paddingRight:42 }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:lc, display:"flex", alignItems:"center" }}>
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          <button
            className="btn btn-p"
            type="submit"
            style={{ width:"100%", justifyContent:"center", padding:"12px", fontSize:14, marginTop:18, borderRadius:10, letterSpacing:".01em" }}
            disabled={loading || !!oauthLoading}>
            {loading
              ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>Signing in…</>
              : <>Sign In →</>}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div style={{ marginTop:22 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", color: dark ? "#2a3a52" : "#cbd5e1", textAlign:"center", marginBottom:10 }}>Quick Demo Login</div>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { label:"👑 Owner",    email:"owner@nexuserp.com", pass:"Owner@123"    },
              { label:"👤 Employee", email:"sarah@nexuserp.com",  pass:"Employee@123" },
            ].map(c => (
              <button
                key={c.label}
                className="btn btn-g"
                style={{ flex:1, justifyContent:"center", fontSize:12, padding:"8px" }}
                disabled={loading || !!oauthLoading}
                onClick={() => demoLogin(c)}>
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize:11, color: dark ? "#1e3050" : "#e2e8f0", textAlign:"center", marginTop:8 }}>
            Your login: vedant@vt.in · ved1423
          </div>
        </div>

        {/* Theme toggle */}
        <div style={{ textAlign:"center", marginTop:18, paddingTop:16, borderTop:`1px solid ${dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)"}` }}>
          <button className="btn btn-g btn-sm" onClick={toggleTheme} style={{ fontSize:11 }}>
            {dark ? <Sun size={12}/> : <Moon size={12}/>}&nbsp;{dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
function Sidebar({ page, setPage, role, onLogout, collapsed, setCollapsed }) {
  const { dark } = useTheme();
  const { user } = useAuth();

  const ownerNav = [
    { id:"dashboard", icon:LayoutDashboard, label:"Dashboard" },
    { id:"inventory",  icon:Package,         label:"Inventory" },
    { id:"finance",    icon:DollarSign,      label:"Finance" },
    { id:"employees",  icon:Users,           label:"Employees" },
    { id:"sales",      icon:ShoppingCart,    label:"Sales & CRM" },
    { id:"tasks",      icon:CheckSquare,     label:"Tasks" },
    { id:"reports",    icon:BarChart2,       label:"Reports" },
  ];
  const empNav = [
    { id:"dashboard", icon:LayoutDashboard, label:"My Dashboard" },
    { id:"tasks",     icon:CheckSquare,     label:"My Tasks" },
  ];
  const nav = role === "EMPLOYEE" ? empNav : ownerNav;

  const lc = dark ? "#64748b" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";

  return (
    <div className={`sb${collapsed ? " off" : ""}`}>
      {/* Logo */}
      <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)"}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#0891b2,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Building2 size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize:17, fontWeight:800, fontFamily:"Syne,sans-serif", background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>NexusERP</div>
            <div style={{ fontSize:10, color: lc, letterSpacing:".05em" }}>v2.4 · {role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 0", overflowY:"auto" }}>
        <div style={{ fontSize:10, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color: dark ? "#2a3a52" : "#cbd5e1", padding:"8px 22px 6px" }}>Navigation</div>
        {nav.map(({ id, icon: Icon, label }) => (
          <div key={id} className={`ni${page === id ? " on" : ""}`} onClick={() => { setPage(id); if(window.innerWidth < 900) setCollapsed(true); }}>
            <Icon size={16} style={{ flexShrink:0 }} />
            <span>{label}</span>
            {page === id && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"rgba(255,255,255,.6)" }} />}
          </div>
        ))}

        {role !== "EMPLOYEE" && (
          <>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase", color: dark ? "#2a3a52" : "#cbd5e1", padding:"14px 22px 6px", marginTop:8 }}>System</div>
            <div className={`ni${page==="settings"?" on":""}`} onClick={() => { setPage("settings"); if(window.innerWidth < 900) setCollapsed(true); }}><Settings size={16}/><span>Settings</span></div>
          </>
        )}
      </nav>

      {/* User */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)"}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 4px", borderRadius:10, cursor:"pointer" }}>
          <Avatar user={user} size={34} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color: tc, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize:11, color: lc }}>{role}</div>
          </div>
          <button className="btn btn-g btn-sm" style={{ padding:"5px" }} title="Logout" onClick={onLogout}><LogOut size={14}/></button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════════ */
function Topbar({ page, collapsed, setCollapsed, toggleTheme, dark, notifications }) {
  const pageNames = { dashboard:"Dashboard", inventory:"Inventory", finance:"Finance & Accounting", employees:"Employee Management", sales:"Sales & CRM", tasks:"Task Manager", reports:"Reports & Analytics" };

  return (
    <div className="tb">
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <button className="btn btn-g btn-sm" style={{ padding:"7px" }} onClick={() => setCollapsed(c=>!c)}>
          {collapsed ? <Menu size={18}/> : <X size={18}/>}
        </button>
        <div>
          <div style={{ fontSize:16, fontWeight:700, fontFamily:"Syne,sans-serif" }}>{pageNames[page] || "NexusERP"}</div>
          <div style={{ fontSize:11, color: dark ? "#3d5068" : "#94a3b8" }}>{new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</div>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button className="btn btn-g btn-sm" style={{ position:"relative", padding:"7px" }} onClick={toggleTheme}>
          {dark ? <Sun size={16}/> : <Moon size={16}/>}
        </button>
        <button className="btn btn-g btn-sm" style={{ position:"relative", padding:"7px" }}>
          <Bell size={16}/>
          {notifications > 0 && <div className="nd" style={{ width:6, height:6, top:4, right:4 }} />}
        </button>
        <button className="btn btn-g btn-sm" style={{ padding:"7px" }}><RefreshCw size={16}/></button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OWNER DASHBOARD
═══════════════════════════════════════════════════════════════ */
function OwnerDashboard() {
  const { dark } = useTheme();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.ownerDashboard().then(d => { setData(d); setLoading(false); });
  }, []);

  const gc = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)";
  const lc = dark ? "#3d5068" : "#94a3b8";

  if (loading) return (
    <div style={{ padding:24 }}>
      <div className="g4" style={{ marginBottom:20 }}>{[0,1,2,3].map(i => <Skeleton key={i} h={110}/>)}</div>
      <div className="g2">{[0,1].map(i => <Skeleton key={i} h={260}/>)}</div>
    </div>
  );

  const { kpis, recentTransactions, monthlyRevenue } = data;

  return (
    <div style={{ padding:24 }}>
      {/* KPI Cards */}
      <div className="g4" style={{ marginBottom:22 }}>
        <StatCard icon={DollarSign} label="Monthly Revenue" value={fmtK(kpis.revenue.current)} change={kpis.revenue.change} changeLabel="vs last month" color="#10b981" idx={0} />
        <StatCard icon={ShoppingCart} label="Orders" value={kpis.totalOrders.toLocaleString()} change={12} changeLabel="267 this week" color="#06b6d4" idx={1} />
        <StatCard icon={Users} label="Active Employees" value={kpis.activeEmployees} change={4} changeLabel="2 on leave" color="#8b5cf6" idx={2} />
        <StatCard icon={Package} label="Low Stock Alerts" value={kpis.lowStockProducts} change={-1} changeLabel="Need reorder" color="#f59e0b" idx={3} />
      </div>

      {/* Charts row 1 */}
      <div className="g2" style={{ marginBottom:20 }}>
        <div className="card fi s3" style={{ opacity:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color: dark ? "#f1f5f9" : "#0f172a" }}>Revenue Overview</div>
              <div style={{ fontSize:12, color: lc }}>Revenue, expenses & profit</div>
            </div>
            <span className="badge bs">+{kpis.revenue.change}% MoM</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0891b2" stopOpacity={0.28}/>
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gc}/>
              <XAxis dataKey="month" tick={{ fill:lc, fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:lc, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0891b2" fill="url(#g1)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#8b5cf6" fill="url(#g2)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="5 3" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card fi s4" style={{ opacity:0 }}>
          <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color: dark ? "#f1f5f9" : "#0f172a", marginBottom:4 }}>Sales by Category</div>
          <div style={{ fontSize:12, color: lc, marginBottom:14 }}>Revenue distribution</div>
          <div style={{ display:"flex", alignItems:"center" }}>
            <ResponsiveContainer width="55%" height={190}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="value" paddingAngle={3}>
                  {categoryData.map((c,i) => <Cell key={i} fill={c.color}/>)}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:9 }}>
              {categoryData.map((c,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c.color, flexShrink:0 }}/>
                  <span style={{ fontSize:12, color: lc, flex:1 }}>{c.name}</span>
                  <span style={{ fontSize:12, fontWeight:700, color: dark ? "#e2e8f0" : "#0f172a" }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="g3" style={{ marginBottom:20 }}>
        {[
          { label:"Gross Profit", val: fmt$(kpis.profit.current), color:"#10b981", icon:TrendingUp },
          { label:"Pending Tasks", val: kpis.pendingTasks, color:"#f59e0b", icon:CheckSquare },
          { label:"Expense Ratio", val: `${((kpis.expenses.current / kpis.revenue.current) * 100).toFixed(0)}%`, color:"#ef4444", icon:TrendingDown },
        ].map((item,i) => (
          <div key={i} className={`card fi s${i+3}`} style={{ opacity:0, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:12, background:`${item.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <item.icon size={22} style={{ color:item.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, fontFamily:"Syne,sans-serif", color: dark ? "#f1f5f9" : "#0f172a" }}>{item.val}</div>
              <div style={{ fontSize:12, color: lc }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card fi s5" style={{ opacity:0 }}>
        <div className="sh">
          <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color: dark ? "#f1f5f9" : "#0f172a" }}>Recent Transactions</div>
          <span className="badge bi">{recentTransactions.length} shown</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table className="dt">
            <thead><tr>{["Reference","Description","Type","Amount","Category","Status","Date"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {recentTransactions.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily:"monospace", fontSize:12, color:"#06b6d4" }}>{t.reference || t.id}</td>
                  <td style={{ fontWeight:500, color: dark ? "#cbd5e1" : "#334155" }}>{t.description}</td>
                  <td><span className={`badge ${t.type==="INCOME" ? "bs" : "bd"}`}>{t.type}</span></td>
                  <td style={{ fontWeight:700, color: t.type==="INCOME" ? "#10b981" : "#ef4444" }}>
                    {t.type==="INCOME" ? "+" : "-"}{fmt$(t.amount)}
                  </td>
                  <td><span className="badge bg-gray">{t.category}</span></td>
                  <td><span className={`badge ${t.status==="COMPLETED" ? "bs" : "bw"}`}>{t.status}</span></td>
                  <td style={{ color: lc, fontSize:12 }}>{fmtDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EMPLOYEE DASHBOARD
═══════════════════════════════════════════════════════════════ */
function EmployeeDashboard() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { mockApi.employeeDashboard().then(d => { setData(d); setLoading(false); }); }, []);

  const lc = dark ? "#3d5068" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";

  if (loading) return <div style={{ padding:24 }}><div className="g3" style={{ marginBottom:20 }}>{[0,1,2].map(i=><Skeleton key={i} h={100}/>)}</div><Skeleton h={300}/></div>;

  const { myTasks, stats } = data;
  const priColor = { CRITICAL:"#ef4444", HIGH:"#f59e0b", MEDIUM:"#06b6d4", LOW:"#10b981" };
  const stClass  = { COMPLETED:"bs", IN_PROGRESS:"bi", TODO:"bg-gray", REVIEW:"bp" };

  return (
    <div style={{ padding:24 }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, fontFamily:"Syne,sans-serif", color:tc }}>Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user?.firstName}! 👋</h1>
        <p style={{ fontSize:13, color:lc }}>Here's your work summary for today.</p>
      </div>

      <div className="g3" style={{ marginBottom:20 }}>
        {[
          { label:"Total Tasks",     val:stats.total,     color:"#06b6d4", icon:ClipboardList },
          { label:"Completed",       val:stats.completed, color:"#10b981", icon:CheckCircle  },
          { label:"Hours This Week", val:stats.hoursThisWeek, color:"#8b5cf6", icon:Clock    },
        ].map((item,i) => (
          <div key={i} className={`card fi s${i+1}`} style={{ opacity:0, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${item.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <item.icon size={20} style={{ color:item.color }}/>
            </div>
            <div>
              <div style={{ fontSize:28, fontWeight:800, fontFamily:"Syne,sans-serif", color:tc }}>{item.val}</div>
              <div style={{ fontSize:12, color:lc }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card fi s3" style={{ opacity:0 }}>
        <div className="sh">
          <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc }}>My Tasks</div>
          <span className="badge bi">{myTasks.length} assigned</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {myTasks.map((t, i) => (
            <div key={t.id} className={`fi s${i+1}`} style={{ opacity:0, padding:14, borderRadius:10, border:`1px solid ${dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)"}`, transition:"border-color .2s", background: dark ? "rgba(255,255,255,.015)" : "rgba(0,0,0,.01)" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:tc, marginBottom:4 }}>{t.title}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span className={`badge ${stClass[t.status]}`}>{t.status.replace("_"," ")}</span>
                    <span className="badge" style={{ background:`${priColor[t.priority]}18`, color:priColor[t.priority] }}>{t.priority}</span>
                  </div>
                </div>
                <span style={{ fontSize:11, color:lc, marginLeft:12 }}>Due {fmtDate(t.dueDate)}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div className="pt" style={{ flex:1 }}>
                  <div className="pf" style={{ width:`${t.progress}%` }} />
                </div>
                <span style={{ fontSize:12, fontWeight:600, color: lc, width:30, textAlign:"right" }}>{t.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INVENTORY PAGE
═══════════════════════════════════════════════════════════════ */
function InventoryPage() {
  const { dark } = useTheme();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search,  setSearch]    = useState("");
  const [catFilter, setCat]     = useState("All");
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState({ name:"", sku:"", category:"Electronics", unitPrice:"", costPrice:"", stockQty:"", reorderPoint:10 });
  const lc = dark ? "#3d5068" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";
  const cats = ["All","Electronics","Sports","Home & Garden","Clothing"];

  useEffect(() => { mockApi.getProducts().then(d => { setProducts(d.products); setLoading(false); }); }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const stockStatus = (p) => {
    if (p.stockQty === 0) return { label:"Out of Stock", cls:"bd" };
    if (p.stockQty <= p.reorderPoint) return { label:"Low Stock", cls:"bw" };
    return { label:"In Stock", cls:"bs" };
  };

  const handleCreate = async () => {
    toast("Product created successfully!", "success");
    setProducts(prev => [...prev, { ...form, id:`PRD-${Date.now()}`, supplier: { name: "TechSource Inc" }, unitPrice: parseFloat(form.unitPrice), costPrice: parseFloat(form.costPrice), stockQty: parseInt(form.stockQty), reorderPoint: parseInt(form.reorderPoint) }]);
    setModal(false);
    setForm({ name:"", sku:"", category:"Electronics", unitPrice:"", costPrice:"", stockQty:"", reorderPoint:10 });
  };

  const lowStockCount = products.filter(p => p.stockQty <= p.reorderPoint).length;

  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Inventory Management" subtitle={`${products.length} products · ${lowStockCount} low stock alerts`}
        action={<button className="btn btn-p" onClick={() => setModal(true)}><Plus size={16}/>Add Product</button>} />

      {/* Summary cards */}
      <div className="g4" style={{ marginBottom:20 }}>
        {[
          { label:"Total Products", val:products.length, color:"#06b6d4" },
          { label:"Low Stock",      val:lowStockCount,   color:"#f59e0b" },
          { label:"Out of Stock",   val:products.filter(p=>p.stockQty===0).length, color:"#ef4444" },
          { label:"Total Value",    val:fmt$(products.reduce((s,p)=>s+p.stockQty*p.unitPrice,0)), color:"#10b981" },
        ].map((item,i) => (
          <div key={i} className={`sc fi s${i+1}`} style={{ opacity:0 }}>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>{item.val}</div>
            <div style={{ fontSize:12, color:lc }}>{item.label}</div>
            <div style={{ width:"100%", height:3, borderRadius:100, background:`${item.color}22`, marginTop:12 }}>
              <div style={{ height:"100%", borderRadius:100, background:item.color, width:`${Math.min((i+1)*25,100)}%`, transition:"width 1s" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div className="inp-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={14} className="inp-icon" style={{ color:lc }}/>
          <input className="inp pl" placeholder="Search products, SKU…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="ptab">
          {cats.map(c => <div key={c} className={`ptab-item${catFilter===c?" on":""}`} onClick={()=>setCat(c)}>{c}</div>)}
        </div>
      </div>

      {/* Table */}
      <div className="card fi s3" style={{ opacity:0, overflowX:"auto" }}>
        {loading ? <Skeleton h={300}/> : (
          <table className="dt">
            <thead><tr>{["SKU","Product","Category","Stock","Reorder Pt","Unit Price","Cost Price","Supplier","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(p => {
                const ss = stockStatus(p);
                const margin = ((p.unitPrice - p.costPrice) / p.unitPrice * 100).toFixed(0);
                return (
                  <tr key={p.id}>
                    <td style={{ fontFamily:"monospace", fontSize:12, color:"#06b6d4" }}>{p.sku}</td>
                    <td style={{ fontWeight:600, color: dark ? "#cbd5e1" : "#334155" }}>{p.name}</td>
                    <td><span className="badge bg-gray">{p.category}</span></td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontWeight:700, color: p.stockQty <= p.reorderPoint ? "#f59e0b" : tc }}>{p.stockQty}</span>
                        <div className="pt" style={{ width:50 }}><div className="pf" style={{ width:`${Math.min(p.stockQty/p.reorderPoint*50,100)}%`, background: p.stockQty <= p.reorderPoint ? "#f59e0b" : undefined }} /></div>
                      </div>
                    </td>
                    <td style={{ color:lc }}>{p.reorderPoint}</td>
                    <td style={{ fontWeight:600, color:"#10b981" }}>{fmt$(p.unitPrice)}</td>
                    <td style={{ color:lc }}>{fmt$(p.costPrice)}</td>
                    <td style={{ fontSize:12, color:lc }}>{p.supplier?.name}</td>
                    <td><span className={`badge ${ss.cls}`}>{ss.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add New Product">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { label:"Product Name", key:"name", type:"text", placeholder:"e.g. Wireless Headphones" },
            { label:"SKU", key:"sku", type:"text", placeholder:"e.g. WHP-2024" },
            { label:"Unit Price ($)", key:"unitPrice", type:"number", placeholder:"299.99" },
            { label:"Cost Price ($)", key:"costPrice", type:"number", placeholder:"180.00" },
            { label:"Stock Qty", key:"stockQty", type:"number", placeholder:"100" },
          ].map(f => (
            <div key={f.key}>
              <div style={{ fontSize:12, fontWeight:600, color: dark ? "#64748b" : "#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>{f.label}</div>
              <input className="inp" type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}/>
            </div>
          ))}
          <div>
            <div style={{ fontSize:12, fontWeight:600, color: dark ? "#64748b" : "#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>Category</div>
            <select className="inp" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
              {["Electronics","Sports","Home & Garden","Clothing","Other"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:6 }}>
            <button className="btn btn-g" style={{ flex:1 }} onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-p" style={{ flex:2 }} onClick={handleCreate}><Save size={14}/>Create Product</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EMPLOYEES PAGE
═══════════════════════════════════════════════════════════════ */
function EmployeesPage() {
  const { dark } = useTheme();
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [deptFilter, setDept] = useState("All");
  const [selected, setSelected] = useState(null);
  const lc = dark ? "#3d5068" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";

  useEffect(() => { mockApi.getEmployees().then(d => { setEmployees(d.employees); setLoading(false); }); }, []);

  const depts = ["All", ...new Set(employees.map(e => e.department))];
  const filtered = employees.filter(e => {
    const name = `${e.user?.firstName} ${e.user?.lastName}`.toLowerCase();
    return (deptFilter === "All" || e.department === deptFilter) && name.includes(search.toLowerCase());
  });

  const stMap = { ACTIVE:"bs", ON_LEAVE:"bw", TERMINATED:"bd" };
  const stLabel = { ACTIVE:"Active", ON_LEAVE:"On Leave", TERMINATED:"Terminated" };

  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Employee Management" subtitle={`${employees.filter(e=>e.status==="ACTIVE").length} active · ${employees.filter(e=>e.status==="ON_LEAVE").length} on leave`}
        action={<button className="btn btn-p" onClick={() => toast("Feature: Add Employee", "info")}><UserPlus size={16}/>Add Employee</button>} />

      <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div className="inp-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={14} className="inp-icon" style={{ color:lc }}/>
          <input className="inp pl" placeholder="Search employees…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="inp" style={{ width:"auto", minWidth:160 }} value={deptFilter} onChange={e=>setDept(e.target.value)}>
          {depts.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>

      {loading ? <Skeleton h={400}/> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
          {filtered.map((emp, i) => {
            const perf = emp.performanceReviews?.[0]?.score ?? 0;
            return (
              <div key={emp.id} className={`card fi s${(i%3)+1}`} style={{ opacity:0, cursor:"pointer" }} onClick={() => setSelected(emp)}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <Avatar user={emp.user} size={44}/>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:tc }}>{emp.user?.firstName} {emp.user?.lastName}</div>
                    <div style={{ fontSize:12, color:lc }}>{emp.designation}</div>
                  </div>
                  <span className={`badge ${stMap[emp.status]}`} style={{ marginLeft:"auto" }}>{stLabel[emp.status]}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    { icon:Briefcase, val:emp.department },
                    { icon:Hash,      val:emp.employeeCode },
                    { icon:DollarSign,val:fmt$(emp.salary) + " /yr" },
                  ].map(({ icon:Icon, val }, j) => (
                    <div key={j} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Icon size={13} style={{ color:lc }}/>
                      <span style={{ fontSize:12, color: lc }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:lc, marginBottom:5 }}>
                    <span>Performance</span><span style={{ fontWeight:700, color: perf >= 90 ? "#10b981" : perf >= 80 ? "#f59e0b" : "#ef4444" }}>{perf}%</span>
                  </div>
                  <div className="pt"><div className="pf" style={{ width:`${perf}%`, background: perf >= 90 ? "#10b981" : perf >= 80 ? "#f59e0b" : "#ef4444" }}/></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Employee Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Employee Details" size="mo-lg">
        {selected && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:22, padding:16, borderRadius:12, background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
              <Avatar user={selected.user} size={56}/>
              <div>
                <div style={{ fontSize:20, fontWeight:700, color: dark ? "#f1f5f9" : "#0f172a" }}>{selected.user?.firstName} {selected.user?.lastName}</div>
                <div style={{ fontSize:13, color: dark ? "#64748b" : "#94a3b8" }}>{selected.designation} · {selected.department}</div>
                <div style={{ marginTop:6 }}><span className={`badge ${stMap[selected.status]}`}>{stLabel[selected.status]}</span></div>
              </div>
            </div>
            <div className="g2" style={{ gap:12 }}>
              {[
                ["Employee Code",  selected.employeeCode],
                ["Email",          selected.user?.email],
                ["Department",     selected.department],
                ["Annual Salary",  fmt$(selected.salary)],
                ["Performance",    `${selected.performanceReviews?.[0]?.score ?? "N/A"}%`],
              ].map(([k,v]) => (
                <div key={k} style={{ padding:"10px 14px", borderRadius:8, background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)" }}>
                  <div style={{ fontSize:11, color: dark ? "#3d5068" : "#94a3b8", marginBottom:3, textTransform:"uppercase", letterSpacing:".05em", fontWeight:600 }}>{k}</div>
                  <div style={{ fontSize:14, fontWeight:600, color: dark ? "#e2e8f0" : "#1a202c" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <button className="btn btn-p" style={{ flex:1, justifyContent:"center" }} onClick={() => { toast("Edit mode (connect to API)", "info"); setSelected(null); }}><Edit size={14}/>Edit Employee</button>
              <button className="btn btn-g" style={{ flex:1, justifyContent:"center" }} onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FINANCE PAGE
═══════════════════════════════════════════════════════════════ */
function FinancePage() {
  const { dark } = useTheme();
  const toast = useToast();
  const [tab, setTab] = useState("transactions");
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const lc = dark ? "#3d5068" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";

  useEffect(() => {
    Promise.all([mockApi.getTransactions(), mockApi.getInvoices()]).then(([t, inv]) => {
      setTransactions(t.transactions); setInvoices(inv.invoices); setLoading(false);
    });
  }, []);

  const totalIncome   = transactions.filter(t=>t.type==="INCOME").reduce((s,t)=>s+t.amount,0);
  const totalExpenses = transactions.filter(t=>t.type==="EXPENSE").reduce((s,t)=>s+t.amount,0);
  const overdueInv    = invoices.filter(i=>i.status==="OVERDUE");
  const invStatus = { PAID:"bs", SENT:"bi", OVERDUE:"bd", DRAFT:"bg-gray", CANCELLED:"bg-gray" };

  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Finance & Accounting" subtitle="Transactions, invoices and cash flow"
        action={<button className="btn btn-p" onClick={() => toast("Feature: New Transaction", "info")}><Plus size={16}/>New Transaction</button>}/>

      <div className="g4" style={{ marginBottom:20 }}>
        {[
          { label:"Total Income",   val:fmt$(totalIncome),              color:"#10b981" },
          { label:"Total Expenses", val:fmt$(totalExpenses),            color:"#ef4444" },
          { label:"Net Profit",     val:fmt$(totalIncome-totalExpenses),color:"#06b6d4" },
          { label:"Overdue Invoices",val:overdueInv.length+" invoices", color:"#f59e0b" },
        ].map((item,i) => (
          <div key={i} className={`sc fi s${i+1}`} style={{ opacity:0 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:`${item.color}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
              <DollarSign size={16} style={{ color:item.color }}/>
            </div>
            <div style={{ fontSize:20, fontWeight:800, fontFamily:"Syne,sans-serif", color:tc, marginBottom:3 }}>{item.val}</div>
            <div style={{ fontSize:12, color:lc }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="ptab" style={{ marginBottom:16, display:"inline-flex" }}>
        {[["transactions","Transactions"],["invoices","Invoices"]].map(([k,l]) => (
          <div key={k} className={`ptab-item${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</div>
        ))}
      </div>

      <div className="card" style={{ overflowX:"auto" }}>
        {loading ? <Skeleton h={300}/> : tab === "transactions" ? (
          <table className="dt">
            <thead><tr>{["Reference","Description","Type","Amount","Category","Status","Date"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily:"monospace", fontSize:12, color:"#06b6d4" }}>{t.reference}</td>
                  <td style={{ fontWeight:500 }}>{t.description}</td>
                  <td><span className={`badge ${t.type==="INCOME"?"bs":"bd"}`}>{t.type}</span></td>
                  <td style={{ fontWeight:700, color: t.type==="INCOME"?"#10b981":"#ef4444" }}>{t.type==="INCOME"?"+":"-"}{fmt$(t.amount)}</td>
                  <td><span className="badge bg-gray">{t.category}</span></td>
                  <td><span className={`badge ${t.status==="COMPLETED"?"bs":"bw"}`}>{t.status}</span></td>
                  <td style={{ color:lc, fontSize:12 }}>{fmtDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="dt">
            <thead><tr>{["Invoice #","Client","Amount","Issued","Due","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontFamily:"monospace", fontSize:12, color:"#06b6d4" }}>{inv.invoiceNumber}</td>
                  <td style={{ fontWeight:600 }}>{inv.customer?.name}</td>
                  <td style={{ fontWeight:700, color:tc }}>{fmt$(inv.totalAmount)}</td>
                  <td style={{ fontSize:12, color:lc }}>{fmtDate(inv.issueDate)}</td>
                  <td style={{ fontSize:12, color: inv.status==="OVERDUE"?"#ef4444":lc }}>{fmtDate(inv.dueDate)}</td>
                  <td><span className={`badge ${invStatus[inv.status]}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SALES & CRM PAGE
═══════════════════════════════════════════════════════════════ */
function SalesPage() {
  const { dark } = useTheme();
  const toast = useToast();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders]       = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const lc = dark ? "#3d5068" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";

  useEffect(() => {
    Promise.all([mockApi.getOrders(), mockApi.getCustomers(), mockApi.getDeals()]).then(([o,c,d]) => {
      setOrders(o.orders); setCustomers(c.customers); setDeals(d); setLoading(false);
    });
  }, []);

  const orderStatusMap = { PENDING:"bw", CONFIRMED:"bi", SHIPPED:"bp", DELIVERED:"bs", CANCELLED:"bd" };
  const dealStageColor = { LEAD:"#94a3b8", DISCOVERY:"#06b6d4", PROPOSAL:"#8b5cf6", NEGOTIATION:"#f59e0b", CLOSED_WON:"#10b981", CLOSED_LOST:"#ef4444" };

  const pipelineValue = deals.filter(d=>!["CLOSED_WON","CLOSED_LOST"].includes(d.stage)).reduce((s,d)=>s+Number(d.value),0);

  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Sales & CRM" subtitle={`${orders.length} orders · ${customers.length} customers · ${fmt$(pipelineValue)} pipeline`}
        action={<button className="btn btn-p" onClick={()=>toast("Feature: New Order","info")}><Plus size={16}/>New Order</button>}/>

      <div className="g4" style={{ marginBottom:20 }}>
        {[
          { label:"Total Revenue",    val:fmt$(orders.filter(o=>o.status!=="CANCELLED").reduce((s,o)=>s+Number(o.totalAmount),0)), color:"#10b981" },
          { label:"Active Orders",    val:orders.filter(o=>!["DELIVERED","CANCELLED"].includes(o.status)).length, color:"#06b6d4" },
          { label:"Total Customers",  val:customers.length, color:"#8b5cf6" },
          { label:"Pipeline Value",   val:fmt$(pipelineValue), color:"#f59e0b" },
        ].map((item,i) => (
          <div key={i} className={`sc fi s${i+1}`} style={{ opacity:0 }}>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>{item.val}</div>
            <div style={{ fontSize:12, color:lc }}>{item.label}</div>
            <div style={{ width:"100%", height:3, borderRadius:100, background:`${item.color}22`, marginTop:10 }}>
              <div style={{ height:"100%", borderRadius:100, background:item.color, width:`${(i+1)*25}%` }}/>
            </div>
          </div>
        ))}
      </div>

      <div className="ptab" style={{ marginBottom:16, display:"inline-flex" }}>
        {[["orders","Orders"],["customers","Customers"],["pipeline","Deal Pipeline"]].map(([k,l]) => (
          <div key={k} className={`ptab-item${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</div>
        ))}
      </div>

      {loading ? <div className="card"><Skeleton h={300}/></div> : (
        <>
          {tab === "orders" && (
            <div className="card" style={{ overflowX:"auto" }}>
              <table className="dt">
                <thead><tr>{["Order #","Customer","Amount","Status","Date"].map(h=><th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontFamily:"monospace", fontSize:12, color:"#06b6d4" }}>{o.orderNumber}</td>
                      <td style={{ fontWeight:600 }}>{o.customer?.name}</td>
                      <td style={{ fontWeight:700, color:tc }}>{fmt$(o.totalAmount)}</td>
                      <td><span className={`badge ${orderStatusMap[o.status]}`}>{o.status}</span></td>
                      <td style={{ fontSize:12, color:lc }}>{fmtDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "customers" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
              {customers.map((c,i) => (
                <div key={c.id} className={`card fi s${(i%3)+1}`} style={{ opacity:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                    <div style={{ width:42, height:42, borderRadius:10, background:"rgba(6,182,212,.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Building2 size={18} style={{ color:"#06b6d4" }}/>
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:tc }}>{c.name}</div>
                      <div style={{ fontSize:11, color:lc }}>{c.company}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:lc }}>
                    <span>Total Spent</span><span style={{ fontWeight:700, color:"#10b981" }}>{fmt$(c.totalSpent)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:lc, marginTop:4 }}>
                    <span>Orders</span><span style={{ fontWeight:600, color:tc }}>{c._count?.orders}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "pipeline" && (
            <div className="kboard">
              {["LEAD","DISCOVERY","PROPOSAL","NEGOTIATION","CLOSED_WON","CLOSED_LOST"].map(stage => {
                const stageDeals = deals.filter(d=>d.stage===stage);
                const color = dealStageColor[stage];
                return (
                  <div key={stage} className="kcol">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div style={{ fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", color }}>{stage.replace("_"," ")}</div>
                      <span className="badge" style={{ background:`${color}18`, color }}>{stageDeals.length}</span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {stageDeals.map(d => (
                        <div key={d.id} style={{ padding:"12px 14px", borderRadius:10, border:`1px solid ${dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)"}`, background: dark?"rgba(255,255,255,.025)":"#fff", cursor:"pointer" }}>
                          <div style={{ fontSize:13, fontWeight:600, color:tc, marginBottom:6 }}>{d.title}</div>
                          <div style={{ fontSize:12, color:lc, marginBottom:6 }}>{d.customer?.name}</div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize:13, fontWeight:700, color:"#10b981" }}>{fmt$(d.value)}</span>
                            <span style={{ fontSize:11, background:`${color}18`, color, padding:"2px 7px", borderRadius:100, fontWeight:600 }}>{d.probability}%</span>
                          </div>
                        </div>
                      ))}
                      {stageDeals.length === 0 && <div style={{ fontSize:12, color: lc, textAlign:"center", padding:"20px 0" }}>No deals</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TASKS PAGE
═══════════════════════════════════════════════════════════════ */
function TasksPage() {
  const { dark } = useTheme();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("ALL");
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(false);
  const [newTask, setNewTask]  = useState({ title:"", priority:"MEDIUM", assignee:"", dueDate:"" });
  const lc = dark ? "#3d5068" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";

  useEffect(() => { mockApi.getTasks().then(d => { setTasks(d.tasks); setLoading(false); }); }, []);

  const priColor  = { CRITICAL:"#ef4444", HIGH:"#f59e0b", MEDIUM:"#06b6d4", LOW:"#10b981" };
  const stClass   = { COMPLETED:"bs", IN_PROGRESS:"bi", TODO:"bg-gray", REVIEW:"bp", CANCELLED:"bd" };
  const stFilters = ["ALL","TODO","IN_PROGRESS","COMPLETED","REVIEW"];

  const filtered = tasks.filter(t => {
    const matchFilter = filter === "ALL" || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total:     tasks.length,
    completed: tasks.filter(t=>t.status==="COMPLETED").length,
    inProgress:tasks.filter(t=>t.status==="IN_PROGRESS").length,
    overdue:   tasks.filter(t=>t.dueDate && new Date(t.dueDate) < new Date() && t.status!=="COMPLETED").length,
  };

  const handleCreate = () => {
    const task = { id:`t${Date.now()}`, ...newTask, status:"TODO", progress:0, assignee: { firstName: newTask.assignee.split(" ")[0], lastName: newTask.assignee.split(" ")[1] || "" }, tags:[], project:null };
    setTasks(p => [task, ...p]);
    toast("Task created!", "success");
    setModal(false);
    setNewTask({ title:"", priority:"MEDIUM", assignee:"", dueDate:"" });
  };

  const toggleDone = (id) => {
    setTasks(p => p.map(t => t.id===id ? { ...t, status: t.status==="COMPLETED" ? "TODO" : "COMPLETED", progress: t.status==="COMPLETED"?0:100 } : t));
    toast("Task status updated", "success");
  };

  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Task Manager" subtitle={`${stats.total} tasks · ${stats.inProgress} in progress`}
        action={<button className="btn btn-p" onClick={() => setModal(true)}><Plus size={16}/>New Task</button>}/>

      <div className="g4" style={{ marginBottom:20 }}>
        {[
          { label:"Total Tasks",  val:stats.total,     color:"#06b6d4" },
          { label:"In Progress",  val:stats.inProgress,color:"#8b5cf6" },
          { label:"Completed",    val:stats.completed, color:"#10b981" },
          { label:"Overdue",      val:stats.overdue,   color:"#ef4444" },
        ].map((item,i) => (
          <div key={i} className={`sc fi s${i+1}`} style={{ opacity:0 }}>
            <div style={{ fontSize:28, fontWeight:800, fontFamily:"Syne,sans-serif", color:tc }}>{item.val}</div>
            <div style={{ fontSize:12, color:lc, marginTop:3 }}>{item.label}</div>
            <div style={{ marginTop:10 }}>
              <div className="pt"><div className="pf" style={{ width:`${(item.val/stats.total*100)||0}%`, background:item.color }}/></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div className="inp-wrap" style={{ flex:1, minWidth:200 }}>
          <Search size={14} className="inp-icon" style={{ color:lc }}/>
          <input className="inp pl" placeholder="Search tasks…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="ptab">
          {stFilters.map(f => <div key={f} className={`ptab-item${filter===f?" on":""}`} onClick={()=>setFilter(f)}>{f.replace("_"," ")}</div>)}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {loading ? [0,1,2,3].map(i=><Skeleton key={i} h={80}/>) : filtered.map((t,i) => (
          <div key={t.id} className={`card fi s${(i%4)+1}`} style={{ opacity:0, padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", color: t.status==="COMPLETED" ? "#10b981" : lc, flexShrink:0 }} onClick={() => toggleDone(t.id)}>
                {t.status === "COMPLETED" ? <CheckCircle size={20}/> : <div style={{ width:20, height:20, border:`2px solid ${lc}`, borderRadius:"50%" }}/>}
              </button>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                  <span style={{ fontSize:14, fontWeight:600, color: t.status==="COMPLETED" ? lc : tc, textDecoration: t.status==="COMPLETED"?"line-through":"none" }}>{t.title}</span>
                  <span className="badge" style={{ background:`${priColor[t.priority]}18`, color:priColor[t.priority] }}>{t.priority}</span>
                  <span className={`badge ${stClass[t.status]}`}>{t.status.replace("_"," ")}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  {t.assignee && (
                    <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:lc }}>
                      <Avatar user={t.assignee} size={18}/>
                      {t.assignee.firstName} {t.assignee.lastName}
                    </div>
                  )}
                  {t.dueDate && (
                    <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color: new Date(t.dueDate)<new Date()&&t.status!=="COMPLETED"?"#ef4444":lc }}>
                      <Calendar size={11}/>{fmtDate(t.dueDate)}
                    </div>
                  )}
                  {t.tags.map(tag => (
                    <span key={tag} className="badge bg-gray" style={{ fontSize:10 }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:lc }}>{t.progress}%</span>
                  <div className="pt" style={{ width:70 }}><div className="pf" style={{ width:`${t.progress}%` }}/></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <EmptyState icon={CheckSquare} title="No tasks found" subtitle="Create a new task or adjust your filters" action={<button className="btn btn-p" onClick={() => setModal(true)}><Plus size={14}/>New Task</button>}/>}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Create New Task">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color: dark?"#64748b":"#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>Task Title</div>
            <input className="inp" placeholder="Enter task title…" value={newTask.title} onChange={e=>setNewTask(p=>({...p,title:e.target.value}))}/>
          </div>
          <div className="g2" style={{ gap:12 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color: dark?"#64748b":"#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>Priority</div>
              <select className="inp" value={newTask.priority} onChange={e=>setNewTask(p=>({...p,priority:e.target.value}))}>
                {["LOW","MEDIUM","HIGH","CRITICAL"].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color: dark?"#64748b":"#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>Due Date</div>
              <input className="inp" type="date" value={newTask.dueDate} onChange={e=>setNewTask(p=>({...p,dueDate:e.target.value}))}/>
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color: dark?"#64748b":"#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>Assignee</div>
            <input className="inp" placeholder="Assignee name" value={newTask.assignee} onChange={e=>setNewTask(p=>({...p,assignee:e.target.value}))}/>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:6 }}>
            <button className="btn btn-g" style={{ flex:1 }} onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-p" style={{ flex:2 }} disabled={!newTask.title} onClick={handleCreate}><Plus size={14}/>Create Task</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REPORTS PAGE
═══════════════════════════════════════════════════════════════ */
function ReportsPage() {
  const { dark } = useTheme();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const lc = dark ? "#3d5068" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";
  const gc = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)";

  useEffect(() => { mockApi.getReports().then(d => { setData(d); setLoading(false); }); }, []);

  if (loading) return <div style={{ padding:24 }}><div className="g3" style={{ marginBottom:20 }}>{[0,1,2].map(i=><Skeleton key={i} h={100}/>)}</div><div className="g2">{[0,1].map(i=><Skeleton key={i} h={280}/>)}</div></div>;

  const { revenue, categoryDistribution, kpi } = data;

  const kpiCards = [
    { label:"Monthly Revenue",   val:fmt$(kpi.monthlyRevenue),   color:"#10b981", icon:DollarSign  },
    { label:"Active Employees",  val:kpi.activeEmployees,        color:"#06b6d4", icon:Users        },
    { label:"Orders This Month", val:kpi.ordersThisMonth,        color:"#8b5cf6", icon:ShoppingCart },
    { label:"Task Completion",   val:kpi.taskCompletion,         color:"#f59e0b", icon:CheckSquare  },
    { label:"Pending Tasks",     val:kpi.taskPending,            color:"#ef4444", icon:Clock        },
    { label:"Low Stock Alerts",  val:kpi.lowStockAlerts,         color:"#f59e0b", icon:AlertTriangle},
  ];

  return (
    <div style={{ padding:24 }}>
      <PageHeader title="Reports & Analytics" subtitle="Business intelligence and KPI tracking"
        action={<button className="btn btn-g"><Download size={16}/>Export PDF</button>}/>

      <div className="g3" style={{ marginBottom:20 }}>
        {kpiCards.map((k,i) => (
          <div key={i} className={`sc fi s${(i%3)+1}`} style={{ opacity:0, display:"flex", gap:14, alignItems:"center" }}>
            <div style={{ width:42, height:42, borderRadius:10, background:`${k.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <k.icon size={18} style={{ color:k.color }}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, fontFamily:"Syne,sans-serif", color:tc }}>{k.val}</div>
              <div style={{ fontSize:12, color:lc }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom:20 }}>
        <div className="card fi s3" style={{ opacity:0 }}>
          <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>Revenue vs Expenses</div>
          <div style={{ fontSize:12, color:lc, marginBottom:16 }}>8-month trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={gc} vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:lc, fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:lc, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="revenue"  name="Revenue"  fill="#06b6d4" radius={[4,4,0,0]}/>
              <Bar dataKey="expenses" name="Expenses" fill="#8b5cf6" radius={[4,4,0,0]} fillOpacity={0.7}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card fi s4" style={{ opacity:0 }}>
          <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>Profit Trend</div>
          <div style={{ fontSize:12, color:lc, marginBottom:16 }}>Net profit over time</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gc}/>
              <XAxis dataKey="month" tick={{ fill:lc, fontSize:12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:lc, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fill="url(#pg)" strokeWidth={2.5} dot={{ r:4, fill:"#10b981" }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="g2">
        <div className="card fi s5" style={{ opacity:0 }}>
          <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>Category Distribution</div>
          <div style={{ fontSize:12, color:lc, marginBottom:14 }}>Revenue by product category</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
                  {categoryDistribution.map((c,i) => <Cell key={i} fill={c.color}/>)}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:9 }}>
              {categoryDistribution.map((c,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:c.color, flexShrink:0 }}/>
                  <span style={{ fontSize:13, color:lc, flex:1 }}>{c.name}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:tc }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card fi s6" style={{ opacity:0 }}>
          <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:16 }}>Department P&L</div>
          <table className="dt">
            <thead><tr>{["Department","Revenue","Expenses","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                { dept:"Sales",       rev:83200, exp:22000 },
                { dept:"Engineering", rev:45000, exp:38000 },
                { dept:"Finance",     rev:12000, exp:8500  },
                { dept:"Marketing",   rev:28000, exp:19000 },
                { dept:"Operations",  rev:15000, exp:21000 },
              ].map(r => (
                <tr key={r.dept}>
                  <td style={{ fontWeight:600, color:tc }}>{r.dept}</td>
                  <td style={{ color:"#10b981", fontWeight:600 }}>{fmt$(r.rev)}</td>
                  <td style={{ color:"#ef4444" }}>{fmt$(r.exp)}</td>
                  <td><span className={`badge ${r.rev>r.exp?"bs":"bd"}`}>{r.rev>r.exp?"Profit":"Loss"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS PAGE — Full working implementation
═══════════════════════════════════════════════════════════════ */
function SettingsPage() {
  const { dark, toggleTheme } = useTheme();
  const { user }  = useAuth();
  const toast     = useToast();
  const [tab, setTab] = useState("profile");

  /* Profile state */
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "VT",
    lastName:  user?.lastName  || "Company",
    email:     user?.email     || "vedant@vt.in",
    phone:     "+91 98765 43210",
    company:   "VT Company Pvt. Ltd.",
    timezone:  "Asia/Kolkata",
    language:  "English (India)",
  });
  const [editMode, setEditMode] = useState(false);

  /* Security state */
  const [pwForm, setPwForm]   = useState({ current:"", newPw:"", confirm:"" });
  const [sessions] = useState([
    { device:"Chrome on Windows", location:"Mumbai, India", time:"Active now",    current:true  },
    { device:"Firefox on MacOS",  location:"Pune, India",   time:"2 hours ago",   current:false },
    { device:"Mobile Safari iOS", location:"Delhi, India",  time:"Yesterday",     current:false },
  ]);

  /* Notifications */
  const [notifs, setNotifs] = useState({
    email_orders:      true,
    email_invoices:    true,
    email_lowstock:    false,
    push_tasks:        true,
    push_mentions:     true,
    push_reports:      false,
    sms_critical:      true,
    sms_payroll:       false,
  });

  /* Appearance */
  const [density,   setDensity]   = useState("comfortable");
  const [language,  setLanguage]  = useState("English (India)");

  /* Company / System (Owner only) */
  const [company, setCompany] = useState({
    name:     "VT Company Pvt. Ltd.",
    gstin:    "27AABCU9603R1ZX",
    pan:      "AABCU9603R",
    address:  "Pune, Maharashtra, India",
    currency: "INR",
    fiscal:   "April – March",
  });

  const lc = dark ? "#475569" : "#94a3b8";
  const tc = dark ? "#f1f5f9" : "#0f172a";
  const bd = dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.07)";

  const Field = ({ label, value, edit, onChange, type="text" }) => (
    <div>
      <div style={{ fontSize:11, fontWeight:600, color:lc, marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>{label}</div>
      {edit
        ? <input className="inp" type={type} value={value} onChange={e => onChange(e.target.value)}/>
        : <div style={{ fontSize:14, color:tc, padding:"9px 0", borderBottom:`1px solid ${bd}` }}>{value || "—"}</div>
      }
    </div>
  );

  const Toggle = ({ label, sub, checked, onChange }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${bd}` }}>
      <div>
        <div style={{ fontSize:14, fontWeight:500, color:tc }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:lc, marginTop:2 }}>{sub}</div>}
      </div>
      <div onClick={() => onChange(!checked)} style={{ width:44, height:24, borderRadius:100, background: checked ? "linear-gradient(135deg,#0891b2,#6366f1)" : dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:3, left: checked?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.3)" }}/>
      </div>
    </div>
  );

  const tabs = [
    { id:"profile",      label:"👤 Profile"      },
    { id:"security",     label:"🔐 Security"     },
    { id:"notifications",label:"🔔 Notifications" },
    { id:"appearance",   label:"🎨 Appearance"   },
    ...(user?.role === "OWNER" ? [{ id:"company", label:"🏢 Company" }] : []),
  ];

  return (
    <div style={{ padding:24, maxWidth:860, margin:"0 auto" }}>
      <PageHeader title="Settings" subtitle="Manage your account, preferences and company settings"/>

      <div style={{ display:"flex", gap:20 }}>
        {/* Sidebar tabs */}
        <div style={{ width:200, flexShrink:0 }}>
          <div className="card" style={{ padding:"10px 0" }}>
            {tabs.map(t => (
              <div key={t.id}
                onClick={() => setTab(t.id)}
                style={{ padding:"10px 16px", cursor:"pointer", fontSize:13.5, fontWeight:500, borderRadius:8, margin:"2px 8px", color: tab===t.id ? "#fff" : lc, background: tab===t.id ? "linear-gradient(135deg,#0891b2,#6366f1)" : "transparent", transition:"all .15s" }}>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div style={{ flex:1 }} key={tab}>

          {/* ── PROFILE ── */}
          {tab === "profile" && (
            <div className="card fi" style={{ opacity:0 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc }}>Profile Information</div>
                <button className="btn btn-g btn-sm" onClick={() => { setEditMode(e=>!e); if(editMode) toast("Profile saved!", "success"); }}>
                  {editMode ? <><Save size={13}/>Save</> : <><Edit size={13}/>Edit</>}
                </button>
              </div>

              {/* Avatar */}
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24, padding:16, borderRadius:12, background: dark?"rgba(255,255,255,.03)":"rgba(0,0,0,.02)" }}>
                <Avatar user={profile} size={60}/>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:tc }}>{profile.firstName} {profile.lastName}</div>
                  <div style={{ fontSize:13, color:lc }}>{profile.email}</div>
                  <div style={{ marginTop:6 }}><span className="badge bi">{user?.role}</span></div>
                </div>
                {editMode && <button className="btn btn-g btn-sm" style={{ marginLeft:"auto" }} onClick={() => toast("Avatar upload (connect to API)", "info")}>Change Photo</button>}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Field label="First Name"  value={profile.firstName} edit={editMode} onChange={v=>setProfile(p=>({...p,firstName:v}))}/>
                <Field label="Last Name"   value={profile.lastName}  edit={editMode} onChange={v=>setProfile(p=>({...p,lastName:v}))}/>
                <Field label="Email"       value={profile.email}     edit={editMode} onChange={v=>setProfile(p=>({...p,email:v}))}    type="email"/>
                <Field label="Phone"       value={profile.phone}     edit={editMode} onChange={v=>setProfile(p=>({...p,phone:v}))}/>
                <Field label="Company"     value={profile.company}   edit={editMode} onChange={v=>setProfile(p=>({...p,company:v}))}/>
                <Field label="Time Zone"   value={profile.timezone}  edit={false}    onChange={()=>{}}/>
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {tab === "security" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="card fi" style={{ opacity:0 }}>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:18 }}>Change Password</div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[["Current Password","current"],["New Password","newPw"],["Confirm New Password","confirm"]].map(([label, key]) => (
                    <div key={key}>
                      <div style={{ fontSize:11, fontWeight:600, color:lc, marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>{label}</div>
                      <input className="inp" type="password" placeholder="••••••••" value={pwForm[key]} onChange={e=>setPwForm(p=>({...p,[key]:e.target.value}))}/>
                    </div>
                  ))}
                  {pwForm.newPw && (
                    <div style={{ padding:"8px 12px", borderRadius:8, fontSize:12, background: pwForm.newPw.length>=8 ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", color: pwForm.newPw.length>=8 ? "#10b981" : "#ef4444", border:`1px solid ${pwForm.newPw.length>=8?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)"}` }}>
                      {pwForm.newPw.length>=8 ? "✓ Strong password" : `Password too short (${pwForm.newPw.length}/8 chars)`}
                    </div>
                  )}
                  <button className="btn btn-p" style={{ alignSelf:"flex-start" }}
                    onClick={() => { if(pwForm.newPw !== pwForm.confirm){ toast("Passwords don't match","error"); return; } if(pwForm.newPw.length<8){ toast("Password too short","error"); return; } toast("Password updated successfully!","success"); setPwForm({current:"",newPw:"",confirm:""}); }}>
                    <Shield size={14}/>Update Password
                  </button>
                </div>
              </div>

              <div className="card fi s2" style={{ opacity:0 }}>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>Active Sessions</div>
                <div style={{ fontSize:12, color:lc, marginBottom:16 }}>Devices currently logged into your account</div>
                {sessions.map((s, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${bd}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:36, height:36, borderRadius:8, background:"rgba(6,182,212,.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Shield size={16} style={{ color:"#06b6d4" }}/>
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:tc }}>{s.device}</div>
                        <div style={{ fontSize:11, color:lc }}>{s.location} · {s.time}</div>
                      </div>
                    </div>
                    {s.current
                      ? <span className="badge bs">Current</span>
                      : <button className="btn btn-d btn-sm" onClick={() => toast("Session revoked","success")}>Revoke</button>}
                  </div>
                ))}
              </div>

              <div className="card fi s3" style={{ opacity:0 }}>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>Two-Factor Authentication</div>
                <div style={{ fontSize:13, color:lc, marginBottom:14 }}>Add an extra layer of security to your account</div>
                <button className="btn btn-p" onClick={() => toast("2FA setup (connect to backend)","info")}><Shield size={14}/>Enable 2FA via Authenticator App</button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === "notifications" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { group:"Email Notifications", items:[
                  { key:"email_orders",   label:"New Orders",    sub:"Get notified when a new order is placed"       },
                  { key:"email_invoices", label:"Invoice Updates",sub:"Payment receipts and overdue reminders"       },
                  { key:"email_lowstock", label:"Low Stock",     sub:"When product stock falls below reorder point"  },
                ]},
                { group:"Push Notifications", items:[
                  { key:"push_tasks",    label:"Task Assignments",sub:"When a task is assigned to you"              },
                  { key:"push_mentions", label:"Mentions",        sub:"When someone mentions you in a comment"      },
                  { key:"push_reports",  label:"Weekly Reports",  sub:"Auto-generated weekly performance report"    },
                ]},
                { group:"SMS Alerts", items:[
                  { key:"sms_critical", label:"Critical Alerts",  sub:"Server downtime and critical system errors"  },
                  { key:"sms_payroll",  label:"Payroll Processed",sub:"Confirm when payroll runs are completed"     },
                ]},
              ].map(section => (
                <div key={section.group} className="card fi" style={{ opacity:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>{section.group}</div>
                  {section.items.map(item => (
                    <Toggle key={item.key} label={item.label} sub={item.sub} checked={notifs[item.key]} onChange={v => { setNotifs(p=>({...p,[item.key]:v})); toast(`${item.label} ${v?"enabled":"disabled"}`, "success"); }}/>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── APPEARANCE ── */}
          {tab === "appearance" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="card fi" style={{ opacity:0 }}>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:16 }}>Theme</div>
                <div style={{ display:"flex", gap:12 }}>
                  {[["Dark","dark","#0c1429"],["Light","light","#f1f5f9"]].map(([label, val, bg]) => (
                    <div key={val} onClick={() => { if((val==="dark")!==dark) toggleTheme(); toast(`${label} mode activated`,"success"); }}
                      style={{ flex:1, padding:"16px", borderRadius:12, cursor:"pointer", border:`2px solid ${(val==="dark")===dark ? "#0891b2" : bd}`, background:bg, transition:"border .2s" }}>
                      <div style={{ fontSize:13, fontWeight:600, color: val==="dark"?"#f1f5f9":"#0f172a", marginBottom:4 }}>{label} Mode</div>
                      <div style={{ fontSize:11, color: val==="dark"?"#475569":"#94a3b8" }}>Easy on the eyes {val==="dark"?"at night":"in daylight"}</div>
                      {(val==="dark")===dark && <span className="badge bi" style={{ marginTop:8 }}>Active</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card fi s2" style={{ opacity:0 }}>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:16 }}>Display Density</div>
                <div style={{ display:"flex", gap:10 }}>
                  {["compact","comfortable","spacious"].map(d => (
                    <button key={d} className={`btn ${density===d?"btn-p":"btn-g"}`} onClick={() => { setDensity(d); toast(`${d.charAt(0).toUpperCase()+d.slice(1)} density applied`,"success"); }} style={{ textTransform:"capitalize", flex:1, justifyContent:"center" }}>{d}</button>
                  ))}
                </div>
              </div>

              <div className="card fi s3" style={{ opacity:0 }}>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:16 }}>Language & Region</div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[["Language","English (India)","English (India),Hindi,Marathi,Tamil,Telugu"],
                    ["Currency","INR — Indian Rupee","INR — Indian Rupee,USD — US Dollar,EUR — Euro"],
                    ["Date Format","DD/MM/YYYY","DD/MM/YYYY,MM/DD/YYYY,YYYY-MM-DD"],
                  ].map(([label, def, opts]) => (
                    <div key={label}>
                      <div style={{ fontSize:11, fontWeight:600, color:lc, marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>{label}</div>
                      <select className="inp" defaultValue={def} onChange={() => toast(`${label} updated`,"success")}>
                        {opts.split(",").map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COMPANY (Owner only) ── */}
          {tab === "company" && user?.role === "OWNER" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="card fi" style={{ opacity:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div style={{ fontSize:16, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc }}>Company Details</div>
                  <button className="btn btn-p btn-sm" onClick={() => toast("Company profile saved!","success")}><Save size={13}/>Save Changes</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[
                    ["Company Name",  "name",    "VT Company Pvt. Ltd."  ],
                    ["GSTIN",         "gstin",   "27AABCU9603R1ZX"       ],
                    ["PAN",           "pan",     "AABCU9603R"            ],
                    ["Registered Address","address","Pune, Maharashtra"  ],
                    ["Currency",      "currency","INR"                   ],
                    ["Fiscal Year",   "fiscal",  "April – March"         ],
                  ].map(([label, key, placeholder]) => (
                    <div key={key}>
                      <div style={{ fontSize:11, fontWeight:600, color:lc, marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>{label}</div>
                      <input className="inp" value={company[key]} placeholder={placeholder} onChange={e=>setCompany(p=>({...p,[key]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card fi s2" style={{ opacity:0 }}>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:tc, marginBottom:4 }}>Module Management</div>
                <div style={{ fontSize:12, color:lc, marginBottom:14 }}>Enable or disable ERP modules for your organisation</div>
                {[["Inventory Management","Track products, suppliers and stock levels",true],
                  ["Finance & Accounting","Invoices, transactions and financial reports",true],
                  ["HR & Payroll","Employee records, attendance and payroll",true],
                  ["Sales & CRM","Orders, customers and deal pipeline",true],
                  ["Task Management","Projects, tasks and team collaboration",true],
                ].map(([name, desc, def], i) => {
                  const [on, setOn] = useState(def);
                  return <Toggle key={i} label={name} sub={desc} checked={on} onChange={v=>{setOn(v); toast(`${name} ${v?"enabled":"disabled"}`,"success");}}/>;
                })}
              </div>

              <div className="card fi s3" style={{ opacity:0, border:"1px solid rgba(239,68,68,.25)" }}>
                <div style={{ fontSize:15, fontWeight:700, fontFamily:"Syne,sans-serif", color:"#ef4444", marginBottom:4 }}>⚠️ Danger Zone</div>
                <div style={{ fontSize:13, color:lc, marginBottom:14 }}>These actions are irreversible. Please proceed with caution.</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button className="btn btn-d" onClick={() => toast("Export initiated — check your email","info")}><Download size={14}/>Export All Data</button>
                  <button className="btn btn-d" onClick={() => toast("Account deletion requires email confirmation","warning")}><Trash2 size={14}/>Delete Account</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [dark,      setDark]      = useState(true);
  const [user,      setUser]      = useState(null);
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => setDark(d => !d);
  const handleLogin = (u) => { setUser(u); setPage("dashboard"); };
  const handleLogout = () => { setUser(null); setPage("dashboard"); };

  const PageMap = {
    dashboard: user?.role === "EMPLOYEE" ? <EmployeeDashboard/> : <OwnerDashboard/>,
    inventory:  <InventoryPage/>,
    finance:    <FinancePage/>,
    employees:  <EmployeesPage/>,
    sales:      <SalesPage/>,
    tasks:      <TasksPage/>,
    reports:    <ReportsPage/>,
    settings:   <SettingsPage/>,
  };

  return (
    <ThemeCtx.Provider value={{ dark, toggleTheme }}>
      <AuthCtx.Provider value={{ user }}>
        <ToastProvider>
          <GS/>
          <div className={`r ${dark ? "dark" : "light"}`}>
            {!user ? (
              <Login onLogin={handleLogin}/>
            ) : (
              <>
                <Sidebar page={page} setPage={setPage} role={user.role} onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed}/>
                <div className={`mc${collapsed ? " full" : ""}`}>
                  <Topbar page={page} collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} toggleTheme={toggleTheme} notifications={3}/>
                  <div key={page} style={{ animation:"fi .3s ease" }}>
                    {PageMap[page] || <OwnerDashboard/>}
                  </div>
                </div>
              </>
            )}
          </div>
        </ToastProvider>
      </AuthCtx.Provider>
    </ThemeCtx.Provider>
  );
}
