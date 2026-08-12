import React, { useState } from 'react';
import { X, User, MapPin, Calendar, Save, CheckCircle, Shield, AlertCircle, Loader2, Key, Lock, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, userProfile, onSaveProfile }) {
  if (!isOpen) return null;

  const [username, setUsername] = useState(userProfile?.username || '');
  const [age, setAge] = useState(userProfile?.age !== undefined && userProfile?.age !== null ? userProfile.age : '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [gender, setGender] = useState(userProfile?.gender || '');
  
  // Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Name / Username cannot be empty.');
      return;
    }

    if (showPasswordSection || newPassword) {
      if (!newPassword) {
        setErrorMsg('Please enter a new password or collapse the password section.');
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New passwords do not match.');
        return;
      }
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        username: username.trim(),
        age: age ? Number(age) : null,
        location: location.trim(),
        gender: gender,
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      // 1. Send update to backend API
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        onSaveProfile(data.user);
        setSaveSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1200);
      } else if (!res.ok && data.error) {
        setErrorMsg(data.error);
      } else {
        // Fallback for local/offline mode or non-authenticated user session
        onSaveProfile({
          username: username.trim(),
          age: age ? Number(age) : null,
          location: location.trim(),
          gender: gender,
        });
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.warn('Backend update error, saving profile locally:', err);
      onSaveProfile({
        username: username.trim(),
        age: age ? Number(age) : null,
        location: location.trim(),
        gender: gender,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-2xl shadow-2xl overflow-hidden font-mono text-[var(--text-main)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-bright)] tracking-wide">SETTINGS & PROFILE</h2>
              <p className="text-[10px] text-[var(--text-muted)]">Configure operative metadata & credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-panel)] text-[var(--text-muted)] hover:text-[var(--text-bright)] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-bounce">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Profile settings saved successfully!</span>
            </div>
          )}

          {/* User Initials Badge Display */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 p-0.5 bg-cyan-950 flex items-center justify-center text-sm font-bold text-cyan-400 font-mono shadow-[0_0_10px_rgba(34,211,238,0.2)] shrink-0">
              {username ? username.slice(0, 2).toUpperCase() : 'YS'}
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-bold text-[var(--text-bright)] truncate">{username || 'Operative'}</div>
              <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{userProfile?.role || 'Student'} • LVL {userProfile?.level || 1}</span>
              </div>
            </div>
          </div>

          {/* Form Field 1: Name / Username */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Name / Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name or handle..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-input)] text-[var(--text-bright)] focus:outline-none focus:border-cyan-500 text-xs transition-all"
              required
            />
          </div>

          {/* Form Field 2: Age */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Age</span>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 25"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-input)] text-[var(--text-bright)] focus:outline-none focus:border-cyan-500 text-xs transition-all"
            />
          </div>

          {/* Form Field 3: Location */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Paris, France / Tokyo / Remote"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-main)] bg-[var(--bg-input)] text-[var(--text-bright)] focus:outline-none focus:border-cyan-500 text-xs transition-all"
            />
          </div>

          {/* Form Field 4: Gender */}
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gender</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender(gender === 'Man' ? '' : 'Man')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  gender === 'Man'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'bg-[var(--bg-input)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <span>👨 Man</span>
              </button>
              <button
                type="button"
                onClick={() => setGender(gender === 'Woman' ? '' : 'Woman')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  gender === 'Woman'
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                    : 'bg-[var(--bg-input)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <span>👩 Woman</span>
              </button>
            </div>
          </div>

          {/* Email Read-only Info */}
          {userProfile?.email && (
            <div className="p-2.5 rounded-xl bg-[var(--bg-input)]/50 border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex justify-between items-center">
              <span>Email Address:</span>
              <span className="font-mono text-[var(--text-bright)]">{userProfile.email}</span>
            </div>
          )}

          {/* Password Toggle Section */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-panel)] border border-[var(--border-main)] text-xs text-[var(--text-bright)] font-semibold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>CHANGE PASSWORD</span>
              </div>
              {showPasswordSection ? (
                <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </button>

            {showPasswordSection && (
              <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-[var(--bg-input)]/40 border border-[var(--border-subtle)] animate-fadeIn">
                {/* Current Password Field */}
                <div className="space-y-1">
                  <label className="text-[11px] text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span>Current Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password..."
                      className="w-full px-3 py-2 pr-9 rounded-lg border border-[var(--border-main)] bg-[var(--bg-input)] text-[var(--text-bright)] focus:outline-none focus:border-cyan-500 text-xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-bright)] cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-1">
                  <label className="text-[11px] text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-cyan-400" />
                    <span>New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters..."
                      className="w-full px-3 py-2 pr-9 rounded-lg border border-[var(--border-main)] bg-[var(--bg-input)] text-[var(--text-bright)] focus:outline-none focus:border-cyan-500 text-xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-bright)] cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div className="space-y-1">
                  <label className="text-[11px] text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-cyan-400" />
                    <span>Confirm New Password</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-main)] bg-[var(--bg-input)] text-[var(--text-bright)] focus:outline-none focus:border-cyan-500 text-xs transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-main)] bg-transparent hover:bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-bright)] text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)] cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
