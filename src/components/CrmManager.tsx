/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Lead, 
  LeadStatus, 
  FollowupLog, 
  Apartment, 
  Project, 
  Bill, 
  SystemUserProfile 
} from '../types';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Building2, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  X, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  TrendingUp, 
  UserPlus, 
  Check, 
  Eye, 
  Kanban, 
  List, 
  PhoneCall, 
  Award,
  Layers,
  FileText,
  BadgeDollarSign,
  Tag,
  Share2,
  CalendarDays
} from 'lucide-react';

interface CrmManagerProps {
  leads: Lead[];
  apartments: Apartment[];
  projects: Project[];
  currentUserProfile?: SystemUserProfile;
  onAddLead: (lead: Lead) => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead: (id: string) => void;
  onConvertLeadToClient: (params: {
    lead: Lead;
    propertyId: string;
    dealType: 'Sold' | 'Rental';
    dealValue: number;
    generateInvoice: boolean;
  }) => void;
  onTriggerNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; border: string; bg: string }> = {
  'New': { label: 'New Lead', color: 'text-blue-400', border: 'border-blue-800/60', bg: 'bg-blue-950/40' },
  'Contacted': { label: 'Contacted', color: 'text-cyan-400', border: 'border-cyan-800/60', bg: 'bg-cyan-950/40' },
  'Site Visit Scheduled': { label: 'Site Visit Scheduled', color: 'text-amber-400', border: 'border-amber-800/60', bg: 'bg-amber-950/40' },
  'Negotiation': { label: 'Negotiation', color: 'text-purple-400', border: 'border-purple-800/60', bg: 'bg-purple-950/40' },
  'Converted': { label: 'Converted to Client', color: 'text-emerald-400', border: 'border-emerald-800/60', bg: 'bg-emerald-950/40' },
  'Lost': { label: 'Closed / Lost', color: 'text-zinc-400', border: 'border-zinc-800/60', bg: 'bg-zinc-900/60' }
};

const REQUIREMENT_PRESETS = [
  '2BHK Luxury Apartment',
  '3BHK Penthouse with Terrace',
  'Bespoke Smart Villa',
  'Commercial Office Space',
  'High-Traffic Retail Shop',
  'Studio Executive Suite',
  'Duplex Family Villa'
];

