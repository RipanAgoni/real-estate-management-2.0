/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, Project, Employee, Asset, Expense, Apartment, SystemUserProfile, Material, Vendor, SystemNotification, Bill, SaasTenant, MaintenanceTicket, Bid, Tender, ProjectMilestone, GanttTask, Lead } from './types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_EMPLOYEES, 
  INITIAL_ASSETS, 
  INITIAL_EXPENSES, 
  INITIAL_APARTMENTS, 
  INITIAL_MATERIALS,
  INITIAL_VENDORS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BILLS,
  INITIAL_SAAS_TENANTS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_TENDERS,
  INITIAL_PROJECT_MILESTONES,
  INITIAL_GANTT_TASKS,
  INITIAL_LEADS,
  loadData, 
  saveData 
} from './data';
import { RoleSelector } from './components/RoleSelector';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ProjectManager } from './components/ProjectManager';
import { EmployeeManager } from './components/EmployeeManager';
import { AssetManager } from './components/AssetManager';
import { PropertyManager } from './components/PropertyManager';
import { ExpenseTracker } from './components/ExpenseTracker';
import { ClientDashboard } from './components/ClientDashboard';
import { Login } from './components/Login';
import { MaterialManager } from './components/MaterialManager';
import { VendorManager } from './components/VendorManager';
import { BillingManager } from './components/BillingManager';
import { SaaSSupabaseCenter } from './components/SaaSSupabaseCenter';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { CrmManager } from './components/CrmManager';

interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

