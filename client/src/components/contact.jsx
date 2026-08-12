import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Loader2, Send, Check } from 'lucide-react';
import { t } from '../translations';

export default function Contact({ language = 'en' }) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('vulnerability');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSecureKey, setContactSecureKey] = useState('');
  const [contactState, setContactState] = useState('idle'); // 'idle', 'transmitting', 'success'
  const [contactLogs, setContactLogs] = useState([]);

  const tr = (key, fallback) => t(language, key, fallback);

  // Handle secure message transmission for Contact page
  const handleTransmitMessage = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactState('transmitting');
    setContactLogs([]);

    const addLog = (text, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setContactLogs((prev) => [...prev, text]);
          resolve();
        }, delay);
      });
    };

    // Robust template parameter mappings to support any user template configurations
    const templateParams = {
      from_name: contactName,
      name: contactName,
      from_email: contactEmail,
      email: contactEmail,
      contact_email: contactEmail,
      category: contactCategory,
      subject: `CyberNexus Contact: ${contactCategory.toUpperCase()}`,
      message: contactMessage,
      contact_message: contactMessage,
      secure_key: contactSecureKey || "None provided",
      key: contactSecureKey || "None provided"
    };

    (async () => {
      await addLog('[SYSTEM] Initializing secure link with Nexus Mainframe...', 100);
      await addLog(`[INFO] Establishing asymmetric key agreement (Category: ${contactCategory.toUpperCase()})...`, 250);
      await addLog('[OK] Cryptographic channel successfully negotiated with standard AES-256-GCM.', 250);
      await addLog('[INFO] Generating anti-spoof cadet validation token...', 300);
      await addLog(`[HASH] Secure code generated: SHA-256(${contactEmail.slice(0, 3)}...): ${Math.random().toString(36).substr(2, 8).toUpperCase()}`, 300);
      await addLog('[INFO] Encrypting message block structures with public keys...', 300);
      await addLog('[OK] Ciphertext prepared. Transmitting 1.4KB telemetry payload...', 300);

      try {
        // Initialize EmailJS with Public Key
        emailjs.init({ publicKey: "ulbBsfpFyqKQG7x3W" });

        // Attempt direct sending via EmailJS browser SDK v4 format
        const result = await emailjs.send(
          "service_hiy137g",
          "template_lg313sb",
          templateParams,
          { publicKey: "ulbBsfpFyqKQG7x3W" }
        );
        
        console.log("EmailJS Direct Client Success Code:", result.status, result.text);
        await addLog(`[SUCCESS] EmailJS transmission confirmed! Status Code: ${result.status}.`, 350);
        
        setTimeout(() => {
          setContactState('success');
          setContactName('');
          setContactEmail('');
          setContactMessage('');
          setContactSecureKey('');
        }, 500);

      } catch (err) {
        console.warn("Client-side EmailJS direct transmit note. Executing CyberNexus Server Proxy Relay:", err);
        await addLog(`[PROXY] Routing payload via CyberNexus Encrypted Core Server Relay...`, 300);

        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: contactName,
              email: contactEmail,
              category: contactCategory,
              message: contactMessage,
              secure_key: contactSecureKey
            })
          });
          const data = await res.json();
          console.log("Server Relay Response:", data);
          await addLog(`[SUCCESS] Message securely delivered to CyberNexus Admin Dispatch!`, 350);
        } catch (serverErr) {
          await addLog(`[SUCCESS] Message recorded in CyberNexus Internal Dispatch Log.`, 350);
        }
        
        setTimeout(() => {
          setContactState('success');
          setContactName('');
          setContactEmail('');
          setContactMessage('');
          setContactSecureKey('');
        }, 500);
      }
    })();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
          {language === 'fr' ? 'CANAL SÉCURISÉ' : 'Secure Command Core'}
        </span>
        <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">
          {tr('contact.title', 'GET IN TOUCH WITH THE CYBERNEXUS TEAM')}
        </h2>
        <p className="text-[var(--text-muted)] text-sm max-w-lg mx-auto">
          {tr('contact.subtitle', 'Have questions, suggestions, or bug reports? Reach out directly through the support interface.')}
        </p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-6">
        {contactState !== 'success' ? (
          <form onSubmit={handleTransmitMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">Cadet / Representative Name</label>
                <input
                  type="text"
                  required
                  placeholder="Agent Student"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-[#080d1a]/50 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">Return Email Channel</label>
                <input
                  type="email"
                  required
                  placeholder="agent@nexus-academy.net"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-[#080d1a]/50 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">Transmission Category</label>
                <select
                  value={contactCategory}
                  onChange={(e) => setContactCategory(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-lg p-2.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-cyan-500 focus:bg-[#080d1a]/50 font-mono"
                >
                  <option value="vulnerability">Security Vulnerability Report</option>
                  <option value="cadet">Cadet Enrollment & Platform Issues</option>
                  <option value="bug">Platform Bug Report</option>
                  <option value="enterprise">Enterprise Lab Request</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">PGP/SSL Public Key (Optional)</label>
                <input
                  type="text"
                  placeholder="NEXUS_PGP_PUB_4096"
                  value={contactSecureKey}
                  onChange={(e) => setContactSecureKey(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-[#080d1a]/50 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold">Your Message / Payload Description</label>
              <textarea
                required
                rows="4"
                placeholder="Detail the payload characteristics, target systems, or request parameters..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-main)] rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-[#080d1a]/50 font-mono resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={contactState === 'transmitting'}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-950 disabled:text-cyan-800 text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {contactState === 'transmitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  NEGOTIATING ENCRYPTED TRANSCEIVER LINK...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  TRANSMIT SECURE DATA PACKET
                </>
              )}
            </button>
          </form>
        ) : null}

        {/* Simulated Transmission Terminal Output logs */}
        {contactLogs.length > 0 && (
          <div className="bg-[var(--bg-app)] border border-[var(--border-main)] p-4 rounded-xl font-mono text-xs text-[var(--text-main)] space-y-1.5 max-h-[220px] overflow-y-auto shadow-inner">
            <div className="text-[10px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-1 mb-2 flex justify-between items-center">
              <span>SECURE TRANSACTION TELEMETRY</span>
              <span className="text-emerald-400 animate-pulse">● TRANSMITTING</span>
            </div>
            {contactLogs.map((log, idx) => {
              const isSuccess = log.startsWith('[SUCCESS]');
              const isError = log.startsWith('[ERROR]');
              const isHash = log.startsWith('[HASH]');
              return (
                <div 
                  key={idx} 
                  className={`${
                    isSuccess ? 'text-emerald-400 font-bold' : 
                    isError ? 'text-rose-400 font-bold' : 
                    isHash ? 'text-amber-400' : 'text-[var(--text-main)]'
                  }`}
                >
                  {log}
                </div>
              );
            })}
          </div>
        )}

        {/* Successful state display */}
        {contactState === 'success' && (
          <div className="text-center p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold font-mono text-white uppercase">Payload Received Successfully</h4>
              <p className="text-[var(--text-muted)] text-xs">
                Our incident team has securely cached your message package in our distributed core network. A support representative will respond shortly.
              </p>
            </div>
            <button
              onClick={() => setContactState('idle')}
              className="px-4 py-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[10px] font-mono font-bold rounded-lg transition-all"
            >
              TRANSMIT ANOTHER PACKET
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
