import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Activity, 
  Settings, 
  Terminal, 
  UserPlus, 
  Trash2, 
  ShieldAlert, 
  CheckCircle, 
  RefreshCw, 
  Sliders, 
  Database, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Search, 
  Crown, 
  Award, 
  Zap, 
  Save, 
  X,
  Server,
  Eye,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Filter,
  CreditCard,
  Wallet,
  Copy,
  Check,
  FileText,
  Download,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { downloadCertificatePDF } from '../utils/pdfGenerator';

export default function Admin({ language = 'en', userProfile, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'logs', 'settings', 'payments', 'certificates'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [copiedTxId, setCopiedTxId] = useState('');
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [issueCertData, setIssueCertData] = useState({ username: '', courseId: 'ethical-hacking', userEmail: '', issueDate: '' });
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    scheduledBackups: false,
    announcementBanner: '🚨 Cyber Nexus v4.2 Admin Portal active.',
    firewallLevel: 'High',
    ctfRateLimit: true,
    require2FAForAdmin: false
  });

  // User management states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'Student' });

  const [editUserModal, setEditUserModal] = useState(null); // user object to edit stats
  const [editUserStats, setEditUserStats] = useState({ level: 1, xp: 0, streak: 1, newPassword: '' });
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null); // { id, username }

  // Translations helper
  const isFr = language === 'fr';

  // Helper function to handle response errors
  const parseError = (data, fallback) => data && data.error ? data.error : fallback;

  // 1. Load Data
  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadPayments = async () => {
    try {
      const res = await fetch('/api/payments/all', {
        headers: {
          'x-user-role': userProfile?.role || 'Admin',
          'x-user-name': userProfile?.username || 'admin',
          'x-user-email': userProfile?.email || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  };

  const loadCertificates = async () => {
    try {
      const res = await fetch('/api/verify-certificate/all');
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error('Failed to load certificates:', err);
    }
  };

  const reloadAll = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadUsers(), loadLogs(), loadSettings(), loadPayments(), loadCertificates()]);
    setLoading(false);
  };

  useEffect(() => {
    reloadAll();
  }, []);

  const handleApproveCert = async (certId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/verify-certificate/${certId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userProfile?.role || 'Admin',
          'x-user-name': userProfile?.username || 'admin',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Certificat & Badge approuvés avec succès !' : 'Certificate & Badge approved successfully!' });
        loadCertificates();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to approve certificate.') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssueCertSubmit = async (e) => {
    e.preventDefault();
    if (!issueCertData.username || !issueCertData.courseId) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/verify-certificate/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userProfile?.role || 'Admin',
          'x-user-name': userProfile?.username || 'admin',
        },
        body: JSON.stringify(issueCertData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Certificat & Badge émis directement !' : 'Verifiable Certificate & Digital Badge issued directly!' });
        setShowIssueCertModal(false);
        setIssueCertData({ username: '', courseId: 'ethical-hacking', userEmail: '', issueDate: '' });
        loadCertificates();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to issue certificate.') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeCert = async (certId) => {
    if (!confirm(isFr ? 'Voulez-vous vraiment révoquer ce certificat ?' : 'Are you sure you want to revoke this certificate?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/verify-certificate/${certId}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': userProfile?.role || 'Admin',
          'x-user-name': userProfile?.username || 'admin',
        },
      });
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Certificat révoqué.' : 'Certificate revoked.' });
        loadCertificates();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userProfile?.role || 'Admin',
          'x-user-name': userProfile?.username || 'admin',
          'x-user-email': userProfile?.email || ''
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Paiement approuvé ! Cours débloqué.' : 'Payment approved! Course unlocked.' });
        loadPayments();
        loadUsers();
        if (onProfileUpdate) onProfileUpdate();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to approve payment' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error approving payment' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userProfile?.role || 'Admin',
          'x-user-name': userProfile?.username || 'admin',
          'x-user-email': userProfile?.email || ''
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Paiement rejeté.' : 'Payment rejected.' });
        loadPayments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reject payment' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error rejecting payment' });
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Handlers
  const handleToggleSelfAdmin = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/toggle-self-admin', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `${isFr ? 'Rôle basculé vers' : 'Role toggled to'} ${data.role}` });
        if (onProfileUpdate && data.user) onProfileUpdate(data.user);
        reloadAll();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Role toggle failed') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error calling server endpoint' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Opérateur créé avec succès !' : 'User account created successfully!' });
        setShowAddUserModal(false);
        setNewUser({ username: '', email: '', password: '', role: 'Student' });
        loadUsers();
        loadStats();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to create user') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server connection error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        loadUsers();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to update user role') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveUserStats = async (e) => {
    e.preventDefault();
    if (!editUserModal) return;
    setActionLoading(true);
    try {
      let statsSuccess = false;
      const resStats = await fetch(`/api/admin/users/${editUserModal.id}/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: editUserStats.level,
          xp: editUserStats.xp,
          streak: editUserStats.streak
        })
      });
      const dataStats = await resStats.json();
      if (resStats.ok) {
        statsSuccess = true;
      }

      if (editUserStats.newPassword && editUserStats.newPassword.trim().length > 0) {
        const resPass = await fetch(`/api/admin/users/${editUserModal.id}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword: editUserStats.newPassword.trim() })
        });
        const dataPass = await resPass.json();
        if (!resPass.ok) {
          setMessage({ type: 'error', text: parseError(dataPass, 'Failed to update user password') });
          setActionLoading(false);
          return;
        }
      }

      if (statsSuccess) {
        setMessage({ type: 'success', text: isFr ? 'Utilisateur mis à jour avec succès !' : 'User profile and credentials updated successfully!' });
        setEditUserModal(null);
        loadUsers();
        loadStats();
      } else {
        setMessage({ type: 'error', text: parseError(dataStats, 'Failed to update user stats') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBan = async (userId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        loadUsers();
        loadStats();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Ban action failed') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = (userId, username) => {
    setDeleteConfirmUser({ id: userId, username });
  };

  const executeDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    const { id, username } = deleteConfirmUser;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || `User '${username}' deleted successfully.` });
        setDeleteConfirmUser(null);
        setEditUserModal(null);
        loadUsers();
        loadStats();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Delete failed') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Paramètres du système enregistrés !' : 'System settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to save settings') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearLogs = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/logs/clear', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Journaux purgés avec succès' : 'Logs purged successfully' });
        loadLogs();
        loadStats();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error clearing logs' });
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-[var(--text-main)] font-sans">
      
      {/* 1. TOP TITLE BAR & ADMIN STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-mono tracking-wider text-[var(--text-bright)] flex items-center gap-3">
                CYBER NEXUS <span className="text-cyan-400">{isFr ? 'PORTAIL D\'ADMINISTRATION' : 'ADMIN CONTROL PANEL'}</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {isFr ? 'Gestion des privilèges, utilisateurs, sécurité et télémétrie' : 'Privilege management, user controls, security audit & live platform telemetry'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Role Badge */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleToggleSelfAdmin}
            disabled={actionLoading}
            title={isFr ? 'Basculer le rôle entre Admin et Étudiant' : 'Toggle role between Admin and Student for testing'}
            className="px-3 py-2 bg-[var(--bg-input)] hover:bg-[var(--border-main)] border border-[var(--border-main)] text-xs font-mono font-semibold text-[var(--text-bright)] rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>{isFr ? 'Mode Test Rôle' : 'Toggle Admin Role'}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 font-bold uppercase">
              {userProfile?.role || 'Student'}
            </span>
          </button>

          <button
            onClick={reloadAll}
            className="p-2 bg-[var(--bg-input)] hover:bg-[var(--border-main)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-bright)] rounded-xl transition-all cursor-pointer"
            title={isFr ? 'Rafraîchir les données' : 'Refresh All Telemetry'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* ALERT MESSAGE NOTIFICATION */}
      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-mono animate-fadeIn ${
          message.type === 'error' 
            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'error' ? <ShieldAlert className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: '', text: '' })} className="text-slate-400 hover:text-white font-bold cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. KPI METRICS RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Opérateurs' : 'Total Users'}</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-[var(--text-bright)]">
            {stats ? stats.totalUsers : '...'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">
            {stats ? `${stats.activeUsers} ${isFr ? 'actifs' : 'active'}` : ''}
          </span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Admins' : 'Admins'}</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-400">
            {stats ? stats.adminCount : '...'}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1">{isFr ? 'Privilégiés' : 'Superusers'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'XP Système' : 'Total XP'}</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-purple-400">
            {stats ? stats.totalXP.toLocaleString() : '...'}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1">{isFr ? 'Points cumulés' : 'Platform sum'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Labs Résolus' : 'Labs Solved'}</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-blue-400">
            {stats ? stats.totalLabsSolved : '...'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">{isFr ? 'Déploiements' : 'Deployments'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'CTFs Validés' : 'CTFs Solved'}</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
            {stats ? stats.totalCtfsSolved : '...'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">{isFr ? 'Flags capturés' : 'Flags claimed'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Alertes Sécurité' : 'Security Alerts'}</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-red-400">
            {stats ? stats.securityAlertsCount : '0'}
          </div>
          <span className="text-[10px] text-red-400/80 font-mono mt-1">{isFr ? 'Incidents' : 'Incidents logged'}</span>
        </div>
      </div>

      {/* 3. NAVIGATION SUB-TABS */}
      <div className="flex border-b border-[var(--border-main)] space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', icon: Activity, label: isFr ? 'Aperçu & Télémétrie' : 'Overview & System' },
          { id: 'users', icon: Users, label: isFr ? 'Gestion des Utilisateurs' : 'User Management' },
          { id: 'certificates', icon: Award, label: isFr ? 'Certificats & Badges' : 'Certificates & Badges' },
          { id: 'payments', icon: CreditCard, label: isFr ? 'Paiements Cours ($10)' : 'Course Payments ($10)' },
          { id: 'logs', icon: Terminal, label: isFr ? 'Journaux d\'Incidents' : 'Security Audit Logs' },
          { id: 'settings', icon: Settings, label: isFr ? 'Configuration Sécurité' : 'System Settings' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isSelected 
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-panel)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'users' && users.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[var(--bg-input)] text-[10px] font-mono text-slate-300">
                  {users.length}
                </span>
              )}
              {tab.id === 'certificates' && certificates.filter(c => c.status === 'PENDING').length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-400 font-bold">
                  {certificates.filter(c => c.status === 'PENDING').length}
                </span>
              )}
              {tab.id === 'payments' && payments.filter(p => p.status === 'pending').length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-400 font-bold">
                  {payments.filter(p => p.status === 'pending').length}
                </span>
              )}
              {tab.id === 'logs' && logs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-500/20 text-[10px] font-mono text-red-400">
                  {logs.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* System Health Card */}
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                {isFr ? 'État des Serveurs' : 'Server & Engine Status'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                {isFr ? 'Opérationnel' : 'Operational'}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">{isFr ? 'Environnement Exec' : 'Runtime Node Env'}</span>
                <span className="text-[var(--text-bright)] font-semibold">{stats?.nodeEnv || 'development'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">{isFr ? 'Base MongoDB' : 'MongoDB Cluster'}</span>
                <span className={`font-semibold ${stats?.mongoConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {stats?.mongoConnected ? (isFr ? 'Connecté' : 'Connected') : (isFr ? 'Mode En Mémoire' : 'In-Memory Fallback')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">{isFr ? 'Disponibilité Système' : 'System Uptime'}</span>
                <span className="text-emerald-400 font-semibold">{stats?.systemUptime || '99.98%'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">{isFr ? 'Sauvegardes Planifiées' : 'Scheduled Backups'}</span>
                <span className={`font-semibold ${settings.scheduledBackups ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {settings.scheduledBackups ? (isFr ? 'Activée' : 'Enabled') : (isFr ? 'Désactivée' : 'Disabled')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--text-muted)]">{isFr ? 'Pare-feu Réseau' : 'Active Firewall'}</span>
                <span className="text-cyan-400 font-semibold">{settings.firewallLevel} {isFr ? 'Niveau' : 'Level'}</span>
              </div>
            </div>
          </div>

          {/* Platform Broadcast Announcement */}
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {isFr ? 'Bannière d\'Annonce Système' : 'System Announcement Banner'}
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {isFr ? 'Bannière diffusée en haut de l\'écran pour tous les utilisateurs actifs.' : 'Broadcast message displayed at top of screen to all logged-in operatives.'}
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={settings.announcementBanner}
                onChange={(e) => setSettings({ ...settings, announcementBanner: e.target.value })}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-xs text-[var(--text-bright)] font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSaveSettings}
                disabled={actionLoading}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isFr ? 'Mettre à Jour la Bannière' : 'Update Broadcast Banner'}</span>
              </button>
            </div>
          </div>

          {/* Quick Control Toggles */}
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                {isFr ? 'Contrôles Rapides' : 'Quick Security Toggles'}
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-input)]">
                <div>
                  <div className="font-bold text-[var(--text-bright)]">{isFr ? 'Mode Maintenance' : 'Maintenance Mode'}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{isFr ? 'Restreindre l\'accès aux admins' : 'Restrict non-admin logins'}</div>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...settings, maintenanceMode: !settings.maintenanceMode };
                    setSettings(updated);
                  }}
                  className="cursor-pointer"
                >
                  {settings.maintenanceMode ? <ToggleRight className="w-7 h-7 text-amber-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-input)]">
                <div>
                  <div className="font-bold text-[var(--text-bright)]">{isFr ? 'Inscriptions Ouvertes' : 'User Registration'}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{isFr ? 'Autoriser de nouveaux comptes' : 'Allow new user signup'}</div>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...settings, registrationOpen: !settings.registrationOpen };
                    setSettings(updated);
                  }}
                  className="cursor-pointer"
                >
                  {settings.registrationOpen ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-input)]">
                <div>
                  <div className="font-bold text-[var(--text-bright)]">{isFr ? 'Sauvegardes Planifiées' : 'Scheduled Backups'}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{isFr ? 'Sauvegardes automatiques de la base de données' : 'Automated daily database backups'}</div>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...settings, scheduledBackups: !settings.scheduledBackups };
                    setSettings(updated);
                  }}
                  className="cursor-pointer"
                >
                  {settings.scheduledBackups ? <ToggleRight className="w-7 h-7 text-emerald-400" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-fadeIn">
          {/* User Controls Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)]">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={isFr ? 'Rechercher par pseudo ou email...' : 'Search by username or email...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl py-2 pl-10 pr-4 text-xs font-mono text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Role Filter & Add User Button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-1.5 text-xs font-mono">
                <Filter className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-[var(--text-bright)] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">{isFr ? 'Tous les rôles' : 'All Roles'}</option>
                  <option value="Admin">Admin</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isFr ? 'Nouvel Opérateur' : 'Add User'}</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-main)] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[var(--bg-input)] text-[var(--text-muted)] uppercase text-[10px] tracking-wider border-b border-[var(--border-main)]">
                  <tr>
                    <th className="p-4">{isFr ? 'Utilisateur' : 'Operative / Email'}</th>
                    <th className="p-4">{isFr ? 'Rôle' : 'Role'}</th>
                    <th className="p-4">{isFr ? 'Niveau & XP' : 'Level & XP'}</th>
                    <th className="p-4">{isFr ? 'Série' : 'Streak'}</th>
                    <th className="p-4">{isFr ? 'Statut' : 'Status'}</th>
                    <th className="p-4 text-right">{isFr ? 'Actions' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                        {isFr ? 'Aucun utilisateur trouvé' : 'No operatives match the current query.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[var(--bg-input)]/50 transition-colors">
                        {/* User identity */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-xs">
                              {u.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[var(--text-bright)] flex items-center gap-2">
                                <span>{u.username}</span>
                                {u.role === 'Admin' && <Crown className="w-3.5 h-3.5 text-amber-400 inline shrink-0" />}
                              </div>
                              <div className="text-[10px] text-[var(--text-muted)]">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role selection dropdown */}
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            disabled={actionLoading}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold focus:outline-none cursor-pointer ${
                              u.role === 'Admin' 
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                : u.role === 'Instructor'
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            }`}
                          >
                            <option value="Student">Student</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>

                        {/* Level & XP */}
                        <td className="p-4">
                          <div className="font-semibold text-[var(--text-bright)]">LVL {u.level}</div>
                          <div className="text-[10px] text-purple-400">{u.xp} XP</div>
                        </td>

                        {/* Streak */}
                        <td className="p-4 text-emerald-400 font-semibold">
                          🔥 {u.streak || 1} {isFr ? 'jours' : 'days'}
                        </td>

                        {/* Status badge */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.isBanned || u.status === 'Banned'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {u.isBanned || u.status === 'Banned' ? (isFr ? 'Banni' : 'Banned') : (isFr ? 'Actif' : 'Active')}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="p-4 text-right space-x-2">
                          {/* Edit stats button */}
                          <button
                            onClick={() => {
                              setEditUserModal(u);
                              setEditUserStats({ level: u.level, xp: u.xp, streak: u.streak || 1, newPassword: '' });
                            }}
                            className="p-1.5 bg-[var(--bg-input)] hover:bg-[var(--border-main)] text-[var(--text-muted)] hover:text-cyan-400 rounded-lg transition-colors cursor-pointer"
                            title={isFr ? 'Modifier profil / mot de passe' : 'Edit Profile & Password'}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>

                          {/* Ban / Unban button */}
                          <button
                            onClick={() => handleToggleBan(u.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              u.isBanned 
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                            }`}
                            title={u.isBanned ? (isFr ? 'Débannir l\'utilisateur' : 'Unban user') : (isFr ? 'Bannir l\'utilisateur' : 'Ban user')}
                          >
                            {u.isBanned ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete user button */}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                            title={isFr ? 'Supprimer définitivement' : 'Delete user account'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)]">
            <div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                {isFr ? 'Journaux d\'Incidents de Sécurité' : 'Security Incident Audit Logs'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {isFr ? 'Détection en temps réel des tentatives d\'injection NoSQL, CSRF, et événements auth' : 'Real-time telemetry logging NoSQL injection blocks, CSRF anomalies & security events'}
              </p>
            </div>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Effacer les journaux' : 'Purge Logs'}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-[var(--border-main)] font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-slate-500 text-center py-10">
                💚 {isFr ? 'Aucun incident de sécurité enregistré. Tous les systèmes sont nominaux.' : 'No security incident anomalies logged. All nodes clear.'}
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{log.type || 'SECURITY_ALERT'}</span>
                      <span className="text-[10px] text-slate-500">[{log.timestamp || new Date().toISOString()}]</span>
                    </div>
                    <div className="text-slate-300 text-[11px]">{log.details || JSON.stringify(log)}</div>
                  </div>
                  <div className="text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800 shrink-0 font-mono">
                    IP: {log.originIp || log.ip || '127.0.0.1'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: CERTIFICATES & DIGITAL BADGES MANAGEMENT */}
      {activeTab === 'certificates' && (
        <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-main)]">
            <div>
              <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                {isFr ? 'Certificats PDF Vérifiables & Badges Numériques' : 'Verifiable PDF Certificates & Digital Badges'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                {isFr
                  ? 'Examinez les parcours terminés, validez les demandes et attribuez des certificats signés cryptographiquement avec QR codes.'
                  : 'Review completed student paths, approve verification requests, and issue cryptographically signed PDF certificates with QR codes.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowIssueCertModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{isFr ? 'Émettre un Certificat' : 'Issue Certificate'}</span>
              </button>
              <button
                onClick={loadCertificates}
                className="px-3 py-2 bg-[var(--bg-input)] hover:bg-[var(--border-subtle)] border border-[var(--border-main)] text-[var(--text-bright)] font-mono text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isFr ? 'Actualiser' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {certificates.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] font-mono text-xs">
              {isFr ? 'Aucun certificat ou demande de badge enregistré.' : 'No certificates or badge issuance requests found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-main)] text-[var(--text-muted)] uppercase text-[10px]">
                    <th className="p-3">{isFr ? 'Étudiant' : 'Student Operative'}</th>
                    <th className="p-3">{isFr ? 'Parcours / Cours' : 'Course Track'}</th>
                    <th className="p-3">{isFr ? 'Badge Atteint' : 'Digital Badge'}</th>
                    <th className="p-3">{isFr ? 'ID & Hash Signature' : 'Certificate ID & Hash'}</th>
                    <th className="p-3">{isFr ? 'Statut' : 'Status'}</th>
                    <th className="p-3 text-right">{isFr ? 'Actions Administrateur' : 'Admin Verification'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {certificates.map((cert) => {
                    const isPending = cert.status === 'PENDING';
                    const isApproved = cert.status === 'APPROVED';
                    return (
                      <tr key={cert.certificateId} className="hover:bg-[var(--bg-input)]/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-[var(--text-bright)]">@{cert.username}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{cert.userEmail || 'registered@operative'}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-cyan-400">{cert.courseTitle}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">Code: {cert.courseId}</div>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                            <Award className="w-3 h-3 text-amber-400" />
                            {cert.badgeType}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10px]">
                          <div className="text-white font-bold select-all">{cert.certificateId}</div>
                          <div className="text-slate-500 truncate max-w-[150px]" title={cert.signatureHash}>
                            {cert.signatureHash}
                          </div>
                        </td>
                        <td className="p-3">
                          {isPending && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              PENDING VERIFICATION
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              VERIFIED & ISSUED
                            </span>
                          )}
                          {!isPending && !isApproved && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                              REVOKED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <button
                                onClick={() => handleApproveCert(cert.certificateId)}
                                disabled={actionLoading}
                                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>{isFr ? 'Valider & Délivrer' : 'Approve & Issue'}</span>
                              </button>
                            )}

                            <button
                              onClick={() => downloadCertificatePDF({ certificate: cert, language })}
                              className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1"
                              title="Download PDF Certificate with QR Code"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </button>

                            <button
                              onClick={() => handleRevokeCert(cert.certificateId)}
                              disabled={actionLoading}
                              className="px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Revoke Certificate"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ISSUE CERTIFICATE MODAL */}
      {showIssueCertModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl font-mono text-xs animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
              <h3 className="font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                {isFr ? 'Émettre un Certificat & Badge Numérique' : 'Directly Issue Certificate & Badge'}
              </h3>
              <button
                onClick={() => setShowIssueCertModal(false)}
                className="p-1 hover:bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueCertSubmit} className="space-y-4">
              <div>
                <label className="block text-[var(--text-muted)] font-bold uppercase text-[10px] mb-1">
                  {isFr ? 'Nom d\'utilisateur de l\'étudiant' : 'Student Username'}
                </label>
                <input
                  type="text"
                  required
                  value={issueCertData.username}
                  onChange={(e) => setIssueCertData((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="e.g. yassineklt94"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-bright)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold uppercase text-[10px] mb-1">
                  {isFr ? 'Email de l\'étudiant (Optionnel)' : 'Student Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={issueCertData.userEmail}
                  onChange={(e) => setIssueCertData((prev) => ({ ...prev, userEmail: e.target.value }))}
                  placeholder="student@cybernexus.org"
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-bright)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold uppercase text-[10px] mb-1">
                  {isFr ? 'Parcours / Module Réussi' : 'Completed Course Track'}
                </label>
                <select
                  value={issueCertData.courseId}
                  onChange={(e) => setIssueCertData((prev) => ({ ...prev, courseId: e.target.value }))}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-bright)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="ethical-hacking">Ethical Hacking & Network Exploitation</option>
                  <option value="linux-fundamentals">Linux System Administration & Security</option>
                  <option value="web-app-security">Web Application Security & Penetration Testing</option>
                  <option value="soc-analyst">SOC Analyst, Incident Response & Blue Teaming</option>
                  <option value="malware-analysis">Reverse Engineering & Malware Analysis</option>
                  <option value="cloud-security">Cloud Security Architecture & Hardening</option>
                  <option value="crypto-stego">Advanced Cryptography & Steganography</option>
                  <option value="osint-recon">OSINT, Reconnaissance & Threat Intelligence</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-bold uppercase text-[10px] mb-1">
                  {isFr ? "Date d'émission (Optionnel)" : 'Issue Date (Optional)'}
                </label>
                <input
                  type="date"
                  value={issueCertData.issueDate}
                  onChange={(e) => setIssueCertData((prev) => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-bright)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-main)]">
                <button
                  type="button"
                  onClick={() => setShowIssueCertModal(false)}
                  className="px-4 py-2 border border-[var(--border-main)] hover:bg-[var(--bg-input)] text-[var(--text-muted)] rounded-xl transition-colors cursor-pointer"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>{isFr ? 'Émettre Certificat & Badge' : 'Issue Verifiable Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] space-y-4">
            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] pb-2 border-b border-[var(--border-main)] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              {isFr ? 'Paramètres Globaux de la Plateforme' : 'Global Platform Security Configuration'}
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px]">{isFr ? 'Niveau du Pare-feu NoSQL & API' : 'Firewall & WAF Inspection Level'}</label>
                <select
                  value={settings.firewallLevel}
                  onChange={(e) => setSettings({ ...settings, firewallLevel: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                >
                  <option value="Low">Low - Basic Sanitization</option>
                  <option value="Medium font-bold">Medium - Balanced Defense</option>
                  <option value="High">High - Deep NoSQL & XSS Inspection (Recommended)</option>
                  <option value="Paranoid">Paranoid - Strict Rate Limit & Payload Rejection</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <div>
                  <div className="font-bold text-[var(--text-bright)]">{isFr ? 'Limitation de débit CTF' : 'CTF Anti-Brute-Force Rate Limiter'}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{isFr ? 'Empêcher la soumission automatisée de flags' : 'Prevent automated script flag submissions'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.ctfRateLimit}
                  onChange={(e) => setSettings({ ...settings, ctfRateLimit: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <div>
                  <div className="font-bold text-[var(--text-bright)]">{isFr ? 'Double Authentification Obligatoire Admin' : 'Enforce 2FA for Administrators'}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{isFr ? 'Exiger une clé TOTP pour les rôles Admin' : 'Require TOTP security keys for privilege escalation'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.require2FAForAdmin}
                  onChange={(e) => setSettings({ ...settings, require2FAForAdmin: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{isFr ? 'Enregistrer les Paramètres' : 'Save Security Configurations'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: COURSE PAYMENTS & UNLOCK VERIFICATION */}
      {activeTab === 'payments' && (
        <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-main)]">
            <div>
              <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                {isFr ? 'Paiements Crypto & Déblocage des Cours ($10)' : 'Crypto Payments & Course Unlocks ($10 USD)'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                {isFr 
                  ? 'Vérifiez les identifiants de transaction (TxID) soumis par les étudiants et instructeurs pour débloquer les cours d\'experts.'
                  : 'Verify transaction hashes (TxIDs) submitted by students and instructors to unlock expert courses.'}
              </p>
            </div>
            <button
              onClick={loadPayments}
              className="px-3.5 py-2 bg-[var(--bg-input)] hover:bg-[var(--border-subtle)] border border-[var(--border-main)] text-[var(--text-bright)] font-mono text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isFr ? 'Actualiser' : 'Refresh List'}</span>
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] font-mono text-xs">
              {isFr ? 'Aucune demande de paiement enregistrée.' : 'No payment transaction requests submitted yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-main)] text-[var(--text-muted)] uppercase text-[10px]">
                    <th className="p-3">{isFr ? 'Utilisateur' : 'User / Operative'}</th>
                    <th className="p-3">{isFr ? 'Cours Exigeant Déblocage' : 'Course'}</th>
                    <th className="p-3">{isFr ? 'Réseau / Token' : 'Network / Token'}</th>
                    <th className="p-3">{isFr ? 'Montant' : 'Amount'}</th>
                    <th className="p-3">{isFr ? 'ID de Transaction (TxID)' : 'Transaction Hash (TxID)'}</th>
                    <th className="p-3">{isFr ? 'Date' : 'Submitted'}</th>
                    <th className="p-3">{isFr ? 'Statut' : 'Status'}</th>
                    <th className="p-3 text-right">{isFr ? 'Actions' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {payments.map((p) => {
                    const isPending = p.status === 'pending';
                    const isApproved = p.status === 'approved';
                    const isRejected = p.status === 'rejected';

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{p.username}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{p.userEmail || 'No email'}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-cyan-400">{p.courseTitle}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{p.courseId}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            {p.cryptoToken} ({p.network})
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">
                          {p.amountCrypto} (${p.amountUsd})
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <code className="bg-[var(--bg-input)] px-2 py-1 rounded text-[10px] text-slate-300 max-w-[140px] truncate">
                              {p.txId}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(p.txId);
                                setCopiedTxId(p.id);
                                setTimeout(() => setCopiedTxId(''), 2000);
                              }}
                              className="p-1 hover:text-cyan-400 text-[var(--text-muted)] transition-colors cursor-pointer"
                              title="Copy TxID"
                            >
                              {copiedTxId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-[10px] text-[var(--text-muted)]">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3">
                          {isPending && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase">
                              Pending
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase">
                              Approved
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 border border-red-500/30 text-red-400 uppercase">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprovePayment(p.id)}
                                disabled={actionLoading}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>{isFr ? 'Approuver' : 'Approve & Unlock'}</span>
                              </button>
                              <button
                                onClick={() => handleRejectPayment(p.id)}
                                disabled={actionLoading}
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[10px] font-bold transition-all cursor-pointer"
                              >
                                {isFr ? 'Rejeter' : 'Reject'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[var(--text-muted)] italic">
                              {isApproved ? (isFr ? 'Débloqué' : 'Unlocked') : (isFr ? 'Refusé' : 'Declined')}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD NEW OPERATIVE */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              {isFr ? 'Créer un Nouvel Opérateur' : 'Create New User Account'}
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px]">{isFr ? 'Nom d\'utilisateur' : 'Username'}</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="cyber_hacker"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="hacker@cybernexus.org"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px]">{isFr ? 'Mot de passe' : 'Password'}</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px]">{isFr ? 'Rôle Initial' : 'Initial Role'}</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-bright)] font-bold rounded-xl cursor-pointer"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  {isFr ? 'Créer l\'Opérateur' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER LEVEL & XP */}
      {editUserModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditUserModal(null)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              {isFr ? 'Modifier les Métriques Utilisateur' : 'Edit User Metrics'} ({editUserModal.username})
            </h3>

            <form onSubmit={handleSaveUserStats} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px]">{isFr ? 'Niveau' : 'Level'}</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editUserStats.level}
                  onChange={(e) => setEditUserStats({ ...editUserStats, level: parseInt(e.target.value) || 1 })}
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px]">XP (Points d'expérience)</label>
                <input
                  type="number"
                  min="0"
                  value={editUserStats.xp}
                  onChange={(e) => setEditUserStats({ ...editUserStats, xp: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px]">{isFr ? 'Série (Jours)' : 'Streak (Days)'}</label>
                <input
                  type="number"
                  min="0"
                  value={editUserStats.streak}
                  onChange={(e) => setEditUserStats({ ...editUserStats, streak: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[var(--text-muted)] font-bold uppercase text-[10px] text-cyan-400">
                  {isFr ? 'Réinitialiser / Changer le Mot de passe' : 'Reset / Change Password'}
                </label>
                <input
                  type="password"
                  placeholder={isFr ? 'Laissez vide pour conserver le mot de passe actuel' : 'Leave empty to keep current password'}
                  value={editUserStats.newPassword || ''}
                  onChange={(e) => setEditUserStats({ ...editUserStats, newPassword: e.target.value })}
                  className="w-full mt-1 bg-[var(--bg-input)] border border-cyan-500/30 rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetId = editUserModal.id;
                    const targetUsername = editUserModal.username;
                    setEditUserModal(null);
                    handleDeleteUser(targetId, targetUsername);
                  }}
                  className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Supprimer le compte' : 'Delete Account'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditUserModal(null)}
                    className="px-4 py-2 bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-bright)] font-bold rounded-xl cursor-pointer text-xs"
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl cursor-pointer text-xs"
                  >
                    {isFr ? 'Enregistrer' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM DELETE USER */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-red-500/40 max-w-md w-full space-y-4 shadow-2xl relative text-[var(--text-bright)]">
            <button
              onClick={() => setDeleteConfirmUser(null)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-400 font-mono font-bold text-base border-b border-[var(--border-subtle)] pb-3">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              <span>{isFr ? 'Confirmer la suppression' : 'Confirm Account Deletion'}</span>
            </div>

            <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
              {isFr
                ? `Êtes-vous sûr de vouloir supprimer définitivement le compte de `
                : `Are you sure you want to permanently delete user `}
              <strong className="text-red-400 font-bold">{deleteConfirmUser.username}</strong>?
              {isFr
                ? ` Cette action est irréversible.`
                : ` This action cannot be undone.`}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3 font-mono">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 bg-[var(--bg-input)] hover:bg-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-bright)] font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={executeDeleteUser}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-lg shadow-red-600/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{actionLoading ? (isFr ? 'Suppression...' : 'Deleting...') : (isFr ? 'Supprimer définitivement' : 'Delete Permanently')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}