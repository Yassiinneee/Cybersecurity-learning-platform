import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Flag, 
  Award, 
  Plus, 
  Trash2, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  ShieldAlert, 
  X, 
  Search, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Layers, 
  FileText, 
  Sliders, 
  Clock, 
  Filter, 
  MessageSquare, 
  Crown,
  ChevronRight
} from 'lucide-react';

export default function Instructor({ language = 'en', userProfile, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'curriculum', 'challenges', 'students', 'broadcasts'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data states
  const [stats, setStats] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Form Modals
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [newCohort, setNewCohort] = useState({ name: '', description: '' });

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    category: 'Web Application Security',
    duration: '30 mins',
    difficulty: 'Intermediate',
    xpReward: 250,
    description: '',
    content: ''
  });

  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    category: 'Web Security',
    difficulty: 'Medium',
    points: 200,
    flag: '',
    hint: '',
    hintPenalty: 20,
    description: ''
  });

  const [showAwardModal, setShowAwardModal] = useState(null); // student object
  const [awardXp, setAwardXp] = useState(100);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', cohortId: '', message: '' });

  // Filter state for student list
  const [studentSearch, setStudentSearch] = useState('');

  const isFr = language === 'fr';

  const parseError = (data, fallback) => data && data.error ? data.error : fallback;

  // 1. Data Fetching
  const loadStats = async () => {
    try {
      const res = await fetch('/api/instructor/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load instructor stats:', err);
    }
  };

  const loadCohortsAndStudents = async () => {
    try {
      const res = await fetch('/api/instructor/cohorts');
      if (res.ok) {
        const data = await res.json();
        setCohorts(data.cohorts || []);
        setStudents(data.students || []);
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error('Failed to load cohorts/students:', err);
    }
  };

  const loadLessons = async () => {
    try {
      const res = await fetch('/api/instructor/lessons');
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
      }
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };

  const loadChallenges = async () => {
    try {
      const res = await fetch('/api/instructor/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challenges || []);
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
    }
  };

  const reloadAll = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadCohortsAndStudents(), loadLessons(), loadChallenges()]);
    setLoading(false);
  };

  useEffect(() => {
    reloadAll();
  }, []);

  // 2. Handlers
  const handleToggleSelfInstructor = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/instructor/toggle-self-instructor', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `${isFr ? 'Rôle basculé vers' : 'Role toggled to'} ${data.role}` });
        if (onProfileUpdate && data.user) onProfileUpdate(data.user);
        reloadAll();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Role toggle failed') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server connection error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCohort = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/instructor/cohorts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCohort)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Cohorte créée avec succès !' : 'Cohort created successfully!' });
        setShowCohortModal(false);
        setNewCohort({ name: '', description: '' });
        loadCohortsAndStudents();
        loadStats();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to create cohort') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/instructor/lessons/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLesson)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Leçon ajoutée au programme !' : 'Lesson added to curriculum!' });
        setShowLessonModal(false);
        setNewLesson({ title: '', category: 'Web Application Security', duration: '30 mins', difficulty: 'Intermediate', xpReward: 250, description: '', content: '' });
        loadLessons();
        loadStats();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to create lesson') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm(isFr ? 'Supprimer cette leçon du programme ?' : 'Remove this lesson from curriculum?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/instructor/lessons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        loadLessons();
        loadStats();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/instructor/challenges/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChallenge)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Défi CTF déployé avec succès !' : 'CTF Challenge deployed successfully!' });
        setShowChallengeModal(false);
        setNewChallenge({ title: '', category: 'Web Security', difficulty: 'Medium', points: 200, flag: '', hint: '', hintPenalty: 20, description: '' });
        loadChallenges();
        loadStats();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to create challenge') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm(isFr ? 'Décommissionner ce défi CTF ?' : 'Decommission this CTF challenge?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/instructor/challenges/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        loadChallenges();
        loadStats();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAwardStudent = async (e) => {
    e.preventDefault();
    if (!showAwardModal) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/instructor/award-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: showAwardModal.id, bonusXp: awardXp })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setShowAwardModal(null);
        loadCohortsAndStudents();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to award XP') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/instructor/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: isFr ? 'Annonce diffusée à la cohorte !' : 'Announcement broadcasted to cohort!' });
        setShowAnnouncementModal(false);
        setNewAnnouncement({ title: '', cohortId: '', message: '' });
        loadCohortsAndStudents();
      } else {
        setMessage({ type: 'error', text: parseError(data, 'Failed to post announcement') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-[var(--text-main)] font-sans">
      
      {/* 1. TOP TITLE BAR & INSTRUCTOR PORTAL STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
              <GraduationCap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-mono tracking-wider text-[var(--text-bright)] flex items-center gap-3">
                CYBER NEXUS <span className="text-purple-400">{isFr ? 'ESPACE INSTRUCTEUR' : 'INSTRUCTOR PORTAL'}</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {isFr ? 'Gestion des cohortes, création de cours & CTFs, et suivi des étudiants' : 'Curriculum creation, CTF challenge deployment & cohort gradebook analytics'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher & Refresh */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleToggleSelfInstructor}
            disabled={actionLoading}
            title={isFr ? 'Basculer entre Instructeur et Étudiant' : 'Toggle role between Instructor and Student for testing'}
            className="px-3 py-2 bg-[var(--bg-input)] hover:bg-[var(--border-main)] border border-[var(--border-main)] text-xs font-mono font-semibold text-[var(--text-bright)] rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>{isFr ? 'Mode Test Instructeur' : 'Toggle Instructor Role'}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 font-bold uppercase">
              {userProfile?.role || 'Student'}
            </span>
          </button>

          <button
            onClick={reloadAll}
            className="p-2 bg-[var(--bg-input)] hover:bg-[var(--border-main)] border border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-bright)] rounded-xl transition-all cursor-pointer"
            title={isFr ? 'Rafraîchir les données' : 'Refresh All Data'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Étudiants Inscrits' : 'Enrolled Students'}</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-purple-400">
            {stats ? stats.totalStudents : '...'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">{isFr ? 'Apprenants actifs' : 'Active learners'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Cohortes Actives' : 'Active Cohorts'}</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-cyan-400">
            {stats ? stats.activeCohorts : '...'}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1">{isFr ? 'Groupes de classe' : 'Class cohorts'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Leçons Crées' : 'Custom Lessons'}</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-blue-400">
            {stats ? stats.totalCustomLessons : '...'}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-mono mt-1">{isFr ? 'Contenu personnalisé' : 'Published modules'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Défis CTF' : 'CTF Challenges'}</span>
            <Flag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-400">
            {stats ? stats.totalCustomChallenges : '...'}
          </div>
          <span className="text-[10px] text-amber-400 font-mono mt-1">{isFr ? 'Labs déployés' : 'Labs deployed'}</span>
        </div>

        <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono">
            <span>{isFr ? 'Moyenne XP' : 'Avg Student XP'}</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
            {stats ? stats.avgStudentXP.toLocaleString() : '...'}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">{isFr ? 'Progression globale' : 'Class average'}</span>
        </div>
      </div>

      {/* 3. NAVIGATION SUB-TABS */}
      <div className="flex border-b border-[var(--border-main)] space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', icon: Layers, label: isFr ? 'Cohortes & Aperçu' : 'Cohorts & Overview' },
          { id: 'curriculum', icon: BookOpen, label: isFr ? 'Créateur de Cours' : 'Curriculum Builder' },
          { id: 'challenges', icon: Flag, label: isFr ? 'Créateur CTF / Labs' : 'CTF Challenge Builder' },
          { id: 'students', icon: GraduationCap, label: isFr ? 'Roster & Carnet de Notes' : 'Student Gradebook' },
          { id: 'broadcasts', icon: MessageSquare, label: isFr ? 'Annonces & Devoirs' : 'Cohort Broadcasts' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isSelected 
                  ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-sm' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-panel)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'curriculum' && lessons.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[var(--bg-input)] text-[10px] font-mono text-slate-300">
                  {lessons.length}
                </span>
              )}
              {tab.id === 'challenges' && challenges.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px] font-mono text-amber-400">
                  {challenges.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & COHORTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)]">
            <div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                {isFr ? 'Groupes de Cohortes d\'Apprenants' : 'Active Student Cohorts'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {isFr ? 'Organisez vos étudiants en groupes de formation spécifiques.' : 'Group student operatives into structured security bootcamps.'}
              </p>
            </div>

            <button
              onClick={() => setShowCohortModal(true)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isFr ? 'Nouvelle Cohorte' : 'Create Cohort'}</span>
            </button>
          </div>

          {/* Cohort Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cohorts.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-[var(--text-muted)] font-mono border border-[var(--border-main)] rounded-xl bg-[var(--bg-panel)]">
                {isFr ? 'Aucune cohorte configurée.' : 'No active cohorts found.'}
              </div>
            ) : (
              cohorts.map((c) => (
                <div key={c.id} className="bg-[var(--bg-panel)] p-5 rounded-2xl border border-[var(--border-main)] space-y-4 hover:border-purple-500/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-mono font-bold text-base text-[var(--text-bright)]">{c.name}</h4>
                      <p className="text-xs text-[var(--text-muted)] font-mono mt-1">{c.description}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono font-bold text-[10px]">
                      {c.completionRate} {isFr ? 'complété' : 'complete'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-subtle)] font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">{isFr ? 'Étudiants' : 'Students'}</div>
                      <div className="font-bold text-[var(--text-bright)] mt-0.5">{c.studentCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">{isFr ? 'Devoirs' : 'Assignments'}</div>
                      <div className="font-bold text-cyan-400 mt-0.5">{c.activeAssignments}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase">{isFr ? 'Instructeur' : 'Instructor'}</div>
                      <div className="font-bold text-purple-400 mt-0.5">@{c.instructor}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM BUILDER */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)]">
            <div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                {isFr ? 'Module de Création de Cours' : 'Custom Curriculum & Lesson Builder'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {isFr ? 'Rédigez et publiez de nouveaux cours interactifs pour les étudiants.' : 'Draft and publish custom security training modules directly to the student dashboard.'}
              </p>
            </div>

            <button
              onClick={() => setShowLessonModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isFr ? 'Nouveau Cours' : 'Add Custom Lesson'}</span>
            </button>
          </div>

          {/* Lessons List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-[var(--text-muted)] font-mono border border-[var(--border-main)] rounded-xl bg-[var(--bg-panel)]">
                {isFr ? 'Aucun cours personnalisé publié.' : 'No custom lessons published yet.'}
              </div>
            ) : (
              lessons.map((les) => (
                <div key={les.id} className="bg-[var(--bg-panel)] p-5 rounded-2xl border border-[var(--border-main)] space-y-3 relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono text-[10px] font-bold uppercase">
                        {les.category}
                      </span>
                      <h4 className="font-mono font-bold text-base text-[var(--text-bright)] mt-2">{les.title}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteLesson(les.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title={isFr ? 'Supprimer la leçon' : 'Delete lesson'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] font-mono line-clamp-2">{les.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] font-mono text-xs">
                    <span className="text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {les.duration}
                    </span>
                    <span className="text-purple-400 font-bold">+{les.xpReward} XP</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-input)] text-slate-300">
                      {les.difficulty}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CTF CHALLENGE BUILDER */}
      {activeTab === 'challenges' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)]">
            <div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-400" />
                {isFr ? 'Déploiement de Défis CTF & Labs' : 'CTF Challenge & Target Deployment'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {isFr ? 'Créez des flags CTF personnalisés, indices et points pour les exercices pratiques.' : 'Configure custom CTF flag targets, hint penalties, and point rewards for practical labs.'}
              </p>
            </div>

            <button
              onClick={() => setShowChallengeModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isFr ? 'Créer un Défi CTF' : 'Deploy CTF Challenge'}</span>
            </button>
          </div>

          {/* Challenges List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-[var(--text-muted)] font-mono border border-[var(--border-main)] rounded-xl bg-[var(--bg-panel)]">
                {isFr ? 'Aucun défi CTF déployé.' : 'No custom CTF challenges deployed yet.'}
              </div>
            ) : (
              challenges.map((ch) => (
                <div key={ch.id} className="bg-[var(--bg-panel)] p-5 rounded-2xl border border-[var(--border-main)] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold uppercase">
                        {ch.category}
                      </span>
                      <h4 className="font-mono font-bold text-base text-[var(--text-bright)] mt-2">{ch.title}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteChallenge(ch.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title={isFr ? 'Supprimer le défi' : 'Delete challenge'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] font-mono">{ch.description}</p>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{isFr ? 'Flag Confidentiel :' : 'Target Secret Flag:'}</div>
                    <div className="text-emerald-400 font-mono font-bold">{ch.flag}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 font-mono text-xs text-[var(--text-muted)]">
                    <span>🏆 {ch.points} PTS</span>
                    <span>💡 Hint: -{ch.hintPenalty} PTS</span>
                    <span className="text-cyan-400 font-bold">{ch.solvesCount} {isFr ? 'résolutions' : 'solves'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT GRADEBOOK */}
      {activeTab === 'students' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={isFr ? 'Rechercher un étudiant par nom ou email...' : 'Search student roster by name or email...'}
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl py-2 pl-10 pr-4 text-xs font-mono text-[var(--text-bright)] focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="text-xs font-mono text-[var(--text-muted)]">
              {filteredStudents.length} {isFr ? 'étudiants dans le registre' : 'students in active roster'}
            </div>
          </div>

          <div className="bg-[var(--bg-panel)] rounded-2xl border border-[var(--border-main)] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[var(--bg-input)] text-[var(--text-muted)] uppercase text-[10px] tracking-wider border-b border-[var(--border-main)]">
                  <tr>
                    <th className="p-4">{isFr ? 'Étudiant' : 'Student Operative'}</th>
                    <th className="p-4">{isFr ? 'Niveau & XP' : 'Level & XP'}</th>
                    <th className="p-4">{isFr ? 'Labs Complétés' : 'Labs Solved'}</th>
                    <th className="p-4">{isFr ? 'CTFs Validés' : 'CTFs Claimed'}</th>
                    <th className="p-4">{isFr ? 'Série' : 'Streak'}</th>
                    <th className="p-4 text-right">{isFr ? 'Action Instructeur' : 'Instructor Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                        {isFr ? 'Aucun étudiant trouvé.' : 'No students matched the query.'}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-[var(--bg-input)]/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[var(--text-bright)]">{st.username}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{st.email}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-[var(--text-bright)]">LVL {st.level}</span>
                          <span className="text-[10px] text-purple-400 ml-2">({st.xp} XP)</span>
                        </td>
                        <td className="p-4 text-blue-400 font-bold">{st.completedLabsCount} labs</td>
                        <td className="p-4 text-amber-400 font-bold">{st.solvedCtfsCount} ctfs</td>
                        <td className="p-4 text-emerald-400">🔥 {st.streak}d</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setShowAwardModal(st)}
                            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ml-auto text-[11px]"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{isFr ? 'Accorder Bonus XP' : 'Award Bonus XP'}</span>
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

      {/* TAB 5: BROADCASTS */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-main)]">
            <div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-bright)] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                {isFr ? 'Diffusion d\'Annonces & Devoirs' : 'Cohort Announcements & Assignments'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {isFr ? 'Envoyez des messages d\'orientation et des alertes de devoirs à vos cohortes.' : 'Send direct guidelines, exam dates, or CTF competition notices.'}
              </p>
            </div>

            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{isFr ? 'Diffuser un Message' : 'Post Broadcast'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] font-mono border border-[var(--border-main)] rounded-xl bg-[var(--bg-panel)]">
                {isFr ? 'Aucune annonce diffusée.' : 'No announcements published yet.'}
              </div>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="bg-[var(--bg-panel)] p-5 rounded-2xl border border-[var(--border-main)] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono font-bold text-base text-[var(--text-bright)]">{ann.title}</h4>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{ann.timestamp}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed">{ann.message}</p>
                  <div className="text-[10px] font-mono text-purple-400 pt-1">
                    {isFr ? 'Par' : 'By'} @{ann.author} • Cohort: {ann.cohortId}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE COHORT */}
      {showCohortModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setShowCohortModal(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              {isFr ? 'Créer une Nouvelle Cohorte' : 'Create New Cohort'}
            </h3>
            <form onSubmit={handleCreateCohort} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">{isFr ? 'Nom de la cohorte' : 'Cohort Name'}</label>
                <input
                  type="text"
                  required
                  value={newCohort.name}
                  onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
                  placeholder="Ethical Hacking 2026 Cohort"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Description</label>
                <textarea
                  rows="3"
                  value={newCohort.description}
                  onChange={(e) => setNewCohort({ ...newCohort, description: e.target.value })}
                  placeholder={isFr ? 'Objectifs pédagogiques et périmètre de formation...' : 'Cohort goals and curriculum scope...'}
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowCohortModal(false)} className="px-4 py-2 bg-[var(--bg-input)] text-[var(--text-muted)] font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Créer la Cohorte' : 'Create Cohort'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD LESSON */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] max-w-lg w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowLessonModal(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              {isFr ? 'Créer un Cours Personnalisé' : 'Draft Custom Lesson'}
            </h3>
            <form onSubmit={handleCreateLesson} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">{isFr ? 'Titre du cours' : 'Lesson Title'}</label>
                <input
                  type="text"
                  required
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  placeholder="Advanced Reverse Engineering"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Category</label>
                  <select
                    value={newLesson.category}
                    onChange={(e) => setNewLesson({ ...newLesson, category: e.target.value })}
                    className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Web Application Security">Web Application Security</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Cryptography">Cryptography</option>
                    <option value="Reverse Engineering">Reverse Engineering</option>
                    <option value="SOC Operations">SOC Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">XP Reward</label>
                  <input
                    type="number"
                    value={newLesson.xpReward}
                    onChange={(e) => setNewLesson({ ...newLesson, xpReward: e.target.value })}
                    className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Description</label>
                <input
                  type="text"
                  required
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  placeholder="Overview of lesson objectives..."
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Content (Markdown)</label>
                <textarea
                  rows="4"
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                  placeholder="### Material Header&#10;Explain technical concept here..."
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-blue-500 font-mono"
                ></textarea>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowLessonModal(false)} className="px-4 py-2 bg-[var(--bg-input)] text-[var(--text-muted)] font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Publier le cours' : 'Publish Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CTF CHALLENGE */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] max-w-lg w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowChallengeModal(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
              <Flag className="w-5 h-5 text-amber-400" />
              {isFr ? 'Créer un Défi CTF' : 'Deploy CTF Challenge'}
            </h3>
            <form onSubmit={handleCreateChallenge} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">{isFr ? 'Titre du défi' : 'Challenge Title'}</label>
                <input
                  type="text"
                  required
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  placeholder="Buffer Overflow Exploit 101"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Category</label>
                  <select
                    value={newChallenge.category}
                    onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                    className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-amber-500"
                  >
                    <option value="Web Security">Web Security</option>
                    <option value="Binary Exploitation">Binary Exploitation</option>
                    <option value="Cryptography">Cryptography</option>
                    <option value="Forensics">Forensics</option>
                  </select>
                </div>
                <div>
                  <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Points</label>
                  <input
                    type="number"
                    value={newChallenge.points}
                    onChange={(e) => setNewChallenge({ ...newChallenge, points: e.target.value })}
                    className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Secret Flag</label>
                <input
                  type="text"
                  required
                  value={newChallenge.flag}
                  onChange={(e) => setNewChallenge({ ...newChallenge, flag: e.target.value })}
                  placeholder="FLAG{your_secret_flag_here}"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-amber-500 font-mono text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Hint</label>
                <input
                  type="text"
                  value={newChallenge.hint}
                  onChange={(e) => setNewChallenge({ ...newChallenge, hint: e.target.value })}
                  placeholder="Check the register offset..."
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Instructions & Description</label>
                <textarea
                  rows="3"
                  required
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  placeholder="Analyze the binary memory address..."
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowChallengeModal(false)} className="px-4 py-2 bg-[var(--bg-input)] text-[var(--text-muted)] font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Déployer le défi' : 'Deploy CTF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AWARD BONUS XP */}
      {showAwardModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setShowAwardModal(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              {isFr ? 'Accorder un Bonus XP' : 'Award Bonus XP'} ({showAwardModal.username})
            </h3>
            <form onSubmit={handleAwardStudent} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Bonus XP</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={awardXp}
                  onChange={(e) => setAwardXp(parseInt(e.target.value) || 50)}
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowAwardModal(null)} className="px-4 py-2 bg-[var(--bg-input)] text-[var(--text-muted)] font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Accorder les points' : 'Grant XP Bonus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST ANNOUNCEMENT */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-panel)] p-6 rounded-2xl border border-[var(--border-main)] max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setShowAnnouncementModal(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-mono font-bold text-base text-[var(--text-bright)] flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              {isFr ? 'Diffuser une Annonce' : 'Post Broadcast Message'}
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">{isFr ? 'Titre de l\'annonce' : 'Title'}</label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="🚨 Midterm Exam Instructions"
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[var(--text-muted)] uppercase text-[10px] font-bold">Message</label>
                <textarea
                  rows="3"
                  required
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  placeholder="Enter details for student cohort..."
                  className="w-full mt-1 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl px-3 py-2 text-[var(--text-bright)] focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="px-4 py-2 bg-[var(--bg-input)] text-[var(--text-muted)] font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer">
                  {isFr ? 'Diffuser' : 'Publish Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
