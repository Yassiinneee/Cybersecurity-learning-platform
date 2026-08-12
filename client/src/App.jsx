import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { io } from 'socket.io-client';
import { 
  Terminal as TerminalIcon, Shield, ShieldAlert, Award, Play, BookOpen, 
  CheckCircle, XCircle, ChevronRight, Lock, Unlock, HelpCircle, 
  Trophy, User, Search, Send, Loader2, Sparkles, ExternalLink, 
  ArrowRight, Copy, Check, Info, FileText, Radar, Database, Globe, Key, Eye, Sword, Zap, Clock, AlertCircle, RefreshCcw,
  Printer, Download, Share2, Home, Mail, Sun, Moon, Crown, GraduationCap, Settings, MapPin, Calendar,
  Bell, BellOff, Volume2, VolumeX, Trash2, Filter, MessageSquare, Radio, QrCode
} from 'lucide-react';
import { downloadCertificatePDF } from './utils/pdfGenerator';
import { ALL_LEARNING_PATHS, ALL_LABS, ALL_CTFS, ALL_ACHIEVEMENTS, INITIAL_PROFILE, MOCK_LEADERBOARD } from './data';
import InteractiveDiagram from './components/InteractiveDiagram';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/about';
import Contact from './components/contact';
import Admin from './components/Admin';
import Instructor from './components/Instructor';
import Live from './components/Live';
import SettingsModal from './components/SettingsModal';
import PaymentModal from './components/PaymentModal';
import { t } from './translations';
import './App.css';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('cyber_nexus_theme') || 'dark');

  // Language State (en / fr)
  const [language, setLanguage] = useState(() => localStorage.getItem('cyber_nexus_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('cyber_nexus_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cyber_nexus_lang', language);
  }, [language]);

  const tr = (key, fallback) => t(language, key, fallback);
  const isFr = language === 'fr';

  // Navigation & Profile States
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) return hash;
    const saved = localStorage.getItem('cyber_nexus_active_tab');
    if (saved) return saved;
    return 'home';
  });

  // Sync activeTab with localStorage & URL hash for page refresh persistence
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('cyber_nexus_active_tab', activeTab);
      if (window.location.hash !== `#${activeTab}`) {
        window.history.replaceState(null, '', `#${activeTab}`);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeHackerCount, setActiveHackerCount] = useState(1);
  const [realtimeFeed, setRealtimeFeed] = useState([]);
  const [socketChatText, setSocketChatText] = useState('');
  const [feedFilter, setFeedFilter] = useState('all'); // 'all', 'chat', 'alert', 'success', 'command'
  const [intelNotificationsEnabled, setIntelNotificationsEnabled] = useState(() => {
    return localStorage.getItem('cyber_nexus_intel_notifs') !== 'false';
  });
  const [intelSoundEnabled, setIntelSoundEnabled] = useState(() => {
    return localStorage.getItem('cyber_nexus_intel_sound') !== 'false';
  });
  const [activeToastNotif, setActiveToastNotif] = useState(null);
  
  const socketRef = useRef(null);
  const intelFeedEndRef = useRef(null);
  const intelNotifRef = useRef(intelNotificationsEnabled);
  const intelSoundRef = useRef(intelSoundEnabled);

  useEffect(() => {
    intelNotifRef.current = intelNotificationsEnabled;
    localStorage.setItem('cyber_nexus_intel_notifs', intelNotificationsEnabled ? 'true' : 'false');
  }, [intelNotificationsEnabled]);

  useEffect(() => {
    intelSoundRef.current = intelSoundEnabled;
    localStorage.setItem('cyber_nexus_intel_sound', intelSoundEnabled ? 'true' : 'false');
  }, [intelSoundEnabled]);

  const playIntelBeep = (type = 'default') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = (type === 'alert' || type === 'success') ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime((type === 'alert' || type === 'success') ? 880 : 587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Audio autoplay policy catch
    }
  };

  useEffect(() => {
    if (activeToastNotif) {
      const timer = setTimeout(() => {
        setActiveToastNotif(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToastNotif]);

  // Auto-scroll Live Intel Feed to bottom when new logs arrive or filter changes
  useEffect(() => {
    if (intelFeedEndRef.current) {
      intelFeedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [realtimeFeed, feedFilter]);

  useEffect(() => {
    // Connect to Socket.io
    socketRef.current = io();

    socketRef.current.on('node_count_update', (count) => {
      setActiveHackerCount(count);
    });

    socketRef.current.on('initial_feed', (feed) => {
      setRealtimeFeed(feed);
    });

    socketRef.current.on('security_feed_update', (newLog) => {
      setRealtimeFeed((prev) => {
        const next = [...prev, newLog];
        return next.slice(-50); // keep last 50 logs
      });

      if (intelNotifRef.current) {
        setActiveToastNotif({
          id: Date.now(),
          type: newLog.type || 'info',
          time: newLog.time || new Date().toLocaleTimeString(),
          message: newLog.message,
          username: newLog.username
        });

        if (intelSoundRef.current) {
          playIntelBeep(newLog.type);
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('cyber_nexus_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PROFILE; }
    }
    return INITIAL_PROFILE;
  });

  // State persistence
  useEffect(() => {
    localStorage.setItem('cyber_nexus_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Check backend session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUserProfile(data.user);
            setIsAuthenticated(true);
            setShowAuthScreen(false);
            setTerminalHistory((t) => [
              ...t,
              { text: `💚 Established secure persistent tunnel for user session: ${data.user.username}`, type: 'success' }
            ]);
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
    checkSession();
  }, []);

  // UI state for learning path details
  const [selectedPath, setSelectedPath] = useState(ALL_LEARNING_PATHS[0]);
  const [selectedLesson, setSelectedLesson] = useState(ALL_LEARNING_PATHS[0].modules[0].lessons[0]);
  const [coursePage, setCoursePage] = useState(1);
  const [paymentModalCourse, setPaymentModalCourse] = useState(null);
  const [userPayments, setUserPayments] = useState([]);

  // Fetch payments for current user to track pending verification
  const loadUserPayments = async () => {
    if (!userProfile?.username) return;
    try {
      const res = await fetch(`/api/payments/user/${userProfile.username}`);
      if (res.ok) {
        const data = await res.json();
        setUserPayments(data.payments || []);
      }
    } catch (err) {
      console.warn("Failed to load user payments:", err);
    }
  };

  useEffect(() => {
    loadUserPayments();
  }, [userProfile?.username]);

  // Check if user is Admin
  const isAdminUser =
    userProfile?.role === "Admin" ||
    userProfile?.username === "admin" ||
    userProfile?.username === "yassinekalthoum94" ||
    userProfile?.username === "yassineklt" ||
    userProfile?.username === "yassineklt94" ||
    (userProfile?.email && ["yassinekalthoum94@gmail.com", "yassineklt94@gmail.com", "admin@cybernexus.org"].includes(userProfile.email.toLowerCase()));

  // Check if course is unlocked for current user
  const isCourseUnlocked = (course) => {
    if (!course) return false;
    if (!course.isExpert) return true; // Standard paths are unlocked for everyone
    if (isAdminUser) return true; // Admin ALWAYS sees full details & unlocked course
    const unlockedList = userProfile?.unlockedCourses || [];
    return unlockedList.includes(course.id);
  };
  
  // UI state for active quiz in a lesson
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [quizTimer, setQuizTimer] = useState(300); // 5 min timer
  const [timerActive, setTimerActive] = useState(false);
  const [notesText, setNotesText] = useState('');

  // UI state for Labs
  const [selectedLab, setSelectedLab] = useState(ALL_LABS[0]);
  const [labAnswers, setLabAnswers] = useState({});
  const [labDeployed, setLabDeployed] = useState({});
  const [labDeploying, setLabDeploying] = useState({});
  const [labLogs, setLabLogs] = useState([]);

  // UI state for CTF
  const [ctfSelected, setCtfSelected] = useState(null);
  const [ctfSubmissions, setCtfSubmissions] = useState({});
  const [ctfMessage, setCtfMessage] = useState({});
  const [unlockedHints, setUnlockedHints] = useState({});

  // UI state for Kali Terminal Simulator
  const [terminalHistory, setTerminalHistory] = useState([
    { text: 'CyberNexus Kali Emulator v4.2.0 [Simulation Environment]', type: 'success' },
    { text: 'Type "help" to list available cyber utility tools and navigation commands.', type: 'output' },
    { text: 'Current host: root@nexus-kali:~', type: 'output' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalCwd, setTerminalCwd] = useState('/home/student');
  const [terminalPrompt, setTerminalPrompt] = useState('root@nexus-kali:~#');
  
  // Terminal connection sessions (e.g. nested ftp or ssh session)
  const [nestedSession, setNestedSession] = useState({ type: null });

  // UI state for AI Cyber Assistant
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'assistant', content: "Hello! I am Nexus AI, your virtual cyber tutor. I can assist you in understanding injection flows, interpreting system logs, explaining Nmap parameters, or analyzing packet records. Ask me anything, or pick a guide option below!", timestamp: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Verification ID Verification State
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [holoActive, setHoloActive] = useState(true);
  const [certTheme, setCertTheme] = useState('cyberpunk');

  // States for New Sections (Home, Contact, About, Lessons)
  const [lessonsSearchQuery, setLessonsSearchQuery] = useState('');
  const [lessonsCategoryFilter, setLessonsCategoryFilter] = useState('all');
  const [lessonsDifficultyFilter, setLessonsDifficultyFilter] = useState('all');
  const [lessonsStatusFilter, setLessonsStatusFilter] = useState('all');

  // Skill Radar interactive states
  const [radarStyle, setRadarStyle] = useState('neon'); // 'neon', 'tactical', 'aura'
  const [radarComparison, setRadarComparison] = useState('none'); // 'none', 'pentester', 'soc_analyst', 'hax0r_god'
  const [hoveredAxis, setHoveredAxis] = useState(null);

  // Copied alert feedback
  const [copiedText, setCopiedText] = useState('');

  // Refs
  const terminalBottomRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Scroll to bottom of terminal/chat
  useEffect(() => {
    if (activeTab === 'terminal' || activeTab === 'labs') {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, activeTab]);

  useEffect(() => {
    if (activeTab === 'assistant') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Quiz Timer countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && quizTimer > 0) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev - 1);
      }, 1000);
    } else if (quizTimer === 0) {
      setTimerActive(false);
      handleQuizSubmit(true); // Auto-submit
    }
    return () => clearInterval(interval);
  }, [timerActive, quizTimer]);

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Listen for Google OAuth successful postMessage authentication from popup
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      const origin = event.origin;
      // Allow from current origin (dev run.app / localhost / shared run.app)
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.user) {
        const oauthUser = event.data.user;
        setUserProfile((prev) => ({
          ...prev,
          username: oauthUser.username,
          level: oauthUser.level || prev.level,
          xp: oauthUser.xp || prev.xp,
          role: oauthUser.role || prev.role,
          googleConnected: true,
        }));
        
        setIsAuthenticated(true);
        setShowAuthScreen(false);
        setActiveTab('home');

        setTerminalHistory((t) => [
          ...t,
          { text: `🔑 GOOGLE OAUTH SUCCESS: Logged in as ${oauthUser.username}`, type: 'success' }
        ]);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const handleGoogleConnect = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      "/api/auth/google",
      "google_oauth_popup",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'X-CSRF-Token': getCookie('XSRF-TOKEN')
        }
      });
      setUserProfile(INITIAL_PROFILE);
      setIsAuthenticated(false);
      setShowAuthScreen(true);
      setAuthMode('login');
      setActiveTab('home');
      setTerminalHistory((t) => [...t, { text: `🔌 Connection closed. Session terminated.`, type: 'info' }]);
    } catch (err) {
      console.error(err);
    }
  };

  // Gamification: helper to grant XP and unlock achievements
  const awardXp = (amount, reason) => {
    setUserProfile((prev) => {
      const newXp = prev.xp + amount;
      const nextLevelThreshold = prev.level * 1000;
      let newLevel = prev.level;
      let extraXp = newXp;

      if (extraXp >= nextLevelThreshold) {
        newLevel += 1;
        extraXp = extraXp - nextLevelThreshold;
      }

      // Check achievements as side-effect of activity
      const updatedAchievements = [...prev.unlockedAchievements];
      const newlyUnlocked = [];

      // script kiddie: 250+ total cumulative XP
      if (newXp >= 250 && !updatedAchievements.includes('ach-script-kiddie')) {
        updatedAchievements.push('ach-script-kiddie');
        newlyUnlocked.push('Script Kiddie');
      }

      // first blood: completing any lesson or lab task
      if (!updatedAchievements.includes('ach-first-blood')) {
        updatedAchievements.push('ach-first-blood');
        newlyUnlocked.push('First Blood');
      }

      // Add feedback outputs to system
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach((ach) => {
          setTerminalHistory((t) => [
            ...t,
            { text: `🏆 ACHIEVEMENT UNLOCKED: ${ach}! You earned a cyber badge and bonus XP!`, type: 'success' }
          ]);
        });
      }

      return {
        ...prev,
        xp: extraXp,
        level: newLevel,
        unlockedAchievements: updatedAchievements
      };
    });

    setTerminalHistory((t) => [
      ...t,
      { text: `[+] Received +${amount} XP: ${reason}`, type: 'success' }
    ]);
  };

  // Handler when selecting a lesson
  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizTimer(300);
    setTimerActive(false);
    setNotesText(userProfile.savedNotes[lesson.id] || '');
  };

  // Start the Quiz Timer
  const handleStartQuiz = () => {
    setQuizTimer(300);
    setTimerActive(true);
  };

  // Submit dynamic quiz
  const handleQuizSubmit = (isTimeOut = false) => {
    if (!selectedLesson) return;
    setTimerActive(false);

    let score = 0;
    const questions = selectedLesson.quiz;

    questions.forEach((q) => {
      const ans = quizAnswers[q.id];
      if (q.type === 'mcq' || q.type === 'fill-blank' || q.type === 'log-analysis') {
        if (typeof ans === 'string' && ans.trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
          score += 1;
        }
      } else if (q.type === 'match') {
        // Simple mock validation for interactive structures
        if (ans === 'match-correct') {
          score += 1;
        }
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const percent = (score / questions.length) * 100;
    if (percent >= 70) {
      // Completed lesson
      if (!userProfile.completedLessons.includes(selectedLesson.id)) {
        setUserProfile((prev) => ({
          ...prev,
          completedLessons: [...prev.completedLessons, selectedLesson.id]
        }));
        awardXp(selectedLesson.xpReward, `Completed Lesson: ${selectedLesson.title}`);

        // Check if all lessons of a course/path are completed to issue certificate verify code
        if (selectedPath) {
          const allLessonIds = selectedPath.modules.flatMap(m => m.lessons.map(l => l.id));
          const completedInPath = allLessonIds.every(id => 
            id === selectedLesson.id || userProfile.completedLessons.includes(id)
          );
          if (completedInPath) {
            const certCode = `CN-${userProfile.username}-${selectedPath.slug}`;
            setUserProfile((prev) => ({
              ...prev,
              certificateVerifyId: certCode,
              unlockedAchievements: prev.unlockedAchievements.includes('ach-certified-pro') 
                ? prev.unlockedAchievements 
                : [...prev.unlockedAchievements, 'ach-certified-pro']
            }));
            setTerminalHistory((t) => [
              ...t,
              { text: `🎓 CERTIFICATE ISSUED: You completed the entire course track! Verification ID: ${certCode}`, type: 'success' }
            ]);
          }
        }
      }
    }
  };

  // Transmit message handler was removed to components/contact.jsx

  // Save lesson note
  const handleSaveNotes = () => {
    if (!selectedLesson) return;
    setUserProfile((prev) => {
      const updatedNotes = { ...prev.savedNotes, [selectedLesson.id]: notesText };
      return { ...prev, savedNotes: updatedNotes };
    });
    setTerminalHistory((t) => [
      ...t,
      { text: `[+] Saved research notes for: ${selectedLesson.title}`, type: 'success' }
    ]);
  };

  // Deploy Lab simulation
  const handleDeployLab = (labId) => {
    setLabDeploying((prev) => ({ ...prev, [labId]: true }));
    setLabLogs([
      `[*] Requesting virtual laboratory allocation for ${labId}...`,
      `[+] Allocating cloud environment wrapper under student token...`,
      `[+] Isolated container starting up on sub-network 10.10.x.x`,
      `[*] Mounting storage points & launching microservice ports...`
    ]);

    setTimeout(() => {
      setLabDeploying((prev) => ({ ...prev, [labId]: false }));
      setLabDeployed((prev) => ({ ...prev, [labId]: true }));
      setLabLogs((prev) => [
        ...prev,
        `[+] Microservices active! Target host is now up.`,
        `[+] Vulnerable Services configured on target IP.`,
        `[!] SYSTEM OPERATIONAL. Kali Terminal ready.`
      ]);
      setTerminalHistory((t) => [
        ...t,
        { text: `[+] Dynamic lab deployed: Target IP active. Hack away inside the terminal!`, type: 'success' }
      ]);
    }, 2500);
  };

  // Verify custom lab tasks via flag input
  const handleSubmitLabTask = (labId, taskId, flagInput) => {
    const lab = ALL_LABS.find((l) => l.id === labId);
    if (!lab) return;

    const task = lab.tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (flagInput.trim() === task.flag) {
      const answerKey = `${labId}-${taskId}`;
      if (labAnswers[answerKey] === 'CORRECT') return; // already solved

      setLabAnswers((prev) => ({ ...prev, [answerKey]: 'CORRECT' }));
      
      // Update user complete history
      const allTasksSolved = lab.tasks.every(t => 
        t.id === taskId || labAnswers[`${labId}-${t.id}`] === 'CORRECT'
      );

      if (allTasksSolved && !userProfile.completedLabs.includes(labId)) {
        setUserProfile((prev) => ({
          ...prev,
          completedLabs: [...prev.completedLabs, labId],
          unlockedAchievements: labId === 'lab-nmap-basics' && !prev.unlockedAchievements.includes('ach-port-explorer')
            ? [...prev.unlockedAchievements, 'ach-port-explorer']
            : prev.unlockedAchievements
        }));
        awardXp(lab.xpReward, `Completed Lab Sandbox: ${lab.title}`);
        if (socketRef.current) {
          socketRef.current.emit("solve_challenge", {
            username: userProfile.username,
            challengeName: `Completed Lab: ${lab.title}`,
            xp: lab.xpReward
          });
        }
      } else {
        awardXp(task.xp, `Solved Lab Task: ${task.title}`);
        if (socketRef.current) {
          socketRef.current.emit("solve_challenge", {
            username: userProfile.username,
            challengeName: `Lab: ${lab.title} - ${task.title}`,
            xp: task.xp
          });
        }
      }

      setTerminalHistory((t) => [
        ...t,
        { text: `[+] Correct Flag submitted for task "${task.title}"! Earned ${task.xp} XP.`, type: 'success' }
      ]);
    } else {
      setTerminalHistory((t) => [
        ...t,
        { text: `[-] Flag verification failed for task: "${task.title}". Try inspecting logs or hint!`, type: 'error' }
      ]);
    }
  };

  // Submit CTF challenge flag
  const handleSubmitCtf = (ctf) => {
    const userInput = ctfSubmissions[ctf.id] || '';
    if (userInput.trim() === ctf.flag) {
      if (userProfile.solvedCtfs.includes(ctf.id)) {
        setCtfMessage((prev) => ({ ...prev, [ctf.id]: { text: 'Already Solved!', type: 'success' } }));
        return;
      }

      setUserProfile((prev) => ({
        ...prev,
        solvedCtfs: [...prev.solvedCtfs, ctf.id],
        unlockedAchievements: !prev.unlockedAchievements.includes('ach-ctf-champion') 
          ? [...prev.unlockedAchievements, 'ach-ctf-champion'] 
          : prev.unlockedAchievements
      }));

      awardXp(ctf.points, `Solved CTF Flag: ${ctf.title}`);
      
      if (socketRef.current) {
        socketRef.current.emit("solve_challenge", {
          username: userProfile.username,
          challengeName: `CTF Flag Captured: ${ctf.title}`,
          xp: ctf.points
        });
      }

      setCtfMessage((prev) => ({ ...prev, [ctf.id]: { text: 'SUCCESS! Correct flag submitted!', type: 'success' } }));
    } else {
      setCtfMessage((prev) => ({ ...prev, [ctf.id]: { text: 'INCORRECT FLAG. Try again!', type: 'error' } }));
    }
  };

  // Reveal CTF hint (deducts 10 XP)
  const handleRevealCtfHint = (ctfId) => {
    if (unlockedHints[ctfId]) return;
    setUnlockedHints((prev) => ({ ...prev, [ctfId]: true }));
    setUserProfile((prev) => ({
      ...prev,
      xp: Math.max(0, prev.xp - 10)
    }));
    setTerminalHistory((t) => [
      ...t,
      { text: `[!] Decrypted intelligence briefing. Spent -10 XP to unlock hint for CTF.`, type: 'error' }
    ]);
  };

  // Kali Terminal Command Evaluator Engine
  const executeTerminalCommand = (rawCommand) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    // Add to input logs history
    setTerminalHistory((t) => [...t, { text: `${terminalPrompt} ${cmd}`, type: 'input' }]);
    setTerminalInput('');

    // Socket.io: Broadcast terminal command to the live security feed
    if (socketRef.current) {
      socketRef.current.emit("terminal_command", { username: userProfile.username, command: cmd });
    }

    // Split args
    const parts = cmd.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // --- Nested Sessions Handler (FTP/SSH password checks) ---
    if (nestedSession.type === 'ftp' && nestedSession.awaitingPass) {
      // In FTP session, checking login
      setTerminalHistory((t) => [
        ...t,
        { text: `331 Please specify the password.`, type: 'output' },
        { text: `230 Login successful.`, type: 'success' },
        { text: `Remote system type is UNIX.`, type: 'output' }
      ]);
      setNestedSession({ type: 'ftp', ip: nestedSession.ip, username: nestedSession.username, awaitingPass: false });
      setTerminalPrompt('ftp> ');
      return;
    }

    if (nestedSession.type === 'ftp') {
      if (baseCmd === 'ls' || baseCmd === 'dir') {
        setTerminalHistory((t) => [
          ...t,
          { text: `227 Entering Passive Mode (10,10,12,8,195,14).`, type: 'output' },
          { text: `-rw-r--r--    1 ftp      ftp            31 Jun 25 02:30 flag.txt`, type: 'output' },
          { text: `226 Directory send OK.`, type: 'success' }
        ]);
      } else if (baseCmd === 'cat' || baseCmd === 'get') {
        if (args[0] === 'flag.txt') {
          setTerminalHistory((t) => [
            ...t,
            { text: `200 PORT command successful.`, type: 'output' },
            { text: `150 Opening BINARY mode data connection for flag.txt.`, type: 'output' },
            { text: `THM{nmap_recon_specialist_2026}`, type: 'success' },
            { text: `226 Transfer complete.`, type: 'success' }
          ]);
        } else {
          setTerminalHistory((t) => [...t, { text: `550 File not found.`, type: 'error' }]);
        }
      } else if (baseCmd === 'bye' || baseCmd === 'exit' || baseCmd === 'quit') {
        setTerminalHistory((t) => [...t, { text: `221 Goodbye.`, type: 'output' }]);
        setNestedSession({ type: null });
        setTerminalPrompt('root@nexus-kali:~#');
      } else {
        setTerminalHistory((t) => [
          ...t,
          { text: `500 Unknown command. Available: ls, get, cat, quit`, type: 'error' }
        ]);
      }
      return;
    }

    if (nestedSession.type === 'ssh' && nestedSession.awaitingPass) {
      if (nestedSession.ip === '10.10.30.55') {
        setTerminalHistory((t) => [
          ...t,
          { text: `Welcome to Ubuntu 20.04.5 LTS (GNU/Linux 5.4.0-117-generic)`, type: 'success' },
          { text: `Last login: Mon Jul 20 03:30:16 2026 from 10.10.1.88`, type: 'output' },
          { text: `student@sandbox-node:~$`, type: 'success' }
        ]);
        setNestedSession({ type: 'ssh', ip: '10.10.30.55', username: 'student', awaitingPass: false });
        setTerminalPrompt('student@sandbox-node:~$ ');
      } else if (cmd === 'cybernexus_elite') {
        setTerminalHistory((t) => [
          ...t,
          { text: `Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.4.0-104-generic)`, type: 'success' },
          { text: `Last login: Thu Jun 25 02:02:11 2026 from 10.10.1.55`, type: 'output' },
          { text: `security_officer@officer-node:~$`, type: 'success' }
        ]);
        setNestedSession({ type: 'ssh', ip: nestedSession.ip, username: 'security_officer', awaitingPass: false });
        setTerminalPrompt('security_officer@officer-node:~$ ');
      } else {
        setTerminalHistory((t) => [
          ...t,
          { text: `Permission denied, please try again.`, type: 'error' },
          { text: `root@nexus-kali:~#`, type: 'output' }
        ]);
        setNestedSession({ type: null });
        setTerminalPrompt('root@nexus-kali:~#');
      }
      return;
    }

    if (nestedSession.type === 'ssh') {
      if (nestedSession.ip === '10.10.30.55') {
        if (baseCmd === 'ls') {
          setTerminalHistory((t) => [...t, { text: `challenges/    notes/`, type: 'output' }]);
        } else if (baseCmd === 'find') {
          if (cmd.includes('-perm -4000') || cmd.includes('-perm /4000')) {
            setTerminalHistory((t) => [
              ...t,
              { text: `/usr/lib/openssh/ssh-keysign`, type: 'output' },
              { text: `/usr/lib/dbus-1.0/dbus-daemon-launch-helper`, type: 'output' },
              { text: `/usr/lib/eject/dmcrypt-get-device`, type: 'output' },
              { text: `/usr/bin/chsh`, type: 'output' },
              { text: `/usr/bin/gpasswd`, type: 'output' },
              { text: `/usr/bin/passwd`, type: 'output' },
              { text: `/usr/bin/find`, type: 'success' },
              { text: `/usr/bin/chfn`, type: 'output' },
              { text: `/bin/mount`, type: 'output' },
              { text: `/bin/umount`, type: 'output' }
            ]);
          } else if (cmd.includes('cat') && cmd.includes('/root/flag.txt')) {
            setTerminalHistory((t) => [...t, { text: `THM{suid_priv_esc_conquered_448}`, type: 'success' }]);
          } else {
            setTerminalHistory((t) => [...t, { text: `Usage: find [path] [conditions]`, type: 'output' }]);
          }
        } else if (baseCmd === '/usr/bin/find') {
          if (cmd.includes('cat') && cmd.includes('/root/flag.txt')) {
            setTerminalHistory((t) => [...t, { text: `THM{suid_priv_esc_conquered_448}`, type: 'success' }]);
          } else if (cmd.includes('whoami')) {
            setTerminalHistory((t) => [...t, { text: `root`, type: 'success' }]);
          } else {
            setTerminalHistory((t) => [...t, { text: `/usr/bin/find: missing arguments`, type: 'error' }]);
          }
        } else if (baseCmd === 'cat') {
          if (args[0] === '/root/flag.txt' || args[0] === 'flag.txt') {
            setTerminalHistory((t) => [...t, { text: `cat: /root/flag.txt: Permission denied`, type: 'error' }]);
          } else if (args[0] === 'notes/instructions.txt') {
            setTerminalHistory((t) => [...t, { text: `We need to escalate to root to capture the flag at /root/flag.txt.\nEnumerate the system for SUID files!`, type: 'output' }]);
          } else {
            setTerminalHistory((t) => [...t, { text: `cat: ${args[0] || 'file'}: No such file or directory`, type: 'error' }]);
          }
        } else if (baseCmd === 'whoami') {
          setTerminalHistory((t) => [...t, { text: `student`, type: 'output' }]);
        } else if (baseCmd === 'exit') {
          setTerminalHistory((t) => [...t, { text: `Connection to ${nestedSession.ip} closed.`, type: 'output' }]);
          setNestedSession({ type: null });
          setTerminalPrompt('root@nexus-kali:~#');
        } else {
          setTerminalHistory((t) => [...t, { text: `Command not found. Try: ls, cat, find, exit`, type: 'error' }]);
        }
      } else {
        if (baseCmd === 'ls') {
          setTerminalHistory((t) => [...t, { text: `flag.txt    wordlist.txt    logs/`, type: 'output' }]);
        } else if (baseCmd === 'cat') {
          if (args[0] === 'flag.txt') {
            setTerminalHistory((t) => [...t, { text: `THM{hydra_brute_ssh_cracked_812}`, type: 'success' }]);
          } else if (args[0] === 'wordlist.txt') {
            setTerminalHistory((t) => [...t, { text: `password123\nsunshine\nshadow1\ncybersecurity\ncybernexus_elite`, type: 'output' }]);
          } else {
            setTerminalHistory((t) => [...t, { text: `cat: ${args[0] || 'file'}: No such file or directory`, type: 'error' }]);
          }
        } else if (baseCmd === 'exit') {
          setTerminalHistory((t) => [...t, { text: `Connection to ${nestedSession.ip} closed.`, type: 'output' }]);
          setNestedSession({ type: null });
          setTerminalPrompt('root@nexus-kali:~#');
        } else {
          setTerminalHistory((t) => [...t, { text: `Command not found. Try: ls, cat, exit`, type: 'error' }]);
        }
      }
      return;
    }

    // --- Standard Terminal Commands ---
    switch (baseCmd) {
      case 'help':
        setTerminalHistory((t) => [
          ...t,
          { text: 'Available commands:', type: 'output' },
          { text: '  ls                      - List directory files', type: 'output' },
          { text: '  cd [dir]                - Change directory (e.g. /home/student/challenges)', type: 'output' },
          { text: '  pwd                     - Print working directory', type: 'output' },
          { text: '  cat [file]              - Print file contents to terminal', type: 'output' },
          { text: '  nmap [IP]               - Port scan target IP to discover services', type: 'output' },
          { text: '  ftp [IP]                - Log in anonymously to targeted ftp servers', type: 'output' },
          { text: '  hydra -l [u] -P [w] ssh://[IP] - Password cracking utility', type: 'output' },
          { text: '  ssh [user]@[IP]         - Remote SSH terminal console connection', type: 'output' },
          { text: '  sqlmap -u [URL]         - Automated database injection scanner', type: 'output' },
          { text: '  tshark -r [file]        - Packet analysis scanner', type: 'output' },
          { text: '  curl [URL]              - Fetch resources / interact with web servers', type: 'output' },
          { text: '  whoami / hostname       - Examine system roles and context', type: 'output' },
          { text: '  clear                   - Clear the screen buffer', type: 'output' }
        ]);
        break;

      case 'ls':
        if (terminalCwd === '/home/student/challenges') {
          setTerminalHistory((t) => [...t, { text: 'flag.txt    notes.txt', type: 'output' }]);
        } else if (terminalCwd === '/home/student') {
          setTerminalHistory((t) => [...t, { text: 'challenges/    logs/    wordlists/    capture.pcap    file.txt    dynamicStatic.txt', type: 'output' }]);
        } else {
          setTerminalHistory((t) => [...t, { text: 'bin/  etc/  home/  var/  tmp/  root/', type: 'output' }]);
        }
        break;

      case 'pwd':
        setTerminalHistory((t) => [...t, { text: terminalCwd, type: 'output' }]);
        break;

      case 'cd':
        const targetDir = args[0];
        if (!targetDir || targetDir === '~') {
          setTerminalCwd('/home/student');
          setTerminalPrompt('root@nexus-kali:~#');
        } else if (targetDir === 'challenges' && terminalCwd === '/home/student') {
          setTerminalCwd('/home/student/challenges');
          setTerminalPrompt('root@nexus-kali:~/challenges#');
        } else if (targetDir === '/home/student/challenges') {
          setTerminalCwd('/home/student/challenges');
          setTerminalPrompt('root@nexus-kali:~/challenges#');
        } else if (targetDir === '..') {
          if (terminalCwd === '/home/student/challenges') {
            setTerminalCwd('/home/student');
            setTerminalPrompt('root@nexus-kali:~#');
          } else if (terminalCwd === '/home/student') {
            setTerminalCwd('/');
            setTerminalPrompt('root@nexus-kali:/#');
          }
        } else {
          setTerminalHistory((t) => [...t, { text: `cd: no such file or directory: ${targetDir}`, type: 'error' }]);
        }
        break;

      case 'cat':
        const file = args[0];
        if (!file) {
          setTerminalHistory((t) => [...t, { text: `Usage: cat [filename]`, type: 'error' }]);
        } else if (file === 'flag.txt' && terminalCwd === '/home/student/challenges') {
          setTerminalHistory((t) => [...t, { text: 'THM{linux_terminal_pioneer_419}', type: 'success' }]);
        } else if (file === 'notes.txt' && terminalCwd === '/home/student/challenges') {
          setTerminalHistory((t) => [...t, { text: 'Tip: Network enumeration using Nmap scanning maps services and hidden ports.', type: 'output' }]);
        } else if (file === 'dynamicStatic.txt' || file === 'dynamicstatic.txt' || file === '/dynamicStatic.txt') {
          setTerminalHistory((t) => [
            ...t,
            { text: "=== CYBERNEXUS ARCHITECTURAL ANALYSIS: DYNAMIC vs STATIC ===", type: 'success' },
            { text: "[⚡ DYNAMIC COMPONENTS]", type: 'success' },
            { text: "1. Live Intel Feed (Socket.io WebSockets): Broadcasts real-time events & operative chats.", type: 'output' },
            { text: "2. User Auth & Profile System (JWT & MongoDB): Manages sessions, profile data, gender & credentials.", type: 'output' },
            { text: "3. Interactive Shell & Command Emulator: Parses CLI inputs, directory paths, and flags dynamically.", type: 'output' },
            { text: "4. Certificate Ledger & Verification API: Verifies hashes and generates QR verification codes.", type: 'output' },
            { text: "5. Gamification & XP Engine: Evaluates CTF submissions, achievements, and XP progression on-the-fly.", type: 'output' },
            { text: "[📌 STATIC COMPONENTS]", type: 'cyan' },
            { text: "1. Curriculum & Learning Paths: Fixed course markdown structures (ALL_LEARNING_PATHS).", type: 'output' },
            { text: "2. Reference Guides & Cheatsheets (file.txt, dynamicStatic.txt): Served static text files.", type: 'output' },
            { text: "3. Network Topologies & Diagram Models: Immutable network map structures for consistent labs.", type: 'output' },
            { text: "4. React UI & Tailwind Styling: Pre-compiled SPA client-side bundles.", type: 'output' },
            { text: "💡 Downloadable file available at: /dynamicStatic.txt", type: 'output' }
          ]);
        } else if (file === 'file.txt' || file === '/file.txt') {
          setTerminalHistory((t) => [
            ...t,
            { text: "=== KALI LINUX COMMAND CHEATSHEET BY MODULE ===", type: 'success' },
            { text: "[1] RECON: nmap -sV -sC -T4 10.10.10.10 | whois example.com | sublist3r -d example.com", type: 'output' },
            { text: "[2] WEB: gobuster dir -u http://10.10.10.10 -w wordlist.txt | nikto -h http://10.10.10.10 | sqlmap -u URL --dbs", type: 'output' },
            { text: "[3] PASSWORDS: hydra -l admin -P rockyou.txt 10.10.10.10 ssh | john --wordlist=rockyou.txt hashes.txt", type: 'output' },
            { text: "[4] EXPLOITS: msfconsole -q | searchsploit apache 2.4.49 | msfvenom -p linux/x64/shell_reverse_tcp ...", type: 'output' },
            { text: "[5] SNIFFING: tcpdump -i eth0 host 10.10.10.10 -w capture.pcap | tshark -r capture.pcap", type: 'output' },
            { text: "[6] PRIV ESC & SMB: enum4linux -a 10.10.10.10 | smbclient -L //10.10.10.10 -N | sudo -l | find / -perm -u=s", type: 'output' },
            { text: "[7] NETWORKING: nc -lvnp 4444 | ss -tulpn | ip a | python3 -m http.server 8000", type: 'output' },
            { text: "💡 Complete downloadable text file available at: /file.txt", type: 'output' }
          ]);
        } else if (file === 'capture.pcap' && terminalCwd === '/home/student') {
          setTerminalHistory((t) => [...t, { text: `cat: capture.pcap: Cannot print binary files. Use 'tshark -r capture.pcap' to analyze packet structures.`, type: 'error' }]);
        } else {
          setTerminalHistory((t) => [...t, { text: `cat: ${file}: No such file or directory`, type: 'error' }]);
        }
        break;

      case 'whoami':
        setTerminalHistory((t) => [...t, { text: 'root', type: 'output' }]);
        break;

      case 'hostname':
        setTerminalHistory((t) => [...t, { text: 'nexus-kali', type: 'output' }]);
        break;

      case 'clear':
        setTerminalHistory([]);
        break;

      case 'nmap':
        const targetIp = args[args.length - 1];
        if (!targetIp || targetIp.startsWith('-')) {
          setTerminalHistory((t) => [...t, { text: 'Usage: nmap -sV -p [ports] [IP]', type: 'error' }]);
          break;
        }

        setTerminalHistory((t) => [...t, { text: `Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-25 02:45 UTC`, type: 'output' }]);
        
        setTimeout(() => {
          if (targetIp === '10.10.12.8') {
            setTerminalHistory((t) => [
              ...t,
              { text: `Nmap scan report for 10.10.12.8`, type: 'output' },
              { text: `Host is up (0.002s latency).`, type: 'output' },
              { text: `PORT     STATE SERVICE VERSION`, type: 'output' },
              { text: `21/tcp   open  ftp     vsftpd 3.0.3 (Anonymous Enabled)`, type: 'success' },
              { text: `22/tcp   open  ssh     OpenSSH 8.2 (protocol 2.0)`, type: 'output' },
              { text: `80/tcp   open  http    Nginx 1.18`, type: 'output' }
            ]);
          } else if (targetIp === '10.10.10.45') {
            setTerminalHistory((t) => [
              ...t,
              { text: `Nmap scan report for 10.10.10.45`, type: 'output' },
              { text: `Host is up (0.003s latency).`, type: 'output' },
              { text: `PORT     STATE SERVICE VERSION`, type: 'output' },
              { text: `80/tcp   open  http    Apache httpd 2.4.41`, type: 'output' },
              { text: `3306/tcp open  mysql   MySQL v8.0.22`, type: 'output' }
            ]);
          } else if (targetIp === '10.10.15.110') {
            setTerminalHistory((t) => [
              ...t,
              { text: `Nmap scan report for 10.10.15.110`, type: 'output' },
              { text: `Host is up (0.004s latency).`, type: 'output' },
              { text: `PORT     STATE SERVICE VERSION`, type: 'output' },
              { text: `22/tcp   open  ssh     OpenSSH 7.9 (protocol 2.0)`, type: 'output' }
            ]);
          } else if (targetIp === '10.10.10.88') {
            setTerminalHistory((t) => [
              ...t,
              { text: `Nmap scan report for 10.10.10.88`, type: 'output' },
              { text: `Host is up (0.003s latency).`, type: 'output' },
              { text: `PORT     STATE SERVICE VERSION`, type: 'output' },
              { text: `80/tcp   open  http    Apache httpd 2.4.49 (PHP 8.0.10 with SQLite support)`, type: 'success' }
            ]);
          } else if (targetIp === '10.10.20.15') {
            setTerminalHistory((t) => [
              ...t,
              { text: `Nmap scan report for 10.10.20.15`, type: 'output' },
              { text: `Host is up (0.004s latency).`, type: 'output' },
              { text: `PORT     STATE SERVICE VERSION`, type: 'output' },
              { text: `80/tcp   open  http    Node.js Express (Ping Diagnostics portal)`, type: 'success' }
            ]);
          } else if (targetIp === '10.10.30.55') {
            setTerminalHistory((t) => [
              ...t,
              { text: `Nmap scan report for 10.10.30.55`, type: 'output' },
              { text: `Host is up (0.005s latency).`, type: 'output' },
              { text: `PORT     STATE SERVICE VERSION`, type: 'output' },
              { text: `22/tcp   open  ssh     OpenSSH 8.4p1 (Ubuntu Linux 20.04 LTS with atypical SUID attributes)`, type: 'success' }
            ]);
          } else {
            setTerminalHistory((t) => [
              ...t,
              { text: `Nmap scan report for ${targetIp}`, type: 'output' },
              { text: `All 1000 scanned ports are closed.`, type: 'error' }
            ]);
          }
        }, 1000);
        break;

      case 'ftp':
        const ftpIp = args[0];
        if (ftpIp === '10.10.12.8') {
          setTerminalHistory((t) => [
            ...t,
            { text: `Connected to 10.10.12.8.`, type: 'success' },
            { text: `220 (vsFTPd 3.0.3)`, type: 'output' },
            { text: `Name (10.10.12.8:student): `, type: 'output' }
          ]);
          setNestedSession({ type: 'ftp', ip: ftpIp, username: 'anonymous', awaitingPass: true });
          setTerminalPrompt('Name: ');
        } else {
          setTerminalHistory((t) => [...t, { text: `ftp: connect: Connection refused`, type: 'error' }]);
        }
        break;

      case 'hydra':
        // Check if correct args for hydra
        const hydraStr = cmd.toLowerCase();
        if (hydraStr.includes('ssh://10.10.15.110') && hydraStr.includes('security_officer')) {
          setTerminalHistory((t) => [
            ...t,
            { text: `Hydra v9.2-dev (c) 2026 by van Hauser/THC - for legal purposes only`, type: 'output' },
            { text: `Hydra starting at 2026-06-25 02:46:12`, type: 'output' },
            { text: `[DATA] attacking ssh://10.10.15.110:22/`, type: 'output' },
            { text: `[STATUS] attack started with 16 parallel tasks`, type: 'output' },
            { text: `[22][ssh] host: 10.10.15.110   login: security_officer   password: password123 - failed`, type: 'output' },
            { text: `[22][ssh] host: 10.10.15.110   login: security_officer   password: sunshine - failed`, type: 'output' },
            { text: `[22][ssh] host: 10.10.15.110   login: security_officer   password: shadow1 - failed`, type: 'output' },
            { text: `[22][ssh] host: 10.10.15.110   login: security_officer   password: cybersecurity - failed`, type: 'output' },
            { text: `[22][ssh] host: 10.10.15.110   login: security_officer   password: cybernexus_elite - SUCCESS!`, type: 'success' },
            { text: `[DATA] Hydra finished, credentials cracked:`, type: 'success' },
            { text: `[SSH] host: 10.10.15.110   login: security_officer   password: cybernexus_elite`, type: 'success' }
          ]);
        } else {
          setTerminalHistory((t) => [
            ...t,
            { text: `Hydra targeting error. Format: hydra -l security_officer -P wordlists/passwords.txt ssh://10.10.15.110`, type: 'error' }
          ]);
        }
        break;

      case 'ssh':
        const sshTarget = args[0];
        if (sshTarget === 'security_officer@10.10.15.110') {
          setTerminalHistory((t) => [
            ...t,
            { text: `The authenticity of host '10.10.15.110' can't be established.`, type: 'output' },
            { text: `Are you sure you want to continue connecting (yes/no)? yes`, type: 'output' },
            { text: `security_officer@10.10.15.110's password: `, type: 'output' }
          ]);
          setNestedSession({ type: 'ssh', ip: '10.10.15.110', username: 'security_officer', awaitingPass: true });
          setTerminalPrompt('Password: ');
        } else if (sshTarget === 'student@10.10.30.55' || sshTarget === '10.10.30.55') {
          setTerminalHistory((t) => [
            ...t,
            { text: `The authenticity of host '10.10.30.55' can't be established.`, type: 'output' },
            { text: `Are you sure you want to continue connecting (yes/no)? yes`, type: 'output' },
            { text: `student@10.10.30.55's password: `, type: 'output' }
          ]);
          setNestedSession({ type: 'ssh', ip: '10.10.30.55', username: 'student', awaitingPass: true });
          setTerminalPrompt('Password: ');
        } else {
          setTerminalHistory((t) => [...t, { text: `ssh: connect to host ${sshTarget || 'target'} port 22: Connection refused`, type: 'error' }]);
        }
        break;

      case 'sqlmap':
        const sqlmapStr = cmd.toLowerCase();
        if (sqlmapStr.includes('10.10.10.45')) {
          setTerminalHistory((t) => [
            ...t,
            { text: `sqlmap/1.6.2#stable - automatic SQL injection tool`, type: 'output' },
            { text: `[+] testing connection to target URL...`, type: 'output' },
            { text: `[+] heuristics detected parameter 'username' is vulnerable to Union Query SQLi`, type: 'output' },
            { text: `[+] retrieving database names...`, type: 'output' },
            { text: `[*] secure_portal\n[*] info_schema`, type: 'success' },
            { text: `[+] retrieving tables for database 'secure_portal'...`, type: 'output' },
            { text: `[*] flags\n[*] users`, type: 'success' },
            { text: `[+] retrieving flag values:`, type: 'output' },
            { text: `[*] Table 'flags' contents:\n    ID: 1, VALUE: THM{sql_inject_master_783}`, type: 'success' }
          ]);
        } else {
          setTerminalHistory((t) => [...t, { text: `sqlmap: No injectable parameters detected on target.`, type: 'error' }]);
        }
        break;

      case 'tshark':
        if (cmd.includes('capture.pcap')) {
          setTerminalHistory((t) => [
            ...t,
            { text: `1   0.000000   10.10.1.10 -> 10.10.1.55   TCP 74 49152 -> 21 [SYN] Seq=0 Win=64240 Len=0`, type: 'output' },
            { text: `2   0.001200   10.10.1.55 -> 10.10.1.10   TCP 74 21 -> 49152 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0`, type: 'output' },
            { text: `3   0.001350   10.10.1.10 -> 10.10.1.55   TCP 66 49152 -> 21 [ACK] Seq=1 Ack=1 Win=64240 Len=0`, type: 'output' },
            { text: `4   0.015000   10.10.1.55 -> 10.10.1.10   FTP 120 Response: 220 Welcome to Nexus FTP Backup Server`, type: 'output' },
            { text: `5   0.052000   10.10.1.10 -> 10.10.1.55   FTP 84 Command: USER backup_admin`, type: 'output' },
            { text: `6   0.053100   10.10.1.55 -> 10.10.1.10   FTP 102 Response: 331 Password required for backup_admin`, type: 'output' },
            { text: `7   0.110000   10.10.1.10 -> 10.10.1.55   FTP 96 Command: PASS nexus_ftp_fallback_901`, type: 'success' },
            { text: `8   0.125000   10.10.1.55 -> 10.10.1.10   FTP 112 Response: 230 User logged in, proceed`, type: 'success' },
            { text: `9   0.210000   10.10.1.10 -> 10.10.1.55   FTP 92 Command: RETR config_backup.xml`, type: 'output' },
            { text: `10  0.224000   10.10.1.55 -> 10.10.1.10   FTP-DATA 256 FTP Data: <config><backup_flag>THM{wireshark_cleartext_cred_harvest_21}</backup_flag></config>`, type: 'success' }
          ]);
        } else {
          setTerminalHistory((t) => [...t, { text: `Usage: tshark -r [filename]`, type: 'error' }]);
        }
        break;

      case 'curl':
        const curlUrl = args[args.length - 1] || '';
        if (curlUrl.includes('10.10.20.15')) {
          if (curlUrl.includes('whoami')) {
            setTerminalHistory((t) => [
              ...t,
              { text: `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.`, type: 'output' },
              { text: `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms`, type: 'output' },
              { text: `--- 127.0.0.1 ping statistics ---`, type: 'output' },
              { text: `1 packets transmitted, 1 received, 0% packet loss`, type: 'output' },
              { text: ``, type: 'output' },
              { text: `www-data`, type: 'success' }
            ]);
          } else if (curlUrl.includes('cat') && curlUrl.includes('flag.txt')) {
            setTerminalHistory((t) => [
              ...t,
              { text: `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.`, type: 'output' },
              { text: `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.03 ms`, type: 'output' },
              { text: `--- 127.0.0.1 ping statistics ---`, type: 'output' },
              { text: `1 packets transmitted, 1 received, 0% packet loss`, type: 'output' },
              { text: ``, type: 'output' },
              { text: `THM{command_injection_rce_902}`, type: 'success' }
            ]);
          } else {
            setTerminalHistory((t) => [
              ...t,
              { text: `<html><body><h3>Network Diagnostics Portal</h3><p>Enter IP to ping:</p></body></html>`, type: 'output' }
            ]);
          }
        } else if (curlUrl.includes('10.10.10.88')) {
          setTerminalHistory((t) => [
            ...t,
            { text: `<html><body><h3>Support Ticketing Forum</h3><form action="/ticket" method="POST"><input name="title"/><textarea name="description"></textarea></form></body></html>`, type: 'output' }
          ]);
        } else {
          setTerminalHistory((t) => [...t, { text: `curl: (7) Failed to connect to port 80: Connection refused`, type: 'error' }]);
        }
        break;

      default:
        setTerminalHistory((t) => [...t, { text: `bash: command not found: ${baseCmd}. Type "help" for a list of tools.`, type: 'error' }]);
        break;
    }
  };

  // Chat with Nexus AI Assistant
  const handleSendChat = async (presetPrompt) => {
    const promptToSend = presetPrompt || chatInput;
    if (!promptToSend.trim()) return;

    // Append user message
    const userMsg = {
      id: Math.random().toString(),
      sender: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCookie('XSRF-TOKEN')
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          context: {
            activeLesson: selectedLesson?.title,
            activeLab: selectedLab?.title,
            userStats: { xp: userProfile.xp, level: userProfile.level }
          }
        })
      });

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          content: data.response || "I parsed your instruction but couldn't reach the backend. Let me know if you want to explore injection payloads!",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      // Fallback response generator inside preview
      let answer = "I couldn't contact my neural core, but as a local cybersecurity assistant, I can explain that. ";
      const query = promptToSend.toLowerCase();
      if (query.includes('sql') || query.includes('injection')) {
        answer += "SQL Injection (SQLi) allows attackers to execute random database operations. To mitigate it, always use Parameterized Queries / Prepared Statements, which safely separate user inputs from executable SQL logic.";
      } else if (query.includes('xss') || query.includes('scripting')) {
        answer += "Cross-Site Scripting (XSS) lets attackers execute browser scripts in another user's session. To fix it, run HTML Context-Aware Output Escaping on user parameters, and implement a strict Content Security Policy (CSP).";
      } else if (query.includes('nmap') || query.includes('scan')) {
        answer += "Nmap is the gold standard for network mapping. Important parameters include: -sS (stealthy SYN handshake scan), -sV (probe open ports to retrieve active service versions), and -O (OS fingerprint analysis).";
      } else if (query.includes('brute') || query.includes('hydra')) {
        answer += "Hydra is an online credentials cracking utility. When targeting SSH, limit active connection limits to prevent rate limit blocks, and inspect logs for failed attempt bursts.";
      } else {
        answer += "CyberNexus focuses on defensive and offensive competencies. You can navigate through our Learning Paths (Web Security, Linux, SOC auditing) or start a sandbox lab to run active scans using the simulated Kali command line!";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          content: answer,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Certificate ID verification
  const handleVerifyCertificate = async () => {
    if (!verifyId.trim()) return;
    setVerifyLoading(true);
    setVerifyResult(null);

    try {
      const response = await fetch(`/api/verify-certificate/${verifyId.trim()}`);
      const data = await response.json();
      setVerifyResult(data);
    } catch (e) {
      setVerifyResult({
        verified: false,
        error: "Verification node offline. Please double check syntax (CN-[USERNAME]-[SLUG])."
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  // Dynamic Certificate Handlers
  const handlePrintCertificate = (result) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup blocker active! Please allow popups to export certificate.");
      return;
    }
    
    // Select themes styling for printed certificate
    let themeBg = 'background: #050608; color: #cbd5e1;';
    let themeBorder = 'border-color: #06b6d4; box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);';
    let nameColor = 'color: #22d3ee;';
    let accentLine = 'background: linear-gradient(90deg, transparent, #22d3ee, transparent);';
    let sealColor = '#22d3ee';

    if (certTheme === 'executive_gold') {
      themeBg = 'background: #0f0e0c; color: #e2e8f0;';
      themeBorder = 'border-color: #fbbf24; box-shadow: 0 0 30px rgba(251, 191, 36, 0.2);';
      nameColor = 'color: #fbbf24;';
      accentLine = 'background: linear-gradient(90deg, transparent, #fbbf24, transparent);';
      sealColor = '#fbbf24';
    } else if (certTheme === 'plasma_blue') {
      themeBg = 'background: #050a18; color: #93c5fd;';
      themeBorder = 'border-color: #6366f1; box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);';
      nameColor = 'color: #818cf8;';
      accentLine = 'background: linear-gradient(90deg, transparent, #6366f1, transparent);';
      sealColor = '#6366f1';
    } else if (certTheme === 'phantom_grey') {
      themeBg = 'background: #141517; color: #d1d5db;';
      themeBorder = 'border-color: #9ca3af; box-shadow: 0 0 30px rgba(156, 163, 175, 0.1);';
      nameColor = 'color: #f3f4f6;';
      accentLine = 'background: linear-gradient(90deg, transparent, #9ca3af, transparent);';
      sealColor = '#9ca3af';
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>CyberNexus Certificate - \${result.recipient}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Inter:wght@400;600;900&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .mono { font-family: 'JetBrains Mono', monospace; }
          </style>
        </head>
        <body class="bg-[#030406] flex items-center justify-center min-h-screen p-8">
          <div class="max-w-4xl w-full p-12 rounded-3xl relative overflow-hidden border text-center space-y-8" style="\${themeBg} \${themeBorder}">
            {/* Tech line markings */}
            <div class="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4" style="border-color: inherit;"></div>
            <div class="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4" style="border-color: inherit;"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4" style="border-color: inherit;"></div>
            <div class="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4" style="border-color: inherit;"></div>
            
            <div class="mono text-xs tracking-[0.3em] opacity-40 uppercase">AUTHENTIC SECURE CREDENTIAL RECORD</div>
            
            <div class="flex justify-center">
              <svg class="w-16 h-16" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="\${sealColor}" stroke-width="2" stroke-dasharray="4 2"/>
                <path d="M50 30 L62 42 L58 46 L50 38 L42 46 L38 42 Z" fill="\${sealColor}"/>
                <path d="M50 42 L65 57 L57 65 L50 58 L43 65 L35 57 Z" fill="\${sealColor}"/>
              </svg>
            </div>
            
            <h1 class="text-3xl font-black tracking-widest text-white uppercase mono">CYBERNEXUS ACADEMY</h1>
            <div class="w-32 h-[1px] mx-auto opacity-30" style="\${accentLine}"></div>
            
            <div class="mono text-[10px] tracking-widest opacity-50 uppercase">CERTIFICATE OF DEMONSTRATED COMPETENCY</div>
            
            <div class="space-y-4">
              <p class="text-sm opacity-70 leading-relaxed max-w-lg mx-auto">
                This secure token verified credential certifies that under severe cyber penetration testing audits, the following node user has cleared all offensive and defensive modules:
              </p>
              
              <h2 class="text-4xl font-extrabold tracking-wide uppercase py-2" style="\${nameColor}">
                \${result.recipient}
              </h2>
              
              <p class="text-sm opacity-70">
                for demonstrating elite competencies and completing the specialized path:
              </p>
              
              <div class="text-xl font-bold text-white uppercase mono tracking-wider bg-[var(--bg-input)] py-3 px-6 rounded-xl inline-block border border-[var(--border-subtle)]">
                \${result.course}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8 text-xs text-left pt-8 border-t border-[var(--border-main)] max-w-2xl mx-auto opacity-80">
              <div class="space-y-1.5 font-mono">
                <div><span class="opacity-40">CREDENTIAL ID:</span> <span class="text-white">\${result.id}</span></div>
                <div><span class="opacity-40">STATUS:</span> <span class="text-emerald-400 font-bold">\${result.status}</span></div>
                <div><span class="opacity-40">CLASSIFICATION:</span> <span class="text-cyan-400 font-bold">\${result.badgeType}</span></div>
              </div>
              <div class="space-y-1.5 font-mono text-right">
                <div><span class="opacity-40">ISSUED ON:</span> <span class="text-white">\${result.issueDate}</span></div>
                <div><span class="opacity-40">REGISTRY BOARD:</span> <span class="text-white">\${result.issuer}</span></div>
                <div><span class="opacity-40">HASH PROOF:</span> <span class="text-[var(--text-muted)] font-mono text-[9px]">SHA256: 7f81a...d9a2e</span></div>
              </div>
            </div>

            <div class="pt-4 flex justify-center opacity-70">
              <div class="p-2 border border-[var(--border-main)] bg-black/40 rounded-xl">
                <svg class="w-16 h-16 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm1 1h2v2H5V5zm9-3h8v8h-8V2zm2 2v4h4V4h-4zm1 1h2v2h-2V5zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm1 1h2v2H5v-2zm12-3h5v2h-5v-2zm3 3h2v5h-2v-5zm-3 2h2v3h-2v-3zm-3 1h2v2h-2v-2zm-3-3h2v2h-2v-2zm5-2h2v2h-2v-2zm0 5h2v2h-2v-2z" />
                </svg>
              </div>
            </div>
            
            <div class="text-[9px] opacity-40 font-mono uppercase tracking-widest text-center">
              SECURED VIA CRYPTOGRAPHIC LEDGER SIGNATURES. MULTI-NODE CONSENSUS COMPLETE.
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadAttestation = (result) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      title: "CYBERNEXUS CERTIFICATE ATTESTATION",
      credentialId: result.id,
      recipient: result.recipient,
      courseTrack: result.course,
      issueDate: result.issueDate,
      registryStatus: result.status,
      classification: result.badgeType,
      cryptographicAudit: {
        hashAlgorithm: "SHA-256",
        signatureRoot: "CN_ROOT_ACC_COUNCIL_" + result.recipient.toUpperCase(),
        auditHash: "7f81a547b749d8a391512db2d0619a9d2e1c94d03e913aefdc51a37bbdf69cae",
        verificationConsensusNodes: [
          "node-us-east-1.cybernexus.org",
          "node-eu-west-2.cybernexus.org",
          "node-ap-south-1.cybernexus.org"
        ]
      }
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CN_Attestation_\${result.recipient}_\${result.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Auto load active path details on startup if none selected
  useEffect(() => {
    if (!selectedPath && ALL_LEARNING_PATHS.length > 0) {
      setSelectedPath(ALL_LEARNING_PATHS[0]);
    }
  }, []);

  // Dynamically calculate user rank label
  const getUserRank = (xp, level) => {
    const score = level * 1000 + xp;
    if (score < 500) return 'Apprentice';
    if (score < 1500) return 'Specialist';
    if (score < 3000) return 'Pentester';
    if (score < 5000) return 'Cyber Expert';
    return 'Elite Hacker';
  };

  if (showAuthScreen) {
    if (authMode === 'login') {
      return (
        <Login
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          language={language}
          onToggleLanguage={() => setLanguage(l => l === 'en' ? 'fr' : 'en')}
          onSuccess={(user) => {
            setUserProfile(user);
            setIsAuthenticated(true);
            setShowAuthScreen(false);
            setActiveTab('home');
            setTerminalHistory((t) => [
              ...t,
              { text: `🔑 HANDSHAKE SUCCESSFUL: Authenticated as ${user.username}`, type: 'success' }
            ]);
          }}
          onGoogleConnect={handleGoogleConnect}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      );
    } else {
      return (
        <Register
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          language={language}
          onToggleLanguage={() => setLanguage(l => l === 'en' ? 'fr' : 'en')}
          onSuccess={(user) => {
            setUserProfile(user);
            setIsAuthenticated(true);
            setShowAuthScreen(false);
            setActiveTab('home');
            setTerminalHistory((t) => [
              ...t,
              { text: `🔑 REGISTERED & LOGGED IN: Welcome hacker ${user.username}!`, type: 'success' }
            ]);
          }}
          onRegisterOnly={() => {
            setAuthMode('login');
          }}
          onGoogleConnect={handleGoogleConnect}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  // Dynamic Skill calculations for the radar chart
  const getComputedSkillStats = () => {
    const completedLessons = userProfile.completedLessons || [];
    const completedLabs = userProfile.completedLabs || [];
    const solvedCtfs = userProfile.solvedCtfs || [];

    const webLessons = completedLessons.filter(id => id.startsWith('web-sec-')).length;
    const webLabs = completedLabs.filter(id => id.includes('sql') || id.includes('web')).length;
    const webCtfs = solvedCtfs.filter(id => id.includes('web') || id.includes('cookie')).length;
    const webScore = Math.min(100, 35 + (webLessons * 25) + (webLabs * 20) + (webCtfs * 20));

    const linuxLessons = completedLessons.filter(id => id.startsWith('linux-')).length;
    const linuxLabs = completedLabs.filter(id => id.includes('linux')).length;
    const linuxScore = Math.min(100, 30 + (linuxLessons * 35) + (linuxLabs * 25));

    const pentestLessons = completedLessons.filter(id => id.startsWith('eth-hack-')).length;
    const pentestLabs = completedLabs.filter(id => id.includes('nmap') || id.includes('hydra')).length;
    const pentestScore = Math.min(100, 25 + (pentestLessons * 35) + (pentestLabs * 25));

    const blueLessons = completedLessons.filter(id => id.startsWith('soc-') || id.startsWith('cloud-')).length;
    const blueLabs = completedLabs.filter(id => id.includes('soc') || id.includes('log') || id.includes('cloud')).length;
    const blueScore = Math.min(100, 20 + (blueLessons * 30) + (blueLabs * 25));

    const cryptoLessons = completedLessons.filter(id => id.startsWith('crypto-') || id.startsWith('rev-eng-')).length;
    const cryptoCtfs = solvedCtfs.filter(id => id.includes('crypto') || id.includes('rot13')).length;
    const cryptoScore = Math.min(100, 15 + (cryptoLessons * 30) + (cryptoCtfs * 35) + (userProfile.level * 5));

    return {
      web: webScore,
      linux: linuxScore,
      pentest: pentestScore,
      blue: blueScore,
      crypto: cryptoScore
    };
  };

  const COMPARISONS = {
    none: null,
    pentester: {
      name: 'Sr Pentester',
      stats: { web: 90, linux: 85, pentest: 95, blue: 40, crypto: 65 },
      color: '#fbbf24', // Amber
      dash: '3,3'
    },
    soc_analyst: {
      name: 'Lead SOC Analyst',
      stats: { web: 50, linux: 75, pentest: 45, blue: 95, crypto: 60 },
      color: '#10b981', // Emerald
      dash: '3,3'
    },
    hax0r_god: {
      name: 'Hax0r_God (Rank 1)',
      stats: { web: 95, linux: 90, pentest: 98, blue: 85, crypto: 90 },
      color: '#ec4899', // Pink
      dash: '2,2'
    }
  };

  const RADAR_AXES = [
    { key: 'web', name: 'Web Sec', angle: -Math.PI / 2, desc: 'Web Application Vulnerabilities & OWASP Top 10' },
    { key: 'linux', name: 'Linux', angle: -Math.PI / 2 + (2 * Math.PI) / 5, desc: 'Linux Shell, Priv Esc, Log Auditing' },
    { key: 'pentest', name: 'Pentest', angle: -Math.PI / 2 + (4 * Math.PI) / 5, desc: 'Nmap, Hydra, Active Exploit Tactics' },
    { key: 'blue', name: 'Blue Team', angle: -Math.PI / 2 + (6 * Math.PI) / 5, desc: 'SOC Analyst Logs & Firewall Security' },
    { key: 'crypto', name: 'Crypto', angle: -Math.PI / 2 + (8 * Math.PI) / 5, desc: 'Cryptographic Ciphers & Hash Cracking' }
  ];

  return (
    <div className={`w-full h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex overflow-hidden font-sans ${theme === 'light' ? 'light' : ''}`}>
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-20 border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] flex flex-col items-center py-6 gap-6 shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Sidebar Logo Button -> Home Redirect */}
        <button
          onClick={() => setActiveTab('home')}
          title="Go to Home"
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer hover:scale-105 transition-transform group"
        >
          <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <div className="w-2 h-2 bg-white"></div>
          </div>
        </button>

        <nav className="flex flex-col gap-4">
          {(() => {
            const ADMIN_EMAILS = [
              "yassinekalthoum94@gmail.com",
              "yassineklt94@gmail.com",
              "yassineklt@gmail.com",
              "admin@cybernexus.org"
            ];

            const isAdminUser = 
              userProfile?.role === "Admin" || 
              userProfile?.username === "admin" || 
              userProfile?.username === "yassinekalthoum94" ||
              userProfile?.username === "yassineklt" ||
              userProfile?.username === "yassineklt94" ||
              (userProfile?.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase()));

            const isInstructorUser = 
              isAdminUser || 
              userProfile?.role === "Instructor" || 
              userProfile?.username === "cyber_shepherd" || 
              (userProfile?.email && ADMIN_EMAILS.includes(userProfile.email.toLowerCase()));

            const navItems = [
              { id: 'home', icon: Home, label: tr('nav.home', 'Home') },
              { id: 'dashboard', icon: Trophy, label: tr('nav.status', 'Status') },
              { id: 'live', icon: Radio, label: tr('nav.live', 'Live') },
              { id: 'paths', icon: BookOpen, label: tr('nav.courses', 'Courses') },
              { id: 'lessons', icon: FileText, label: tr('nav.lessons', 'Lessons') },
              { id: 'labs', icon: Database, label: tr('nav.labs', 'Labs') },
              { id: 'ctfs', icon: Shield, label: tr('nav.ctfs', 'CTFs') },
              { id: 'terminal', icon: TerminalIcon, label: tr('nav.console', 'Console') },
              { id: 'assistant', icon: Sparkles, label: tr('nav.nexusAI', 'Nexus AI') },
              { id: 'verification', icon: Award, label: tr('nav.certificates', 'Certificates') },
              { id: 'about', icon: Info, label: tr('nav.about', 'About') },
              { id: 'contact', icon: Mail, label: tr('nav.contact', 'Contact') },
              ...(isInstructorUser ? [{ id: 'instructor', icon: GraduationCap, label: tr('nav.instructor', 'Instructor') }] : []),
              ...(isAdminUser ? [{ id: 'admin', icon: Crown, label: tr('nav.admin', 'Admin') }] : [])
            ];

            return navItems.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                  className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all shrink-0 ${
                    isSelected 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                      : 'bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[8px] font-mono mt-0.5 scale-90">{tab.label.slice(0, 5)}</span>
                </button>
              );
            });
          })()}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full border-2 border-emerald-500/50 hover:border-cyan-400 p-0.5 relative cursor-pointer hover:scale-105 transition-all group"
            title={userProfile?.username ? `Logged in as ${userProfile.username} - Click for Settings` : 'Operative Settings'}
          >
            <div className="w-full h-full rounded-full bg-cyan-950 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 group-hover:text-white transition-colors">
              {userProfile?.username ? userProfile.username.slice(0, 2).toUpperCase() : 'YS'}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-app)] rounded-full animate-ping"></span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--bg-app)] rounded-full"></span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT FRAME */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* 2. HEADER */}
        <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('home')}
              title="Go to Home"
              className="text-xl font-black tracking-wider text-[var(--text-bright)] font-mono hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-3 group"
            >
              <span>CYBER<span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">NEXUS</span></span>
              <span className="text-xs font-mono font-normal text-[var(--text-muted)] px-2 py-0.5 border border-[var(--border-main)] rounded bg-[var(--bg-input)] group-hover:border-cyan-500/50 transition-colors">
                BETA v4.2.0
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Language Selector Protocol */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              title={language === 'en' ? 'Passer en Français' : 'Switch to English'}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-input)] hover:bg-[var(--bg-input)]/80 text-[var(--text-bright)] transition-all cursor-pointer flex items-center gap-1.5 font-mono text-xs font-bold shadow-sm"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className={language === 'en' ? 'text-cyan-400 font-black' : 'text-[var(--text-muted)]'}>EN</span>
              <span className="text-[var(--border-main)]">|</span>
              <span className={language === 'fr' ? 'text-cyan-400 font-black' : 'text-[var(--text-muted)]'}>FR</span>
            </button>

            {/* Theme Selector Protocol */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={theme === 'light' ? 'Switch to Dark protocol' : 'Switch to Light protocol'}
              className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-input)] hover:bg-[var(--bg-input)]/80 text-[var(--text-main)] hover:text-[var(--text-bright)] transition-all cursor-pointer flex items-center justify-center shadow-sm"
            >
              {theme === 'light' ? (
                <Moon className="w-4.5 h-4.5 text-indigo-500" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              )}
            </button>

            {/* Gamified XP and level track */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                Rank: {getUserRank(userProfile.xp, userProfile.level)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-cyan-400 font-bold">LVL {userProfile.level}</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">({userProfile.xp} / {userProfile.level * 1000} XP)</span>
                <div className="w-32 h-2 bg-[var(--bg-input)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_#22d3ee] transition-all duration-500"
                    style={{ width: `${(userProfile.xp / (userProfile.level * 1000)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="w-px h-8 bg-[var(--border-main)]"></div>

            {/* Profile status info */}
            <div className="flex items-center gap-3">
              {/* Interactive Profile Card Pill */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                title="Click to view & edit Profile (Name, Age, Location)"
                className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-panel)] border border-[var(--border-main)] hover:border-cyan-500/50 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all cursor-pointer text-left"
              >
                {/* Avatar Circle with Initials & Online Indicator */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full border-2 border-emerald-500/80 group-hover:border-cyan-400 p-0.5 bg-cyan-950 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 group-hover:text-white transition-colors shadow-inner">
                    {userProfile?.username ? userProfile.username.slice(0, 2).toUpperCase() : 'YS'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[var(--bg-panel)] rounded-full animate-pulse"></span>
                </div>

                {/* User Details & Micro Badges */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-[var(--text-bright)] group-hover:text-cyan-400 transition-colors">
                      {userProfile.username}
                    </span>
                    <Settings className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-300" />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
                    {userProfile.location ? (
                      <span className="flex items-center gap-0.5 text-cyan-400/90 truncate max-w-[110px]">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{userProfile.location}</span>
                      </span>
                    ) : null}
                    {userProfile.age ? (
                      <span className="flex items-center gap-0.5 text-indigo-400/90">
                        <Calendar className="w-2.5 h-2.5 shrink-0" />
                        <span>{userProfile.age}y</span>
                      </span>
                    ) : null}
                    {userProfile.gender ? (
                      <span className="flex items-center gap-0.5 text-pink-400/90">
                        <User className="w-2.5 h-2.5 shrink-0" />
                        <span>{userProfile.gender}</span>
                      </span>
                    ) : null}
                    {!userProfile.location && !userProfile.age && !userProfile.gender && (
                      <span className="text-[9px] text-[var(--text-muted)] group-hover:text-cyan-400/80 transition-colors">
                        Edit profile
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Quick Auth & Status Control Actions */}
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="text-[9px] font-mono text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold"
                    >
                      DISCONNECT
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setShowAuthScreen(true);
                      }}
                      className="text-[9px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold animate-pulse"
                    >
                      SIGN IN / REGISTER
                    </button>
                  )}
                </div>

                <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 
                  {activeHackerCount} {activeHackerCount === 1 ? "NODE ONLINE" : "NODES ONLINE"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. CONTENT CONTAINER AREA */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-app)]">
          
          {/* --- HOME TAB --- */}
          {activeTab === 'home' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
              {/* Hero Header */}
              <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#0a0f1d] via-[#080d1a] to-[#04060e] border border-cyan-500/20 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.05)]">
                <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full"></div>
                <div className="absolute left-1/3 bottom-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] pointer-events-none rounded-full"></div>
                
                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    NEXUS ACADEMY CORE
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-white tracking-tight leading-tight">
                    Next-Gen Interactive <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                      Cybersecurity Training
                    </span>
                  </h1>
                  <p className="text-[var(--text-muted)] text-base md:text-lg leading-relaxed max-w-2xl">
                    Master penetration testing, dynamic vulnerability research, reverse engineering, and cloud infrastructure security using our state-of-the-art sandboxed virtual simulators.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => setActiveTab('paths')}
                      className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer font-mono text-sm group"
                    >
                      BEGIN LEARNING PATHS
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('terminal')}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-[var(--border-main)] hover:border-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer font-mono text-sm"
                    >
                      <TerminalIcon className="w-4 h-4 text-cyan-400" />
                      KALI CONSOLE SIMULATOR
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of Interactive Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab('lessons')}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-cyan-500/30 p-6 rounded-2xl cursor-pointer transition-all hover:translate-y-[-4px] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white group-hover:text-cyan-400 transition-colors">Lesson Library</h3>
                  <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">
                    Search and filter 15+ comprehensive theoretical briefings with interactive live sandbox tasks.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('labs')}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-emerald-500/30 p-6 rounded-2xl cursor-pointer transition-all hover:translate-y-[-4px] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white group-hover:text-emerald-400 transition-colors">Lab Sandboxes</h3>
                  <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">
                    Deploy interactive Kali Linux clusters and audit live logs on SQL, Auth nodes, and vulnerable targets.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('ctfs')}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-indigo-500/30 p-6 rounded-2xl cursor-pointer transition-all hover:translate-y-[-4px] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white group-hover:text-indigo-400 transition-colors">CTF Arenas</h3>
                  <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">
                    Test your tactical execution skills on high-difficulty jeopardy Capture The Flag challenges.
                  </p>
                </div>
              </div>

              {/* Dynamic Cadet Progress Summary + Active Threat Simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* User Snapshot Dashboard */}
                <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-base font-bold font-mono text-white border-b border-[var(--border-subtle)] pb-2">
                      CADET DOSSIER STATUS
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-xl font-mono font-bold text-cyan-400">
                        {userProfile.level}
                      </div>
                      <div>
                        <div className="text-[var(--text-muted)] text-xs font-mono">CADET CLASSIFICATION</div>
                        <div className="text-base font-bold text-white font-mono">{userProfile.username.toUpperCase()}</div>
                        <div className="text-cyan-400 text-xs font-mono font-bold">LEVEL {userProfile.level} ENCRYPTOR</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[var(--text-muted)]">XP PROGRESS</span>
                        <span className="text-cyan-400">{userProfile.xp % 1000} / 1000 XP</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500" 
                          style={{ width: `${(userProfile.xp % 1000) / 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border-subtle)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-mono uppercase">Lessons Completed</div>
                      <div className="text-lg font-bold font-mono text-white mt-1">
                        {userProfile.completedLessons.length}
                      </div>
                    </div>
                    <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border-subtle)]">
                      <div className="text-[var(--text-muted)] text-[10px] font-mono uppercase">CTFs Solved</div>
                      <div className="text-lg font-bold font-mono text-white mt-1">
                        {userProfile.solvedCtfs.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated threat monitor alert card */}
                <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2 mb-4">
                      <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        LIVE SOC INCIDENT LOGS
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">REAL-TIME PORTAL</span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-2.5 rounded bg-rose-500/5 border border-rose-500/10 flex items-start gap-2">
                        <span className="text-rose-400 font-bold">[WARN]</span>
                        <span className="text-[var(--text-main)]">Port sweep detected on host <span className="text-rose-400 font-bold">10.10.10.45</span>. 143 dynamic TCP probes matched SYN signatures.</span>
                      </div>
                      <div className="p-2.5 rounded bg-amber-500/5 border border-rose-500/10 flex items-start gap-2">
                        <span className="text-amber-400 font-bold">[ALERT]</span>
                        <span className="text-[var(--text-main)]">Brute-force SSH warning: 45 failed root attempts from IP <span className="text-amber-400 font-bold">185.220.101.44</span>.</span>
                      </div>
                      <div className="p-2.5 rounded bg-cyan-500/5 border border-rose-500/10 flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">[INFO]</span>
                        <span className="text-[var(--text-main)]">S3 Storage audit check: Found public bucket exposing backups. Mitigation required.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-4">
                    <span>Active SOC Monitor Node: <span className="text-emerald-400 font-bold">active</span></span>
                    <button 
                      onClick={() => setActiveTab('dashboard')} 
                      className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer font-bold"
                    >
                      VIEW INTEL OVERVIEW <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* --- ABOUT TAB --- */}
          {activeTab === 'about' && (
            <About language={language} />
          )}

          {/* --- CONTACT TAB --- */}
          {activeTab === 'contact' && (
            <Contact language={language} />
          )}

          {/* --- ADMIN TAB --- */}
          {activeTab === 'admin' && (
            <Admin 
              language={language} 
              userProfile={userProfile} 
              onProfileUpdate={(updatedUser) => setUserProfile(prev => ({ ...prev, ...updatedUser }))}
            />
          )}

          {/* --- INSTRUCTOR TAB --- */}
          {activeTab === 'instructor' && (
            <Instructor 
              language={language} 
              userProfile={userProfile} 
              onProfileUpdate={(updatedUser) => setUserProfile(prev => ({ ...prev, ...updatedUser }))}
            />
          )}

          {/* --- LESSONS TAB --- */}
          {activeTab === 'lessons' && (() => {
            // Flat map all lessons in the app
            const allLessons = ALL_LEARNING_PATHS.flatMap(path => 
              path.modules.flatMap(mod => 
                mod.lessons.map(les => ({
                  ...les,
                  pathId: path.id,
                  pathTitle: path.title,
                  moduleTitle: mod.title,
                  pathIcon: path.icon,
                  pathSlug: path.slug
                }))
              )
            );

            // Filter lessons
            const filteredLessons = allLessons.filter(les => {
              const matchesSearch = 
                les.title.toLowerCase().includes(lessonsSearchQuery.toLowerCase()) ||
                les.learningObjectives.some(obj => obj.toLowerCase().includes(lessonsSearchQuery.toLowerCase())) ||
                (les.readingMaterial && les.readingMaterial.toLowerCase().includes(lessonsSearchQuery.toLowerCase()));
              
              const matchesCategory = 
                lessonsCategoryFilter === 'all' || 
                les.pathId === lessonsCategoryFilter;

              const matchesDifficulty = 
                lessonsDifficultyFilter === 'all' || 
                les.difficulty.toLowerCase() === lessonsDifficultyFilter.toLowerCase();

              const isCompleted = userProfile.completedLessons.includes(les.id);
              const matchesStatus = 
                lessonsStatusFilter === 'all' || 
                (lessonsStatusFilter === 'completed' && isCompleted) ||
                (lessonsStatusFilter === 'uncompleted' && !isCompleted);

              return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
            });

            return (
              <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
                
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">Cyber Curriculum Lesson Library</h2>
                    <p className="text-[var(--text-muted)] text-xs mt-1">
                      Instantly explore theory, objectives, and test sandboxes across all cyber learning disciplines.
                    </p>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-input)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg">
                    TOTAL INDEXED LESSONS: <span className="text-cyan-400 font-bold">{filteredLessons.length}</span> / {allLessons.length}
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-xl">
                  {/* Search bar */}
                  <div className="md:col-span-5 relative">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search lesson titles, objectives, theory..."
                      value={lessonsSearchQuery}
                      onChange={(e) => setLessonsSearchQuery(e.target.value)}
                      className="w-full bg-[var(--bg-app)] border border-[var(--border-subtle)] focus:border-cyan-500/50 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="md:col-span-3">
                    <select
                      value={lessonsCategoryFilter}
                      onChange={(e) => setLessonsCategoryFilter(e.target.value)}
                      className="w-full bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-lg py-2.5 px-3 text-xs text-[var(--text-main)] focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="all">All Tracks</option>
                      {ALL_LEARNING_PATHS.map(path => (
                        <option key={path.id} value={path.id}>{path.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="md:col-span-2">
                    <select
                      value={lessonsDifficultyFilter}
                      onChange={(e) => setLessonsDifficultyFilter(e.target.value)}
                      className="w-full bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-lg py-2.5 px-3 text-xs text-[var(--text-main)] focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="md:col-span-2">
                    <select
                      value={lessonsStatusFilter}
                      onChange={(e) => setLessonsStatusFilter(e.target.value)}
                      className="w-full bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-lg py-2.5 px-3 text-xs text-[var(--text-main)] focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="uncompleted">Uncompleted</option>
                    </select>
                  </div>
                </div>

                {/* Lesson Grid Card List */}
                {filteredLessons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((les) => {
                      const isCompleted = userProfile.completedLessons.includes(les.id);
                      return (
                        <div 
                          key={les.id}
                          className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/30 transition-all group"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                les.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                les.difficulty === 'Intermediate' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {les.difficulty}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--text-muted)]">{les.duration}</span>
                            </div>

                            <div>
                              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-semibold block">{les.pathTitle}</span>
                              <h3 className="text-sm font-bold text-white font-mono mt-0.5 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                                {les.title}
                              </h3>
                            </div>

                            <div className="space-y-1 bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border-subtle)] min-h-[90px] flex flex-col justify-center">
                              <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-semibold">Core Objective</span>
                              <p className="text-xs text-[var(--text-main)] line-clamp-3 leading-relaxed">
                                {les.learningObjectives[0] || 'Understand core vulnerability mechanisms.'}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {isCompleted ? (
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono font-bold">
                                  <CheckCircle className="w-3.5 h-3.5" /> COMPLETED
                                </span>
                              ) : (
                                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
                                  <Lock className="w-3.5 h-3.5" /> UNCOMPLETED
                                </span>
                              )}
                              <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded">+{les.xpReward} XP</span>
                            </div>
                            
                            <button
                              onClick={() => {
                                // Find full path object from state
                                const targetPath = ALL_LEARNING_PATHS.find(p => p.id === les.pathId);
                                if (targetPath) {
                                  setSelectedPath(targetPath);
                                  setSelectedLesson(targetPath.modules.flatMap(m => m.lessons).find(l => l.id === les.id) || les);
                                  setActiveTab('paths');
                                }
                              }}
                              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-bold rounded-md font-mono flex items-center gap-1 shadow-md shadow-cyan-950/20 cursor-pointer"
                            >
                              LAUNCH LESSON <Play className="w-2.5 h-2.5 fill-current" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl space-y-3">
                    <div className="text-[var(--text-muted)] text-3xl">🔍</div>
                    <h3 className="text-sm font-bold font-mono text-white">No Lessons Found</h3>
                    <p className="text-[var(--text-muted)] text-xs max-w-sm mx-auto leading-relaxed">
                      Your search parameters did not yield any curricular matching nodes. Try adjusting your queries, track categories, or difficulties.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* --- DASHBOARD TAB --- */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
              
              {/* Left Column: Welcome box + Lab banner + terminal snapshot */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Active Lab Promo block */}
                <div className="relative bg-gradient-to-r from-[#0d1117] to-[#080a0f] border border-[var(--border-main)] rounded-2xl p-6 overflow-hidden min-h-[220px]">
                  <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-3">
                      <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold tracking-wider border border-cyan-500/20">
                        Active Lab Sandbox
                      </span>
                      <h2 className="text-2xl font-bold text-white font-mono">SQL Injection Basics</h2>
                      <p className="text-[var(--text-muted)] max-w-lg text-sm">
                        Inspect query execution, bypass firewall blocks, and access databases. Deploy your own terminal sandbox container to grab the flag parameters!
                      </p>
                      
                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => {
                            setActiveTab('labs');
                            setSelectedLab(ALL_LABS[0]);
                          }}
                          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer font-mono"
                        >
                          LAUNCH LAB SYSTEM
                        </button>
                        <button 
                          onClick={() => {
                            setActiveTab('paths');
                            const firstPath = ALL_LEARNING_PATHS[0];
                            setSelectedPath(firstPath);
                            setSelectedLesson(firstPath.modules[0].lessons[0]);
                          }}
                          className="px-5 py-2.5 border border-[var(--border-main)] text-white text-xs font-bold rounded-lg hover:bg-[var(--bg-input)] transition-all font-mono"
                        >
                          READ THEORY BRIEFING
                        </button>
                      </div>
                    </div>

                    {/* Progress Circle Visualizer */}
                    <div className="flex items-center gap-4 bg-[var(--bg-input)] border border-[var(--border-main)] p-4 rounded-xl shrink-0">
                      <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin duration-1000"></div>
                        <span className="text-xl font-mono text-white font-bold">68%</span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-[var(--text-muted)]">Path completed</div>
                        <div className="text-sm font-bold text-cyan-400 font-mono">Web Exploit</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)] font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" /> Est. Time: 45m
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-cyan-400" /> Level: Entry/Int
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" /> Solves: 1.4k global
                    </div>
                  </div>
                </div>

                {/* Simulated Terminal Live Console Preview */}
                <div className="bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-2xl overflow-hidden flex flex-col h-[280px]">
                  <div className="bg-[var(--bg-input)] px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                      <span className="ml-3 text-xs font-mono text-[var(--text-muted)]">root@nexus-kali: ~</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">TERMINAL STATUS: ONLINE</span>
                  </div>
                  <div className="p-4 font-mono text-xs overflow-y-auto flex-1 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
                    <div className="text-emerald-400">student@nexus-kali:~$ nmap -sV 10.10.12.8</div>
                    <div className="text-[var(--text-muted)]">Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-25 02:37 UTC</div>
                    <div className="text-[var(--text-muted)]">Nmap scan report for 10.10.12.8</div>
                    <div className="text-[var(--text-muted)]">PORT     STATE SERVICE VERSION</div>
                    <div className="text-[var(--text-main)]">21/tcp   open  ftp     vsftpd 3.0.3</div>
                    <div className="text-[var(--text-main)]">22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3</div>
                    <div className="text-[var(--text-muted)]">|_http-title: Secure Internal Portal</div>
                    <div className="text-emerald-400 mt-2">student@nexus-kali:~$ _</div>
                  </div>
                  <div className="p-3 bg-[var(--bg-input)] border-t border-[var(--border-subtle)] flex justify-between items-center text-xs font-mono px-4">
                    <span className="text-[var(--text-muted)]">Practice your ethical hacking tools inside the simulated lab.</span>
                    <button 
                      onClick={() => setActiveTab('terminal')}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      OPEN CONSOLE <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Achievements List */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6">
                  <h3 className="text-lg font-bold font-mono text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" /> PLATFORM BADGES & ACHIEVEMENTS
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ALL_ACHIEVEMENTS.map((ach) => {
                      const isUnlocked = userProfile.unlockedAchievements.includes(ach.id);
                      return (
                        <div 
                          key={ach.id} 
                          className={`p-4 rounded-xl border flex gap-3 items-start transition-all ${
                            isUnlocked 
                              ? 'bg-cyan-950/10 border-cyan-500/20 text-[var(--text-main)]' 
                              : 'bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[var(--bg-input)] text-[var(--text-muted)]'}`}>
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-sm leading-snug">{ach.title}</div>
                            <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">{ach.description}</div>
                            <div className="text-[10px] font-mono text-cyan-400 mt-1">+{ach.xpReward} XP</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Skill Radar + Leaderboard snapshot */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Skill Radar visualizer container */}
                <div className={`border rounded-2xl p-6 flex flex-col transition-all duration-500 min-h-[440px] ${
                  radarStyle === 'neon' ? 'bg-[var(--bg-card)] border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.03)]' :
                  radarStyle === 'tactical' ? 'bg-[var(--bg-app)] border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.03)]' :
                  'bg-[#0a0d14] border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.03)]'
                }`}>
                  {/* Skill Radar animations are managed inside App.css */}

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black font-mono tracking-wider text-white uppercase flex items-center gap-2">
                        <Radar className={`w-4 h-4 ${
                          radarStyle === 'neon' ? 'text-cyan-400 animate-pulse' :
                          radarStyle === 'tactical' ? 'text-emerald-400' : 'text-indigo-400'
                        }`} />
                        <span>Skill Radar</span>
                      </h3>
                      
                      {/* Theme selection pills */}
                      <div className="flex items-center gap-1 bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-subtle)]">
                        {['neon', 'tactical', 'aura'].map((style) => (
                          <button
                            key={style}
                            onClick={() => setRadarStyle(style)}
                            className={`px-2 py-0.5 rounded text-[8px] font-black font-mono uppercase transition-all cursor-pointer ${
                              radarStyle === style
                                ? radarStyle === 'neon' ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.4)]' :
                                  radarStyle === 'tactical' ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                  'bg-indigo-600 text-white shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comparison selector */}
                    <div className="flex items-center justify-between bg-black/30 border border-[var(--border-subtle)] px-2.5 py-1.5 rounded-lg text-[9px] font-mono">
                      <span className="text-[var(--text-muted)] uppercase">Benchmark overlay:</span>
                      <select
                        value={radarComparison}
                        onChange={(e) => setRadarComparison(e.target.value)}
                        className="bg-[var(--bg-app)] text-[9px] text-[var(--text-main)] font-mono border border-[var(--border-main)] rounded px-1.5 py-0.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="none">None (Self Only)</option>
                        <option value="pentester">Sr Pentester Career</option>
                        <option value="soc_analyst">Lead SOC Specialist</option>
                        <option value="hax0r_god">Hax0r_God (Rank 1)</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Dynamic Radar Map */}
                  <div className="flex-1 flex items-center justify-center py-2 relative">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Glow Filter Defs */}
                        <defs>
                          <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Outer rotating tactical scanning line */}
                        {radarStyle === 'tactical' && (
                          <>
                            <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(16,185,129,0.03)" strokeWidth="0.5" strokeDasharray="2,2" />
                            <line 
                              x1="50" 
                              y1="50" 
                              x2="50" 
                              y2="9" 
                              stroke="rgba(16,185,129,0.25)" 
                              strokeWidth="1.5" 
                              className="animate-radar-sweep"
                              filter="url(#radar-glow)"
                            />
                          </>
                        )}

                        {radarStyle === 'neon' && (
                          <>
                            <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(139,92,246,0.04)" strokeWidth="0.5" strokeDasharray="3,3" />
                            <line 
                              x1="50" 
                              y1="50" 
                              x2="50" 
                              y2="9" 
                              stroke="rgba(34,211,238,0.2)" 
                              strokeWidth="1" 
                              className="animate-radar-sweep"
                            />
                          </>
                        )}

                        {/* Core concentric grid rings (regular pentagons) */}
                        {[8, 16, 24, 32, 40].map((radiusVal, rIdx) => {
                          const pts = RADAR_AXES.map((axis) => {
                            const x = 50 + radiusVal * Math.cos(axis.angle);
                            const y = 50 + radiusVal * Math.sin(axis.angle);
                            return `${x.toFixed(2)},${y.toFixed(2)}`;
                          }).join(' ');

                          return (
                            <polygon
                              key={rIdx}
                              points={pts}
                              fill="none"
                              stroke={
                                radarStyle === 'neon' ? 'rgba(34,211,238,0.06)' :
                                radarStyle === 'tactical' ? 'rgba(16,185,129,0.08)' :
                                'rgba(255,255,255,0.04)'
                              }
                              strokeWidth="0.75"
                              strokeDasharray={rIdx % 2 === 1 ? '1,1' : undefined}
                            />
                          );
                        })}

                        {/* Radial Axis Spokes */}
                        {RADAR_AXES.map((axis, aIdx) => {
                          const x = 50 + 40 * Math.cos(axis.angle);
                          const y = 50 + 40 * Math.sin(axis.angle);
                          return (
                            <line
                              key={aIdx}
                              x1="50"
                              y1="50"
                              x2={x}
                              y2={y}
                              stroke={
                                radarStyle === 'neon' ? 'rgba(255,255,255,0.05)' :
                                radarStyle === 'tactical' ? 'rgba(16,185,129,0.1)' :
                                'rgba(255,255,255,0.03)'
                              }
                              strokeWidth="0.75"
                              strokeDasharray="2,2"
                            />
                          );
                        })}

                        {/* Overlay comparison benchmark (if selected) */}
                        {radarComparison !== 'none' && COMPARISONS[radarComparison] && (() => {
                          const cmp = COMPARISONS[radarComparison];
                          const cmpPts = RADAR_AXES.map((axis) => {
                            const val = cmp.stats[axis.key] || 0;
                            const r = (val / 100) * 40;
                            const x = 50 + r * Math.cos(axis.angle);
                            const y = 50 + r * Math.sin(axis.angle);
                            return `${x.toFixed(2)},${y.toFixed(2)}`;
                          }).join(' ');

                          return (
                            <polygon
                              points={cmpPts}
                              fill="none"
                              stroke={cmp.color}
                              strokeWidth="1.25"
                              strokeDasharray={cmp.dash}
                              className="transition-all duration-500"
                            />
                          );
                        })()}

                        {/* User Active Polygon Path */}
                        {(() => {
                          const stats = getComputedSkillStats();
                          const pts = RADAR_AXES.map((axis) => {
                            const val = stats[axis.key] || 0;
                            const r = (val / 100) * 40;
                            const x = 50 + r * Math.cos(axis.angle);
                            const y = 50 + r * Math.sin(axis.angle);
                            return `${x.toFixed(2)},${y.toFixed(2)}`;
                          }).join(' ');

                          return (
                            <polygon
                              points={pts}
                              fill={
                                radarStyle === 'neon' ? 'rgba(34,211,238,0.12)' :
                                radarStyle === 'tactical' ? 'rgba(16,185,129,0.1)' :
                                'rgba(99,102,241,0.18)'
                              }
                              stroke={
                                radarStyle === 'neon' ? '#22d3ee' :
                                radarStyle === 'tactical' ? '#10b981' :
                                '#6366f1'
                              }
                              strokeWidth="1.5"
                              filter={radarStyle === 'neon' ? 'url(#radar-glow)' : undefined}
                              className="transition-all duration-500 animate-pulse"
                            />
                          );
                        })()}

                        {/* Interactive vertices indicator nodes */}
                        {(() => {
                          const stats = getComputedSkillStats();
                          return RADAR_AXES.map((axis, idx) => {
                            const val = stats[axis.key] || 0;
                            const r = (val / 100) * 40;
                            const x = 50 + r * Math.cos(axis.angle);
                            const y = 50 + r * Math.sin(axis.angle);

                            const color = radarStyle === 'neon' ? '#22d3ee' : radarStyle === 'tactical' ? '#10b981' : '#6366f1';
                            const isHovered = hoveredAxis?.key === axis.key;

                            return (
                              <g 
                                key={idx}
                                onMouseEnter={() => setHoveredAxis({ ...axis, value: val })}
                                onMouseLeave={() => setHoveredAxis(null)}
                                className="cursor-pointer"
                              >
                                {/* Glowing outer circle on active hover */}
                                {isHovered && (
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="3.5"
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="1"
                                    className="animate-ping"
                                  />
                                )}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isHovered ? '2.5' : '1.5'}
                                  fill={color}
                                  stroke="#050608"
                                  strokeWidth="0.5"
                                  className="transition-all duration-300"
                                />
                              </g>
                            );
                          });
                        })()}

                        {/* Labels positioned beautifully outside */}
                        {RADAR_AXES.map((axis, idx) => {
                          // Compute label positioning slightly offset from outer perimeter (radius = 45)
                          const labelRadius = 46;
                          const x = 50 + labelRadius * Math.cos(axis.angle);
                          const y = 50 + labelRadius * Math.sin(axis.angle);

                          // Determine text-anchor based on side
                          let anchor = 'middle';
                          if (Math.abs(x - 50) > 3) {
                            anchor = x > 50 ? 'start' : 'end';
                          }

                          // Tiny alignment offset
                          const dy = y < 50 ? -1 : y > 50 ? 5 : 2;

                          return (
                            <text
                              key={idx}
                              x={x}
                              y={y + dy}
                              fill={hoveredAxis?.key === axis.key ? '#ffffff' : '#94a3b8'}
                              fontSize="5.5"
                              fontWeight={hoveredAxis?.key === axis.key ? '900' : '500'}
                              textAnchor={anchor}
                              fontFamily="monospace"
                              className="transition-all duration-300 select-none pointer-events-none tracking-tight uppercase"
                            >
                              {axis.name}
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Interactive Directive Intel Panel */}
                  {hoveredAxis ? (
                    <div className="bg-[var(--bg-app)]/90 border border-[var(--border-main)] rounded-xl p-3 text-left font-mono mt-2 min-h-[64px] flex flex-col justify-center transition-all duration-300 animate-fade-in">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-white font-bold uppercase tracking-wider">{hoveredAxis.name} COMPETENCY</span>
                        <span className={`font-black ${
                          radarStyle === 'neon' ? 'text-cyan-400' :
                          radarStyle === 'tactical' ? 'text-emerald-400' : 'text-indigo-400'
                        }`}>{hoveredAxis.value}%</span>
                      </div>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1 leading-snug">{hoveredAxis.desc}</p>
                      <div className="text-[8px] text-[var(--text-muted)] mt-1.5 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-amber-500 animate-pulse shrink-0" />
                        <span>Solve lessons or CTFs matching this track to level up</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[var(--bg-app)]/40 border border-dashed border-[var(--border-subtle)] rounded-xl p-3 text-left font-mono mt-2 min-h-[64px] flex items-center justify-between text-[9px] text-[var(--text-muted)] transition-all duration-300">
                      <span>💡 HOVER RADAR NODES TO VIEW REAL-TIME CURRICULUM DIRECTIVES & INTEL</span>
                      <span className="text-[8px] text-slate-600 border border-[var(--border-subtle)] px-1 rounded shrink-0">INTEL</span>
                    </div>
                  )}

                  {/* Skill Progress List */}
                  <div className="space-y-2.5 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    {(() => {
                      const stats = getComputedSkillStats();
                      const SKILL_LABELS = {
                        web: { name: 'Web App Pentesting', color: 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.3)]' },
                        linux: { name: 'Linux System Operations', color: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]' },
                        pentest: { name: 'Exploits & Ethical Hacking', color: 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.3)]' },
                        blue: { name: 'SOC Audits & Blue Teaming', color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' },
                        crypto: { name: 'Cryptographic Decryption', color: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]' }
                      };

                      return Object.entries(SKILL_LABELS).map(([key, label], sIdx) => {
                        const levelVal = stats[key] || 0;
                        return (
                          <div key={sIdx} className="group cursor-pointer" onMouseEnter={() => {
                            const axisInfo = RADAR_AXES.find(a => a.key === key);
                            if (axisInfo) setHoveredAxis({ ...axisInfo, value: levelVal });
                          }} onMouseLeave={() => setHoveredAxis(null)}>
                            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] group-hover:text-white transition-colors">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  key === 'web' ? 'bg-cyan-400' :
                                  key === 'linux' ? 'bg-indigo-400' :
                                  key === 'pentest' ? 'bg-violet-400' :
                                  key === 'blue' ? 'bg-emerald-400' : 'bg-rose-400'
                                }`} />
                                {label.name}
                              </span>
                              <span className="text-white font-bold font-mono text-[9px] bg-[var(--bg-input)] px-1.5 py-0.5 rounded">{levelVal}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-1 p-[1px] border border-[var(--border-subtle)]">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${label.color}`} 
                                style={{ width: `${levelVal}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Active Cyber Defenses Telemetry Panel */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none"></div>
                  <h3 className="text-lg font-bold font-mono text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400 animate-pulse" /> ACTIVE SECURITY TELEMETRY
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-left">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 animate-ping shrink-0"></div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
                          <span>NoSQL Injection Preventer</span>
                          <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                          Dynamically sanitizing body, query, and params. Try sending <code className="text-rose-400 font-bold bg-rose-950/20 px-1 rounded font-mono">$gt</code> or <code className="text-rose-400 font-bold bg-rose-950/20 px-1 rounded font-mono">$ne</code> in the Live Intel Feed below to see the shield intercept it!
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-gray-500/5 border border-gray-500/20 rounded-xl flex items-start gap-3 text-left">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[var(--text-muted)] font-mono uppercase tracking-wider flex items-center justify-between">
                          <span>Double-Submit CSRF Shield</span>
                          <span className="text-[10px] text-gray-400 font-mono">DISABLED</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                          Cryptographic double-submit validation for all state-mutating requests has been disabled.
                        </p>
                        <div className="mt-2.5 bg-black/40 border border-[var(--border-subtle)] p-2 rounded-lg font-mono text-[9px] text-[var(--text-muted)] break-all flex justify-between items-center">
                          <span>XSRF-TOKEN: <span className="text-gray-500 font-bold">DISABLED</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Global Leaderboard Panel */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
                  <h3 className="text-lg font-bold font-mono text-white mb-4 flex items-center justify-between">
                    <span>Global Rank List</span>
                    <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
                  </h3>
                  
                  <div className="space-y-3">
                    {MOCK_LEADERBOARD.map((user) => {
                      const isMe = user.username === userProfile.username;
                      const userXp = isMe ? (userProfile.level * 1000 + userProfile.xp) : user.xp;
                      const userLvl = isMe ? userProfile.level : user.level;

                      return (
                        <div 
                          key={user.username} 
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            isMe 
                              ? 'bg-cyan-500/10 border-cyan-500/30' 
                              : 'bg-[var(--bg-input)] border-[var(--border-subtle)]'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold ${
                            user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            user.rank === 2 ? 'bg-slate-300/20 text-[var(--text-main)] border border-slate-300/30' :
                            user.rank === 3 ? 'bg-amber-600/20 text-amber-500 border border-amber-600/30' :
                            'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                          }`}>
                            {user.rank.toString().padStart(2, '0')}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white font-mono truncate flex items-center gap-1.5">
                              {user.username}
                              {isMe && <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/20 px-1 rounded">YOU</span>}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] font-mono">
                              LVL {userLvl} • Score: {userXp.toLocaleString()}
                            </div>
                          </div>

                          <div className="text-[10px] font-mono text-[var(--text-muted)]">
                            {user.role}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* --- LIVE INTEL TAB --- */}
          {activeTab === 'live' && (
            <div className="max-w-7xl mx-auto">
              <Live 
                realtimeFeed={realtimeFeed}
                setRealtimeFeed={setRealtimeFeed}
                socketRef={socketRef}
                userProfile={userProfile}
                language={language}
                intelNotificationsEnabled={intelNotificationsEnabled}
                setIntelNotificationsEnabled={setIntelNotificationsEnabled}
                intelSoundEnabled={intelSoundEnabled}
                setIntelSoundEnabled={setIntelSoundEnabled}
              />
            </div>
          )}

          {/* --- PATHS & COURSES TAB --- */}
          {activeTab === 'paths' && (
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
              
              {/* Left Column: List of courses & Pagination Page 1 / Page 2 */}
              <div className="col-span-12 md:col-span-4 space-y-4">
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                      {isFr ? 'Cours Cybersécurité' : 'Cyber Learning Paths'}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                      Page {coursePage} / 2
                    </span>
                  </div>

                  {/* Page 1 vs Page 2 Toggle Buttons */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--bg-input)] rounded-xl border border-[var(--border-subtle)]">
                    <button
                      onClick={() => {
                        setCoursePage(1);
                        const p1 = ALL_LEARNING_PATHS.find(p => (p.page || 1) === 1);
                        if (p1) {
                          setSelectedPath(p1);
                          setSelectedLesson(p1.modules[0]?.lessons[0]);
                        }
                      }}
                      className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        coursePage === 1
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isFr ? 'Page 1 (Base)' : 'Page 1 (Base)'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setCoursePage(2);
                        const p2 = ALL_LEARNING_PATHS.find(p => p.page === 2);
                        if (p2) {
                          setSelectedPath(p2);
                          setSelectedLesson(p2.modules[0]?.lessons[0]);
                        }
                      }}
                      className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        coursePage === 2
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'text-amber-400/90 hover:text-amber-300 hover:bg-white/5'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isFr ? 'Page 2 (Experts 10$)' : 'Page 2 (Expert $10)'}</span>
                    </button>
                  </div>
                </div>

                {ALL_LEARNING_PATHS.filter(path => (path.page || 1) === coursePage).map((path) => {
                  const isSelected = selectedPath?.id === path.id;
                  const unlocked = isCourseUnlocked(path);
                  const pendingPayment = userPayments.find(p => p.courseId === path.id && p.status === 'pending');

                  return (
                    <div 
                      key={path.id}
                      onClick={() => {
                        setSelectedPath(path);
                        if (path.modules?.[0]?.lessons?.[0]) {
                          setSelectedLesson(path.modules[0].lessons[0]);
                        }
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[var(--bg-card)] border-cyan-500 shadow-md shadow-cyan-950/20' 
                          : 'bg-[var(--bg-card)]/60 border-[var(--border-subtle)] hover:border-[var(--border-main)] hover:bg-[var(--bg-card)]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${path.isExpert ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                            {path.isExpert ? <Crown className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                          </div>
                          {path.isExpert && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 uppercase">
                              Expert Course ($10)
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-mono font-bold bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] px-2 py-0.5 rounded">
                            +{path.xpReward} XP
                          </span>
                          {path.isExpert && (
                            unlocked ? (
                              <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                                <Unlock className="w-3 h-3" /> UNLOCKED
                              </span>
                            ) : pendingPayment ? (
                              <span className="text-[9px] font-mono font-bold text-amber-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> PENDING
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold text-red-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> LOCKED ($10)
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white font-mono">{path.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">{path.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active course roadmap and interactive material OR Locked Gate */}
              <div className="col-span-12 md:col-span-8 space-y-6">
                
                {selectedPath && (
                  !isCourseUnlocked(selectedPath) ? (
                    /* LOCKED EXPERT COURSE GATEWAY CARD */
                    <div className="bg-[var(--bg-card)] border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 animate-fadeIn shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl">
                            <Lock className="w-8 h-8" />
                          </div>
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-500/40">
                              {isFr ? 'Cours d\'Expert Verrouillé' : 'Locked Expert Masterclass'}
                            </span>
                            <h2 className="text-2xl font-black text-white font-mono mt-1">{selectedPath.title}</h2>
                          </div>
                        </div>

                        <div className="bg-amber-950/30 border border-amber-500/40 px-4 py-2 rounded-xl text-right">
                          <div className="text-[10px] font-mono text-amber-400/80 uppercase font-bold">{isFr ? 'Frais d\'accès' : 'Access Fee'}</div>
                          <div className="text-2xl font-black font-mono text-amber-400">$10 USD</div>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--text-main)] font-mono leading-relaxed">
                        {selectedPath.description}
                      </p>

                      {/* Pending payment notification banner */}
                      {userPayments.find(p => p.courseId === selectedPath.id && p.status === 'pending') ? (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                            <Clock className="w-4 h-4 animate-spin" />
                            <span>{isFr ? 'Paiement en cours de vérification' : 'Payment Pending Admin Approval'}</span>
                          </div>
                          <p className="text-xs text-amber-200/80 font-mono">
                            {isFr 
                              ? 'Votre identifiant de transaction (TxID) a été soumis avec succès. L\'administrateur validera le transfert crypto incessamment pour débloquer le cours.'
                              : 'Your transaction hash (TxID) was submitted and is queued for verification. The Admin will unlock full course access upon confirmation.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl space-y-3">
                            <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              {isFr ? 'Contenu Inclus dans ce cours d\'expert' : 'What is Included in this Expert Course'}
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[var(--text-muted)]">
                              {selectedPath.modules?.map((m) => (
                                <li key={m.id} className="flex items-center gap-2 bg-[var(--bg-input)] p-2 rounded border border-[var(--border-subtle)] text-slate-200">
                                  <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="truncate">{m.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="text-xs font-mono font-bold text-white mb-1">
                                {isFr ? 'Moyens de Paiement Acceptés' : 'Accepted Payment Methods'}
                              </div>
                              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded">USDT (Polygon)</span>
                                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded">BNB (BEP-20)</span>
                                <span className="bg-slate-500/10 border border-slate-500/30 text-slate-300 px-2 py-0.5 rounded">LTC (Native)</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setPaymentModalCourse(selectedPath)}
                              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                            >
                              <Unlock className="w-4 h-4" />
                              <span>{isFr ? 'Débloquer pour 10$ USD' : 'Unlock Course ($10 USD)'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* UNLOCKED / STANDARD COURSE CONTENT */
                    <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6">
                      <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-4 mb-4">
                        <div>
                          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Active Syllabus</span>
                          <h2 className="text-xl font-bold text-white font-mono">{selectedPath.title}</h2>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono text-[var(--text-muted)] block">Total Reward</span>
                          <span className="text-lg font-mono text-cyan-400 font-bold">+{selectedPath.xpReward} XP</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {selectedPath.modules.map((mod) => (
                          <div key={mod.id} className="space-y-3">
                            <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border-subtle)] flex justify-between items-center">
                              <div>
                                <h3 className="text-xs font-bold text-white font-mono">{mod.title}</h3>
                                <p className="text-[10px] text-[var(--text-muted)]">{mod.description}</p>
                              </div>
                              <span className="text-[9px] font-mono text-[var(--text-muted)]">CONCEPTS</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                              {mod.lessons.map((les) => {
                                const isCurrent = selectedLesson?.id === les.id;
                                const isCompleted = userProfile.completedLessons.includes(les.id);
                                return (
                                  <div
                                    key={les.id}
                                    onClick={() => handleSelectLesson(les)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                      isCurrent 
                                        ? 'bg-cyan-950/20 border-cyan-500/50 text-white' 
                                        : 'bg-[var(--bg-input)] border-[var(--border-subtle)] hover:bg-white/10'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0 flex items-center justify-center">
                                          <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                                        </div>
                                      )}
                                      <div className="truncate">
                                        <div className="text-xs font-bold truncate font-mono">{les.title}</div>
                                        <div className="text-[9px] text-[var(--text-muted)] font-mono mt-0.5">
                                          {les.duration} • {les.difficulty}
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* ACTIVE LESSON READER CONTAINER */}
                {selectedPath && isCourseUnlocked(selectedPath) && selectedLesson && (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-4">
                      <div>
                        <div className="flex gap-2 items-center">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] uppercase font-bold tracking-wider border border-cyan-500/20 font-mono">
                            {selectedLesson.difficulty}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--text-muted)]">{selectedLesson.duration}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white font-mono mt-1">{selectedLesson.title}</h2>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-emerald-400 font-bold block">+{selectedLesson.xpReward} XP</span>
                        {userProfile.completedLessons.includes(selectedLesson.id) && (
                          <span className="text-[10px] font-mono text-emerald-500 font-semibold bg-emerald-950/20 border border-emerald-900 px-2 py-0.5 rounded inline-block mt-1">
                            COMPLETED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Learning objectives */}
                    <div className="p-4 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl">
                      <h4 className="text-xs font-bold text-white font-mono uppercase mb-2">Learning Objectives</h4>
                      <ul className="space-y-1 text-xs text-[var(--text-main)] font-mono">
                        {selectedLesson.learningObjectives.map((obj, oIdx) => (
                          <li key={oIdx} className="flex items-start gap-2">
                            <span className="text-cyan-400">✓</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Reading Materials with custom styled MD tags */}
                    <div className="prose prose-invert max-w-none text-xs text-[var(--text-main)] leading-relaxed font-mono space-y-3">
                      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl max-h-[300px] overflow-y-auto whitespace-pre-line leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                        {selectedLesson.readingMaterial}
                      </div>
                    </div>

                    {/* Embedded interactive diagrams */}
                    {selectedLesson.interactiveDiagramType && (
                      <div className="border border-[var(--border-subtle)] rounded-xl p-2 bg-[var(--bg-panel)]">
                        <InteractiveDiagram type={selectedLesson.interactiveDiagramType} />
                      </div>
                    )}

                    {/* Practical Task */}
                    {selectedLesson.practicalTask && (
                      <div className="p-5 bg-cyan-950/10 border border-cyan-500/30 rounded-xl space-y-3 font-mono">
                        <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                          <TerminalIcon className="w-4 h-4 animate-pulse" /> offensive tactical task
                        </h4>
                        <p className="text-xs text-[var(--text-main)] leading-relaxed">{selectedLesson.practicalTask.instruction}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2 border-t border-[var(--border-subtle)] pt-3">
                          <div>
                            <span className="text-[var(--text-muted)]">Target IP Host:</span>
                            <span className="text-white ml-2 select-all font-bold px-1.5 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-main)]">{selectedLesson.practicalTask.targetIp || 'Dynamic Sandbox'}</span>
                          </div>
                          {selectedLesson.practicalTask.hint && (
                            <div className="text-[var(--text-muted)]">
                              <span className="text-amber-400">Tactical Hint:</span> {selectedLesson.practicalTask.hint}
                            </div>
                          )}
                        </div>

                        {selectedLesson.practicalTask.flagRequired && (
                          <div className="flex gap-2 mt-3 pt-2">
                            <input
                              type="text"
                              placeholder="Submit acquired flag format (THM{...})"
                              value={labAnswers[`task-${selectedLesson.id}`] || ''}
                              onChange={(e) => setLabAnswers({ ...labAnswers, [`task-${selectedLesson.id}`]: e.target.value })}
                              className="flex-1 bg-[var(--bg-app)] border border-[var(--border-main)] rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                            <button
                              onClick={() => {
                                const ans = labAnswers[`task-${selectedLesson.id}`] || '';
                                if (ans.trim() === selectedLesson.practicalTask?.flag) {
                                  if (!userProfile.completedLessons.includes(selectedLesson.id)) {
                                    setUserProfile((prev) => ({
                                      ...prev,
                                      completedLessons: [...prev.completedLessons, selectedLesson.id]
                                    }));
                                    awardXp(selectedLesson.xpReward, `Solved Practical Task: ${selectedLesson.title}`);
                                  }
                                  setLabAnswers({ ...labAnswers, [`task-${selectedLesson.id}-solved`]: 'CORRECT' });
                                  setTerminalHistory((t) => [...t, { text: `[+] Correct Flag! Practical Task verified for: ${selectedLesson.title}`, type: 'success' }]);
                                } else {
                                  setTerminalHistory((t) => [...t, { text: `[-] Incorrect Flag for task: ${selectedLesson.title}`, type: 'error' }]);
                                }
                              }}
                              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded transition-all cursor-pointer font-mono"
                            >
                              SUBMIT FLAG
                            </button>
                          </div>
                        )}
                        {labAnswers[`task-${selectedLesson.id}-solved`] === 'CORRECT' && (
                          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                            <CheckCircle className="w-4 h-4" /> Practical Task Solved successfully! Flag accepted.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quiz engine */}
                    <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                        <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-cyan-400" /> Lesson Quiz Engine
                        </h4>
                        
                        {timerActive ? (
                          <div className="text-xs font-mono text-yellow-500 font-bold animate-pulse">
                            TIMER: {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, '0')}
                          </div>
                        ) : (
                          !quizSubmitted && (
                            <button 
                              onClick={handleStartQuiz}
                              className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 rounded hover:bg-cyan-500/20 cursor-pointer"
                            >
                              START SECURITY TIMER
                            </button>
                          )
                        )}
                      </div>

                      <div className="space-y-5">
                        {selectedLesson.quiz.map((q, qIdx) => (
                          <div key={q.id} className="space-y-2 font-mono">
                            <div className="text-xs text-[var(--text-main)]">
                              Q{qIdx + 1}: {q.text}
                            </div>

                            {/* Multiple choice type */}
                            {q.type === 'mcq' && q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map((opt) => {
                                  const isChecked = quizAnswers[q.id] === opt;
                                  return (
                                    <button
                                      key={opt}
                                      disabled={quizSubmitted}
                                      onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt })}
                                      className={`p-2.5 rounded text-left text-[11px] border transition-all ${
                                        isChecked 
                                          ? 'bg-cyan-950/20 border-cyan-500 text-cyan-400' 
                                          : 'bg-[var(--bg-input)] border-[var(--border-subtle)] hover:border-[var(--border-main)] hover:bg-[var(--bg-input)] text-[var(--text-main)]'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Fill blank type */}
                            {q.type === 'fill-blank' && (
                              <input
                                type="text"
                                disabled={quizSubmitted}
                                placeholder="Enter correct terminology..."
                                value={quizAnswers[q.id] || ''}
                                onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                                className="w-full bg-[var(--bg-app)] border border-[var(--border-main)] rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                              />
                            )}

                            {/* Matching question type */}
                            {q.type === 'match' && (
                              <div className="space-y-2">
                                <div className="text-[11px] text-[var(--text-muted)] italic">Match the following terms:</div>
                                <div className="bg-[var(--bg-input)] p-3 rounded border border-[var(--border-subtle)] space-y-1.5 text-[11px]">
                                  {q.pairs?.map((pair, pI) => (
                                    <div key={pI} className="flex justify-between border-b border-[var(--border-subtle)] pb-1 last:border-0 last:pb-0">
                                      <span className="text-cyan-400 font-semibold">{pair.key}</span>
                                      <span className="text-[var(--text-main)]">{pair.value}</span>
                                    </div>
                                  ))}
                                </div>
                                {!quizSubmitted && (
                                  <button
                                    onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: 'match-correct' })}
                                    className={`px-3 py-1.5 rounded text-xs border font-bold ${
                                      quizAnswers[q.id] === 'match-correct'
                                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                        : 'border-[var(--border-main)] text-[var(--text-muted)] hover:bg-[var(--bg-input)]'
                                    }`}
                                  >
                                    Align Correct Sequence
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Log analysis type */}
                            {q.type === 'log-analysis' && (
                              <div className="space-y-2">
                                <pre className="p-3 bg-slate-950 border border-slate-900 rounded font-mono text-[10px] text-[var(--text-main)] max-h-[140px] overflow-y-auto">
                                  {q.logContent}
                                </pre>
                                <input
                                  type="text"
                                  disabled={quizSubmitted}
                                  placeholder="Enter discovered IP address or threat value..."
                                  value={quizAnswers[q.id] || ''}
                                  onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                                  className="w-full bg-[var(--bg-app)] border border-[var(--border-main)] rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                                />
                              </div>
                            )}

                            {quizSubmitted && (
                              <div className="p-2.5 bg-[var(--bg-input)] border-l-2 border-cyan-500 rounded text-[11px] text-[var(--text-muted)]">
                                <span className="font-bold text-white block">Explanation:</span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Quiz validation controls */}
                      <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between items-center">
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          {quizSubmitted && quizScore !== null ? (
                            <span className="text-cyan-400 font-bold">
                              Score: {quizScore} / {selectedLesson.quiz.length} Correct
                            </span>
                          ) : (
                            'Answer all security segments to complete theory validation.'
                          )}
                        </span>

                        {!quizSubmitted ? (
                          <button
                            onClick={() => handleQuizSubmit()}
                            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded cursor-pointer font-mono"
                          >
                            VERIFY SECURITY QUIZ
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizScore(null);
                              setQuizAnswers({});
                              setQuizTimer(300);
                            }}
                            className="px-4 py-2 border border-[var(--border-main)] text-white text-xs font-bold rounded hover:bg-[var(--bg-input)] cursor-pointer font-mono"
                          >
                            RESET QUIZ
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Saved Notes Notepad */}
                    <div className="p-5 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl space-y-3 font-mono">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-cyan-400" /> Saved Analyst Research Notes
                        </h4>
                        <button
                          onClick={handleSaveNotes}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                        >
                          SAVE NOTES
                        </button>
                      </div>
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Write down target parameters, syntax logs, or exfiltration tips..."
                        className="w-full h-24 bg-[var(--bg-app)] border border-[var(--border-main)] rounded p-2.5 text-xs text-[var(--text-main)] placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none font-mono"
                      />
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* --- LABS TAB & EMBEDDED KALI TERMINAL SIMULATION --- */}
          {activeTab === 'labs' && (
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
              
              {/* Left Column: list of Labs */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <h3 className="text-lg font-bold font-mono text-white mb-2 uppercase tracking-wider">
                  Hands-On Sandbox Labs
                </h3>

                {ALL_LABS.map((lab) => {
                  const isSelected = selectedLab?.id === lab.id;
                  const isDeployed = labDeployed[lab.id];
                  const isDeploying = labDeploying[lab.id];
                  const isCompleted = userProfile.completedLabs.includes(lab.id);

                  return (
                    <div
                      key={lab.id}
                      onClick={() => setSelectedLab(lab)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[var(--bg-card)] border-cyan-500 shadow-md shadow-cyan-950/20' 
                          : 'bg-[var(--bg-card)]/60 border-[var(--border-subtle)] hover:border-[var(--border-main)] hover:bg-[var(--bg-card)]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider font-mono ${
                          lab.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          lab.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {lab.difficulty}
                        </span>
                        
                        <div className="flex gap-1.5 items-center">
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          <span className="text-[10px] font-mono font-bold bg-[var(--bg-input)] text-[var(--text-muted)] px-2 py-0.5 rounded">
                            +{lab.xpReward} XP
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white font-mono">{lab.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">{lab.description}</p>
                      
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono border-t border-[var(--border-subtle)] pt-2.5">
                        <span className="text-[var(--text-muted)]">IP: {lab.targetIp}</span>
                        {isDeployed ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
                          </span>
                        ) : isDeploying ? (
                          <span className="text-cyan-400 font-bold animate-pulse">SPINNING UP...</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">OFFLINE</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Lab briefs, task list, Kali simulator */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {selectedLab && (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--border-subtle)] pb-4 gap-4">
                      <div>
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Lab Environment</span>
                        <h2 className="text-xl font-bold text-white font-mono">{selectedLab.title}</h2>
                        <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                          Target IP Address: <span className="text-white select-all font-bold px-1 rounded bg-[var(--bg-input)] border border-[var(--border-main)]">{selectedLab.targetIp}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 shrink-0">
                        {!labDeployed[selectedLab.id] ? (
                          <button
                            onClick={() => handleDeployLab(selectedLab.id)}
                            disabled={labDeploying[selectedLab.id]}
                            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-mono"
                          >
                            {labDeploying[selectedLab.id] ? 'INITIALIZING ENGINE...' : 'DEPLOY LAB INSTANCE'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/30 border border-emerald-900 px-2 py-1 rounded">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> INSTANCE LIVE
                            </span>
                            <button
                              onClick={() => {
                                setLabDeployed((prev) => ({ ...prev, [selectedLab.id]: false }));
                                setTerminalHistory((t) => [...t, { text: `[!] Container instance torn down. Environment reset.`, type: 'error' }]);
                              }}
                              className="px-3 py-1 bg-red-950/30 text-red-400 border border-red-900 text-xs rounded hover:bg-red-950/50"
                            >
                              RESET
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vulnerable Services brief */}
                    <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2 font-mono">
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold">Vulnerable Exposed Services</div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedLab.vulnerableServices.map((svc, sIdx) => (
                          <span key={sIdx} className="bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-main)] px-2.5 py-1 rounded text-xs">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Markdown instructions */}
                    <div className="prose prose-invert max-w-none text-xs text-[var(--text-main)] leading-relaxed font-mono">
                      <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] p-4 rounded-xl max-h-[180px] overflow-y-auto whitespace-pre-line leading-relaxed">
                        {selectedLab.instructions}
                      </div>
                    </div>

                    {/* Dynamic CLI Split layout */}
                    {labDeployed[selectedLab.id] && (
                      <div className="border border-[var(--border-main)] rounded-xl overflow-hidden">
                        <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-[var(--border-main)]">
                          <span className="text-xs font-mono text-cyan-400 font-bold">INTERACTIVE KALI TERMINAL SCREEN</span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">root@nexus-kali: ~</span>
                        </div>
                        
                        {/* Interactive terminal embed */}
                        <div className="bg-[var(--bg-app)] h-[340px] flex flex-col">
                          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-2">
                            {terminalHistory.map((line, idx) => (
                              <div 
                                key={idx} 
                                className={
                                  line.type === 'input' ? 'text-cyan-400' :
                                  line.type === 'error' ? 'text-red-400' :
                                  line.type === 'success' ? 'text-emerald-400 font-bold' :
                                  'text-[var(--text-main)]'
                                }
                              >
                                {line.text}
                              </div>
                            ))}
                            <div ref={terminalBottomRef} />
                          </div>

                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              executeTerminalCommand(terminalInput);
                            }}
                            className="p-2 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] flex items-center gap-2"
                          >
                            <span className="font-mono text-xs text-emerald-400 select-none pl-2 shrink-0">{terminalPrompt}</span>
                            <input
                              type="text"
                              value={terminalInput}
                              onChange={(e) => setTerminalInput(e.target.value)}
                              placeholder="nmap -sV targetIP, hydra, sqlmap..."
                              className="flex-1 bg-transparent border-0 outline-none text-xs text-white focus:ring-0 placeholder-slate-700 font-mono"
                              autoFocus
                            />
                            <button 
                              type="submit"
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono pr-2"
                            >
                              EXECUTE
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Tasks List */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold font-mono text-white uppercase border-b border-[var(--border-subtle)] pb-2">
                        Lab Verification Objectives
                      </h4>
                      
                      <div className="space-y-3 font-mono">
                        {selectedLab.tasks.map((task) => {
                          const answerKey = `${selectedLab.id}-${task.id}`;
                          const isSolved = labAnswers[answerKey] === 'CORRECT';

                          return (
                            <div key={task.id} className="p-4 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-xl space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-main)]">{task.title}</span>
                                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                  +{task.xp} XP
                                </span>
                              </div>
                              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{task.question}</p>
                              
                              {task.hint && (
                                <div className="text-[10px] text-amber-500/90">
                                  <span className="font-bold uppercase text-amber-400">Hint:</span> {task.hint}
                                </div>
                              )}

                              {!isSolved ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Format: THM{...} or parameter value"
                                    value={labAnswers[`input-${answerKey}`] || ''}
                                    onChange={(e) => setLabAnswers({ ...labAnswers, [`input-${answerKey}`]: e.target.value })}
                                    className="flex-1 bg-[var(--bg-app)] border border-[var(--border-main)] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                                  />
                                  <button
                                    onClick={() => handleSubmitLabTask(selectedLab.id, task.id, labAnswers[`input-${answerKey}`] || '')}
                                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded cursor-pointer"
                                  >
                                    VERIFY FLAG
                                  </button>
                                </div>
                              ) : (
                                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-900/30 p-2 rounded">
                                  <CheckCircle className="w-4 h-4 shrink-0" /> Objective complete! Earned {task.xp} XP reward.
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* --- CTF CHALLENGES TAB --- */}
          {activeTab === 'ctfs' && (
            <div className="max-w-7xl mx-auto space-y-6">
              
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h2 className="text-2xl font-bold font-mono text-white uppercase tracking-wider">CyberNexus CTF Arena</h2>
                  <p className="text-[var(--text-muted)] text-xs mt-1">Capture the hidden security flags to dominate the cyber rankings!</p>
                </div>
                <div className="p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-main)] flex items-center gap-2 shrink-0">
                  <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-[var(--text-main)] font-bold">
                    ACTIVE FLAGS DEPLOYED: {ALL_CTFS.length}
                  </span>
                </div>
              </div>

              {/* CTF Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ALL_CTFS.map((ctf) => {
                  const isSolved = userProfile.solvedCtfs.includes(ctf.id);
                  const isHintUnlocked = unlockedHints[ctf.id];
                  const feedback = ctfMessage[ctf.id];

                  return (
                    <div 
                      key={ctf.id}
                      className={`bg-[var(--bg-card)] border rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all relative ${
                        isSolved 
                          ? 'border-emerald-500/40 bg-emerald-950/5' 
                          : 'border-[var(--border-main)] hover:border-white/20'
                      }`}
                    >
                      {/* Solved label */}
                      {isSolved && (
                        <div className="absolute top-4 right-4 text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          SOLVED
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {ctf.category}
                          </span>
                          <span className={`text-[9px] font-mono font-bold ${
                            ctf.difficulty === 'Beginner' ? 'text-emerald-400' :
                            ctf.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {ctf.difficulty}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white font-mono">{ctf.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed font-mono">{ctf.description}</p>
                        
                        <div className="text-[10px] text-[var(--text-muted)] font-mono">
                          Intel briefed by: <span className="text-[var(--text-main)] font-bold">{ctf.creator}</span> • Solved {ctf.solvedCount} times
                        </div>
                      </div>

                      {/* Hint section */}
                      <div className="pt-2">
                        {isHintUnlocked ? (
                          <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg text-xs font-mono text-[var(--text-main)]">
                            <span className="font-bold text-amber-400 block mb-1">✓ Decrypted Intelligence:</span>
                            {ctf.hint}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRevealCtfHint(ctf.id)}
                            className="text-xs font-mono text-amber-500 hover:text-amber-400 font-semibold cursor-pointer flex items-center gap-1"
                          >
                            Decrypt Intel Hint (-10 XP cost)
                          </button>
                        )}
                      </div>

                      {/* Flag Submission form */}
                      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-[var(--text-muted)]">Submit flag format: FLAG{`{...}`}</span>
                          <span className="text-cyan-400 font-bold">+{ctf.points} XP / Points</span>
                        </div>

                        {!isSolved ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="FLAG{hex_or_string_val}"
                              value={ctfSubmissions[ctf.id] || ''}
                              onChange={(e) => setCtfSubmissions({ ...ctfSubmissions, [ctf.id]: e.target.value })}
                              className="flex-1 bg-[var(--bg-app)] border border-[var(--border-main)] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                            />
                            <button
                              onClick={() => handleSubmitCtf(ctf)}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded cursor-pointer"
                            >
                              SUBMIT
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded font-mono">
                            <CheckCircle className="w-4 h-4 shrink-0" /> Target complete! You successfully earned +{ctf.points} points.
                          </div>
                        )}

                        {feedback && (
                          <div className={`text-[11px] font-mono ${feedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {feedback.text}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* --- TERMINAL TAB (DEDICATED FULL SCREEN CONSOLE) --- */}
          {activeTab === 'terminal' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-2">
                <h2 className="text-xl font-bold font-mono text-white">DEDICATED KALI LINUX CONSOLE</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">Examine sandbox files, run nmap scans, and crack test portals using active commands.</p>
              </div>

              <div className="border border-[var(--border-main)] rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[var(--bg-panel)] px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <span className="ml-3 text-xs font-mono text-[var(--text-muted)]">root@nexus-kali: ~</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">TTY: /dev/pts/1</span>
                </div>
                
                <div className="bg-[var(--bg-app)] h-[480px] flex flex-col">
                  <div className="flex-1 p-4 font-mono text-xs overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-1.5">
                    {terminalHistory.map((line, idx) => (
                      <div 
                        key={idx} 
                        className={
                          line.type === 'input' ? 'text-cyan-400' :
                          line.type === 'error' ? 'text-red-400 font-bold' :
                          line.type === 'success' ? 'text-emerald-400 font-bold' :
                          'text-[var(--text-main)]'
                        }
                      >
                        {line.text}
                      </div>
                    ))}
                    <div ref={terminalBottomRef} />
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      executeTerminalCommand(terminalInput);
                    }}
                    className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-panel)] flex items-center gap-2"
                  >
                    <span className="font-mono text-xs text-emerald-400 select-none pl-2 shrink-0">{terminalPrompt}</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type 'help' to review console triggers..."
                      className="flex-1 bg-transparent border-0 outline-none text-xs text-white focus:ring-0 placeholder-slate-700 font-mono"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded font-mono"
                    >
                      SEND
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* --- AI ASSISTANT CHAT TAB --- */}
          {activeTab === 'assistant' && (
            <div className="max-w-4xl mx-auto grid grid-cols-12 gap-6">
              
              {/* Left sidebar: prompt pills */}
              <div className="col-span-12 md:col-span-4 space-y-4 font-mono text-xs">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cyber AI Assistant</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Ask AI Tutor "Nexus AI" for hints, code exfiltrations, explanation of exploits, or log audits.
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Tactical Quick Prompts</span>
                  {[
                    "Explain SQL Injection bypass",
                    "How does Nmap SYN scan work?",
                    "Analyze logs brute force",
                    "How to prevent XSS payloads",
                    "Help me decipher assembly jumps"
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSendChat(preset)}
                      className="w-full p-2.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-cyan-500/30 text-left text-[var(--text-main)] hover:text-cyan-400 hover:bg-[var(--bg-card)]/80 transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right main chat conversation window */}
              <div className="col-span-12 md:col-span-8 flex flex-col h-[520px] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl overflow-hidden">
                <div className="bg-[var(--bg-input)] px-4 py-3 flex justify-between items-center border-b border-[var(--border-subtle)] font-mono">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs text-white font-bold">Nexus AI Intelligence Tutor</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                    GEMINI ENGINE PRO
                  </span>
                </div>

                {/* Messages conversation logs */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 font-mono text-xs">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                        msg.sender === 'user' ? 'bg-cyan-500 text-black' : 'bg-[var(--bg-panel)] text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {msg.sender === 'user' ? 'U' : 'AI'}
                      </div>
                      
                      <div className={`p-3 rounded-xl border leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-cyan-950/20 border-cyan-500/30 text-[var(--text-main)]' 
                          : 'bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-main)]'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <span className="text-[9px] text-[var(--text-muted)] block mt-1.5 text-right">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-3 max-w-[80%] mr-auto">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-panel)] text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] text-[var(--text-muted)] italic">
                        Nexus AI is compiling tactical response...
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="p-3 bg-[var(--bg-panel)] border-t border-[var(--border-subtle)] flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask security explanation, analyze log segments..."
                    className="flex-1 bg-[var(--bg-app)] border border-[var(--border-main)] rounded px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded cursor-pointer font-mono flex items-center gap-1 shrink-0"
                  >
                    SEND <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* --- CERTIFICATE VERIFICATION TAB --- */}
          {activeTab === 'verification' && (
            <div className="max-w-2xl mx-auto space-y-6 font-mono text-xs">
              
              <div className="border-b border-[var(--border-subtle)] pb-2 text-center">
                <h2 className="text-xl font-bold text-white">CYBERNEXUS CERTIFICATE DEPLOYER & VERIFIER</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">Deploy, verify, and validate official completion credentials from CyberNexus academy.</p>
              </div>

              {/* Form to verify */}
              <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase">Verify Completion Authenticity</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Enter a unique verification token code to query the blockchain certificate database system. Standard format: <span className="text-white select-all bg-[var(--bg-input)] px-1 rounded font-bold">CN-[USERNAME]-[COURSE_SLUG]</span>
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyId}
                    onChange={(e) => setVerifyId(e.target.value)}
                    placeholder="e.g. CN-yassineklt94-web-security"
                    className="flex-1 bg-[var(--bg-app)] border border-[var(--border-main)] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleVerifyCertificate}
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded cursor-pointer"
                  >
                    QUERY VERIFICATION
                  </button>
                </div>

                {/* Quick actions if user has generated code */}
                {userProfile.certificateVerifyId && (
                  <div className="text-xs text-[var(--text-main)]">
                    💡 <span className="text-cyan-400">Your Issued Certificate ID:</span>{' '}
                    <span className="font-bold text-white select-all bg-[var(--bg-input)] border border-[var(--border-main)] px-2 py-0.5 rounded">
                      {userProfile.certificateVerifyId}
                    </span>
                    <button
                      onClick={() => handleCopy(userProfile.certificateVerifyId || '')}
                      className="ml-2 text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedText === userProfile.certificateVerifyId ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {/* Results */}
              {verifyResult && (
                <div className={`p-6 border rounded-2xl ${verifyResult.verified ? 'bg-emerald-950/5 border-emerald-500/20' : 'bg-red-950/10 border-red-500/30'} space-y-4`}>
                  {verifyResult.verified ? (
                    <div className="space-y-4">
                      {/* Validated Header with Theme Selection */}
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl">
                        <div className="flex items-center gap-3 text-emerald-400 font-bold">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 shrink-0">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-black tracking-wider uppercase">CERTIFICATE RECORD VALIDATED</div>
                            <div className="text-[9px] text-[var(--text-muted)] font-mono">Verified across decentralized consensus registry nodes</div>
                          </div>
                        </div>
                        
                        {/* Interactive Theme selector circles */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-app)] border border-[var(--border-main)] px-2.5 py-1.5 rounded-lg">
                          <span className="text-[8px] uppercase text-[var(--text-muted)] font-bold mr-1">THEME:</span>
                          <button
                            onClick={() => setCertTheme('cyberpunk')}
                            className={`w-4 h-4 rounded-full bg-cyan-500 border transition-all cursor-pointer ${certTheme === 'cyberpunk' ? 'ring-2 ring-white scale-110 border-cyan-300' : 'border-transparent opacity-60 hover:opacity-90'}`}
                            title="CyberNexus Neon"
                          />
                          <button
                            onClick={() => setCertTheme('executive_gold')}
                            className={`w-4 h-4 rounded-full bg-amber-500 border transition-all cursor-pointer ${certTheme === 'executive_gold' ? 'ring-2 ring-white scale-110 border-amber-300' : 'border-transparent opacity-60 hover:opacity-90'}`}
                            title="Executive Gold"
                          />
                          <button
                            onClick={() => setCertTheme('plasma_blue')}
                            className={`w-4 h-4 rounded-full bg-indigo-600 border transition-all cursor-pointer ${certTheme === 'plasma_blue' ? 'ring-2 ring-white scale-110 border-indigo-400' : 'border-transparent opacity-60 hover:opacity-90'}`}
                            title="Plasma Blue"
                          />
                          <button
                            onClick={() => setCertTheme('phantom_grey')}
                            className={`w-4 h-4 rounded-full bg-slate-500 border transition-all cursor-pointer ${certTheme === 'phantom_grey' ? 'ring-2 ring-white scale-110 border-slate-300' : 'border-transparent opacity-60 hover:opacity-90'}`}
                            title="Phantom Stealth"
                          />
                        </div>
                      </div>

                      {/* Interactive Control Panel */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] p-3 rounded-xl font-mono text-[10px]">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setHoloActive(!holoActive)}
                            className={`px-3 py-1.5 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${holoActive ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'bg-transparent border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${holoActive ? 'animate-spin' : ''}`} />
                            <span>HOLOGRAM FILTER: {holoActive ? 'ACTIVE' : 'DEACTIVATED'}</span>
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => downloadCertificatePDF({ certificate: verifyResult, language })}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold rounded flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                            title="Download verifiable signed PDF certificate with embedded QR code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>VERIFIABLE PDF (QR CODE)</span>
                          </button>

                          <button
                            onClick={() => handlePrintCertificate(verifyResult)}
                            className="px-3 py-1.5 bg-[var(--bg-input)] hover:bg-white/10 border border-[var(--border-main)] text-[var(--text-main)] hover:text-white rounded flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                            title="Export credential to browser print utility"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>PRINT / VIEW PDF</span>
                          </button>
                          
                          <button
                            onClick={() => handleDownloadAttestation(verifyResult)}
                            className="px-3 py-1.5 bg-[var(--bg-input)] hover:bg-white/10 border border-[var(--border-main)] text-[var(--text-main)] hover:text-white rounded flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                            title="Download cryptographic audit proof file (JSON)"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>DOWNLOAD ATTESTATION</span>
                          </button>
                        </div>
                      </div>

                      {/* Visual Certificate Mock */}
                      <div className={`p-8 rounded-2xl relative overflow-hidden text-center transition-all duration-500 select-none border border-[var(--border-main)] ${
                        certTheme === 'cyberpunk' ? 'bg-gradient-to-b from-[#0a0f1d] to-[#04060b] border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-[var(--text-main)]' :
                        certTheme === 'executive_gold' ? 'bg-gradient-to-b from-[#12110e] to-[#060606] border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-[var(--text-main)]' :
                        certTheme === 'plasma_blue' ? 'bg-gradient-to-b from-[#060b1e] to-[#020409] border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] text-indigo-200' :
                        'bg-[#0f1012] border-slate-600/30 shadow-[0_0_30px_rgba(255,255,255,0.03)] text-[var(--text-muted)]'
                      }`}>
                        {/* Tech line markings / corner brackets */}
                        <div className={`absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 transition-all ${
                          certTheme === 'cyberpunk' ? 'border-cyan-400' :
                          certTheme === 'executive_gold' ? 'border-amber-400' :
                          certTheme === 'plasma_blue' ? 'border-indigo-400' : 'border-slate-500'
                        }`}></div>
                        <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 transition-all ${
                          certTheme === 'cyberpunk' ? 'border-cyan-400' :
                          certTheme === 'executive_gold' ? 'border-amber-400' :
                          certTheme === 'plasma_blue' ? 'border-indigo-400' : 'border-slate-500'
                        }`}></div>
                        <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 transition-all ${
                          certTheme === 'cyberpunk' ? 'border-cyan-400' :
                          certTheme === 'executive_gold' ? 'border-amber-400' :
                          certTheme === 'plasma_blue' ? 'border-indigo-400' : 'border-slate-500'
                        }`}></div>
                        <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 transition-all ${
                          certTheme === 'cyberpunk' ? 'border-cyan-400' :
                          certTheme === 'executive_gold' ? 'border-amber-400' :
                          certTheme === 'plasma_blue' ? 'border-indigo-400' : 'border-slate-500'
                        }`}></div>

                        {/* Holographic Laser Shimmer scanning line */}
                        {holoActive && (
                          <>
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
                            <div className="absolute left-0 right-0 h-[2px] bg-cyan-500/50 blur-[4px] animate-pulse pointer-events-none top-1/4 select-none" style={{
                              animation: 'scanLine 6s linear infinite',
                              backgroundImage: certTheme === 'executive_gold' ? 'linear-gradient(90deg, transparent, #fbbf24, transparent)' :
                                               certTheme === 'plasma_blue' ? 'linear-gradient(90deg, transparent, #6366f1, transparent)' :
                                               certTheme === 'phantom_grey' ? 'linear-gradient(90deg, transparent, #9ca3af, transparent)' :
                                               'linear-gradient(90deg, transparent, #22d3ee, transparent)'
                            }}></div>
                            {/* Certificate scanLine animations are managed inside App.css */}
                          </>
                        )}

                        <div className="space-y-6 relative z-10">
                          <div className="text-[10px] tracking-[0.3em] text-[var(--text-muted)] uppercase font-mono">AUTHENTIC HIGH-SEC NODAL RECORD</div>
                          
                          {/* Beautiful Seal / Badge Graphic */}
                          <div className="flex justify-center">
                            <div className={`relative group w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed transition-all duration-500 ${
                              certTheme === 'cyberpunk' ? 'border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]' :
                              certTheme === 'executive_gold' ? 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]' :
                              certTheme === 'plasma_blue' ? 'border-indigo-500/40 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]' :
                              'border-slate-600 bg-slate-900 shadow-none'
                            }`}>
                              <svg className={`w-12 h-12 transition-transform group-hover:scale-110 ${
                                certTheme === 'cyberpunk' ? 'text-cyan-400' :
                                certTheme === 'executive_gold' ? 'text-amber-400' :
                                certTheme === 'plasma_blue' ? 'text-indigo-400' : 'text-[var(--text-main)]'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                              </svg>
                              <span className={`absolute -bottom-1.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                certTheme === 'cyberpunk' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]' :
                                certTheme === 'executive_gold' ? 'bg-amber-500 text-black' :
                                certTheme === 'plasma_blue' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'
                              }`}>
                                VERIFIED
                              </span>
                            </div>
                          </div>

                          <h2 className={`text-base font-black tracking-[0.2em] font-mono transition-colors ${
                            certTheme === 'cyberpunk' ? 'text-white' :
                            certTheme === 'executive_gold' ? 'text-amber-100' :
                            certTheme === 'plasma_blue' ? 'text-white' : 'text-[var(--text-main)]'
                          }`}>
                            CYBERNEXUS CERTIFICATE OF EXCELLENCE
                          </h2>

                          <div className="max-w-md mx-auto space-y-3">
                            <p className="text-[11px] opacity-70 leading-relaxed font-sans">
                              This official secure credential validates that the named security professional has successfully completed comprehensive, hands-on offensive and defensive cybersecurity modules, system audit simulators, and active firewalls.
                            </p>
                            
                            <div className="py-2">
                              <div className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-wider">recipient hacker node</div>
                              <div className={`text-2xl font-black font-mono tracking-widest uppercase transition-colors ${
                                certTheme === 'cyberpunk' ? 'text-cyan-400' :
                                certTheme === 'executive_gold' ? 'text-amber-400' :
                                certTheme === 'plasma_blue' ? 'text-indigo-400' : 'text-white'
                              }`}>
                                {verifyResult.recipient}
                              </div>
                              <div className="w-16 h-[2px] mx-auto mt-1" style={{
                                background: certTheme === 'executive_gold' ? '#fbbf24' :
                                            certTheme === 'plasma_blue' ? '#6366f1' :
                                            certTheme === 'phantom_grey' ? '#9ca3af' : '#06b6d4'
                              }}></div>
                            </div>

                            <p className="text-[11px] opacity-70">
                              for completing specialized modules in practical curriculum:
                            </p>

                            <div className={`py-3 px-5 rounded-xl border font-bold text-xs uppercase tracking-wide inline-block ${
                              certTheme === 'cyberpunk' ? 'bg-cyan-500/5 border-cyan-500/20 text-white' :
                              certTheme === 'executive_gold' ? 'bg-amber-500/5 border-amber-500/20 text-white' :
                              certTheme === 'plasma_blue' ? 'bg-indigo-500/5 border-indigo-500/20 text-white' :
                              'bg-slate-900 border-[var(--border-subtle)] text-[var(--text-main)]'
                            }`}>
                              {verifyResult.course}
                            </div>
                          </div>

                          {/* Verified endorsement badges based on track slug */}
                          <div className="pt-2 max-w-md mx-auto space-y-1.5 text-center">
                            <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-widest block">verified skill endorsements</span>
                            <div className="flex flex-wrap justify-center gap-1.5">
                              {verifyResult.id.includes('web-security') || verifyResult.id.includes('lessons') ? (
                                <>
                                  {['OWASP Top 10 Auditing', 'SQLi Injection Defense', 'Cross-Site Scripting Mitigation', 'Auth Tokens Protection'].map(tag => (
                                    <span key={tag} className="text-[9px] bg-[var(--bg-input)] border border-[var(--border-subtle)] px-2 py-0.5 rounded text-[var(--text-muted)]">{tag}</span>
                                  ))}
                                </>
                              ) : verifyResult.id.includes('linux-fundamentals') ? (
                                <>
                                  {['Linux Privilege Escalation', 'System Log Audits', 'Secure Cron Administration', 'PAM Security Framework'].map(tag => (
                                    <span key={tag} className="text-[9px] bg-[var(--bg-input)] border border-[var(--border-subtle)] px-2 py-0.5 rounded text-[var(--text-muted)]">{tag}</span>
                                  ))}
                                </>
                              ) : verifyResult.id.includes('ethical-hacking') ? (
                                <>
                                  {['Active Nmap Reconnaissance', 'Hydra SSH Exploitation', 'Assembly Jumps Decryption', 'Exploitative Red Teaming'].map(tag => (
                                    <span key={tag} className="text-[9px] bg-[var(--bg-input)] border border-[var(--border-subtle)] px-2 py-0.5 rounded text-[var(--text-muted)]">{tag}</span>
                                  ))}
                                </>
                              ) : (
                                <>
                                  {['Decentralized Node Audit', 'Simulated Penetration Scans', 'Active Defense Deployments', 'Secure Cryptographic Handshake'].map(tag => (
                                    <span key={tag} className="text-[9px] bg-[var(--bg-input)] border border-[var(--border-subtle)] px-2 py-0.5 rounded text-[var(--text-muted)]">{tag}</span>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Credentials block */}
                          <div className="grid grid-cols-2 gap-4 text-[10px] text-[var(--text-muted)] pt-4 border-t border-[var(--border-subtle)] text-left max-w-lg mx-auto">
                            <div className="space-y-1">
                              <div>ID: <span className="text-[var(--text-main)] uppercase select-all font-semibold">{verifyResult.id}</span></div>
                              <div>STATUS: <span className="text-emerald-400 font-bold">{verifyResult.status}</span></div>
                              <div>SECURITY LEVEL: <span className="text-cyan-400 font-bold">{verifyResult.badgeType}</span></div>
                            </div>
                            <div className="space-y-1 text-right">
                              <div>ISSUED: <span className="text-[var(--text-main)]">{verifyResult.issueDate}</span></div>
                              <div>AUTHORITY: <span className="text-[var(--text-main)] font-medium">{verifyResult.issuer}</span></div>
                              <div>CRYPTO PROOF: <span className="text-[var(--text-muted)] font-mono text-[9px] select-all">SHA256: 7f81a54...</span></div>
                            </div>
                          </div>

                          {/* QR Code and Ledger status verification log */}
                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xs mx-auto">
                            <div className="w-16 h-16 border border-[var(--border-main)] bg-black/40 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                              <svg className="w-full h-full text-[var(--text-muted)] hover:text-white transition-colors animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm1 1h2v2H5V5zm9-3h8v8h-8V2zm2 2v4h4V4h-4zm1 1h2v2h-2V5zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm1 1h2v2H5v-2zm12-3h5v2h-5v-2zm3 3h2v5h-2v-5zm-3 2h2v3h-2v-3zm-3 1h2v2h-2v-2zm-3-3h2v2h-2v-2zm5-2h2v2h-2v-2zm0 5h2v2h-2v-2z" />
                              </svg>
                            </div>
                            <div className="text-left space-y-0.5 text-[9px] text-[var(--text-muted)] font-mono">
                              <div className="text-emerald-400 font-bold flex items-center gap-1">🟢 VALID PROTOCOL SYNCED</div>
                              <div>LEDGER BLOCK: #892,109 (SECURED)</div>
                              <div>CONSENSUS ALGORITHM: POA</div>
                              <div>SIGNATURE MATCH: VERIFIED OK</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <XCircle className="w-5 h-5" /> {verifyResult.error || 'INVALID VERIFICATION ID'}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* Floating Real-Time Live Intel Notification Toast Banner */}
      {activeToastNotif && (
        <div className="fixed top-20 right-6 z-50 max-w-sm w-full bg-[var(--bg-card)]/95 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] rounded-2xl p-4 animate-fade-in font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                {activeToastNotif.type === 'chat' ? `CHAT @${activeToastNotif.username || 'Hacker'}` :
                 activeToastNotif.type === 'alert' ? '🚨 SOC NETWORK ALERT' :
                 activeToastNotif.type === 'success' ? '🚨 EXPLOIT INTRUSION' :
                 activeToastNotif.type === 'command' ? '💻 TERMINAL EXEC' :
                 '📡 INTEL BROADCAST'}
              </span>
            </div>
            <button
              onClick={() => setActiveToastNotif(null)}
              className="text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer p-0.5"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-[var(--text-main)] text-xs leading-relaxed line-clamp-3">
            {activeToastNotif.message}
          </p>

          <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px]">
            <span className="text-[var(--text-muted)]">{activeToastNotif.time}</span>
            <button
              onClick={() => {
                setActiveTab('live');
                setActiveToastNotif(null);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1 cursor-pointer"
            >
              OPEN LIVE INTEL FEED <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userProfile={userProfile} 
        onSaveProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))} 
      />

      {/* PAYMENT MODAL FOR EXPERT COURSES */}
      <PaymentModal
        isOpen={!!paymentModalCourse}
        onClose={() => setPaymentModalCourse(null)}
        course={paymentModalCourse}
        userProfile={userProfile}
        language={language}
        onPaymentSubmitted={(newPayment) => {
          setUserPayments(prev => [newPayment, ...prev]);
          loadUserPayments();
        }}
      />
    </div>
  );
}