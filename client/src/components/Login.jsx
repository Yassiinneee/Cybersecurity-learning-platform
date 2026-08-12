import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Globe, Key, Shield, Loader2, ArrowRight, Sun, Moon, Eye, EyeOff, Heart } from 'lucide-react';
import { t } from '../translations';
import { syncUserToFirestore } from '../firebase';

export default function Login({ onSuccess, onGoogleConnect, onSwitchToRegister, theme, onToggleTheme, language = 'en', onToggleLanguage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tr = (key, fallback) => t(language, key, fallback);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError(tr('auth.emailPasswordRequired', 'Email and Password are required.'));
      setLoading(false);
      return;
    }

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return '';
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCookie('XSRF-TOKEN')
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.errors?.[0]?.msg || tr('auth.invalidCredentials', 'Invalid login credentials.'));
        setLoading(false);
        return;
      }

      setSuccess(tr('auth.handshakeSuccess', 'Handshake successful! Logged in.'));
      if (data.user) {
        syncUserToFirestore(data.user);
      }
      setTimeout(() => {
        onSuccess(data.user);
      }, 500);
    } catch (err) {
      console.error(err);
      setError(tr('auth.networkError', 'Network error connecting to auth server.'));
      setLoading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex items-center justify-center p-4 relative overflow-hidden font-sans ${theme === 'light' ? 'light' : ''}`}>
      {/* Cyberpunk decoration grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Header Controls (Theme & Language) */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            type="button"
            title="Toggle Language"
            className="px-3 py-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-panel)] text-[var(--text-bright)] hover:bg-[var(--bg-input)] transition-all cursor-pointer flex items-center gap-1.5 font-mono text-xs font-bold shadow-md"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className={language === 'en' ? 'text-cyan-400 font-bold' : 'text-[var(--text-muted)]'}>EN</span>
            <span className="text-[var(--border-main)]">|</span>
            <span className={language === 'fr' ? 'text-cyan-400 font-bold' : 'text-[var(--text-muted)]'}>FR</span>
          </button>
        )}
        <button
          onClick={onToggleTheme}
          type="button"
          title="Toggle connection theme protocol"
          className="p-2 rounded-xl border border-[var(--border-main)] bg-[var(--bg-panel)] text-[var(--text-main)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-input)] transition-all cursor-pointer flex items-center justify-center shadow-md"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-indigo-500" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </button>
      </div>

      <div className="relative w-full max-w-md bg-[var(--bg-panel)]/90 border border-[var(--border-main)] rounded-2xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-white"></div>
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-[var(--text-bright)] font-mono mt-3">
            CYBER<span className="text-cyan-400">NEXUS</span>
          </h1>
          <p className="text-[var(--text-muted)] text-xs font-mono uppercase tracking-widest">{tr('auth.subTitle', 'Interactive Pentesting & Learning Node')}</p>
        </div>

        {/* Auth Switcher Tabs */}
        <div className="grid grid-cols-2 bg-[var(--bg-input)] border border-[var(--border-subtle)] p-1 rounded-xl">
          <button
            onClick={() => {
              setError('');
              setSuccess('');
            }}
            className="py-2 text-xs font-bold font-mono rounded-lg transition-all bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
          >
            {tr('auth.loginTab', '[ LOGIN SESSION ]')}
          </button>
          <button
            onClick={onSwitchToRegister}
            className="py-2 text-xs font-bold font-mono rounded-lg transition-all text-[var(--text-muted)] hover:text-[var(--text-bright)]"
          >
            {tr('auth.registerTab', '[ CREATE NODE ]')}
          </button>
        </div>

        {/* Alert Status Feedback */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-mono">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] font-mono">{tr('auth.emailLabel', 'Node Communication Email')}</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                placeholder={tr('auth.emailPlaceholder', 'e.g. name@domain.com')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl py-2.5 pl-11 pr-4 text-sm text-[var(--text-input)] placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] font-mono">{tr('auth.passwordLabel', 'Encryption Password')}</label>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl py-2.5 pl-11 pr-11 text-sm text-[var(--text-input)] placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[var(--text-muted)] hover:text-[var(--text-bright)] transition-colors cursor-pointer"
                title={showPassword ? tr('auth.hidePassword', 'Hide password') : tr('auth.showPassword', 'Show password')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{tr('auth.negotiating', 'NEGOTIATING SECURITY TUNNEL...')}</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>{tr('auth.initSessionBtn', 'INITIALIZE SECURE SESSION')}</span>
              </>
            )}
          </button>
        </form>

        {/* Custom Interactive Footer */}
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]/60 text-center space-y-2 font-mono text-[11px]">
          <p className="text-[var(--text-muted)] hover:text-cyan-400 transition-colors cursor-default font-semibold flex items-center justify-center gap-1.5 flex-wrap">
            <span>© {currentDateTime.getFullYear()}</span>
            <span className="text-cyan-400 font-bold tracking-wider hover:text-cyan-300">CyberNexus</span>
            <span className="text-[var(--text-muted)]">{tr('auth.designedBy', 'designed by')}</span>
            <span className="text-cyan-300 font-bold hover:underline cursor-pointer">Yassine Kalthoum</span>
          </p>
          <p className="text-[10px] text-[var(--text-muted)]/80 flex items-center justify-center gap-1.5 flex-wrap">
            <span>{tr('auth.designedWith', 'Designed with')}</span>
            <Heart className="w-3 h-3 text-red-500 inline animate-pulse fill-red-500/30" />
            <span>{tr('auth.using', 'using')}</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-[9px] hover:bg-cyan-500/20 transition-all cursor-pointer">
              MERN
            </span>
            <span>{tr('auth.techStack', 'technical stack')}</span>
            <span className="opacity-40">•</span>
            <span>{tr('auth.allRightsReserved', 'All rights reserved.')}</span>
          </p>
          <div className="pt-1 flex items-center justify-center gap-2 text-[10px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{currentDateTime.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span className="opacity-40">•</span>
              <span className="text-emerald-300">{currentDateTime.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