export default function App() {
  // State Initialization
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('re_ms_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const savedUser = localStorage.getItem('re_ms_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.role;
      }
    } catch {}
    return 'Admin';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem('re_ms_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        switch (parsed.role) {
          case 'Admin': return 'overview';
          case 'SuperAdmin': return 'super-admin';
          case 'ProjectManager': return 'projects';
          case 'HRManager': return 'employees';
          case 'PropertyManager': return 'properties';
          case 'FinancialOfficer': return 'expenses';
          case 'Client': return 'client-dashboard';
        }
      }
    } catch {}
    return 'overview';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // User Accounts & Login Profiles database
  const [userProfiles, setUserProfiles] = useState<SystemUserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('re_ms_user_profiles');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    const defaults: SystemUserProfile[] = [
      {
        id: 'EMP-000',
        name: 'Sophia Vandervelde',
        email: 's.vandervelde@apexrealestate.com',
        role: 'Admin',
        department: 'Executive HQ',
        initials: 'SV',
        passwordDescription: 'admin',
        colorClass: 'from-amber-500 to-orange-600 ring-amber-500/20 text-amber-400 bg-amber-950/20 border-amber-900/40',
      },
      {
        id: 'EMP-001',
        name: 'Sarah Jenkins',
        email: 's.jenkins@apexrealestate.com',
        role: 'ProjectManager',
        department: 'Engineering',
        initials: 'SJ',
        passwordDescription: 'project',
        colorClass: 'from-cyan-500 to-blue-600 ring-cyan-500/20 text-cyan-400 bg-cyan-950/20 border-cyan-900/40',
      },
      {
        id: 'EMP-004',
        name: 'Amanda Ross',
        email: 'a.ross@apexrealestate.com',
        role: 'HRManager',
        department: 'Human Resources',
        initials: 'AR',
        passwordDescription: 'hr',
        colorClass: 'from-emerald-500 to-teal-600 ring-emerald-500/20 text-emerald-400 bg-emerald-950/20 border-emerald-900/40',
      },
      {
        id: 'EMP-008',
        name: 'Claire Standish',
        email: 'c.standish@apexrealestate.com',
        role: 'PropertyManager',
        department: 'Property Sales',
        initials: 'CS',
        passwordDescription: 'property',
        colorClass: 'from-fuchsia-500 to-purple-600 ring-fuchsia-500/20 text-fuchsia-400 bg-fuchsia-950/20 border-fuchsia-900/40',
      },
      {
        id: 'EMP-005',
        name: 'Gregory Pecks',
        email: 'g.pecks@apexrealestate.com',
        role: 'FinancialOfficer',
        department: 'Finance',
        initials: 'GP',
        passwordDescription: 'finance',
        colorClass: 'from-rose-500 to-red-600 ring-rose-500/20 text-rose-400 bg-rose-950/20 border-rose-900/40',
      },
      {
        id: 'CLI-001',
        name: 'David Miller',
        email: 'd.miller@client.com',
        role: 'Client',
        department: 'Client Portal',
        initials: 'DM',
        passwordDescription: 'client',
        colorClass: 'from-blue-500 to-indigo-600 ring-blue-500/20 text-blue-400 bg-blue-950/20 border-blue-900/40',
      },
    ];
    localStorage.setItem('re_ms_user_profiles', JSON.stringify(defaults));
    return defaults;
  });

  // Database lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [saasTenants, setSaasTenants] = useState<SaasTenant[]>([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [projectMilestones, setProjectMilestones] = useState<ProjectMilestone[]>([]);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Find current active tenant by matching the logged in user's domain, or matching their adminEmail, or matching company name
  const activeTenant = useMemo(() => {
    if (!currentUser) return null;
    return saasTenants.find(t => 
      t.adminEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      (currentUser.email.includes('@') && t.adminEmail.includes('@') && 
       t.adminEmail.split('@')[1].toLowerCase() === currentUser.email.split('@')[1].toLowerCase()) ||
      t.companyName.toLowerCase() === currentUser.department?.toLowerCase()
    );
  }, [currentUser, saasTenants]);

  const isBasicPlan = activeTenant?.subscriptionPlan === 'Basic';

  // Theme state (Light / Dark mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('domus-theme') as 'light' | 'dark') || 'dark';
  });

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('domus-theme', nextTheme);
  };

  // Toast / Status Message notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'alert' } | null>(null);

  // Load core datasets
  useEffect(() => {
    setProjects(loadData('projects', INITIAL_PROJECTS));
    setEmployees(loadData('employees', INITIAL_EMPLOYEES));
    setAssets(loadData('assets', INITIAL_ASSETS));
    setExpenses(loadData('expenses', INITIAL_EXPENSES));
    setApartments(loadData('apartments', INITIAL_APARTMENTS));
    setMaterials(loadData('materials', INITIAL_MATERIALS));
    setVendors(loadData('vendors', INITIAL_VENDORS));
    setNotifications(loadData('notifications', INITIAL_NOTIFICATIONS));
    setBills(loadData('bills', INITIAL_BILLS));
    setSaasTenants(loadData('saas_tenants', INITIAL_SAAS_TENANTS));
    setMaintenanceTickets(loadData('maintenance_tickets', INITIAL_MAINTENANCE_TICKETS));
    setTenders(loadData('tenders', INITIAL_TENDERS));
    setProjectMilestones(loadData('project_milestones', INITIAL_PROJECT_MILESTONES));
    setGanttTasks(loadData('gantt_tasks', INITIAL_GANTT_TASKS));
    setLeads(loadData('leads', INITIAL_LEADS));
  }, []);

  // Enforce basic plan tab restrictions on the fly
  useEffect(() => {
    if (isBasicPlan && (activeTab === 'projects' || activeTab === 'materials' || activeTab === 'vendors')) {
      setActiveTab('overview');
    }
  }, [isBasicPlan, activeTab]);

  // Sync to local storage on modifications
  const saveAll = (
    newPrj = projects, 
    newEmp = employees, 
    newAst = assets, 
    newExp = expenses, 
    newApt = apartments,
    newMat = materials,
    newVen = vendors,
    newNot = notifications,
    newBil = bills,
    newTen = saasTenants,
    newTck = maintenanceTickets,
    newTnd = tenders,
    newMls = projectMilestones,
    newGnt = ganttTasks,
    newLed = leads
  ) => {
    saveData('projects', newPrj);
    saveData('employees', newEmp);
    saveData('assets', newAst);
    saveData('expenses', newExp);
    saveData('apartments', newApt);
    saveData('materials', newMat);
    saveData('vendors', newVen);
    saveData('notifications', newNot);
    saveData('bills', newBil);
    saveData('saas_tenants', newTen);
    saveData('maintenance_tickets', newTck);
    saveData('tenders', newTnd);
    saveData('project_milestones', newMls);
    saveData('gantt_tasks', newGnt);
    saveData('leads', newLed);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // State Mutators: Projects
  const handleAddProject = (p: Project) => {
    const updated = [p, ...projects];
    setProjects(updated);
    saveAll(updated, employees, assets, expenses, apartments);
    showToast(`Site "${p.name}" successfully commissioned!`, 'success');
  };

  const handleUpdateProject = (id: string, updatedFields: Partial<Project>) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProjects(updated);
    saveAll(updated, employees, assets, expenses, apartments);
    showToast(`Project metrics updated.`, 'info');
  };

  // State Mutators: Maintenance Tickets
  const handleAddTicket = (t: MaintenanceTicket) => {
    const updated = [t, ...maintenanceTickets];
    setMaintenanceTickets(updated);
    saveData('maintenance_tickets', updated);
    showToast(`Maintenance Request "${t.title}" successfully logged!`, 'success');
  };

  const handleUpdateTicket = (id: string, updatedFields: Partial<MaintenanceTicket>) => {
    const updated = maintenanceTickets.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setMaintenanceTickets(updated);
    saveData('maintenance_tickets', updated);
    showToast(`Maintenance Request status modified.`, 'info');
  };

  // State Mutators: Tenders & Bids
  const handleAddTender = (t: Tender) => {
    const updated = [t, ...tenders];
    setTenders(updated);
    saveData('tenders', updated);
    showToast(`Procurement Tender "${t.title}" published!`, 'success');
  };

  const handleUpdateTender = (id: string, updatedFields: Partial<Tender>) => {
    const updated = tenders.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setTenders(updated);
    saveData('tenders', updated);
  };

  const handleAddBid = (tenderId: string, b: Bid) => {
    const updated = tenders.map(t => {
      if (t.id === tenderId) {
        return {
          ...t,
          bids: [...(t.bids || []), b]
        };
      }
      return t;
    });
    setTenders(updated);
    saveData('tenders', updated);
  };

  // State Mutators: Project Milestones
  const handleAddMilestone = (m: ProjectMilestone) => {
    const updated = [m, ...projectMilestones];
    setProjectMilestones(updated);
    saveData('project_milestones', updated);
    showToast(`Project Milestone "${m.title}" logged.`, 'success');
  };

  const handleUpdateMilestone = (id: string, updatedFields: Partial<ProjectMilestone>) => {
    const updated = projectMilestones.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    setProjectMilestones(updated);
    saveData('project_milestones', updated);
  };

  // State Mutators: Gantt Tasks
  const handleAddGanttTask = (g: GanttTask) => {
    const updated = [g, ...ganttTasks];
    setGanttTasks(updated);
    saveData('gantt_tasks', updated);
    showToast(`Gantt Timeline Task "${g.name}" created.`, 'success');
  };

  const handleUpdateGanttTask = (id: string, updatedFields: Partial<GanttTask>) => {
    const updated = ganttTasks.map(g => g.id === id ? { ...g, ...updatedFields } : g);
    setGanttTasks(updated);
    saveData('gantt_tasks', updated);
  };

  // State Mutators: Employees
  const handleAddEmployee = (e: Employee) => {
    const updated = [e, ...employees];
    setEmployees(updated);
    saveAll(projects, updated, assets, expenses, apartments);
    showToast(`Recruited ${e.name} to department: ${e.department}`, 'success');
  };

  const handleRemoveEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    saveAll(projects, updated, assets, expenses, apartments);
    if (emp) showToast(`Decommissioned corporate account for ${emp.name}.`, 'alert');
  };

  const handleUpdateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    const updated = employees.map(e => e.id === id ? { ...e, ...updatedFields } : e);
    setEmployees(updated);
    saveAll(projects, updated, assets, expenses, apartments);
    showToast(`Employee status modified.`, 'info');
  };

  // State Mutators: Assets
  const handleAddAsset = (a: Asset) => {
    const updated = [a, ...assets];
    setAssets(updated);
    saveAll(projects, employees, updated, expenses, apartments);
    showToast(`Heavy equipment "${a.name}" logged on-site.`, 'success');
  };

  const handleRemoveAsset = (id: string) => {
    const asset = assets.find(a => a.id === id);
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    saveAll(projects, employees, updated, expenses, apartments);
    if (asset) showToast(`Asset "${asset.name}" decommissioned from asset list.`, 'alert');
  };

  const handleUpdateAsset = (id: string, updatedFields: Partial<Asset>) => {
    const updated = assets.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    setAssets(updated);
    saveAll(projects, employees, updated, expenses, apartments);
    showToast(`Asset register updated.`, 'info');
  };

  // State Mutators: Apartments
  const handleAddApartment = (apt: Apartment) => {
    const updated = [apt, ...apartments];
    setApartments(updated);
    saveAll(projects, employees, assets, expenses, updated);
    showToast(`Registered finished property: ${apt.buildingName} - Unit ${apt.unitNumber}`, 'success');
  };

  const handleRemoveApartment = (id: string) => {
    const apt = apartments.find(a => a.id === id);
    const updated = apartments.filter(a => a.id !== id);
    setApartments(updated);
    saveAll(projects, employees, assets, expenses, updated);
    if (apt) showToast(`Unit ${apt.unitNumber} removed from portfolios.`, 'alert');
  };

  const handleUpdateApartment = (id: string, updatedFields: Partial<Apartment>) => {
    const updated = apartments.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    setApartments(updated);
    saveAll(projects, employees, assets, expenses, updated);
    showToast(`Property lease registry modified.`, 'success');
  };

  // State Mutators: Materials
  const handleAddMaterial = (m: Material) => {
    const updated = [m, ...materials];
    setMaterials(updated);
    saveAll(projects, employees, assets, expenses, apartments, updated, vendors, notifications);
  };

  const handleRemoveMaterial = (id: string) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    saveAll(projects, employees, assets, expenses, apartments, updated, vendors, notifications);
  };

  const handleUpdateMaterial = (id: string, updatedFields: Partial<Material>) => {
    const updated = materials.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    setMaterials(updated);
    saveAll(projects, employees, assets, expenses, apartments, updated, vendors, notifications);
  };

  // State Mutators: Vendors
  const handleAddVendor = (v: Vendor) => {
    const updated = [v, ...vendors];
    setVendors(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, updated, notifications);
  };

  const handleRemoveVendor = (id: string) => {
    const updated = vendors.filter(v => v.id !== id);
    setVendors(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, updated, notifications);
  };

  const handleUpdateVendor = (id: string, updatedFields: Partial<Vendor>) => {
    const updated = vendors.map(v => v.id === id ? { ...v, ...updatedFields } : v);
    setVendors(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, updated, notifications);
  };

  // State Mutators: Notifications
  const handleTriggerNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error', targetTenantId?: string) => {
    const tId = targetTenantId || activeTenant?.id || 'TEN-001';
    const newNot: SystemNotification = {
      id: `NOT-${Math.floor(100 + Math.random() * 900)}`,
      tenantId: tId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    const updated = [newNot, ...notifications];
    setNotifications(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, updated);
    showToast(title, type === 'warning' || type === 'error' ? 'alert' : 'success');
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, updated);
  };

  const handleMarkAllAsRead = () => {
    const tenantId = activeTenant?.id || 'TEN-001';
    const updated = notifications.map(n => {
      const nTenantId = n.tenantId || 'TEN-001';
      if (nTenantId === tenantId) {
        return { ...n, read: true };
      }
      return n;
    });
    setNotifications(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, updated);
    showToast('All alerts marked as read', 'success');
  };

  const handleClearNotifications = () => {
    const tenantId = activeTenant?.id || 'TEN-001';
    const updated = notifications.filter(n => {
      const nTenantId = n.tenantId || 'TEN-001';
      return nTenantId !== tenantId;
    });
    setNotifications(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, updated);
    showToast('Cleared notification ledger', 'info');
  };

  // State Mutators: Bills
  const handleAddBill = (b: Bill) => {
    const updated = [b, ...bills];
    setBills(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, updated);
  };

  const handleRemoveBill = (id: string) => {
    const updated = bills.filter(b => b.id !== id);
    setBills(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, updated);
  };

  const handleUpdateBill = (id: string, updatedFields: Partial<Bill>) => {
    const updated = bills.map(b => b.id === id ? { ...b, ...updatedFields } : b);
    setBills(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, updated);
  };

  // State Mutators: SaaS Tenants (Super Admin Control)
  const handleAddSaasTenant = (tenant: SaasTenant, adminPass: string) => {
    const updated = [tenant, ...saasTenants];
    setSaasTenants(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, bills, updated);
    
    // Automatically register their Executive Admin in the demoProfiles table in localStorage
    try {
      const saved = localStorage.getItem('re_ms_user_profiles');
      let profiles = saved ? JSON.parse(saved) : [];
      
      // Check if profile already exists
      const exists = profiles.some((p: any) => p.email.toLowerCase() === tenant.adminEmail.toLowerCase());
      if (!exists) {
        const nameParts = tenant.adminName.split(' ');
        const initials = nameParts.map(n => n[0] || '').join('').toUpperCase().substring(0, 2) || 'AD';
        
        const newProfile = {
          id: `EMP-${Math.floor(200 + Math.random() * 700)}`,
          name: tenant.adminName,
          email: tenant.adminEmail,
          role: 'Admin' as UserRole,
          department: tenant.companyName,
          initials: initials,
          passwordDescription: adminPass,
          colorClass: 'from-amber-500 to-orange-600 ring-amber-500/20 text-amber-400 bg-amber-950/20 border-amber-900/40',
        };
        
        profiles.push(newProfile);
        localStorage.setItem('re_ms_user_profiles', JSON.stringify(profiles));
      }
    } catch (e) {
      console.error('Error adding admin profile to roster', e);
    }

    // Trigger a system-wide notification
    handleTriggerNotification(
      'New SaaS Subscription',
      `Tenant system ${tenant.companyName} has successfully purchased a ${tenant.subscriptionPlan} subscription. Admin workspace for ${tenant.adminName} has been initialized.`,
      'success'
    );

    showToast(`Provisioned Tenant: ${tenant.companyName}`, 'success');
  };

  const handleRemoveSaasTenant = (id: string) => {
    const tenantToRemove = saasTenants.find(t => t.id === id);
    const updated = saasTenants.filter(t => t.id !== id);
    setSaasTenants(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, bills, updated);
    
    // Also remove their admin from user profiles
    if (tenantToRemove) {
      try {
        const saved = localStorage.getItem('re_ms_user_profiles');
        if (saved) {
          let profiles = JSON.parse(saved);
          profiles = profiles.filter((p: any) => p.email.toLowerCase() !== tenantToRemove.adminEmail.toLowerCase());
          localStorage.setItem('re_ms_user_profiles', JSON.stringify(profiles));
        }
      } catch (e) {
        console.error(e);
      }
    }
    showToast(`Deregistered SaaS Tenant`, 'info');
  };

  const handleUpdateSaasTenant = (id: string, updatedFields: Partial<SaasTenant>) => {
    const updated = saasTenants.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    setSaasTenants(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, bills, updated);
  };

  // State Mutators: Expenses
  const handleAddExpense = (exp: Expense) => {
    const updated = [exp, ...expenses];
    setExpenses(updated);
    saveAll(projects, employees, assets, updated, apartments);
    showToast(`Expense invoice of $${exp.amount.toLocaleString()} logged for ${exp.projectName}.`, 'info');
  };

  const handleRemoveExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveAll(projects, employees, assets, updated, apartments);
    showToast(`Expense transaction deleted.`, 'alert');
  };

  const handleApproveExpense = (id: string) => {
    const expenseToApprove = expenses.find(e => e.id === id);
    if (!expenseToApprove || expenseToApprove.status !== 'Pending') return;

    // Transition state
    const updatedExpenses = expenses.map(e => e.id === id ? { ...e, status: 'Approved' as const } : e);
    
    // Update matching project spent
    const updatedProjects = projects.map(p => {
      if (p.name === expenseToApprove.projectName) {
        return { ...p, spent: p.spent + expenseToApprove.amount };
      }
      return p;
    });

    setExpenses(updatedExpenses);
    setProjects(updatedProjects);
    saveAll(updatedProjects, employees, assets, updatedExpenses, apartments);
    showToast(`Invoice approved. $${expenseToApprove.amount.toLocaleString()} posted to ${expenseToApprove.projectName} CapEx.`, 'success');
  };

  const handleRejectExpense = (id: string) => {
    const updated = expenses.map(e => e.id === id ? { ...e, status: 'Rejected' as const } : e);
    setExpenses(updated);
    saveAll(projects, employees, assets, updated, apartments);
    showToast(`Expense invoice rejected and returned.`, 'alert');
  };

  // Safeguard tab mapping when user switches roles
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);

    // Update role on current logged-in user if active (useful for Admin simulation mode)
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      localStorage.setItem('re_ms_current_user', JSON.stringify(updatedUser));
    }

    // Automatically switch to a permitted tab
    switch (role) {
      case 'Admin':
        setActiveTab('overview');
        break;
      case 'SuperAdmin':
        setActiveTab('super-admin');
        break;
      case 'ProjectManager':
        setActiveTab('projects');
        break;
      case 'HRManager':
        setActiveTab('employees');
        break;
      case 'PropertyManager':
        setActiveTab('properties');
        break;
      case 'FinancialOfficer':
        setActiveTab('expenses');
        break;
      case 'Client':
        setActiveTab('client-dashboard');
        break;
    }
    showToast(`Switched active dashboard view to: ${role}`, 'info');
  };

  const handleLoginSuccess = (user: LoggedInUser) => {
    setCurrentUser(user);
    localStorage.setItem('re_ms_current_user', JSON.stringify(user));
    setCurrentRole(user.role);
    
    // Automatically switch to a permitted tab
    switch (user.role) {
      case 'Admin':
        setActiveTab('overview');
        break;
      case 'SuperAdmin':
        setActiveTab('super-admin');
        break;
      case 'ProjectManager':
        setActiveTab('projects');
        break;
      case 'HRManager':
        setActiveTab('employees');
        break;
      case 'PropertyManager':
        setActiveTab('properties');
        break;
      case 'FinancialOfficer':
        setActiveTab('expenses');
        break;
      case 'Client':
        setActiveTab('client-dashboard');
        break;
    }
    showToast(`Access granted. Welcome back, ${user.name.split(' ')[0]}!`, 'success');
  };

  const handleAddUserProfile = (newUser: SystemUserProfile) => {
    const updated = [...userProfiles, newUser];
    setUserProfiles(updated);
    localStorage.setItem('re_ms_user_profiles', JSON.stringify(updated));
    showToast(`Registered system login profile for "${newUser.name}".`, 'success');
  };

  const handleRemoveUserProfile = (id: string) => {
    const target = userProfiles.find(u => u.id === id);
    if (target?.email === currentUser?.email) {
      showToast("Cannot remove your own active login session account!", "alert");
      return;
    }
    const updated = userProfiles.filter(u => u.id !== id);
    setUserProfiles(updated);
    localStorage.setItem('re_ms_user_profiles', JSON.stringify(updated));
    if (target) showToast(`Decommissioned login access for "${target.name}".`, 'alert');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('re_ms_current_user');
    showToast('Secure session terminated successfully.', 'info');
  };

  // State Mutators: Leads & CRM
  const handleAddLead = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, bills, saasTenants, maintenanceTickets, tenders, projectMilestones, ganttTasks, updated);
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    const updated = leads.map(l => l.id === id ? { ...l, ...updates } : l);
    setLeads(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, bills, saasTenants, maintenanceTickets, tenders, projectMilestones, ganttTasks, updated);
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    saveAll(projects, employees, assets, expenses, apartments, materials, vendors, notifications, bills, saasTenants, maintenanceTickets, tenders, projectMilestones, ganttTasks, updated);
  };

  const handleConvertLeadToClient = ({
    lead,
    propertyId,
    dealType,
    dealValue,
    generateInvoice
  }: {
    lead: Lead;
    propertyId: string;
    dealType: 'Sold' | 'Rental';
    dealValue: number;
    generateInvoice: boolean;
  }) => {
    const convertedAt = new Date().toISOString().split('T')[0];
    const clientId = `CLI-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Update Lead
    const updatedLeads = leads.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          status: 'Converted' as const,
          convertedAt,
          convertedClientId: clientId,
          convertedPropertyId: propertyId,
          dealValue,
          notes: (l.notes ? `${l.notes}\n` : '') + `[${convertedAt}] Converted to official client. Assigned unit ${propertyId}. Deal value: $${dealValue.toLocaleString()}`
        };
      }
      return l;
    });
    setLeads(updatedLeads);

    // 2. Update Apartment status if propertyId matches an apartment
    let assignedApt: Apartment | undefined;
    let updatedApts = [...apartments];
    if (propertyId) {
      updatedApts = apartments.map(a => {
        if (a.id === propertyId) {
          assignedApt = {
            ...a,
            status: dealType === 'Sold' ? 'Sold' : 'Rented',
            tenantName: lead.name,
            monthlyRent: dealType === 'Rental' ? Math.round(dealValue / 12) : a.monthlyRent,
            price: dealType === 'Sold' ? dealValue : a.price
          };
          return assignedApt;
        }
        return a;
      });
      setApartments(updatedApts);
    }

    // 3. Create invoice/bill if requested
    let updatedBills = [...bills];
    if (generateInvoice) {
      const newBill: Bill = {
        id: `BIL-${Math.floor(500 + Math.random() * 500)}`,
        billNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        apartmentId: propertyId || 'APT-101',
        buildingName: assignedApt?.buildingName || (lead.interestedProperties && lead.interestedProperties[0]) || 'Grand Horizon Towers',
        unitNumber: assignedApt?.unitNumber || 'Unit 101',
        propertyType: assignedApt?.type || lead.requirement || 'Residential',
        billingType: dealType,
        customerName: lead.name,
        customerEmail: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '.')}@client.com`,
        amount: dealValue,
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        issuedDate: convertedAt,
        status: 'Unpaid',
        paymentMethod: 'Bank Transfer',
        description: `Official ${dealType} contract agreement booking fee for ${lead.name}. Property: ${assignedApt ? assignedApt.buildingName + ' ' + assignedApt.unitNumber : 'Assigned Unit'}.`
      };
      updatedBills = [newBill, ...bills];
      setBills(updatedBills);
    }

    // 4. Ensure client profile exists in userProfiles
    const existingClient = userProfiles.find(u => u.email.toLowerCase() === (lead.email || '').toLowerCase());
    let updatedProfiles = [...userProfiles];
    if (!existingClient) {
      const newProfile: SystemUserProfile = {
        id: clientId,
        name: lead.name,
        email: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '.')}@client.com`,
        role: 'Client',
        department: 'Client Portal',
        initials: lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        passwordDescription: 'client',
        colorClass: 'from-blue-500 to-indigo-600 ring-blue-500/20 text-blue-400 bg-blue-950/20 border-blue-900/40'
      };
      updatedProfiles = [...userProfiles, newProfile];
      setUserProfiles(updatedProfiles);
      localStorage.setItem('re_ms_user_profiles', JSON.stringify(updatedProfiles));
    }

    // 5. System Notification
    const newNotif: SystemNotification = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      tenantId: activeTenant?.id || 'TEN-001',
      title: 'Lead Converted to Official Client',
      message: `${lead.name} (${lead.phone}) has signed a ${dealType} agreement for $${dealValue.toLocaleString()}. Assigned unit: ${assignedApt ? assignedApt.unitNumber : propertyId}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'success'
    };
    const updatedNotifications = [newNotif, ...notifications];
    setNotifications(updatedNotifications);

    // 6. Save all
    saveAll(
      projects,
      employees,
      assets,
      expenses,
      updatedApts,
      materials,
      vendors,
      updatedNotifications,
      updatedBills,
      saasTenants,
      maintenanceTickets,
      tenders,
      projectMilestones,
      ganttTasks,
      updatedLeads
    );
  };

  // Content selector
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            projects={projects}
            employees={employees}
            assets={assets}
            expenses={expenses}
            apartments={apartments}
            onNavigateToRole={(role) => handleRoleChange(role)}
            isBasicPlan={isBasicPlan}
          />
        );
      case 'projects':
        return (
          <ProjectManager
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            isBasicPlan={isBasicPlan}
            ganttTasks={ganttTasks}
            onAddGanttTask={handleAddGanttTask}
            onUpdateGanttTask={handleUpdateGanttTask}
            projectMilestones={projectMilestones}
            onAddMilestone={handleAddMilestone}
            onUpdateMilestone={handleUpdateMilestone}
          />
        );
      case 'employees':
        return (
          <EmployeeManager
            employees={employees}
            projects={projects}
            onAddEmployee={handleAddEmployee}
            onRemoveEmployee={handleRemoveEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            currentUserRole={currentRole}
            userProfiles={userProfiles}
            onAddUserProfile={handleAddUserProfile}
            onRemoveUserProfile={handleRemoveUserProfile}
            currentUserId={currentUser.id}
          />
        );
      case 'assets':
        return (
          <AssetManager
            assets={assets}
            projects={projects}
            onAddAsset={handleAddAsset}
            onRemoveAsset={handleRemoveAsset}
            onUpdateAsset={handleUpdateAsset}
          />
        );
      case 'properties':
        return (
          <PropertyManager
            apartments={apartments}
            projects={projects}
            onAddApartment={handleAddApartment}
            onRemoveApartment={handleRemoveApartment}
            onUpdateApartment={handleUpdateApartment}
            isBasicPlan={isBasicPlan}
            maintenanceTickets={maintenanceTickets}
            onUpdateTicket={handleUpdateTicket}
          />
        );
      case 'expenses':
        return (
          <ExpenseTracker
            expenses={expenses}
            projects={projects}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
            onApproveExpense={handleApproveExpense}
            onRejectExpense={handleRejectExpense}
          />
        );
      case 'materials':
        return (
          <MaterialManager
            materials={materials}
            projects={projects}
            vendors={vendors}
            onAddMaterial={handleAddMaterial}
            onRemoveMaterial={handleRemoveMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onTriggerNotification={handleTriggerNotification}
          />
        );
      case 'vendors':
        return (
          <VendorManager
            vendors={vendors}
            onAddVendor={handleAddVendor}
            onRemoveVendor={handleRemoveVendor}
            onUpdateVendor={handleUpdateVendor}
            onTriggerNotification={handleTriggerNotification}
            isBasicPlan={isBasicPlan}
            tenders={tenders}
            onAddTender={handleAddTender}
            onUpdateTender={handleUpdateTender}
            onAddBid={handleAddBid}
            projects={projects}
          />
        );
      case 'client-dashboard':
        return (
          <ClientDashboard
            currentUser={currentUser}
            apartments={apartments}
            onUpdateApartment={handleUpdateApartment}
            showToast={showToast}
            isBasicPlan={isBasicPlan}
            maintenanceTickets={maintenanceTickets}
            onAddTicket={handleAddTicket}
            onUpdateTicket={handleUpdateTicket}
          />
        );
      case 'billing':
        return (
          <BillingManager
            bills={bills}
            apartments={apartments}
            onAddBill={handleAddBill}
            onRemoveBill={handleRemoveBill}
            onUpdateBill={handleUpdateBill}
            onTriggerNotification={handleTriggerNotification}
          />
        );
      case 'crm':
        return (
          <CrmManager
            leads={leads}
            apartments={apartments}
            projects={projects}
            currentUserProfile={userProfiles.find(p => p.id === currentUser?.id || p.email === currentUser?.email)}
            onAddLead={handleAddLead}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onConvertLeadToClient={handleConvertLeadToClient}
            onTriggerNotification={handleTriggerNotification}
          />
        );
      case 'saas-hub':
        return (
          <SaaSSupabaseCenter />
        );
      case 'super-admin':
        return (
          <SuperAdminDashboard
            saasTenants={saasTenants}
            onAddTenant={handleAddSaasTenant}
            onRemoveTenant={handleRemoveSaasTenant}
            onUpdateTenant={handleUpdateSaasTenant}
            onTriggerNotification={handleTriggerNotification}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border">
            Component tab "{activeTab}" is not accessible for this role.
          </div>
        );
    }
  };

  const filteredNotifications = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'SuperAdmin') {
      return notifications;
    }
    const tenantId = activeTenant?.id || 'TEN-001';
    return notifications.filter(n => {
      const nTenantId = n.tenantId || 'TEN-001';
      return nTenantId === tenantId;
    });
  }, [notifications, currentUser, activeTenant]);

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="re-management-app-root" className={`min-h-screen ${theme === 'light' ? 'theme-light bg-zinc-100 text-zinc-800' : 'bg-[#09090b] text-zinc-300'} flex flex-col font-sans`}>
      {/* Role Selector Header */}
      <RoleSelector
        currentUser={currentUser}
        onLogout={handleLogout}
        onRoleChange={handleRoleChange}
        pendingExpensesCount={expenses.filter(e => e.status === 'Pending').length}
        availableApartmentsCount={apartments.filter(a => a.status === 'Available').length}
        notifications={filteredNotifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearNotifications={handleClearNotifications}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Navigation Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isBasicPlan={isBasicPlan}
        />

        {/* Workspace Canvas / Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Notification Toast Strip */}
          {notification && (
            <div 
              id="app-alert-strip"
              className={`p-3.5 rounded-xl border text-xs font-semibold shadow-md transition-all duration-300 flex items-center justify-between ${
                notification.type === 'success' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' :
                notification.type === 'alert' ? 'bg-red-950/40 text-red-400 border-red-900/60' :
                'bg-zinc-900/80 text-white border-zinc-800'
              }`}
            >
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification(null)} 
                className="text-zinc-500 hover:text-zinc-300 font-bold ml-4 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Active Tab View */}
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
