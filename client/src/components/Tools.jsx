import { useState } from 'react';
import { 
  ExternalLink, Search, Shield, Terminal, Wrench, Globe, 
  Lock, Cpu, Radio, Sparkles, Filter, Copy, Check, ArrowUpRight
} from 'lucide-react';
import { t } from '../translations';

export default function Tools({ language = 'en' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedLink, setCopiedLink] = useState(null);

  const tr = (key, fallback) => t(language, key, fallback);
  const isFr = language === 'fr';

  const toolsData = [
    {
      id: 'nmap',
      name: 'Nmap (Network Mapper)',
      category: 'recon',
      categoryLabel: isFr ? 'Reconnaissance & Scan' : 'Recon & Network Discovery',
      badge: 'RECON & AUDITING',
      badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
      accentColor: '#00f2fe',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      logoText: 'NMAP',
      url: 'https://nmap.org/',
      description: isFr
        ? "Le principal scanner réseau open source utilisé par les auditeurs de sécurité pour découvrir les hôtes, services, systèmes d'exploitation et ports ouverts sur les réseaux d'entreprise."
        : "The premier open-source network discovery and vulnerability scanner used by security auditors to discover hosts, services, operating systems, and open ports across enterprise networks.",
      features: isFr
        ? ['Détection d\'OS', 'Scripts NSE', 'Versionnage de services', 'Scan de ports multi-threads']
        : ['OS Detection', 'NSE Scripts', 'Service Versioning', 'Multi-threaded Port Scanning']
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      category: 'analysis',
      categoryLabel: isFr ? 'Analyse de Trafic Réseau' : 'Network Traffic Analysis',
      badge: 'TRAFFIC ANALYSIS',
      badgeColor: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
      accentColor: '#3b82f6',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      logoText: 'WIRESHARK',
      url: 'https://www.wireshark.org/',
      description: isFr
        ? "L'analyseur de paquets réseau le plus réputé au monde. Il permet de capturer et d'inspecter de manière interactive le trafic réseau en direct avec une dissection poussée des protocoles."
        : "The world's foremost network packet analyzer. It lets you capture and interactively inspect live network traffic, dissecting hundreds of security protocols in real time.",
      features: isFr
        ? ['Inspection profonde de paquets', 'Capture en direct & Hors-ligne', 'Analyse VoIP', 'Déchiffrement SSL/TLS']
        : ['Deep Packet Inspection', 'Live Capture & Offline Analysis', 'VoIP Dissection', 'SSL/TLS Decryption']
    },
    {
      id: 'burpsuite',
      name: 'Burp Suite',
      category: 'web',
      categoryLabel: isFr ? 'Sécurité des Applications Web' : 'Web App Security',
      badge: 'WEB SECURITY',
      badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      accentColor: '#f59e0b',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      logoText: 'BURP SUITE',
      url: 'https://portswigger.net/burp',
      description: isFr
        ? "Une suite d'outils de test de vulnérabilité web incontournable intégrant un proxy HTTP d'interception, un répéteur de requêtes, un intrus et un scanner automatisé."
        : "An industry-standard web application vulnerability testing toolkit featuring an intercepting HTTP proxy, repeater, intruder, and automated scanner.",
      features: isFr
        ? ['Proxy d\'interception HTTP/S', 'Repeater & Intruder', 'Scanner de vulnérabilités Web', 'Extender APIs']
        : ['Intercepting HTTP/S Proxy', 'Repeater & Intruder', 'Web Vulnerability Scanner', 'Extender APIs']
    },
    {
      id: 'metasploit',
      name: 'Metasploit Framework',
      category: 'offensive',
      categoryLabel: isFr ? 'Penetration Testing & Exploitation' : 'Pentesting & Exploitation',
      badge: 'OFFENSIVE PENTESTING',
      badgeColor: 'from-red-500/20 to-rose-500/20 text-red-400 border-red-500/30',
      accentColor: '#ef4444',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      logoText: 'METASPLOIT',
      url: 'https://www.metasploit.com/',
      description: isFr
        ? "La plateforme d'exploitation et de test de pénétration la plus utilisée au monde, permettant aux hackers éthiques de vérifier les vulnérabilités et d'exécuter des charges utiles."
        : "The world's most widely used penetration testing platform, empowering ethical hackers to verify vulnerabilities, execute payloads, and test defensive posture.",
      features: isFr
        ? ['Base de données d\'exploits', 'Générateur de payloads', 'Shell Meterpreter', 'Infiltration Post-Exploitation']
        : ['Exploit Database', 'Payload Generator', 'Meterpreter Shell', 'Post-Exploitation Modules']
    },
    {
      id: 'johnripper',
      name: 'John the Ripper',
      category: 'audit',
      categoryLabel: isFr ? 'Audit de Mots de Passe' : 'Password & Hash Auditing',
      badge: 'CREDENTIAL AUDITING',
      badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      accentColor: '#10b981',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      logoText: 'JOHN THE RIPPER',
      url: 'https://www.openwall.com/john/',
      description: isFr
        ? "Un célèbre outil de cassage de mots de passe rapide conçu pour auditer les identifiants faibles et tester des centaines de formats de hachages cryptographiques."
        : "A famous high-speed password cracker and hash auditing tool designed to detect weak credentials across hundreds of hash and cipher formats.",
      features: isFr
        ? ['Attaques par dictionnaire', 'Modes de force brute', 'Moteur de règles sur mesure', 'Support multi-coeurs & GPU']
        : ['Dictionary Attacks', 'Brute-force Modes', 'Custom Rule Engine', 'Multi-core & GPU Support']
    },
    {
      id: 'owaspzap',
      name: 'OWASP ZAP (Zed Attack Proxy)',
      category: 'web',
      categoryLabel: isFr ? 'Scanner Web Open Source' : 'Open Source Web Scanner',
      badge: 'OPEN SOURCE SCANNING',
      badgeColor: 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
      accentColor: '#a855f7',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      logoText: 'OWASP ZAP',
      url: 'https://www.zaproxy.org/',
      description: isFr
        ? "Le scanner de sécurité d'applications web open source le plus populaire au monde, maintenu par l'OWASP pour les développeurs et experts en sécurité."
        : "The world's most popular free and open-source web application security scanner maintained by OWASP for developers and security practitioners.",
      features: isFr
        ? ['Scanner d\'attaques automatisé', 'Proxy d\'interception', 'Fuzzer de paramètres', 'Automation orientée API']
        : ['Automated Vulnerability Scan', 'Intercepting Proxy', 'Parameter Fuzzer', 'API-driven Automation']
    },
    {
      id: 'ghidra',
      name: 'Ghidra',
      category: 'reverse',
      categoryLabel: isFr ? 'Rétro-Ingénierie & Binaire' : 'Reverse Engineering & Binaries',
      badge: 'REVERSE ENGINEERING',
      badgeColor: 'from-cyan-500/20 to-emerald-500/20 text-cyan-300 border-cyan-500/30',
      accentColor: '#06b6d4',
      image: 'https://images.unsplash.com/photo-1510511459019-5dee997dd1db?auto=format&fit=crop&w=800&q=80',
      logoText: 'GHIDRA SRE',
      url: 'https://ghidra-sre.org/',
      description: isFr
        ? "Un puissant framework d'ingénierie inverse développé par la NSA. Il comprend le désassemblage, la décompilation C/C++ et l'analyse de malwares."
        : "A powerful software reverse engineering framework created by the NSA Research Directorate. Features disassembly, C/C++ decompilation, graph analysis, and scripting.",
      features: isFr
        ? ['Décompilateur C/C++', 'Support Multi-Architectures', 'API de scripting Java/Python', 'Analyseur en mode headless']
        : ['C/C++ Decompiler', 'Multi-Architecture Assembly', 'Java & Python Scripting', 'Headless Batch Analyzer']
    },
    {
      id: 'hydra',
      name: 'THC-Hydra',
      category: 'audit',
      categoryLabel: isFr ? 'Attaque par Force Brute' : 'Brute-Force & Auth Audit',
      badge: 'BRUTE-FORCE AUDIT',
      badgeColor: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
      accentColor: '#f43f5e',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
      logoText: 'THC HYDRA',
      url: 'https://github.com/vanhauser-thc/thc-hydra',
      description: isFr
        ? "Un outil de réapprentissage de mots de passe en réseau extrêmement rapide capable d'exécuter des attaques par force brute parallèles sur plus de 50 protocoles réseau."
        : "A world-renowned fast network logon cracker capable of performing rapid parallelized brute-force attacks across over 50 network protocols including SSH, FTP, HTTP, and databases.",
      features: isFr
        ? ['50+ Protocoles supportés', 'Attaques multi-threads', 'Interruption & Reprise', 'Fuzzing d\'authentification']
        : ['50+ Protocols Supported', 'Parallelized Threads', 'Pause & Resume Attacks', 'Auth Fuzzing']
    },
    {
      id: 'sqlmap',
      name: 'SQLmap',
      category: 'web',
      categoryLabel: isFr ? 'Injection SQL & Base de Données' : 'SQL Injection & Database',
      badge: 'DATABASE INJECTION',
      badgeColor: 'from-amber-500/20 to-yellow-500/20 text-yellow-400 border-yellow-500/30',
      accentColor: '#eab308',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      logoText: 'SQLMAP',
      url: 'https://sqlmap.org/',
      description: isFr
        ? "Un outil open source puissant qui automatise la détection et l'exploitation des vulnérabilités d'injection SQL ainsi que la prise de contrôle des serveurs de base de données."
        : "An open-source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over database servers.",
      features: isFr
        ? ['6 Techniques SQLi', 'Extraction automatique de DB', 'Dump de hachages', 'Shell système à distance']
        : ['6 SQL Injection Techniques', 'Automated DB Enumeration', 'Password Hash Dumping', 'Remote OS Shell Execution']
    },
    {
      id: 'aircrack',
      name: 'Aircrack-ng',
      category: 'wireless',
      categoryLabel: isFr ? 'Sécurité Sans Fil Wi-Fi' : 'Wireless & Wi-Fi Security',
      badge: 'WIRELESS SECURITY',
      badgeColor: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30',
      accentColor: '#14b8a6',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      logoText: 'AIRCRACK-NG',
      url: 'https://www.aircrack-ng.org/',
      description: isFr
        ? "Une suite complète d'outils pour évaluer la sécurité des réseaux sans fil Wi-Fi (802.11), couvrant la capture de paquets, l'injection de trames et le cassage de clés WPA/WPA2/WPA3."
        : "A complete suite of tools to assess Wi-Fi network security (802.11), supporting packet capture, frame injection, dictionary cracking, and WPA/WPA2/WPA3 key recovery.",
      features: isFr
        ? ['Capture 802.11 & Injection', 'Cassage WPA/WPA2/WPA3', 'Détection de Rogue AP', 'Analyse du signal RF']
        : ['802.11 Capture & Injection', 'WPA/WPA2/WPA3 Key Recovery', 'Rogue AP Detection', 'RF Signal Monitoring']
    }
  ];

  const categories = [
    { id: 'all', name: isFr ? `Tous les outils (${toolsData.length})` : `All Tools (${toolsData.length})` },
    { id: 'recon', name: isFr ? 'Reconnaissance' : 'Recon & Network' },
    { id: 'web', name: isFr ? 'Sécurité Web' : 'Web Security' },
    { id: 'offensive', name: isFr ? 'Offensif / Pentest' : 'Offensive & Exploitation' },
    { id: 'analysis', name: isFr ? 'Analyse de Trafic' : 'Traffic Analysis' },
    { id: 'audit', name: isFr ? 'Audit / Mots de Passe' : 'Credential Audit' },
    { id: 'wireless', name: isFr ? 'Sécurité Wi-Fi' : 'Wireless Security' },
    { id: 'reverse', name: isFr ? 'Rétro-Ingénierie' : 'Reverse Engineering' }
  ];

  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16 px-4 sm:px-6">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <Wrench className="w-3.5 h-3.5" />
          <span>{isFr ? 'BOÎTE À OUTILS DE CYBERSÉCURITÉ' : 'ESSENTIAL CYBERSECURITY TOOLKIT'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-bright)] font-mono tracking-wider">
          {isFr ? 'OUTILS ESSENTIELS DU PENTESTER' : 'TOP CYBERSECURITY UTILITIES'}
        </h2>
        <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
          {isFr
            ? `Explorez notre sélection des ${toolsData.length} outils fondamentaux de cybersécurité utilisés quotidiennement par les experts en audit, tests d'intrusion et analyse forensique.`
            : `Explore our curated index of ${toolsData.length} premier industry-standard cybersecurity tools used daily by ethical hackers, penetration testers, and SOC analysts worldwide.`}
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isFr ? 'Rechercher un outil, catégorie...' : 'Search tools, tags, features...'}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl text-xs sm:text-sm text-[var(--text-bright)] focus:outline-none focus:border-cyan-400 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 font-bold shadow-sm'
                  : 'bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-[var(--bg-input)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* TOOLS GRID */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl space-y-3">
          <Shield className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-50" />
          <p className="text-[var(--text-muted)] font-mono text-sm">
            {isFr ? 'Aucun outil correspondant à votre recherche.' : 'No tools found matching your search term.'}
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
          >
            {isFr ? 'Réinitialiser les filtres' : 'Reset Search Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, idx) => (
            <div
              key={tool.id}
              className="group bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,242,254,0.12)] hover:-translate-y-1 relative"
            >
              {/* Tool Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-black/40">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback to high-tech gradient if image fails
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                
                {/* Fallback Graphic */}
                <div 
                  className="hidden absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 items-center justify-center p-6"
                >
                  <div className="text-center space-y-2">
                    <Terminal className="w-10 h-10 text-cyan-400 mx-auto" />
                    <span className="font-mono text-lg font-bold text-white tracking-widest">{tool.logoText}</span>
                  </div>
                </div>

                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-black/60" />

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md border backdrop-blur-md bg-black/50 ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Index Tag Top Right */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white/70 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {(idx + 1).toString().padStart(2, '0')} / {toolsData.length.toString().padStart(2, '0')}
                </div>

                {/* Tool Name Overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block">
                    {tool.categoryLabel}
                  </span>
                  <h3 className="text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition-colors drop-shadow-md">
                    {tool.name}
                  </h3>
                </div>
              </div>

              {/* Tool Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Description */}
                <p className="text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
                  {tool.description}
                </p>

                {/* Feature Tags */}
                <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                    {isFr ? 'Fonctionnalités Clés :' : 'Key Capabilities :'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--border-main)] text-[var(--text-main)] group-hover:border-cyan-500/20 transition-colors"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)]">
                  
                  {/* Copy Link Button */}
                  <button
                    onClick={() => handleCopyLink(tool.url, tool.id)}
                    title={isFr ? 'Copier le lien' : 'Copy link'}
                    className="p-2 bg-[var(--bg-input)] hover:bg-white/10 border border-[var(--border-main)] text-[var(--text-muted)] hover:text-white rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-mono"
                  >
                    {copiedLink === tool.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px]">{isFr ? 'Copié !' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">{isFr ? 'Lien' : 'Link'}</span>
                      </>
                    )}
                  </button>

                  {/* Visit External Website */}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer group/btn"
                  >
                    <span>{isFr ? 'ACCÉDER À L\'OUTIL' : 'ACCESS TOOL'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* BOTTOM INFO BANNER */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-[var(--bg-card)] to-slate-900/40 border border-cyan-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 border border-cyan-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-mono font-bold text-white text-sm">
              {isFr ? 'Pratiquez ces outils dans la Console Kali' : 'Practice These Utilities in Kali Console'}
            </h4>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">
              {isFr
                ? 'Accédez directement à la console interactive pour simuler les commandes Nmap, John, et Hydra.'
                : 'Access our browser-emulated terminal console to practice running simulated commands for Nmap, John the Ripper, and more.'}
            </p>
          </div>
        </div>

        <a
          href="#terminal"
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-cyan-500/20 whitespace-nowrap"
        >
          <Terminal className="w-4 h-4" />
          <span>{isFr ? 'OUVRIR LA CONSOLE' : 'OPEN KALI CONSOLE'}</span>
        </a>
      </div>

    </div>
  );
}