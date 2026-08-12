import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Bell, BellOff, Volume2, VolumeX, Trash2, Filter, 
  Send, Copy, Check, Search, ShieldAlert, Zap, Terminal, MessageSquare, 
  Activity, Wifi, ChevronDown
} from 'lucide-react';

export default function Live({
  realtimeFeed = [],
  setRealtimeFeed,
  socketRef,
  userProfile = {},
  language = 'en',
  intelNotificationsEnabled,
  setIntelNotificationsEnabled,
  intelSoundEnabled,
  setIntelSoundEnabled
}) {
  const [chatInput, setChatInput] = useState('');
  const [feedFilter, setFeedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);
  
  const feedEndRef = useRef(null);
  const isFr = language === 'fr';

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isAutoScrollActive && feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [realtimeFeed, feedFilter, isAutoScrollActive]);

  const handleSendBroadcast = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const messageText = chatInput.trim();
    const username = userProfile?.username || 'Operative';

    if (socketRef?.current) {
      socketRef.current.emit('chat_message', {
        username: username,
        message: messageText
      });
    }

    // Fallback if socket is not connected or null
    if (!socketRef?.current?.connected) {
      const newLog = {
        id: `feed_${Date.now()}`,
        type: 'chat',
        username: username,
        message: `💬 [CHAT] ${username}: ${messageText}`,
        time: new Date().toLocaleTimeString()
      };
      if (setRealtimeFeed) {
        setRealtimeFeed((prev) => [...prev, newLog].slice(-50));
      }
    }

    setChatInput('');
  };

  const copyLogText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Stats calculation
  const totalCount = realtimeFeed.length;
  const chatCount = realtimeFeed.filter(l => l.type === 'chat').length;
  const alertCount = realtimeFeed.filter(l => l.type === 'alert').length;
  const intrusionCount = realtimeFeed.filter(l => l.type === 'success').length;

  const filteredFeed = realtimeFeed.filter(log => {
    const matchesFilter = feedFilter === 'all' || log.type === feedFilter;
    const matchesSearch = !searchQuery.trim() || 
      (log.message && log.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.username && log.username.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden font-mono">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[90px] pointer-events-none"></div>

      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-wide">
                {isFr ? 'Flux d\'Intelligence en Direct' : 'Live Intel Feed'}
                <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  {isFr ? 'RÉSEAU ACTIF' : 'SOCKET.IO LIVE'}
                </span>
              </h3>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">
                {isFr 
                  ? 'Surveillance télémétrique chiffrée en temps réel des nœuds SOC et diffusions d\'opérateurs.' 
                  : 'Real-time encrypted telemetry stream monitoring active SOC nodes & hacker broadcasts.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Notification Toggle */}
          <button
            type="button"
            onClick={() => setIntelNotificationsEnabled && setIntelNotificationsEnabled(!intelNotificationsEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              intelNotificationsEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white'
            }`}
            title={intelNotificationsEnabled ? "Notifications ON (Click to Disable)" : "Notifications OFF (Click to Enable)"}
          >
            {intelNotificationsEnabled ? <Bell className="w-3.5 h-3.5 text-emerald-400" /> : <BellOff className="w-3.5 h-3.5" />}
            <span>{isFr ? 'NOTIFS' : 'NOTIFS'}: {intelNotificationsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            type="button"
            onClick={() => setIntelSoundEnabled && setIntelSoundEnabled(!intelSoundEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              intelSoundEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white'
            }`}
            title={intelSoundEnabled ? "Audio Sound Effects ON" : "Audio Sound Effects OFF"}
          >
            {intelSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>AUDIO</span>
          </button>

          {/* Clear Buffer Button */}
          <button
            type="button"
            onClick={() => setRealtimeFeed && setRealtimeFeed([])}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-rose-400 bg-[var(--bg-input)] hover:bg-rose-500/10 border border-[var(--border-subtle)] hover:border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            title="Flush Feed Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFr ? 'VIDER' : 'FLUSH'}</span>
          </button>
        </div>
      </div>

      {/* Realtime Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
        <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] p-2.5 rounded-xl flex items-center justify-between">
          <span className="text-[var(--text-muted)] text-[10px] uppercase font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" /> {isFr ? 'TOTAL LOGS' : 'TOTAL LOGS'}
          </span>
          <span className="font-bold text-white text-sm">{totalCount}</span>
        </div>
        <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] p-2.5 rounded-xl flex items-center justify-between">
          <span className="text-[var(--text-muted)] text-[10px] uppercase font-semibold flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-amber-400" /> {isFr ? 'MESSAGES' : 'CHAT LOGS'}
          </span>
          <span className="font-bold text-amber-300 text-sm">{chatCount}</span>
        </div>
        <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] p-2.5 rounded-xl flex items-center justify-between">
          <span className="text-[var(--text-muted)] text-[10px] uppercase font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" /> {isFr ? 'ALERTES SOC' : 'SOC ALERTS'}
          </span>
          <span className="font-bold text-rose-300 text-sm">{alertCount}</span>
        </div>
        <div className="bg-[var(--bg-input)] border border-[var(--border-subtle)] p-2.5 rounded-xl flex items-center justify-between">
          <span className="text-[var(--text-muted)] text-[10px] uppercase font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" /> {isFr ? 'EXPLOITS' : 'INTRUSIONS'}
          </span>
          <span className="font-bold text-emerald-300 text-sm">{intrusionCount}</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-[var(--text-muted)] uppercase text-[9px] flex items-center gap-1 mr-1 shrink-0 font-bold">
            <Filter className="w-3 h-3 text-cyan-400" /> {isFr ? 'Filtre' : 'Filter'}:
          </span>
          {[
            { id: 'all', label: isFr ? 'TOUT' : 'ALL' },
            { id: 'chat', label: '💬 CHAT' },
            { id: 'alert', label: '📡 ALERTS' },
            { id: 'success', label: '🚨 INTRUSIONS' },
            { id: 'command', label: '💻 COMMANDS' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFeedFilter(f.id)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 font-bold text-[10px] ${
                feedFilter === f.id
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.35)]'
                  : 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative shrink-0 w-full sm:w-48">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={isFr ? "Rechercher log..." : "Filter logs..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-cyan-500 text-[11px] text-white placeholder-slate-500 pl-8 pr-3 py-1 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* Log Feed Display Window */}
      <div className="bg-[var(--bg-app)] border border-[var(--border-main)] rounded-xl p-3 h-[380px] overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-white/10 text-left">
        {filteredFeed.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)] text-xs space-y-2">
            <Wifi className="w-8 h-8 text-[var(--text-muted)]/50 animate-pulse" />
            <div className="font-bold text-white">{isFr ? 'Aucun log chiffré dans le tampon' : 'No telemetry logs found'}</div>
            <p className="text-[10px] max-w-sm opacity-80">
              {searchQuery 
                ? (isFr ? 'Aucun résultat ne correspond à votre recherche.' : 'No items matched your search filter.')
                : (isFr ? 'Laissez le canal ouvert pour capturer les alertes automatiques ou envoyez un message ci-dessous !' : 'Keep channel open to capture live SOC telemetry or broadcast a message below!')}
            </p>
          </div>
        ) : (
          filteredFeed.map((log, lIdx) => {
            const isSuccess = log.type === 'success';
            const isAlert = log.type === 'alert';
            const isCommand = log.type === 'command';
            const isChat = log.type === 'chat';

            return (
              <div 
                key={log.id || lIdx}
                className={`p-3 rounded-xl border text-xs transition-all leading-relaxed relative group ${
                  isSuccess ? "bg-emerald-950/25 border-emerald-500/35 text-emerald-200 hover:border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.05)]" :
                  isAlert ? "bg-rose-950/25 border-rose-500/35 text-rose-200 hover:border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.05)]" :
                  isCommand ? "bg-cyan-950/25 border-cyan-500/35 text-cyan-200 hover:border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.05)]" :
                  isChat ? "bg-[var(--bg-input)] border-cyan-500/20 text-[var(--text-main)] hover:border-cyan-500/40" :
                  "bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--text-muted)]"
                }`}
              >
                {/* Log Item Header Header */}
                <div className="flex justify-between items-center gap-2 mb-1.5 text-[10px] text-[var(--text-muted)] border-b border-white/5 pb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      isSuccess ? "bg-emerald-400 animate-ping" :
                      isAlert ? "bg-rose-400 animate-ping" :
                      isCommand ? "bg-cyan-400" :
                      isChat ? "bg-amber-400" : "bg-slate-400"
                    }`} />
                    {isSuccess ? "🚨 INTRUSION / FLAG EXPLOIT" :
                     isAlert ? "📡 SOC NETWORK ALERT" :
                     isCommand ? "💻 TERMINAL COMMAND EXEC" :
                     isChat ? `💬 @${log.username || 'Operative'}` : "ℹ️ INTEL BROADCAST"}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] opacity-70 font-mono">{log.time}</span>
                    <button
                      type="button"
                      onClick={() => copyLogText(log.id || lIdx, log.message)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-white p-0.5 rounded"
                      title="Copy Log Message"
                    >
                      {copiedId === (log.id || lIdx) ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                
                {/* Log Content */}
                <div className="text-xs break-words">{log.message}</div>
              </div>
            );
          })
        )}
        <div ref={feedEndRef} />
      </div>

      {/* Preset Quick Message Macros */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-[9px] scrollbar-none">
        <span className="text-[var(--text-muted)] shrink-0 font-bold uppercase">{isFr ? 'Macros Rapides:' : 'Quick Macros:'}</span>
        <button
          type="button"
          onClick={() => setChatInput("[🚨 ALERT] Port scan detected on internal gateway!")}
          className="px-2.5 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 shrink-0 cursor-pointer transition-colors"
        >
          [🚨 REPORT SCAN]
        </button>
        <button
          type="button"
          onClick={() => setChatInput("ping -c 4 10.10.12.8")}
          className="px-2.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 shrink-0 cursor-pointer transition-colors"
        >
          [💻 EXEC PING]
        </button>
        <button
          type="button"
          onClick={() => setChatInput("Hello fellow operatives! Operative node online.")}
          className="px-2.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 cursor-pointer transition-colors"
        >
          [💬 WAVE]
        </button>
        <button
          type="button"
          onClick={() => setChatInput("[STATUS] All SOC perimeter sensors reporting clean.")}
          className="px-2.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 shrink-0 cursor-pointer transition-colors"
        >
          [🛡️ STATUS OK]
        </button>
      </div>

      {/* Broadcast Chat Form */}
      <form onSubmit={handleSendBroadcast} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Terminal className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder={isFr ? "Diffuser un message chiffré sur le réseau..." : "Broadcast network security message or chat..."}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full bg-[var(--bg-app)] border border-[var(--border-main)] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 shadow-inner"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-1.5 shrink-0"
        >
          <span>{isFr ? 'DIFFUSER' : 'BROADCAST'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
