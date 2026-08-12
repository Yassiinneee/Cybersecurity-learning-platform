import { useState } from 'react';
import { Shield, Award } from 'lucide-react';
import { t } from '../translations';

export default function About({ language = 'en' }) {
  const [aboutActiveSection, setAboutActiveSection] = useState('mission'); // 'mission', 'timeline', 'instructors'

  const tr = (key, fallback) => t(language, key, fallback);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 inline-block">
          {language === 'fr' ? 'DOSSIER PROJET' : 'PROJECT DOSSIER'}
        </span>
        <h2 className="text-3xl font-bold text-white font-mono uppercase tracking-wider">{tr('about.title', 'ABOUT CYBER NEXUS')}</h2>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          {tr('about.description', 'Cyber Nexus is an elite cloud-native interactive sandbox platform built to bridge the gap between static academic theory and practical console-level offensive and defensive capabilities.')}
        </p>
      </div>

      {/* Sub-navigation tabs within the About page */}
      <div className="flex border-b border-[var(--border-subtle)] gap-2">
        {[
          { id: 'mission', label: language === 'fr' ? 'Notre Mission' : 'Our Mission' },
          { id: 'timeline', label: language === 'fr' ? 'Feuille de Route' : 'Operational Roadmap' },
          { id: 'instructors', label: language === 'fr' ? 'Commandement' : 'Command Staff' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setAboutActiveSection(sec.id)}
            className={`px-4 py-2 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
              aboutActiveSection === sec.id
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Content depending on aboutActiveSection */}
      {aboutActiveSection === 'mission' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-4">
            <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 inline-block">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">
              {language === 'fr' ? 'Simulateurs Actifs Dynamiques' : 'Dynamic Active Simulators'}
            </h3>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              {language === 'fr' 
                ? 'Contrairement aux tutoriels statiques traditionnels, CyberNexus intègre un simulateur actif. Les utilisateurs écrivent directement des injections SQL, analysent les registres et exécutent de véritables diagnostics réseau.'
                : 'Unlike traditional static tutorial hubs, Cyber Nexus operates an active client-side and server-side virtualization emulator. Users directly write SQL injection payloads, trace stack frame overflows in Assembly registers, examine SSH brute-force log dumps, and execute actual network sweep diagnostics.'}
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 inline-block">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">
              {language === 'fr' ? 'Programme Gamifié' : 'The Gamified Syllabus'}
            </h3>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              {language === 'fr'
                ? 'Chaque module complété vous attribue des points d\'expérience (XP) liés à un radar de compétences. Gagnez des niveaux, débloquez des badges et téléchargez des certificats signés.'
                : 'We believe cyber expertise is forged through feedback loops. Each module completed awards raw Experience Points (XP) mapped dynamically to a visual Skill Radar. Earn points, trigger achievements, level up your class ranking, and download cryptographically signed verification certificate credentials.'}
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-4 md:col-span-2">
            <h3 className="text-base font-bold font-mono text-white border-b border-[var(--border-subtle)] pb-2">
              {tr('about.techStack', 'CORE TECHNOLOGY STACK')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-subtle)]">
                <div className="text-cyan-400 font-bold font-mono text-sm">React 18 + Vite</div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  {language === 'fr' ? 'Moteur Client Réactif' : 'Responsive Client Engine'}
                </div>
              </div>
              <div className="p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-subtle)]">
                <div className="text-cyan-400 font-bold font-mono text-sm">Socket.io</div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  {language === 'fr' ? 'Flux Menaces Temps Réel' : 'Live Global Threat Feeds'}
                </div>
              </div>
              <div className="p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-subtle)]">
                <div className="text-cyan-400 font-bold font-mono text-sm">Express JS</div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  {language === 'fr' ? 'Couche API Sécurisée' : 'Secure Core API Layer'}
                </div>
              </div>
              <div className="p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-subtle)]">
                <div className="text-cyan-400 font-bold font-mono text-sm">D3 / Recharts</div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono mt-1">
                  {language === 'fr' ? 'Radar de Compétences' : 'Dynamic Skill Radar Chart'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {aboutActiveSection === 'timeline' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold font-mono text-white border-b border-[var(--border-subtle)] pb-2">
            {language === 'fr' ? 'PARCOURS DE FORMATION DE L\'ÉLÈVE' : 'CADET TRAINING PATHWAY'}
          </h3>
          <div className="relative border-l-2 border-[var(--border-subtle)] pl-6 ml-4 space-y-8">
            {[
              { 
                title: language === 'fr' ? "Étape 01: Bases des Systèmes & Architecture" : "Stage 01: Systems & Architecture Foundations", 
                desc: language === 'fr' ? "Maîtrisez le système Linux, la gestion des permissions (chmod), les chemins relatifs/absolus et les commandes shell." : "Gain total proficiency in the Linux operating system, absolute vs relative pathing, permissions modification (chmod), and general shell operations.", 
                icon: "01", 
                status: language === 'fr' ? "Actif" : "Active" 
              },
              { 
                title: language === 'fr' ? "Étape 02: Reconnaissance Réseau & Cartographie" : "Stage 02: Network Reconnaissance & Mapping", 
                desc: language === 'fr' ? "Utilisez des scanners de ports (Nmap) pour cartographier les services ouverts, détecter les pare-feux et analyser les versions." : "Deploy stealth port scanners (Nmap) to map open services, identify active firewalls, and probe specific service version codes.", 
                icon: "02", 
                status: language === 'fr' ? "Actif" : "Active" 
              },
              { 
                title: language === 'fr' ? "Étape 03: Vecteurs d'Exploitation Web" : "Stage 03: Web Exploitation Vectors", 
                desc: language === 'fr' ? "Injectez des requêtes SQL pour interroger des bases de données et explorez les failles XSS côté client." : "Isolate dynamic queries to inject database commands (SQLi) and hijack client-side DOM or stored states (XSS) in secure browsers.", 
                icon: "03", 
                status: language === 'fr' ? "Actif" : "Active" 
              },
              { 
                title: language === 'fr' ? "Étape 04: Audits Système & Analyse de Logs" : "Stage 04: Host-Based Audits & Log Forensics", 
                desc: language === 'fr' ? "Examinez les journaux d'authentification SSH, identifiez les tentatives de force brute et appliquez des correctifs." : "Inspect remote login auth.log pipelines, detect SSH brute force parameters, identify compromised root sessions, and draft security mitigations.", 
                icon: "04", 
                status: language === 'fr' ? "Actif" : "Active" 
              },
              { 
                title: language === 'fr' ? "Étape 05: Cryptographie & Assembleur" : "Stage 05: Cryptography & Lower Assembly Core", 
                desc: language === 'fr' ? "Déchiffrez des ciphers, étudiez le hachage SHA-256 et analysez les instructions processeur de bas niveau." : "Crack rotational symmetric ciphers, analyze irreversible hashing integrity (SHA-256), trace stack pointers, and analyze processor instructions.", 
                icon: "05", 
                status: language === 'fr' ? "Actif" : "Active" 
              }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-11 top-0 w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white font-mono">{step.title}</h4>
                    <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed max-w-2xl">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aboutActiveSection === 'instructors' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { 
              name: "Agent 0xDEAD", 
              role: language === 'fr' ? "Spécialiste Offensive Lead" : "Offensive Lead Specialist", 
              specialty: "SQLi, Payload Crafting, RCE", 
              avatar: "💀", 
              bio: language === 'fr' ? "Expert red team spécialisé dans l'élaboration de payloads d'exploitation web dynamiques et de scanners automatisés." : "Former core red team operator specializing in high-impact dynamic web exploit payloads and automated scanning suites." 
            },
            { 
              name: "Valkyrie", 
              role: language === 'fr' ? "Responsable Incident SOC" : "SOC Incident Lead", 
              specialty: "Log Forensics, SIEM, Threat Hunting", 
              avatar: "🛡️", 
              bio: language === 'fr' ? "Ancienne auditrice d'infrastructures d'entreprise. Traque et neutralise les intrusions et attaques par force brute." : "Ex-enterprise infrastructure auditor. Tracks, logs, and neutralizes brute force host intrusions in high-density servers." 
            },
            { 
              name: "CipherMage", 
              role: language === 'fr' ? "Chef Cryptographie" : "Head of Cryptography", 
              specialty: "Decryption, Assembly Reverse Eng.", 
              avatar: "🔑", 
              bio: language === 'fr' ? "Mathématicien et analyste binaire. Déchiffre les systèmes de hachage et analyse le code assembleur." : "Mathematician and binary analyst. Deciphers secure hashing systems and translates lower assembly pointers." 
            }
          ].map((staff, idx) => (
            <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-cyan-500/30 p-5 rounded-2xl transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-main)] flex items-center justify-center text-2xl shadow-inner">
                  {staff.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold font-mono text-white">{staff.name}</h4>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">{staff.role}</span>
                </div>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{staff.bio}</p>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <div className="text-[9px] text-[var(--text-muted)] font-mono uppercase">{language === 'fr' ? 'DOMAINE D\'EXPERTISE' : 'EXPERT SECTOR'}</div>
                <div className="text-[10px] text-[var(--text-main)] font-mono font-bold mt-0.5">{staff.specialty}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

