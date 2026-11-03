-- =========================================================================
-- DOMUS REAL ESTATE SAAS - SUPABASE POSTGRESQL SCHEMA & INITIAL SEED
-- =========================================================================
-- Run this script in your Supabase Project: Dashboard > SQL Editor > New query
-- This script provisions all tables, indexes, and Row Level Security (RLS) policies.
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SAAS TENANTS
CREATE TABLE IF NOT EXISTS saas_tenants (
  id VARCHAR(64) PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT,
  subscription_plan TEXT NOT NULL DEFAULT 'Standard',
  status TEXT NOT NULL DEFAULT 'Active',
  max_projects INT NOT NULL DEFAULT 10,
  storage_used TEXT DEFAULT '12.4 GB',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  billing_cycle TEXT DEFAULT 'Monthly',
  admin_email TEXT NOT NULL,
  notes TEXT
);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  spent NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'In Progress',
  progress NUMERIC NOT NULL DEFAULT 0,
  completion_date TEXT,
  manager TEXT,
  contractor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APARTMENTS / UNITS
CREATE TABLE IF NOT EXISTS apartments (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE SET NULL,
  unit_number TEXT NOT NULL,
  type TEXT NOT NULL,
  floor INT NOT NULL DEFAULT 1,
  area_sqft NUMERIC NOT NULL DEFAULT 500,
  price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Available',
  lease_price_monthly NUMERIC DEFAULT 0,
  tenant_name TEXT,
  tenant_contact TEXT,
  lease_start_date TEXT,
  lease_end_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMPLOYEES & STAFF
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  project_assigned TEXT,
  salary NUMERIC NOT NULL DEFAULT 0,
  joined_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ASSETS & MACHINERY
CREATE TABLE IF NOT EXISTS assets (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  serial_number TEXT,
  assigned_project TEXT,
  status TEXT NOT NULL DEFAULT 'Operational',
  purchase_cost NUMERIC NOT NULL DEFAULT 0,
  last_maintenance TEXT,
  next_maintenance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EXPENSES & LEDGER
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  description TEXT,
  approved_by TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MATERIALS & INVENTORY
CREATE TABLE IF NOT EXISTS materials (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'Units',
  min_stock_level NUMERIC NOT NULL DEFAULT 10,
  unit_cost NUMERIC NOT NULL DEFAULT 0,
  supplier TEXT,
  last_restocked TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VENDORS & CONTRACTORS
CREATE TABLE IF NOT EXISTS vendors (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  rating NUMERIC DEFAULT 4.5,
  tenders_won INT DEFAULT 0,
  total_payout NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BILLING & INVOICES
CREATE TABLE IF NOT EXISTS bills (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  bill_number TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  customer_or_tenant TEXT NOT NULL,
  apartment_id TEXT,
  project_id TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  issue_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unpaid',
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MAINTENANCE TICKETS
CREATE TABLE IF NOT EXISTS maintenance_tickets (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  apartment_id TEXT,
  project_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Open',
  reported_by TEXT,
  reported_date TEXT,
  resolved_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SYSTEM NOTIFICATIONS
CREATE TABLE IF NOT EXISTS system_notifications (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CRM LEADS & CONVERSIONS
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES saas_tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  requirement TEXT NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  interested_properties JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'New',
  followups_count INT NOT NULL DEFAULT 0,
  last_followup_date TEXT,
  next_followup_date TEXT,
  notes TEXT,
  source TEXT DEFAULT 'Website Inquiry',
  assigned_agent TEXT,
  converted_at TEXT,
  converted_client_id TEXT,
  converted_property_id TEXT,
  deal_value NUMERIC,
  followup_logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR MULTI-TENANT QUERY ACCELERATION
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_projects_tenant ON projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_apartments_tenant ON apartments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_apartments_project ON apartments(project_id);
CREATE INDEX IF NOT EXISTS idx_employees_tenant ON employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_assets_tenant ON assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_expenses_tenant ON expenses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_materials_tenant ON materials(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendors_tenant ON vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bills_tenant ON bills(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant ON maintenance_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant ON system_notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE saas_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public / anon read & write during application bootstrapping
-- (You can restrict these policies to authenticated roles in production)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public access saas_tenants" ON saas_tenants;
  CREATE POLICY "Public access saas_tenants" ON saas_tenants FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access projects" ON projects;
  CREATE POLICY "Public access projects" ON projects FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access apartments" ON apartments;
  CREATE POLICY "Public access apartments" ON apartments FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access employees" ON employees;
  CREATE POLICY "Public access employees" ON employees FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access assets" ON assets;
  CREATE POLICY "Public access assets" ON assets FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access expenses" ON expenses;
  CREATE POLICY "Public access expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access materials" ON materials;
  CREATE POLICY "Public access materials" ON materials FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access vendors" ON vendors;
  CREATE POLICY "Public access vendors" ON vendors FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access bills" ON bills;
  CREATE POLICY "Public access bills" ON bills FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access maintenance_tickets" ON maintenance_tickets;
  CREATE POLICY "Public access maintenance_tickets" ON maintenance_tickets FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access system_notifications" ON system_notifications;
  CREATE POLICY "Public access system_notifications" ON system_notifications FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access leads" ON leads;
  CREATE POLICY "Public access leads" ON leads FOR ALL USING (true) WITH CHECK (true);
END $$;

-- =========================================================================
-- INITIAL DEMO SEED FOR BASE TENANT
-- =========================================================================
INSERT INTO saas_tenants (id, company_name, domain, subscription_plan, status, max_projects, storage_used, admin_email, notes)
VALUES 
  ('TEN-001', 'BuildForce Dynamics Ltd.', 'buildforce.io', 'Enterprise Pro Tier', 'Active', 25, '14.2 GB', 'admin@buildforce.io', 'Primary enterprise construction tenant')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, tenant_id, title, location, budget, spent, status, progress, completion_date, manager, contractor)
VALUES 
  ('PRJ-101', 'TEN-001', 'Grand Horizon Towers', '420 Bay Boulevard, Downtown Metropolis', 12500000, 8900000, 'In Progress', 72, '2026-12-15', 'Marcus Sterling', 'Apex Structural Dynamics'),
  ('PRJ-102', 'TEN-001', 'Silvercrest Commercial Center', '105 Innovation Way, Tech Corridor', 8200000, 3100000, 'In Progress', 45, '2027-04-30', 'Sophia Chen', 'Matrix Builders Corp'),
  ('PRJ-103', 'TEN-001', 'The Palisades Luxury Residences', '88 Palm Crest Drive, Marina Bay', 15400000, 14800000, 'Completed', 100, '2026-05-20', 'David Ross', 'Vanguard Construction Group')
ON CONFLICT (id) DO NOTHING;
