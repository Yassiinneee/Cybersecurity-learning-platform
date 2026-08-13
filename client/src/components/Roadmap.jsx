import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, CheckCircle2, Circle, 
  Sparkles, Shield, Terminal, BookOpen, Award, Wrench, 
  ArrowRight, Compass, Flag, Zap, Target, Layers, ChevronRight,
  RotateCcw, Lock, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import { t } from '../translations';

export default function Roadmap({ language = 'en' }) {
  const tr = (key, fallback) => t(language, key, fallback);
  const isFr = language === 'fr';

  // Selected Track / Specialization
  const [activeTrack, setActiveTrack] = useState('general');

  // Interactive Station State
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [userProgressLevel, setUserProgressLevel] = useState(() => {
    const saved = localStorage.getItem('cyber_nexus_roadmap_level');
    return saved ? parseInt(saved, 10) : 1; // 1-indexed (Station 1-7)
  });

  // Animation Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState(1); // 0.5, 1, 2, 4
  const [currentPosProgress, setCurrentPosProgress] = useState(0); // 0 to 1 along entire path length

  // User completed skills checklist per station
  const [completedSkills, setCompletedSkills] = useState(() => {
    const saved = localStorage.getItem('cyber_nexus_roadmap_skills');
    return saved ? JSON.parse(saved) : {};
  });

  const svgPathRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Save progress level to localStorage
  useEffect(() => {
    localStorage.setItem('cyber_nexus_roadmap_level', userProgressLevel.toString());
  }, [userProgressLevel]);

  // Save completed skills to localStorage
  useEffect(() => {
    localStorage.setItem('cyber_nexus_roadmap_skills', JSON.stringify(completedSkills));
  }, [completedSkills]);

  // Define Roadmaps for different specializations
  const roadmaps = {
    general: {
      id: 'general',
      title: isFr ? 'Parcours Global Cybersécurité' : 'All-Rounder Cybersecurity Roadmap',
      badge: isFr ? 'RECOMMANDÉ POUR DÉBUTANTS' : 'RECOMMENDED FOR ALL',
      description: isFr 
        ? 'Du niveau zéro absolu jusqu\'au rôle d\'Architecte Sécurité / CISO. Un parcours équilibré combinant théorie, pratique offensive, défense SOC et sécurité Cloud.'
        : 'From zero baseline to Security Architect / CISO. A comprehensive pathway balancing core IT foundations, pentesting, SOC defense, and cloud security.',
      stations: [
        {
          id: 'st-1',
          number: 1,
          title: isFr ? 'Bases Informatiques & Réseaux' : 'IT Foundations & Networking',
          levelTag: isFr ? 'Niveau 1 : Débutant' : 'Level 1 : Beginner',
          levelClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          estTime: isFr ? '1 - 2 Mois' : '1 - 2 Months',
          summary: isFr 
            ? 'Maîtrisez le modèle OSI, le protocole TCP/IP, les commandes Linux de base, la gestion Windows et la cryptographie élémentaire.'
            : 'Master the OSI model, TCP/IP fundamentals, Linux CLI navigation, Windows administration, and basic cryptographic primitives.',
          skills: [
            isFr ? 'Modèle OSI & Suite TCP/IP (IP, TCP, UDP, ICMP)' : 'OSI Model & TCP/IP Protocol Suite (IP, TCP, UDP, ICMP)',
            isFr ? 'Administration Terminal Linux (Bash, autorisations, processus)' : 'Linux Terminal Administration (Bash, permissions, processes)',
            isFr ? 'Notions de base DNS, DHCP, HTTP/S & SSH' : 'DNS, DHCP, HTTP/S & SSH Fundamentals',
            isFr ? 'Bases de la Cryptographie (Symétrique, Asymétrique, Hachage)' : 'Cryptography Essentials (Symmetric, Asymmetric, Hashing)'
          ],
          tools: ['Bash', 'Wireshark', 'Ping / Traceroute', 'OpenSSL'],
          certs: ['CompTIA Network+', 'CompTIA Security+'],
          recommendedLabId: 'intro_cyber'
        },
        {
          id: 'st-2',
          number: 2,
          title: isFr ? 'Reconnaissance & Scan Réseau' : 'Reconnaissance & Network Scanning',
          levelTag: isFr ? 'Niveau 2 : Novice' : 'Level 2 : Novice',
          levelClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          estTime: isFr ? '2 - 3 Mois' : '2 - 3 Months',
          summary: isFr 
            ? 'Apprenez à cartographier un réseau, identifier les ports ouverts, interroger les services et découvrir les vulnérabilités potentielles.'
            : 'Learn active and passive OSINT, network mapping, port discovery, service versioning, and vulnerability auditing.',
          skills: [
            isFr ? 'Techniques de Reconnaissance OSINT & DNS Lookup' : 'OSINT Reconnaissance & DNS Lookup Techniques',
            isFr ? 'Scans de ports avancés avec Nmap (SYN, UDP, NSE Scripts)' : 'Advanced Port Scanning with Nmap (SYN, UDP, NSE Scripts)',
            isFr ? 'Analyse de paquets réseau en direct avec Wireshark' : 'Live Packet Dissection & Capture with Wireshark',
            isFr ? 'Identification de vulnérabilités & CVEs' : 'Vulnerability Auditing & CVE Matching'
          ],
          tools: ['Nmap', 'Wireshark', 'Shodan', 'Whois'],
          certs: ['eJPT (eLearnSecurity Junior Penetration Tester)', 'CEH (Certified Ethical Hacker)'],
          recommendedLabId: 'sql_injection_basics'
        },
        {
          id: 'st-3',
          number: 3,
          title: isFr ? 'Sécurité Web & OWASP Top 10' : 'Web Application Security & OWASP',
          levelTag: isFr ? 'Niveau 3 : Intermédiaire' : 'Level 3 : Intermediate',
          levelClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          estTime: isFr ? '3 - 4 Mois' : '3 - 4 Months',
          summary: isFr 
            ? 'Comprenez l\'architecture web, interceptez les requêtes HTTP et exploitez les vulnérabilités critiques comme les injections SQL et Cross-Site Scripting.'
            : 'Understand HTTP protocol internals, intercept web traffic, and exploit top web vulnerabilities like SQL Injections, XSS, and CSRF.',
          skills: [
            isFr ? 'Proxy d\'interception & Modificateurs de requêtes (Burp Suite)' : 'Interception Proxies & Request Manipulation (Burp Suite)',
            isFr ? 'Exploitation des injections SQL (SQLi) & Bypass de formulaires' : 'SQL Injection (SQLi) Exploitation & Authentication Bypass',
            isFr ? 'Injections XSS (Reflected, Stored, DOM-based)' : 'Cross-Site Scripting (Reflected, Stored, DOM-based XSS)',
            isFr ? 'Contrôle d\'accès défaillant (BOLA/IDOR) & Inclusions de fichiers (LFI/RFI)' : 'Broken Access Control (IDOR) & Local File Inclusion (LFI)'
          ],
          tools: ['Burp Suite', 'OWASP ZAP', 'SQLmap', 'FFUF / Gobuster'],
          certs: ['eWPT (eLearnSecurity Web App Pentester)', 'PortSwigger Certified Practitioner'],
          recommendedLabId: 'sqli_bypass'
        },
        {
          id: 'st-4',
          number: 4,
          title: isFr ? 'Exploitation Système & Active Directory' : 'System Exploitation & Active Directory',
          levelTag: isFr ? 'Niveau 4 : Avancé' : 'Level 4 : Advanced',
          levelClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          estTime: isFr ? '4 - 5 Mois' : '4 - 5 Months',
          summary: isFr 
            ? 'Infiltrez des machines Windows/Linux, élevez vos privilèges, volez des hachages et attaquez des domaines Active Directory.'
            : 'Compromise Windows/Linux endpoints, execute privilege escalation, dump credentials, and compromise Active Directory domains.',
          skills: [
            isFr ? 'Utilisation du Metasploit Framework & Payloads Meterpreter' : 'Metasploit Framework & Meterpreter Payload Engineering',
            isFr ? 'Élévation de privilèges Linux (SUDO, SUID, Capabilities)' : 'Linux Privilege Escalation (SUDO, SUID, Misconfigurations)',
            isFr ? 'Élévation de privilèges Windows (Token Impersonation, Unquoted Paths)' : 'Windows Privilege Escalation (Token Manipulation, DLL Hijacking)',
            isFr ? 'Attaques Active Directory (Kerberoasting, Pass-the-Hash, BloodHound)' : 'Active Directory Attacks (Kerberoasting, Pass-the-Hash, BloodHound)'
          ],
          tools: ['Metasploit', 'John the Ripper', 'Mimikatz', 'BloodHound'],
          certs: ['OSCP (Offensive Security Certified Professional)', 'PNPT (TCM Security)'],
          recommendedLabId: 'buffer_overflow'
        },
        {
          id: 'st-5',
          number: 5,
          title: isFr ? 'Défense SOC & Threat Hunting' : 'SOC Defense, SIEM & Threat Hunting',
          levelTag: isFr ? 'Niveau 5 : Confirmé' : 'Level 5 : Senior',
          levelClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          estTime: isFr ? '3 - 5 Mois' : '3 - 5 Months',
          summary: isFr 
            ? 'Surveillez les réseaux d\'entreprise, analysez les journaux d\'événements (SIEM), détectez les intrusions et menez les réponses aux incidents.'
            : 'Monitor enterprise telemetries, analyze SIEM event logs, construct detection rules, and orchestrate incident response.',
          skills: [
            isFr ? 'Gestion des événements & Logs SIEM (Splunk, Elastic ELK)' : 'SIEM Log Analysis & Threat Correlation (Splunk, Elastic)',
            isFr ? 'Réponse aux incidents & Forensique mémoire (Volatility)' : 'Digital Forensics & Memory Analysis (Volatility, Autopsy)',
            isFr ? 'Règles de détection YARA & Sigma' : 'YARA & Sigma Detection Rule Authoring',
            isFr ? 'Analyse du Framework MITRE ATT&CK' : 'MITRE ATT&CK Matrix Mapping & TTP Detection'
          ],
          tools: ['Splunk', 'Elastic SIEM', 'Volatility', 'YARA'],
          certs: ['CompTIA CySA+', 'BTL1 (Blue Team Level 1)', 'GIAC GCIH'],
          recommendedLabId: 'xss_reflected'
        },
        {
          id: 'st-6',
          number: 6,
          title: isFr ? 'Rétro-Ingénierie & Analyse de Malware' : 'Reverse Engineering & Malware Analysis',
          levelTag: isFr ? 'Niveau 6 : Expert' : 'Level 6 : Expert',
          levelClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          estTime: isFr ? '5 - 6 Mois' : '5 - 6 Months',
          summary: isFr 
            ? 'Décompilez des exécutables malveillants, comprenez l\'assembleur x86/x64, analysez la mémoire et désarmez le code hostile.'
            : 'Disassemble compiled binaries, analyze x86/x64 assembly, extract command-and-control indicators, and deconstruct ransomware.',
          skills: [
            isFr ? 'Désassemblage & Décompilation C/C++ (Ghidra, IDA Pro)' : 'Disassembly & C/C++ Decompilation (Ghidra, IDA Pro)',
            isFr ? 'Analyse dynamique en Sandbox (ProcMon, Wireshark)' : 'Dynamic Sandbox Behavioral Analysis (ProcMon, x64dbg)',
            isFr ? 'Contournement des protections d\'anti-débogage & Obfuscation' : 'Anti-Debugging Bypass & Obfuscation De-packing',
            isFr ? 'Analyse de logiciels de ransomwares & Exploits Zero-Day' : 'Ransomware Deconstruction & Zero-Day Analysis'
          ],
          tools: ['Ghidra', 'x64dbg', 'IDA Free', 'PEStudio'],
          certs: ['GREM (GIAC Reverse Engineering Malware)', 'OSMR (OffSec Malware Reverse Engineer)'],
          recommendedLabId: 'command_injection'
        },
        {
          id: 'st-7',
          number: 7,
          title: isFr ? 'Sécurité Cloud, Zero Trust & CISO Elite' : 'Cloud Security, Zero Trust & CISO Elite',
          levelTag: isFr ? 'Niveau 7 : Maître Cyber' : 'Level 7 : Cyber Master',
          levelClass: 'bg-amber-400/20 text-amber-300 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]',
          estTime: isFr ? 'Continu / 6+ Mois' : 'Ongoing / 6+ Months',
          summary: isFr 
            ? 'Déployez des architectures Zero Trust sur AWS/Azure, sécurisez Kubernetes/Docker, et pilotez la gouvernance cyber d\'entreprise.'
            : 'Design Zero Trust Cloud architectures (AWS/Azure), harden Kubernetes cluster deployments, and govern global cyber risk posture.',
          skills: [
            isFr ? 'Sécurisation Cloud AWS / Azure / GCP & IAM Policies' : 'AWS / Azure / GCP Cloud Security & IAM Policy Hardening',
            isFr ? 'Sécurité des conteneurs Docker & Orchestration Kubernetes' : 'Docker Container Hardening & Kubernetes Security (CKS)',
            isFr ? 'Architecture Zero Trust & Cryptographie moderne' : 'Zero Trust Architecture & Enterprise Access Controls',
            isFr ? 'Gouvernance, Risques & Conformité (ISO 27001, NIS2, SOC2)' : 'Governance, Risk & Compliance (ISO 27001, NIS2, SOC2)'
          ],
          tools: ['Terraform Security', 'Trivy', 'AWS GuardDuty', 'Kubescape'],
          certs: ['CISSP (ISC2)', 'CCSP (Certified Cloud Security Professional)', 'CISM'],
          recommendedLabId: 'csrf_mitigation'
        }
      ]
    },

    redteam: {
      id: 'redteam',
      title: isFr ? 'Parcours Red Team & Hacking Offensif' : 'Offensive Red Team & Pentesting Path',
      badge: isFr ? 'SPECIALISATION OFFENSIVE' : 'OFFENSIVE SPECIALIZATION',
      description: isFr
        ? 'Un parcours hyper-focalisé sur les attaques offensives : tests d\'intrusion web, infiltration de réseaux d\'entreprise, évasion d\'antivirus et opérations Red Team.'
        : 'A laser-focused offensive track specializing in web penetration testing, network infiltration, EDR evasion, and Red Team operations.',
      stations: [
        {
          id: 'rt-1',
          number: 1,
          title: isFr ? 'Bases du Hacking & Scripting' : 'Ethical Hacking Basics & Scripting',
          levelTag: isFr ? 'Niveau 1 : Débutant' : 'Level 1 : Beginner',
          levelClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          estTime: isFr ? '1 - 2 Mois' : '1 - 2 Months',
          summary: isFr 
            ? 'Apprenez à automatiser des scripts en Python/Bash, configurer votre VM Kali Linux et comprendre les méthodologies d\'attaque.'
            : 'Learn Python/Bash automation, set up your Kali Linux environment, and master offensive methodologies.',
          skills: ['Python for Hackers', 'Bash Automation', 'Kali Linux Toolset', 'Recon Methodologies'],
          tools: ['Python3', 'Nmap', 'Netcat', 'Sublist3r'],
          certs: ['eJPT', 'CompTIA Security+'],
          recommendedLabId: 'intro_cyber'
        },
        {
          id: 'rt-2',
          number: 2,
          title: isFr ? 'Audits Web & OWASP Top 10' : 'Web Pentesting & OWASP Exploitation',
          levelTag: isFr ? 'Niveau 2 : Intermediate' : 'Level 2 : Intermediate',
          levelClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          estTime: isFr ? '2 - 3 Mois' : '2 - 3 Months',
          summary: isFr 
            ? 'Infiltrez des applications web via Burp Suite, exploitez SQLi, XSS, SSRF et contournez les WAFs.'
            : 'Crack web apps with Burp Suite, exploit SQLi, XSS, SSRF, and bypass Web Application Firewalls (WAF).',
          skills: ['SQLi & Command Injection', 'Stored/Reflected XSS', 'SSRF & LFI Exploitation', 'WAF Bypass'],
          tools: ['Burp Suite', 'SQLmap', 'FFUF', 'OWASP ZAP'],
          certs: ['eWPTX', 'PortSwigger Certified Practitioner'],
          recommendedLabId: 'sql_injection_basics'
        },
        {
          id: 'rt-3',
          number: 3,
          title: isFr ? 'Privilege Escalation & Infiltration' : 'Network Compromise & PrivEsc',
          levelTag: isFr ? 'Niveau 3 : Avancé' : 'Level 3 : Advanced',
          levelClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          estTime: isFr ? '3 - 4 Mois' : '3 - 4 Months',
          summary: isFr 
            ? 'Prenez le contrôle des endpoints, élevez vos privilèges sur Linux/Windows et établissez la persistance.'
            : 'Gain initial access, elevate system privileges on Linux/Windows, and establish C2 persistence.',
          skills: ['Linux SUID/Sudo Esc', 'Windows Token Impersonation', 'Metasploit Meterpreter', 'Port Forwarding & Pivoting'],
          tools: ['Metasploit', 'LinPEAS / WinPEAS', 'Chisel', 'John the Ripper'],
          certs: ['OSCP (OffSec Certified Professional)'],
          recommendedLabId: 'buffer_overflow'
        },
        {
          id: 'rt-4',
          number: 4,
          title: isFr ? 'Attaques Active Directory' : 'Active Directory Domain Exploitation',
          levelTag: isFr ? 'Niveau 4 : Avancé' : 'Level 4 : Advanced',
          levelClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          estTime: isFr ? '3 - 5 Mois' : '3 - 5 Months',
          summary: isFr 
            ? 'Compromettez des domaines Active Directory complets via Kerberoasting, AS-REP Roasting et DCSync.'
            : 'Compromise Enterprise AD environments using Kerberoasting, AS-REP Roasting, BloodHound, and DCSync attacks.',
          skills: ['Kerberoasting & AS-REP', 'BloodHound Domain Mapping', 'Pass-the-Hash / Ticket', 'DCSync & Golden Ticket'],
          tools: ['Impacket', 'BloodHound', 'Mimikatz', 'PowerView'],
          certs: ['CRTP (Certified Red Team Professional)', 'PNPT'],
          recommendedLabId: 'command_injection'
        },
        {
          id: 'rt-5',
          number: 5,
          title: isFr ? 'Évasion EDR & Malware Custom' : 'EDR Evasion & Custom Payload Dev',
          levelTag: isFr ? 'Niveau 5 : Expert' : 'Level 5 : Expert',
          levelClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          estTime: isFr ? '4 - 6 Mois' : '4 - 6 Months',
          summary: isFr 
            ? 'Développez vos propres loaders C/C++ / C#, contournez les EDR (Defender, CrowdStrike) et masquez vos shellcodes.'
            : 'Write custom C/C++ loaders, unhook Windows APIs, bypass modern EDR solutions, and obfuscate shellcode.',
          skills: ['Windows Internal APIs', 'API Unhooking & Direct Syscalls', 'Obfuscation & Encryption', 'Process Injection'],
          tools: ['Visual Studio', 'x64dbg', 'Donut', 'Sliver C2'],
          certs: ['OSEP (OffSec Experienced Pentester)'],
          recommendedLabId: 'sqli_bypass'
        },
        {
          id: 'rt-6',
          number: 6,
          title: isFr ? 'Infrastructures C2 & Red Team Ops' : 'C2 Infrastructure & Red Team Ops',
          levelTag: isFr ? 'Niveau 6 : Master' : 'Level 6 : Master',
          levelClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          estTime: isFr ? '5 - 6 Mois' : '5 - 6 Months',
          summary: isFr 
            ? 'Concevez des infrastructures Command & Control résilientes avec redirecteurs, domaines camouflés et phishing ciblé.'
            : 'Build stealthy C2 infrastructure using domain fronting, redirectors, custom C2 profiles, and spear-phishing campaigns.',
          skills: ['C2 Framework Setup (Cobalt Strike/Sliver)', 'Domain Fronting & Redirectors', 'Initial Access Vectors', 'OPSEC Discipline'],
          tools: ['Sliver', 'Cobalt Strike', 'GoPhish', 'Apache Redirectors'],
          certs: ['CRTE (Certified Red Team Expert)', 'OSED'],
          recommendedLabId: 'buffer_overflow'
        },
        {
          id: 'rt-7',
          number: 7,
          title: isFr ? 'Exploitation Zero-Day & Recherche' : 'Zero-Day Research & Exploit Dev',
          levelTag: isFr ? 'Niveau 7 : Elite Hacker' : 'Level 7 : Elite Hacker',
          levelClass: 'bg-amber-400/20 text-amber-300 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]',
          estTime: isFr ? '6+ Mois' : '6+ Months',
          summary: isFr 
            ? 'Découvrez de nouvelles vulnérabilités (Zero-Days), faites du Fuzzing de protocoles et écrivez des exploits autonomes.'
            : 'Discover unknown zero-day vulnerabilities through fuzzing, reverse engineering, and advanced exploit development.',
          skills: ['AFL++ / LibFuzzer', 'Kernel Exploitation', 'Browser Exploit Dev', 'CVE Responsible Disclosure'],
          tools: ['Ghidra', 'IDA Pro', 'AFL++', 'Windbg'],
          certs: ['OSEE (OffSec Exploitation Expert)'],
          recommendedLabId: 'command_injection'
        }
      ]
    },

    blueteam: {
      id: 'blueteam',
      title: isFr ? 'Parcours Blue Team & SOC Defensive' : 'Defensive Blue Team & Threat Hunter',
      badge: isFr ? 'SPECIALISATION DEFENSIVE' : 'DEFENSIVE SPECIALIZATION',
      description: isFr
        ? 'Un parcours axé sur la défense d\'entreprise : analyse de logs SIEM, détection d\'attaques, réponse aux incidents, forensique numérique et Threat Hunting.'
        : 'Focus on enterprise defense: SIEM telemetry analysis, intrusion detection, digital forensics, threat hunting, and SOC operations.',
      stations: [
        {
          id: 'bt-1',
          number: 1,
          title: isFr ? 'Fondations du SOC & Analyste L1' : 'SOC Analyst L1 & Fundamentals',
          levelTag: isFr ? 'Niveau 1 : Débutant' : 'Level 1 : Beginner',
          levelClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          estTime: isFr ? '1 - 2 Mois' : '1 - 2 Months',
          summary: isFr 
            ? 'Comprenez le rôle du SOC, analysez les alertes de sécurité de niveau 1, vérifiez les faux positifs et examinez les headers d\'emails.'
            : 'Understand SOC workflows, triage Level 1 security alerts, verify false positives, and analyze phishing emails.',
          skills: ['SOC Workflow & Triage', 'Email Header Analysis', 'IP/Hash Reputation Lookup', 'Basic Event Log Review'],
          tools: ['VirusTotal', 'Wireshark', 'Any.Run', 'MXToolbox'],
          certs: ['CompTIA CySA+', 'BTL1 (Blue Team Level 1)'],
          recommendedLabId: 'intro_cyber'
        },
        {
          id: 'bt-2',
          number: 2,
          title: isFr ? 'Analyse de Logs SIEM & Corrélation' : 'SIEM Telemetry & Log Correlation',
          levelTag: isFr ? 'Niveau 2 : Intermediate' : 'Level 2 : Intermediate',
          levelClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          estTime: isFr ? '2 - 3 Mois' : '2 - 3 Months',
          summary: isFr 
            ? 'Maîtrisez les requêtes Splunk/Elastic, analysez les journaux d\'événements Windows Sysmon et logs de pare-feu.'
            : 'Master Splunk & Elastic query languages, analyze Windows Sysmon logs, web server logs, and firewall traffic.',
          skills: ['Splunk SPL / KQL Queries', 'Sysmon Event ID Analysis', 'Web Server Log Parsing', 'Network Traffic Anomaly Detection'],
          tools: ['Splunk', 'Elastic ELK', 'Sysmon', 'Zeek / Snort'],
          certs: ['Splunk Core Certified Power User', 'BTL1'],
          recommendedLabId: 'xss_reflected'
        },
        {
          id: 'bt-3',
          number: 3,
          title: isFr ? 'Réponse aux Incidents (IR)' : 'Incident Response & Triage',
          levelTag: isFr ? 'Niveau 3 : Avancé' : 'Level 3 : Advanced',
          levelClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          estTime: isFr ? '3 - 4 Mois' : '3 - 4 Months',
          summary: isFr 
            ? 'Gérez la containment d\'hôtes infectés, éradiquez les menaces, restaurez les systèmes et rédigez les rapports d\'incidents.'
            : 'Execute containment strategies, isolate infected hosts, eradicate malicious persistence, and write incident reports.',
          skills: ['Host Containment Procedures', 'NIST / SANS IR Framework', 'Evidence Acquisition', 'Root Cause Analysis'],
          tools: ['Velociraptor', 'KAPE', 'FTK Imager', 'YARA'],
          certs: ['GIAC GCIH (Certified Incident Handler)', 'BTL2'],
          recommendedLabId: 'csrf_mitigation'
        },
        {
          id: 'bt-4',
          number: 4,
          title: isFr ? 'Digital Forensics (DFIR)' : 'Digital Forensics & Memory Analysis',
          levelTag: isFr ? 'Niveau 4 : Avancé' : 'Level 4 : Advanced',
          levelClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          estTime: isFr ? '3 - 5 Mois' : '3 - 5 Months',
          summary: isFr 
            ? 'Examinez les fichiers d\'artefacts Windows (Registry, Shimcache, MFT) et extrayez les processus en mémoire avec Volatility.'
            : 'Analyze Windows artifacts (Registry, Shimcache, MFT, Prefetch) and extract RAM processes with Volatility.',
          skills: ['Memory Dump Dissection', 'Windows Forensic Artifacts', 'Timeline Reconstruction', 'Browser & File Forensics'],
          tools: ['Volatility', 'Autopsy', 'Eric Zimmerman Tools', 'RegRipper'],
          certs: ['GCFA (GIAC Certified Forensic Analyst)', 'eCFP'],
          recommendedLabId: 'sql_injection_basics'
        },
        {
          id: 'bt-5',
          number: 5,
          title: isFr ? 'Threat Hunting Proactif' : 'Proactive Threat Hunting & YARA',
          levelTag: isFr ? 'Niveau 5 : Expert' : 'Level 5 : Expert',
          levelClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          estTime: isFr ? '4 - 5 Mois' : '4 - 5 Months',
          summary: isFr 
            ? 'Chassez les attaquants tapis dans le réseau sans attendre d\'alerte, rédigez des règles YARA/Sigma et cartographiez MITRE ATT&CK.'
            : 'Hunt for hidden adversary presence without relying on alerts. Author YARA & Sigma detection logic based on MITRE ATT&CK.',
          skills: ['Hypothesis-driven Hunting', 'YARA & Sigma Rule Writing', 'MITRE ATT&CK Mapping', 'Beaconing Detection'],
          tools: ['YARA', 'Sigma', 'RITA', 'HELK'],
          certs: ['GCDA (GIAC Certified Detection Analyst)'],
          recommendedLabId: 'sqli_bypass'
        },
        {
          id: 'bt-6',
          number: 6,
          title: isFr ? 'Automation SOC & SOAR' : 'SOC Automation & SOAR Workflows',
          levelTag: isFr ? 'Niveau 6 : Master' : 'Level 6 : Master',
          levelClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          estTime: isFr ? '4 - 6 Mois' : '4 - 6 Months',
          summary: isFr 
            ? 'Automatisez les réponses aux menaces via des playbooks SOAR (Shuffle, Cortex XSOAR) et réduisez le temps de réaction (MTTR).'
            : 'Build automated incident response playbooks using SOAR platforms to dramatically reduce Mean Time To Respond (MTTR).',
          skills: ['SOAR Playbook Design', 'API Integration & Webhooks', 'Automated Containment Scripts', 'Threat Intel Feeds Integration'],
          tools: ['Shuffle SOAR', 'Cortex XSOAR', 'MISP', 'OpenCTI'],
          certs: ['GIAC GSLC', 'CISSP'],
          recommendedLabId: 'command_injection'
        },
        {
          id: 'bt-7',
          number: 7,
          title: isFr ? 'Directeur SOC & Cyber Résilience' : 'SOC Management & Cyber Resilience',
          levelTag: isFr ? 'Niveau 7 : Chief Defender' : 'Level 7 : Chief Defender',
          levelClass: 'bg-amber-400/20 text-amber-300 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]',
          estTime: isFr ? '6+ Mois' : '6+ Months',
          summary: isFr 
            ? 'Pilotez l\'ensemble du centre de défense, gérez la crise cyber, respectez les normes de conformité et renforcez la résilience.'
            : 'Lead global security operations, manage C-level cyber crisis communication, and enforce continuous security posture resilience.',
          skills: ['Crisis Management & Business Continuity', 'SOC Metric KPIs (MTTD/MTTR)', 'Regulatory Compliance (NIS2/GDPR)', 'Threat Intelligence Governance'],
          tools: ['MISP', 'ServiceNow Security', 'Splunk Enterprise', 'Microsoft Sentinel'],
          certs: ['CISM', 'CISSP', 'GSLC'],
          recommendedLabId: 'csrf_mitigation'
        }
      ]
    }
  };

  const currentRoadmap = roadmaps[activeTrack] || roadmaps.general;
  const stations = currentRoadmap.stations;
  const totalStations = stations.length;

  // Selected active station data
  const activeStation = stations[selectedStationIndex] || stations[0];

  // Calculate moving point coordinates along the path
  // We use 7 waypoints along an SVG S-curve path
  // SVG ViewBox: 0 0 1000 320
  const waypoints = [
    { x: 80,  y: 200, label: '01' },
    { x: 220, y: 90,  label: '02' },
    { x: 370, y: 220, label: '03' },
    { x: 520, y: 80,  label: '04' },
    { x: 670, y: 230, label: '05' },
    { x: 820, y: 90,  label: '06' },
    { x: 930, y: 190, label: '07' }
  ];

  // Get current smooth point coordinates based on currentPosProgress (0 to 1)
  const getPointOnPath = (progress) => {
    if (!svgPathRef.current) {
      // Fallback interpolation between waypoints
      const segmentCount = waypoints.length - 1;
      const totalP = Math.max(0, Math.min(1, progress));
      const scaled = totalP * segmentCount;
      const idx = Math.min(Math.floor(scaled), segmentCount - 1);
      const rem = scaled - idx;
      const p1 = waypoints[idx];
      const p2 = waypoints[idx + 1];
      return {
        x: p1.x + (p2.x - p1.x) * rem,
        y: p1.y + (p2.y - p1.y) * rem
      };
    }

    try {
      const pathLen = svgPathRef.current.getTotalLength();
      const point = svgPathRef.current.getPointAtLength(progress * pathLen);
      return { x: point.x, y: point.y };
    } catch {
      return waypoints[selectedStationIndex] || waypoints[0];
    }
  };

  // Continuous animation loop for the moving point along the road
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time) => {
      if (isPlaying) {
        const delta = (time - lastTime) / 1000;
        lastTime = time;

        setCurrentPosProgress((prev) => {
          // Complete full path in ~24 seconds at 1x speed
          const speedFactor = 0.04 * animSpeed;
          let next = prev + delta * speedFactor;
          if (next > 1) {
            next = 0; // loop back to start
          }

          // Sync selected station index based on current progress segment
          const calculatedIndex = Math.min(
            Math.floor(next * totalStations),
            totalStations - 1
          );
          if (calculatedIndex !== selectedStationIndex) {
            setSelectedStationIndex(calculatedIndex);
          }

          return next;
        });
      } else {
        lastTime = time;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animSpeed, selectedStationIndex, totalStations]);

  // Jump moving point directly to a specific station when clicked
  const handleJumpToStation = (idx) => {
    setSelectedStationIndex(idx);
    const targetProgress = idx / (totalStations - 1);
    setCurrentPosProgress(targetProgress);
  };

  // Toggle skill check state
  const handleToggleSkill = (stationId, skillIndex) => {
    const key = `${stationId}_${skillIndex}`;
    setCompletedSkills((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculate completion percentage of current roadmap station skills
  const getStationSkillsProgress = (station) => {
    let count = 0;
    station.skills.forEach((_, idx) => {
      if (completedSkills[`${station.id}_${idx}`]) count++;
    });
    return {
      completed: count,
      total: station.skills.length,
      pct: Math.round((count / station.skills.length) * 100)
    };
  };

  const currentPointPos = getPointOnPath(currentPosProgress);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16 px-4 sm:px-6">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span>{isFr ? 'PARCOURS D\'APPRENTISSAGE INTERACTIF' : 'INTERACTIVE LEARNING PATHWAY'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-bright)] font-mono tracking-wider">
          {isFr ? 'ROADMAP DE DÉBUTANT À EXPERT' : 'CYBERSECURITY ROADMAP'}
        </h2>
        <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
          {isFr
            ? 'Suivez le drone cyber animé le long de la route des compétences. De la maîtrise des réseaux jusqu\'à l\'architecture globale Zero Trust.'
            : 'Follow the animated cyber pulse along the interactive road from beginner basics to elite expert mastery. Click any station or control animation movement.'}
        </p>
      </div>

      {/* TRACK SPECIALIZATION SELECTOR */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => { setActiveTrack('general'); handleJumpToStation(0); }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
            activeTrack === 'general'
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>{isFr ? '🌐 Parcours Général' : '🌐 All-Rounder Path'}</span>
        </button>

        <button
          onClick={() => { setActiveTrack('redteam'); handleJumpToStation(0); }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
            activeTrack === 'redteam'
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4 text-rose-400" />
          <span>{isFr ? '⚔️ Offensive / Red Team' : '⚔️ Offensive / Red Team'}</span>
        </button>

        <button
          onClick={() => { setActiveTrack('blueteam'); handleJumpToStation(0); }}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
            activeTrack === 'blueteam'
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-blue-400" />
          <span>{isFr ? '🛡️ Défense / Blue Team' : '🛡️ Defense / Blue Team'}</span>
        </button>
      </div>

      {/* ROAD CANVAS & ANIMATED PATH CONTAINER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-6">
          
          {/* Active Track Title & Badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 uppercase">
              {currentRoadmap.badge}
            </span>
            <h3 className="font-mono font-bold text-white text-base">
              {currentRoadmap.title}
            </h3>
          </div>

          {/* Animation Movement Controls */}
          <div className="flex items-center gap-2 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-xl p-1.5">
            
            {/* Play/Pause Motion */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? (isFr ? 'Mettre en pause' : 'Pause drone') : (isFr ? 'Lancer le déplacement' : 'Play motion')}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{isFr ? 'PAUSE' : 'PAUSE'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{isFr ? 'LANCER' : 'PLAY'}</span>
                </>
              )}
            </button>

            {/* Step Back Station */}
            <button
              onClick={() => handleJumpToStation(Math.max(0, selectedStationIndex - 1))}
              disabled={selectedStationIndex === 0}
              title={isFr ? 'Station précédente' : 'Previous station'}
              className="p-1.5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white rounded-lg disabled:opacity-30 transition-all cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Step Forward Station */}
            <button
              onClick={() => handleJumpToStation(Math.min(totalStations - 1, selectedStationIndex + 1))}
              disabled={selectedStationIndex === totalStations - 1}
              title={isFr ? 'Station suivante' : 'Next station'}
              className="p-1.5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white rounded-lg disabled:opacity-30 transition-all cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Speed Multiplier Toggle */}
            <div className="border-l border-[var(--border-subtle)] pl-2 ml-1 flex items-center gap-1">
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setAnimSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                    animSpeed === spd
                      ? 'bg-cyan-400 text-black'
                      : 'text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* THE VISUAL ROAD SVG MAP */}
        <div className="relative w-full overflow-x-auto pb-4 scrollbar-none">
          <div className="min-w-[850px] relative py-8">
            
            <svg
              viewBox="0 0 1000 300"
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                {/* Road Gradient */}
                <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="25%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="75%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                {/* Moving Drone Glow Filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Outer Highway Path */}
              <path
                d="M 80,200 C 150,110 180,90 220,90 C 290,90 320,220 370,220 C 440,220 470,80 520,80 C 590,80 620,230 670,230 C 740,230 770,90 820,90 C 880,90 900,190 930,190"
                fill="none"
                stroke="#1e293b"
                strokeWidth="28"
                strokeLinecap="round"
              />

              {/* Highway Dashed Center Line */}
              <path
                d="M 80,200 C 150,110 180,90 220,90 C 290,90 320,220 370,220 C 440,220 470,80 520,80 C 590,80 620,230 670,230 C 740,230 770,90 820,90 C 880,90 900,190 930,190"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />

              {/* Main Glowing Cyber Highway Path */}
              <path
                ref={svgPathRef}
                d="M 80,200 C 150,110 180,90 220,90 C 290,90 320,220 370,220 C 440,220 470,80 520,80 C 590,80 620,230 670,230 C 740,230 770,90 820,90 C 880,90 900,190 930,190"
                fill="none"
                stroke="url(#roadGlow)"
                strokeWidth="6"
                strokeLinecap="round"
                className="opacity-90"
              />

              {/* STATIONS / WAYPOINTS ALONG THE ROAD */}
              {waypoints.map((pt, idx) => {
                const station = stations[idx];
                const isSelected = selectedStationIndex === idx;
                const isCompleted = station.number <= userProgressLevel;
                const isUserCurrent = station.number === userProgressLevel;

                return (
                  <g
                    key={station.id}
                    onClick={() => handleJumpToStation(idx)}
                    className="cursor-pointer group"
                  >
                    {/* Station Pulse Ring if selected */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="24"
                        fill="none"
                        stroke="#00f2fe"
                        strokeWidth="2"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Outer Circle Ring */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="18"
                      fill={isSelected ? '#0f172a' : '#020617'}
                      stroke={
                        isSelected 
                          ? '#22d3ee' 
                          : isUserCurrent 
                            ? '#38bdf8' 
                            : isCompleted 
                              ? '#10b981' 
                              : '#334155'
                      }
                      strokeWidth={isSelected ? '4' : '2'}
                      className="transition-all duration-300 group-hover:scale-110"
                    />

                    {/* Inner Station Icon or Number */}
                    <text
                      x={pt.x}
                      y={pt.y + 4}
                      textAnchor="middle"
                      fill={
                        isSelected 
                          ? '#22d3ee' 
                          : isCompleted 
                            ? '#34d399' 
                            : '#94a3b8'
                      }
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {station.number}
                    </text>

                    {/* Station Label Text (Above or Below path depending on Y) */}
                    <text
                      x={pt.x}
                      y={pt.y > 150 ? pt.y + 36 : pt.y - 26}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#94a3b8'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="group-hover:fill-cyan-300 transition-colors"
                    >
                      {station.title.split('&')[0].trim()}
                    </text>

                    {/* Level Tag Pill */}
                    <rect
                      x={pt.x - 32}
                      y={pt.y > 150 ? pt.y + 42 : pt.y - 48}
                      width="64"
                      height="16"
                      rx="8"
                      fill="#020617"
                      stroke={isCompleted ? '#059669' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x}
                      y={pt.y > 150 ? pt.y + 53 : pt.y - 37}
                      textAnchor="middle"
                      fill={isCompleted ? '#34d399' : '#64748b'}
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {isUserCurrent ? (isFr ? 'NIVEAU ACTUEL' : 'CURRENT') : `STATION 0${station.number}`}
                    </text>
                  </g>
                );
              })}

              {/* MOVING POINT / CYBER DRONE / PULSE MARKER */}
              <g
                transform={`translate(${currentPointPos.x}, ${currentPointPos.y})`}
                filter="url(#glow)"
                className="transition-transform duration-75 pointer-events-none"
              >
                {/* Radar Ripple */}
                <circle r="16" fill="rgba(34, 211, 238, 0.2)" className="animate-pulse" />
                <circle r="10" fill="rgba(34, 211, 238, 0.5)" />
                
                {/* Core Glowing Point */}
                <circle r="5" fill="#00f2fe" stroke="#ffffff" strokeWidth="2" />

                {/* Target Crosshairs */}
                <line x1="-12" y1="0" x2="-7" y2="0" stroke="#00f2fe" strokeWidth="1.5" />
                <line x1="7" y1="0" x2="12" y2="0" stroke="#00f2fe" strokeWidth="1.5" />
                <line x1="0" y1="-12" x2="0" y2="-7" stroke="#00f2fe" strokeWidth="1.5" />
                <line x1="0" y1="7" x2="0" y2="12" stroke="#00f2fe" strokeWidth="1.5" />
              </g>

            </svg>

          </div>
        </div>

        {/* User Current Station Progress Bar */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                {isFr ? 'Votre Niveau de Progression :' : 'Your Progress Level :'}
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {isFr ? `Station ${userProgressLevel} sur ${totalStations} atteinte` : `Station ${userProgressLevel} of ${totalStations} reached`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setUserProgressLevel(selectedStationIndex + 1)}
              className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFr ? 'Marquer la Station sélectionnée comme mon Niveau' : 'Set Selected Station as My Level'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* ACTIVE STATION DETAIL INSPECTOR CARD */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Station Inspector Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${activeStation.levelClass}`}>
                {activeStation.levelTag}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-main)] text-[var(--text-muted)]">
                ⏱️ {isFr ? 'Durée estimée :' : 'Est. Time :'} {activeStation.estTime}
              </span>
              {userProgressLevel >= activeStation.number && (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {isFr ? 'Atteint' : 'Completed'}
                </span>
              )}
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2 pt-1">
              <span className="text-cyan-400">Station 0{activeStation.number}:</span>
              <span>{activeStation.title}</span>
            </h3>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleJumpToStation(Math.max(0, selectedStationIndex - 1))}
              disabled={selectedStationIndex === 0}
              className="px-3 py-1.5 bg-[var(--bg-input)] hover:bg-white/10 border border-[var(--border-main)] rounded-xl text-xs font-mono text-[var(--text-muted)] disabled:opacity-30 cursor-pointer"
            >
              ← {isFr ? 'Précédent' : 'Prev'}
            </button>
            <button
              onClick={() => handleJumpToStation(Math.min(totalStations - 1, selectedStationIndex + 1))}
              disabled={selectedStationIndex === totalStations - 1}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-400 font-bold disabled:opacity-30 cursor-pointer"
            >
              {isFr ? 'Suivant' : 'Next'} →
            </button>
          </div>
        </div>

        {/* Station Summary */}
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
          {activeStation.summary}
        </p>

        {/* Grid Breakdown: Skills Checklist & Tools/Certs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Skills Checklist (2 Cols) */}
          <div className="lg:col-span-2 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-2xl p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider">
                  {isFr ? 'Compétences & Concepts à Maîtriser' : 'Skills & Concepts to Master'}
                </h4>
              </div>
              
              {/* Station Skill Progress Bar */}
              {(() => {
                const prog = getStationSkillsProgress(activeStation);
                return (
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {prog.completed} / {prog.total} ({prog.pct}%)
                  </span>
                );
              })()}
            </div>

            <div className="space-y-2.5">
              {activeStation.skills.map((skill, sIdx) => {
                const isChecked = !!completedSkills[`${activeStation.id}_${sIdx}`];
                return (
                  <div
                    key={sIdx}
                    onClick={() => handleToggleSkill(activeStation.id, sIdx)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-cyan-500/30 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-xs font-mono">{skill}</span>
                    </div>

                    <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                      {isChecked ? (isFr ? 'Acquis' : 'Mastered') : (isFr ? 'Cliquer pour valider' : 'Click to complete')}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Tools & Certs Sidebar (1 Col) */}
          <div className="space-y-4">
            
            {/* Required Tools */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider">
                  {isFr ? 'Outils Recommandés' : 'Recommended Tools'}
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeStation.tools.map((tool, tIdx) => (
                  <a
                    key={tIdx}
                    href="#tools"
                    className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{tool}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>

            {/* Target Industry Certifications */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider">
                  {isFr ? 'Certifications Visées' : 'Target Certifications'}
                </h4>
              </div>

              <div className="space-y-1.5">
                {activeStation.certs.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-between"
                  >
                    <span>{cert}</span>
                    <Sparkles className="w-3 h-3 text-purple-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Jump to CyberNexus Practice Lab */}
            <a
              href="#labs"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>{isFr ? 'PRATIQUER SUR LE LAB DÉDIÉ' : 'PRACTICE RELATED LAB'}</span>
              <ChevronRight className="w-4 h-4" />
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}