export const CrmManager: React.FC<CrmManagerProps> = ({
  leads,
  apartments,
  projects,
  currentUserProfile,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  onConvertLeadToClient,
  onTriggerNotification
}) => {
  // Navigation & View
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [followupFilter, setFollowupFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'budget-desc' | 'budget-asc' | 'followups-desc' | 'newest'>('newest');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [followupModalLead, setFollowupModalLead] = useState<Lead | null>(null);

  // Add / Edit Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formRequirement, setFormRequirement] = useState('');
  const [formBudget, setFormBudget] = useState('');
  const [formInterestedProperties, setFormInterestedProperties] = useState<string[]>([]);
  const [formCustomProperty, setFormCustomProperty] = useState('');
  const [formStatus, setFormStatus] = useState<LeadStatus>('New');
  const [formFollowupsCount, setFormFollowupsCount] = useState<number>(0);
  const [formNextFollowupDate, setFormNextFollowupDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formSource, setFormSource] = useState('Website Inquiry');
  const [formAssignedAgent, setFormAssignedAgent] = useState('Sophia Vandervelde');

  // Convert Modal State
  const [convertPropertyId, setConvertPropertyId] = useState('');
  const [convertDealType, setConvertDealType] = useState<'Sold' | 'Rental'>('Sold');
  const [convertDealValue, setConvertDealValue] = useState<string>('');
  const [convertGenerateInvoice, setConvertGenerateInvoice] = useState(true);

  // Log Follow-up State
  const [followupType, setFollowupType] = useState<'Call' | 'Meeting' | 'Site Visit' | 'Email' | 'WhatsApp'>('Call');
  const [followupNotes, setFollowupNotes] = useState('');
  const [followupNextDate, setFollowupNextDate] = useState('');
  const [followupAgentName, setFollowupAgentName] = useState(currentUserProfile?.name || 'Sophia Vandervelde');

  // Available Property Options list for selection
  const availablePropertyOptions = useMemo(() => {
    const list: { id: string; label: string; price: number; type: string }[] = [];
    apartments.forEach(apt => {
      list.push({
        id: apt.id,
        label: `${apt.buildingName} - Unit ${apt.unitNumber} (${apt.type}, Status: ${apt.status})`,
        price: apt.price || 0,
        type: apt.type
      });
    });
    projects.forEach(p => {
      list.push({
        id: p.id,
        label: `${p.name} (Project - ${p.location})`,
        price: p.budget || 0,
        type: 'Project'
      });
    });
    return list;
  }, [apartments, projects]);

  // Compute CRM KPIs
  const kpis = useMemo(() => {
    const total = leads.length;
    const activeLeads = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost');
    const convertedLeads = leads.filter(l => l.status === 'Converted');
    const pipelineValue = activeLeads.reduce((sum, l) => sum + (l.budget || 0), 0);
    const convertedValue = convertedLeads.reduce((sum, l) => sum + (l.dealValue || l.budget || 0), 0);
    const totalFollowups = leads.reduce((sum, l) => sum + (l.followupsCount || 0), 0);
    const conversionRate = total > 0 ? ((convertedLeads.length / total) * 100).toFixed(1) : '0';
    const highTouchCount = leads.filter(l => (l.followupsCount || 0) >= 3).length;

    return {
      total,
      activeCount: activeLeads.length,
      convertedCount: convertedLeads.length,
      pipelineValue,
      convertedValue,
      totalFollowups,
      conversionRate,
      highTouchCount
    };
  }, [leads]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.requirement.toLowerCase().includes(q) ||
        (l.notes && l.notes.toLowerCase().includes(q)) ||
        l.interestedProperties.some(p => p.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter);
    }

    // Followup filter
    if (followupFilter === 'zero') {
      result = result.filter(l => (l.followupsCount || 0) === 0);
    } else if (followupFilter === 'active') {
      result = result.filter(l => (l.followupsCount || 0) >= 1 && (l.followupsCount || 0) <= 3);
    } else if (followupFilter === 'high') {
      result = result.filter(l => (l.followupsCount || 0) >= 4);
    } else if (followupFilter === 'has-next') {
      result = result.filter(l => Boolean(l.nextFollowupDate));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'budget-desc') return (b.budget || 0) - (a.budget || 0);
      if (sortBy === 'budget-asc') return (a.budget || 0) - (b.budget || 0);
      if (sortBy === 'followups-desc') return (b.followupsCount || 0) - (a.followupsCount || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [leads, searchQuery, statusFilter, followupFilter, sortBy]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormRequirement('3BHK Penthouse with Terrace');
    setFormBudget('750000');
    setFormInterestedProperties([]);
    setFormCustomProperty('');
    setFormStatus('New');
    setFormFollowupsCount(0);
    setFormNextFollowupDate('');
    setFormNotes('');
    setFormSource('Website Inquiry');
    setFormAssignedAgent(currentUserProfile?.name || 'Sophia Vandervelde');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormName(lead.name);
    setFormPhone(lead.phone);
    setFormEmail(lead.email);
    setFormAddress(lead.address);
    setFormRequirement(lead.requirement);
    setFormBudget(lead.budget.toString());
    setFormInterestedProperties(lead.interestedProperties || []);
    setFormCustomProperty('');
    setFormStatus(lead.status);
    setFormFollowupsCount(lead.followupsCount || 0);
    setFormNextFollowupDate(lead.nextFollowupDate || '');
    setFormNotes(lead.notes || '');
    setFormSource(lead.source || 'Website Inquiry');
    setFormAssignedAgent(lead.assignedAgent || 'Sophia Vandervelde');
  };

  // Save Lead (Add or Update)
  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      alert('Please enter at least the Lead Name and Phone Number.');
      return;
    }

    const budgetVal = parseFloat(formBudget) || 0;
    const finalProperties = [...formInterestedProperties];
    if (formCustomProperty.trim() && !finalProperties.includes(formCustomProperty.trim())) {
      finalProperties.push(formCustomProperty.trim());
    }

    if (editingLead) {
      onUpdateLead(editingLead.id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        address: formAddress.trim(),
        requirement: formRequirement.trim(),
        budget: budgetVal,
        interestedProperties: finalProperties,
        status: formStatus,
        followupsCount: formFollowupsCount,
        nextFollowupDate: formNextFollowupDate || undefined,
        notes: formNotes.trim(),
        source: formSource,
        assignedAgent: formAssignedAgent
      });
      onTriggerNotification('Lead Updated', `Lead record for "${formName}" updated successfully.`, 'info');
      setEditingLead(null);
    } else {
      const newLead: Lead = {
        id: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        address: formAddress.trim(),
        requirement: formRequirement.trim() || 'Residential Apartment',
        budget: budgetVal,
        interestedProperties: finalProperties.length > 0 ? finalProperties : ['Grand Horizon Towers'],
        status: formStatus,
        followupsCount: formFollowupsCount,
        nextFollowupDate: formNextFollowupDate || undefined,
        notes: formNotes.trim(),
        source: formSource,
        assignedAgent: formAssignedAgent,
        createdAt: new Date().toISOString().split('T')[0],
        followupLogs: formFollowupsCount > 0 ? [
          {
            id: `FL-${Date.now().toString().slice(-4)}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Call',
            notes: 'Initial contact logged during lead creation.',
            agentName: formAssignedAgent
          }
        ] : []
      };
      onAddLead(newLead);
      onTriggerNotification('New Lead Added', `Lead "${formName}" added to CRM pipeline with budget $${budgetVal.toLocaleString()}.`, 'success');
      setShowAddModal(false);
    }
  };

  // Quick increment follow-up
  const handleQuickFollowup = (lead: Lead) => {
    const nextCount = (lead.followupsCount || 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    const newLog: FollowupLog = {
      id: `FL-${Date.now().toString().slice(-4)}`,
      date: today,
      type: 'Call',
      notes: `Quick follow-up #${nextCount} logged by ${currentUserProfile?.name || 'Owner'}.`,
      agentName: currentUserProfile?.name || 'Sophia Vandervelde'
    };
    const updatedLogs = lead.followupLogs ? [...lead.followupLogs, newLog] : [newLog];

    onUpdateLead(lead.id, {
      followupsCount: nextCount,
      lastFollowupDate: today,
      followupLogs: updatedLogs
    });

    onTriggerNotification(
      'Follow-up Recorded',
      `Follow-up count for "${lead.name}" increased to ${nextCount}.`,
      'info'
    );
  };

  // Open Log Follow-up Detailed Modal
  const handleOpenFollowupModal = (lead: Lead) => {
    setFollowupModalLead(lead);
    setFollowupType('Call');
    setFollowupNotes('');
    setFollowupNextDate(lead.nextFollowupDate || '');
    setFollowupAgentName(currentUserProfile?.name || 'Sophia Vandervelde');
  };

  // Submit Detailed Follow-up
  const handleSubmitDetailedFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupModalLead) return;

    const nextCount = (followupModalLead.followupsCount || 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    const newLog: FollowupLog = {
      id: `FL-${Date.now().toString().slice(-4)}`,
      date: today,
      type: followupType,
      notes: followupNotes.trim() || `${followupType} follow-up conducted.`,
      agentName: followupAgentName
    };

    const existingLogs = followupModalLead.followupLogs || [];
    const updatedLogs = [...existingLogs, newLog];

    onUpdateLead(followupModalLead.id, {
      followupsCount: nextCount,
      lastFollowupDate: today,
      nextFollowupDate: followupNextDate || undefined,
      followupLogs: updatedLogs
    });

    onTriggerNotification(
      'Follow-up Logged',
      `${followupType} interaction logged for "${followupModalLead.name}". Total follow-ups: ${nextCount}.`,
      'success'
    );
    setFollowupModalLead(null);
  };

  // Open Convert to Client Modal
  const handleOpenConvertModal = (lead: Lead) => {
    setConvertingLead(lead);
    // Find matching apartment if possible
    const match = apartments.find(a => 
      lead.interestedProperties.some(ip => ip.includes(a.unitNumber) || ip.includes(a.buildingName))
    );
    setConvertPropertyId(match ? match.id : (apartments[0]?.id || ''));
    setConvertDealType('Sold');
    setConvertDealValue(lead.budget ? lead.budget.toString() : (match?.price?.toString() || '500000'));
    setConvertGenerateInvoice(true);
  };

  // Confirm Convert to Client
  const handleConfirmConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;

    const dealVal = parseFloat(convertDealValue) || convertingLead.budget || 0;

    onConvertLeadToClient({
      lead: convertingLead,
      propertyId: convertPropertyId,
      dealType: convertDealType,
      dealValue: dealVal,
      generateInvoice: convertGenerateInvoice
    });

    onTriggerNotification(
      '🎉 Lead Converted to Client!',
      `"${convertingLead.name}" has been converted to an official Client with a $${dealVal.toLocaleString()} deal.`,
      'success'
    );
    setConvertingLead(null);
  };

  // Quick Stage change in Kanban / Table
  const handleStatusChange = (lead: Lead, newStatus: LeadStatus) => {
    if (newStatus === 'Converted' && lead.status !== 'Converted') {
      handleOpenConvertModal(lead);
      return;
    }
    onUpdateLead(lead.id, { status: newStatus });
    onTriggerNotification('Lead Stage Changed', `"${lead.name}" moved to "${newStatus}".`, 'info');
  };

  // Export Leads to CSV
  const handleExportCsv = () => {
    const headers = ['Lead ID', 'Name', 'Phone', 'Email', 'Address', 'Requirement', 'Budget', 'Interested Properties', 'Status', 'Followups Count', 'Last Followup', 'Next Followup', 'Assigned Agent', 'Created Date'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      `"${l.requirement.replace(/"/g, '""')}"`,
      l.budget,
      `"${(l.interestedProperties || []).join('; ')}"`,
      l.status,
      l.followupsCount || 0,
      l.lastFollowupDate || '',
      l.nextFollowupDate || '',
      `"${l.assignedAgent || ''}"`,
      l.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `domus-crm-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerNotification('Leads Exported', `Exported ${leads.length} leads to CSV successfully.`, 'info');
  };

  // Toggle Property in multi-select
  const handleToggleProperty = (propLabel: string) => {
    setFormInterestedProperties(prev => 
      prev.includes(propLabel) 
        ? prev.filter(p => p !== propLabel)
        : [...prev, propLabel]
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Owner CRM Header */}
      <div className="bg-[#111114] border border-zinc-800 rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono tracking-wider bg-emerald-950/70 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Real Estate CRM Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono tracking-wider bg-zinc-800 border border-zinc-700 text-zinc-300">
                Owner Executive Desk
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <UserCheck className="w-6 h-6 text-emerald-400" />
              Lead Acquisition & Client Conversion CRM
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Capture high-intent property leads, track customer requirements, log multi-channel follow-ups, and convert verified leads directly into official clients with automatic unit allocation and billing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Lead
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-[#111114] border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Total Leads</span>
            <UsersIcon className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-white">{kpis.total}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{kpis.activeCount} active</span> in pipeline
          </div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Pipeline Value</span>
            <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            ${(kpis.pipelineValue / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Active purchase budgets
          </div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Total Follow-ups</span>
            <PhoneCall className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">{kpis.totalFollowups}</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            <span className="text-cyan-300 font-semibold">{kpis.highTouchCount}</span> high-touch leads (3+)
          </div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Converted Clients</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">{kpis.convertedCount}</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            <span className="text-purple-300 font-semibold">${(kpis.convertedValue / 1000000).toFixed(2)}M</span> closed deals
          </div>
        </div>

        <div className="bg-[#111114] border border-zinc-800 rounded-lg p-4 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{kpis.conversionRate}%</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Lead to official client
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-[#111114] border border-zinc-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, phone, address, property, requirement..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Table List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" /> Pipeline Board
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-850 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status pills */}
            <div className="flex items-center gap-1 text-zinc-400 font-medium">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-zinc-700"
            >
              <option value="all">All Stages ({leads.length})</option>
              <option value="New">New ({leads.filter(l => l.status === 'New').length})</option>
              <option value="Contacted">Contacted ({leads.filter(l => l.status === 'Contacted').length})</option>
              <option value="Site Visit Scheduled">Site Visit Scheduled ({leads.filter(l => l.status === 'Site Visit Scheduled').length})</option>
              <option value="Negotiation">Negotiation ({leads.filter(l => l.status === 'Negotiation').length})</option>
              <option value="Converted">Converted to Client ({leads.filter(l => l.status === 'Converted').length})</option>
              <option value="Lost">Closed / Lost ({leads.filter(l => l.status === 'Lost').length})</option>
            </select>

            {/* Followup filter */}
            <div className="flex items-center gap-1 text-zinc-400 font-medium ml-2">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Follow-ups:</span>
            </div>
            <select
              value={followupFilter}
              onChange={(e) => setFollowupFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-zinc-700"
            >
              <option value="all">All Touchpoints</option>
              <option value="zero">No Follow-ups Yet (0)</option>
              <option value="active">Active Touches (1-3)</option>
              <option value="high">High-Touch (4+)</option>
              <option value="has-next">Next Date Scheduled</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-zinc-700"
            >
              <option value="newest">Recently Added</option>
              <option value="budget-desc">Budget: High to Low</option>
              <option value="budget-asc">Budget: Low to High</option>
              <option value="followups-desc">Most Follow-ups</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-[#111114] border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lead Contact & Address</th>
                  <th className="py-3 px-4">Requirement & Budget</th>
                  <th className="py-3 px-4">Interested Properties</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-center">Follow-ups</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UsersIcon className="w-8 h-8 text-zinc-600" />
                        <span className="text-sm">No leads match your search or filter criteria.</span>
                        <button
                          onClick={handleOpenAddModal}
                          className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
                        >
                          + Add a new lead
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG['New'];
                    const isConverted = lead.status === 'Converted';

                    return (
                      <tr key={lead.id} className="hover:bg-zinc-900/40 transition-colors group">
                        {/* Name & Contact */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                                {lead.name}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                {lead.id}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-zinc-300 text-[11px]">
                              <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                              <a href={`tel:${lead.phone}`} className="hover:underline font-mono">
                                {lead.phone}
                              </a>
                            </div>

                            {lead.email && (
                              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                                <Mail className="w-3 h-3 text-zinc-500 shrink-0" />
                                <a href={`mailto:${lead.email}`} className="hover:underline truncate max-w-[200px]">
                                  {lead.email}
                                </a>
                              </div>
                            )}

                            <div className="flex items-start gap-1.5 text-zinc-400 text-[11px] pt-0.5">
                              <MapPin className="w-3 h-3 text-zinc-500 shrink-0 mt-0.5" />
                              <span className="text-zinc-400 line-clamp-1 max-w-[220px]" title={lead.address}>
                                {lead.address || 'Address not recorded'}
                              </span>
                            </div>

                            {lead.source && (
                              <div className="pt-0.5">
                                <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 font-mono">
                                  via {lead.source}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Requirement & Budget */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1.5">
                            <div className="font-semibold text-zinc-200 text-xs">
                              {lead.requirement}
                            </div>
                            <div className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
                              ${lead.budget.toLocaleString()}
                            </div>
                            {lead.notes && (
                              <p className="text-[11px] text-zinc-500 italic line-clamp-2 max-w-[240px]">
                                "{lead.notes}"
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Interested Properties */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {lead.interestedProperties && lead.interestedProperties.length > 0 ? (
                              lead.interestedProperties.map((prop, idx) => (
                                <span 
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
                                >
                                  {prop}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-600 text-[11px]">Any Project</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1.5">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                            
                            {/* Fast stage changer */}
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                              className="block text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 rounded px-1.5 py-0.5 hover:border-zinc-700 focus:outline-none"
                            >
                              <option value="New">Set New</option>
                              <option value="Contacted">Set Contacted</option>
                              <option value="Site Visit Scheduled">Set Site Visit</option>
                              <option value="Negotiation">Set Negotiation</option>
                              <option value="Converted">Convert to Client</option>
                              <option value="Lost">Mark Lost</option>
                            </select>
                          </div>
                        </td>

                        {/* Follow-ups */}
                        <td className="py-3.5 px-4 align-top text-center">
                          <div className="inline-flex flex-col items-center gap-1">
                            <button
                              onClick={() => handleOpenFollowupModal(lead)}
                              title="Click to view history & log notes"
                              className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>{lead.followupsCount || 0}</span>
                            </button>

                            <button
                              onClick={() => handleQuickFollowup(lead)}
                              title="Quick +1 Follow-up call"
                              className="text-[10px] text-zinc-400 hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> 1 Call
                            </button>
                          </div>
                        </td>

                        {/* Next Due Date */}
                        <td className="py-3.5 px-4 align-top">
                          {lead.nextFollowupDate ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-zinc-300 font-mono text-xs">
                                <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                                {lead.nextFollowupDate}
                              </div>
                              {new Date(lead.nextFollowupDate) < new Date() && !isConverted && (
                                <span className="inline-block text-[9px] text-rose-400 font-semibold uppercase">
                                  Action Due
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-zinc-600 text-[11px]">—</span>
                          )}
                          {lead.assignedAgent && (
                            <div className="text-[10px] text-zinc-500 mt-1">
                              Rep: {lead.assignedAgent}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Convert to Client Button */}
                            {!isConverted ? (
                              <button
                                onClick={() => handleOpenConvertModal(lead)}
                                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                                title="Convert Lead to official Client with unit allotment"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Convert</span>
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded bg-purple-950/80 border border-purple-800 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Client
                              </span>
                            )}

                            {/* Edit Lead */}
                            <button
                              onClick={() => handleOpenEditModal(lead)}
                              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-800 transition-colors cursor-pointer"
                              title="Edit Lead Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Lead */}
                            <button
                              onClick={() => setDeletingLead(lead)}
                              className="p-1.5 bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 rounded border border-zinc-800 transition-colors cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN PIPELINE BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {(['New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost'] as LeadStatus[]).map((status) => {
            const statusCfg = STATUS_CONFIG[status];
            const columnLeads = filteredLeads.filter(l => l.status === status);
            const columnTotalBudget = columnLeads.reduce((sum, l) => sum + (l.budget || 0), 0);

            return (
              <div 
                key={status}
                className="bg-[#111114] border border-zinc-800 rounded-lg p-3 flex flex-col min-w-[240px] max-h-[800px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-850">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusCfg.color.replace('text-', 'bg-')}`}></span>
                    <span className="text-xs font-bold text-white tracking-wide">{status}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="text-[10px] text-zinc-500 mb-3 flex items-center justify-between">
                  <span>Value:</span>
                  <span className="font-mono text-zinc-300 font-semibold">
                    ${(columnTotalBudget / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {columnLeads.map((lead) => {
                    const isConverted = lead.status === 'Converted';

                    return (
                      <div 
                        key={lead.id}
                        className="bg-zinc-950 border border-zinc-850 hover:border-zinc-700 rounded-lg p-3 space-y-2 transition-all shadow-sm"
                      >
                        {/* Top: Name & Budget */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-bold text-white text-xs hover:text-emerald-400 transition-colors">
                              {lead.name}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-bold font-mono">
                              ${lead.budget.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(lead)}
                              className="text-zinc-500 hover:text-white p-0.5"
                              title="Edit"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeletingLead(lead)}
                              className="text-zinc-500 hover:text-rose-400 p-0.5"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Requirement & Address */}
                        <div className="text-[11px] text-zinc-300 leading-snug">
                          {lead.requirement}
                        </div>

                        {lead.address && (
                          <div className="text-[10px] text-zinc-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{lead.address}</span>
                          </div>
                        )}

                        {/* Phone */}
                        <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>

                        {/* Properties pills */}
                        {lead.interestedProperties && lead.interestedProperties.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {lead.interestedProperties.slice(0, 2).map((p, idx) => (
                              <span key={idx} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded truncate max-w-[140px]">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom Row: Follow-up badge and Convert Action */}
                        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
                          <button
                            onClick={() => handleOpenFollowupModal(lead)}
                            className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-cyan-900/40 cursor-pointer"
                          >
                            <PhoneCall className="w-2.5 h-2.5" />
                            <span>{lead.followupsCount || 0} touches</span>
                          </button>

                          {!isConverted ? (
                            <button
                              onClick={() => handleOpenConvertModal(lead)}
                              className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <UserPlus className="w-2.5 h-2.5" />
                              Convert
                            </button>
                          ) : (
                            <span className="text-[9px] font-bold text-purple-400 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Client
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {columnLeads.length === 0 && (
                    <div className="h-24 border border-dashed border-zinc-850 rounded-lg flex items-center justify-center text-zinc-600 text-xs italic">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: ADD / EDIT LEAD */}
      {/* ============================================================ */}
      {(showAddModal || editingLead) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111114] border border-zinc-800 rounded-xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  {editingLead ? `Edit Lead: ${editingLead.name}` : 'Add New Real Estate Lead'}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Capture buyer contact information, budget criteria, property requirements, and follow-up schedules.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingLead(null);
                }}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-4">
              {/* Row 1: Name, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Lead Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Marcus Sterling"
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-8901"
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: Email, Current Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. m.sterling@example.com"
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Address / City
                  </label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. 842 Highland Ave, West End, Metro City"
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 3: Requirement & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Requirement Type / Configuration
                  </label>
                  <input
                    type="text"
                    value={formRequirement}
                    onChange={(e) => setFormRequirement(e.target.value)}
                    placeholder="e.g. 3BHK Penthouse with Panoramic Terrace"
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                  />
                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {REQUIREMENT_PRESETS.slice(0, 4).map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setFormRequirement(preset)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Estimated Budget ($ USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      required
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      placeholder="e.g. 750000"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  {formBudget && (
                    <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                      ${parseFloat(formBudget || '0').toLocaleString()} USD
                    </span>
                  )}
                </div>
              </div>

              {/* Row 4: Interested Properties */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase">
                  Interested Properties & Built Units
                </label>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1.5">
                  {availablePropertyOptions.map((opt) => {
                    const isSelected = formInterestedProperties.includes(opt.label);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors text-xs ${
                          isSelected ? 'bg-emerald-950/40 text-emerald-300 font-semibold' : 'text-zinc-400 hover:bg-zinc-900'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleProperty(opt.label)}
                          className="accent-emerald-500 rounded"
                        />
                        <span className="truncate">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Custom property field if not in list */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formCustomProperty}
                    onChange={(e) => setFormCustomProperty(e.target.value)}
                    placeholder="Or enter custom property / tower name..."
                    className="flex-1 text-xs bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formCustomProperty.trim() && !formInterestedProperties.includes(formCustomProperty.trim())) {
                        setFormInterestedProperties(prev => [...prev, formCustomProperty.trim()]);
                        setFormCustomProperty('');
                      }
                    }}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 rounded font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Row 5: Status, Initial Followups Count, Next Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Pipeline Stage / Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as LeadStatus)}
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Converted">Converted to Client</option>
                    <option value="Lost">Closed / Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Number of Follow-ups
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formFollowupsCount}
                    onChange={(e) => setFormFollowupsCount(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Next Follow-up Due Date
                  </label>
                  <input
                    type="date"
                    value={formNextFollowupDate}
                    onChange={(e) => setFormNextFollowupDate(e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 6: Source & Assigned Agent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Lead Source
                  </label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Website Inquiry">Website Inquiry</option>
                    <option value="Referral">Client Referral</option>
                    <option value="Walk-in">Showroom Walk-in</option>
                    <option value="Property Portal">Real Estate Portal</option>
                    <option value="Social Media">Social Media Ad Campaign</option>
                    <option value="Direct Call">Direct Inbound Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Assigned Agent / Executive
                  </label>
                  <input
                    type="text"
                    value={formAssignedAgent}
                    onChange={(e) => setFormAssignedAgent(e.target.value)}
                    placeholder="e.g. Sophia Vandervelde"
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Row 7: Notes */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Owner & Agent Consultation Notes
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Record customer preferences, timeline expectations, mortgage status, or specific architectural finishes discussed..."
                  className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLead(null);
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {editingLead ? 'Update Lead' : 'Save & Register Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: CONVERT LEAD TO CLIENT */}
      {/* ============================================================ */}
      {convertingLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111114] border border-emerald-800/80 rounded-xl max-w-xl w-full p-6 space-y-5 my-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Client Conversion Pipeline
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  Convert Lead to Official Client
                </h3>
              </div>
              <button
                onClick={() => setConvertingLead(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lead Summary Card */}
            <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-4 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white text-sm">{convertingLead.name}</div>
                  <div className="text-zinc-400 font-mono text-[11px]">{convertingLead.phone} | {convertingLead.email || 'No email'}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase block">Proposed Budget</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">${convertingLead.budget.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-zinc-400 text-[11px] pt-1 border-t border-zinc-900">
                <span className="text-zinc-500">Requirement:</span> {convertingLead.requirement}
              </div>
            </div>

            <form onSubmit={handleConfirmConvert} className="space-y-4">
              {/* Select Unit / Property to Assign */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                  Assign Built Property / Apartment <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={convertPropertyId}
                  onChange={(e) => {
                    setConvertPropertyId(e.target.value);
                    const selectedApt = apartments.find(a => a.id === e.target.value);
                    if (selectedApt && selectedApt.price) {
                      setConvertDealValue(selectedApt.price.toString());
                    }
                  }}
                  className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select Apartment / Property</option>
                  {apartments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.buildingName} - Unit {apt.unitNumber} ({apt.type}, Status: {apt.status}, Price: ${apt.price.toLocaleString()})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Assigning a unit automatically changes its status to 'Sold' or 'Rented' and registers the client's name.
                </p>
              </div>

              {/* Deal Type and Contract Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Contract Agreement Type
                  </label>
                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setConvertDealType('Sold')}
                      className={`flex-1 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                        convertDealType === 'Sold' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'
                      }`}
                    >
                      Property Sale (Deed)
                    </button>
                    <button
                      type="button"
                      onClick={() => setConvertDealType('Rental')}
                      className={`flex-1 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
                        convertDealType === 'Rental' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'
                      }`}
                    >
                      Lease Agreement
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Confirmed Deal Value ($ USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      min="0"
                      required
                      value={convertDealValue}
                      onChange={(e) => setConvertDealValue(e.target.value)}
                      placeholder="e.g. 620000"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Auto Invoice Option */}
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg space-y-2">
                <label className="flex items-center gap-2 text-xs text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={convertGenerateInvoice}
                    onChange={(e) => setConvertGenerateInvoice(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="font-semibold">Automatically Generate Milestone / Booking Invoice</span>
                </label>
                <p className="text-[11px] text-zinc-500 pl-5">
                  Creates an active invoice record in the <span className="text-zinc-300">Property Billing</span> module with client invoice number and due dates.
                </p>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-[11px] text-emerald-300/80 leading-relaxed">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Client Portal Access Activated
                </div>
                A client profile is created in the database, granting them authenticated access to the dedicated Client Workspace to track lease payments, deed documentation, and maintenance tickets.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  Confirm & Convert to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: LOG DETAILED FOLLOW-UP & TIMELINE */}
      {/* ============================================================ */}
      {followupModalLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111114] border border-zinc-800 rounded-xl max-w-xl w-full p-6 space-y-5 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-cyan-400" />
                  Follow-up Log & Timeline: {followupModalLead.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Total Touches: <span className="font-mono text-cyan-400 font-bold">{followupModalLead.followupsCount || 0}</span> | Requirement: {followupModalLead.requirement}
                </p>
              </div>
              <button
                onClick={() => setFollowupModalLead(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Interaction History
              </h4>
              <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2.5">
                {followupModalLead.followupLogs && followupModalLead.followupLogs.length > 0 ? (
                  followupModalLead.followupLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-cyan-500/60 pl-3 py-1 space-y-0.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-semibold text-cyan-300">
                            {log.type}
                          </span>
                          <span>by {log.agentName}</span>
                        </span>
                        <span className="text-zinc-500 font-mono text-[10px]">{log.date}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        {log.notes}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-zinc-600 text-xs italic">
                    No individual interaction logs recorded yet. Add one below to track consultation notes!
                  </div>
                )}
              </div>
            </div>

            {/* Log New Follow-up Form */}
            <form onSubmit={handleSubmitDetailedFollowup} className="space-y-4 pt-2 border-t border-zinc-850">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-400" /> Log New Follow-up Interaction
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                    Channel / Type
                  </label>
                  <select
                    value={followupType}
                    onChange={(e) => setFollowupType(e.target.value as any)}
                    className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Meeting">In-Person Meeting</option>
                    <option value="Site Visit">On-site Property Walkthrough</option>
                    <option value="WhatsApp">WhatsApp / SMS Chat</option>
                    <option value="Email">Email Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                    Next Follow-up Due Date
                  </label>
                  <input
                    type="date"
                    value={followupNextDate}
                    onChange={(e) => setFollowupNextDate(e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Discussion Summary & Client Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  value={followupNotes}
                  onChange={(e) => setFollowupNotes(e.target.value)}
                  placeholder="e.g. Conducted guided site visit to Grand Horizon penthouse. Client satisfied with floor height. Discussed final 3% cash rebate terms..."
                  className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFollowupModalLead(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950"
                >
                  <Check className="w-4 h-4" /> Save Interaction & Increment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ============================================================ */}
      {deletingLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-rose-900/60 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Lead Record</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to permanently delete lead <span className="font-bold text-white">"{deletingLead.name}"</span> ({deletingLead.phone})?
            </p>
            <p className="text-[11px] text-zinc-500">
              This will remove all associated follow-up touchpoint records and notes from the active CRM database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeletingLead(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLead(deletingLead.id);
                  onTriggerNotification('Lead Deleted', `Lead "${deletingLead.name}" was removed.`, 'warning');
                  setDeletingLead(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
