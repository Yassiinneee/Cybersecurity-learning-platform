// Internationalization Translation Dictionary for CyberNexus Platform
// Supported Languages: English ('en') and French ('fr')

export const translations = {
  en: {
    // Navigation & General UI
    nav: {
      home: "Home",
      dashboard: "Status",
      live: "Live",
      paths: "Courses",
      lessons: "Lessons",
      labs: "Labs",
      ctfs: "CTFs",
      terminal: "Console",
      assistant: "Nexus AI",
      verification: "Certificates",
      about: "About",
      contact: "Contact",
      admin: "Admin",
      instructor: "Instructor"
    },
    header: {
      betaTag: "BETA v4.2.0",
      rank: "Rank",
      level: "LVL",
      themeDark: "Dark Mode",
      themeLight: "Light Mode",
      langToggle: "Language / Langue",
      onlineHackers: "Live Hackers Online"
    },
    ranks: {
      apprentice: "Apprentice",
      specialist: "Specialist",
      pentester: "Pentester",
      expert: "Cyber Expert",
      elite: "Elite Hacker"
    },
    // Home Page
    home: {
      heroTag: "NEXT-GEN CYBERSECURITY TRAINING PLATFORM",
      heroTitle: "Master Ethical Hacking & Offensive Security",
      heroDesc: "Train in real-world offensive & defensive cyber scenarios with interactive Kali Linux sandbox terminals, hands-on vulnerability labs, CTF challenges, and AI-guided tutoring.",
      btnStartLearning: "Start Learning Path",
      btnExploreLabs: "Launch Hands-on Labs",
      btnOpenConsole: "Open Kali Console",
      statsTitle: "LIVE PLATFORM TELEMETRY",
      activeUsers: "Active Operatives",
      completedLabs: "Labs Completed",
      solvedCtfs: "CTFs Solved",
      certifications: "Certs Issued",
      featuresTitle: "Core Training Modules",
      feature1Title: "Interactive Learning Paths",
      feature1Desc: "Structured step-by-step tracks covering Web Security, Linux Administration, Penetration Testing, SOC Analysis, and Cryptography.",
      feature2Title: "Sandboxed Kali Console",
      feature2Desc: "Full browser-emulated Kali Linux terminal equipped with Nmap, Hydra, Sqlmap, Tshark, and SSH target tunneling capabilities.",
      feature3Title: "Vulnerable Practice Labs",
      feature3Desc: "Deploy live vulnerable target machines directly inside the browser and execute real exploitation vectors to capture flags.",
      feature4Title: "AI Security Tutor (Nexus AI)",
      feature4Desc: "Gemini-powered interactive tutor to explain networking, analyze system logs, and guide you through challenges without spoiling flag solutions."
    },
    // Status / Dashboard
    dashboard: {
      title: "OPERATIVE PROFILE & PERFORMANCE METRICS",
      subtitle: "Track your security level, unlocked achievements, skill radar balance, and completed training history.",
      levelOverview: "Level & XP Overview",
      currentLevel: "Current Level",
      totalXp: "Total Experience Points",
      xpToNext: "XP to next level",
      quickStats: "Quick Stats",
      coursesDone: "Courses Finished",
      labsCompleted: "Labs Completed",
      flagsCaptured: "Flags Captured",
      radarTitle: "Skill Proficiency Radar",
      radarTactical: "Tactical View",
      radarClassic: "Classic View",
      webSecurity: "Web Security",
      linuxAdmin: "Linux Systems",
      penetrationTesting: "Pentesting",
      blueTeamSoc: "Blue Team SOC",
      cryptography: "Cryptography",
      achievementsTitle: "Unlocked Badges & Achievements",
      noAchievements: "No achievements unlocked yet. Complete lessons and labs to earn badges!"
    },
    // Courses / Paths
    paths: {
      title: "STRUCTURED LEARNING PATHS",
      subtitle: "Comprehensive curriculum designed to take you from cybersecurity fundamentals to advanced penetration testing.",
      startPath: "Start Learning Path",
      continuePath: "Continue Path",
      duration: "Duration",
      xpReward: "XP Reward",
      modules: "Modules",
      lessonsCount: "Lessons",
      selectModule: "Select a module to view lessons:"
    },
    // Lessons & Quizzes
    lessons: {
      title: "INTERACTIVE LESSONS & QUIZZES",
      subtitle: "Gain theoretical insights, inspect architectural diagrams, test your knowledge with timed quizzes, and submit flags.",
      chooseLesson: "Choose a Lesson",
      instructions: "Lesson Content & Concept",
      quizTitle: "Knowledge Check Quiz",
      timeRemaining: "Time Remaining",
      submitQuiz: "Submit Quiz Answers",
      quizScore: "Quiz Score",
      practicalTask: "Practical Hands-on Task",
      flagInputPlaceholder: "Submit acquired flag format (THM{...})",
      submitFlag: "SUBMIT FLAG",
      taskSolved: "Practical Task Solved successfully! Flag accepted.",
      incorrectFlag: "Incorrect Flag format or value. Check hint and retry.",
      takeNotes: "Personal Notes & Scratchpad",
      saveNotes: "Save Notes"
    },
    // Hands-on Sandbox Labs
    labs: {
      title: "VULNERABLE HANDS-ON LABS",
      subtitle: "Deploy live virtual target environments, analyze target open ports, execute exploit vectors, and harvest administrative flags.",
      difficulty: "Difficulty",
      category: "Category",
      duration: "Est. Time",
      xp: "XP Reward",
      targetIp: "Target IP Address",
      vulnerableServices: "Vulnerable Services",
      btnDeploy: "Deploy Sandbox Target",
      btnDeploying: "Spinning Up VM...",
      btnTerminated: "Target Active",
      labInstructions: "Lab Objectives & Guide",
      tasksList: "Lab Challenge Tasks & Flags",
      flagPlaceholder: "Format: THM{...} or parameter value",
      verifyFlag: "VERIFY FLAG",
      taskSolved: "SOLVED",
      taskPending: "PENDING",
      terminalGuide: "Execute commands in the Kali Console tab against target IP"
    },
    // CTF Challenges
    ctfs: {
      title: "CAPTURE THE FLAG (CTF) ARENA",
      subtitle: "Test your vulnerability assessment speed against real security challenges across multiple categories.",
      allCategories: "All Categories",
      solved: "SOLVED",
      points: "PTS",
      submitFlagTitle: "Submit Flag for Challenge",
      flagInputPlaceholder: "Enter flag (e.g., THM{...})",
      submitBtn: "SUBMIT FLAG",
      unlockHintBtn: "Unlock Hint (-20 XP)",
      hintUnlocked: "Hint:",
      correctFlag: "Congratulations! Flag captured successfully.",
      wrongFlag: "Incorrect flag. Try again!"
    },
    // Terminal Simulator
    terminal: {
      title: "KALI LINUX TERMINAL SIMULATOR",
      subtitle: "Full browser-emulated bash command shell environment with built-in networking utilities.",
      clearBtn: "Clear Screen",
      resetBtn: "Reset Environment",
      typeHelp: "Type 'help' for available command binaries.",
      placeholder: "Enter bash command (e.g., nmap -sV 10.10.10.88)...",
      promptPrefix: "root@nexus-kali:~#"
    },
    // Nexus AI Tutor
    assistant: {
      title: "NEXUS AI TUTOR & ASSISTANT",
      subtitle: "Powered by Gemini to provide tailored security guidance, log analysis, and conceptual assistance without leaking raw flag solutions.",
      placeholder: "Ask Nexus AI about web vulnerabilities, Linux commands, or network protocols...",
      sendBtn: "Ask AI",
      suggestedQuestions: "Suggested Topics:",
      q1: "How does Stored XSS differ from Reflected XSS?",
      q2: "Explain how to find SUID binaries in Linux.",
      q3: "How do I use Nmap service version detection (-sV)?",
      q4: "What is the difference between TCP and UDP?"
    },
    // Certificates
    verification: {
      title: "VERIFIABLE ATTESTATIONS & CERTIFICATES",
      subtitle: "Generate cryptographically verifiable certificates upon mastering cybersecurity paths.",
      generateTitle: "Issue Official Certificate of Completion",
      selectPath: "Select Completed Learning Path",
      yourName: "Your Full Name / Alias",
      btnGenerate: "Generate Certificate",
      certHeader: "CERTIFICATE OF CYBERSECURITY ACHIEVEMENT",
      certSub: "This attestation confirms that the holder has successfully satisfied all practical lab and theoretical criteria for:",
      issuedTo: "Awarded To",
      dateIssued: "Date of Issuance",
      verificationId: "Verification ID",
      btnDownload: "Download Certificate JSON Attestation",
      verifySearchTitle: "Verify Certificate Authenticity",
      verifyPlaceholder: "Enter Certificate ID (e.g. CERT-CYBER-...) ",
      btnVerify: "Verify ID",
      validMsg: "VERIFIED ATTESTATION: Certificate is valid and recorded on CyberNexus Ledger."
    },
    // About & Contact
    about: {
      title: "ABOUT CYBERNEXUS",
      description: "CyberNexus is a premier interactive cybersecurity learning platform built for aspiring ethical hackers, defensive analysts, and security engineers.",
      missionTitle: "Our Mission",
      missionDesc: "To democratize high-quality, practical cybersecurity education by providing realistic, accessible hands-on simulation environments.",
      techStack: "Platform Architecture & Tech Stack",
      versionInfo: "Version 4.2.0 • Socket.io Enabled • Gemini AI Integration"
    },
    contact: {
      title: "GET IN TOUCH WITH THE CYBERNEXUS TEAM",
      subtitle: "Have questions, suggestions, or bug reports? Reach out directly through the support interface.",
      name: "Your Name",
      email: "Your Email Address",
      subject: "Subject",
      message: "Message",
      sendBtn: "Send Message",
      sending: "Transmitting Message...",
      successMsg: "Message transmitted successfully! Our team will get back to you shortly.",
      errorMsg: "Failed to send message. Please try again."
    },
    // Auth Screen
    auth: {
      welcome: "Welcome to CyberNexus",
      subTitle: "Interactive Pentesting & Learning Node",
      loginSub: "Access your persistent security portal and progress history.",
      registerSub: "Create a new operative account to track rank and certificates.",
      loginTab: "[ LOGIN SESSION ]",
      registerTab: "[ CREATE NODE ]",
      aliasLabel: "Hacker Alias / Username",
      aliasPlaceholder: "e.g. root_hacker_13",
      emailLabel: "Node Communication Email",
      emailPlaceholder: "e.g. name@domain.com",
      passwordLabel: "Encryption Password",
      verifyPasswordLabel: "Verify Encryption Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      initSessionBtn: "INITIALIZE SECURE SESSION",
      registerNodeBtn: "REGISTER PLATFORM NODE",
      negotiating: "NEGOTIATING SECURITY TUNNEL...",
      emailPasswordRequired: "Email and Password are required.",
      allFieldsRequired: "All fields are required.",
      passwordsDontMatch: "Passwords do not match.",
      handshakeSuccess: "Handshake successful! Logged in.",
      accountCreatedSuccess: "Account created successfully! Redirecting to login...",
      invalidCredentials: "Invalid login credentials.",
      registrationFailed: "Registration failed.",
      networkError: "Network error connecting to auth server.",
      designedBy: "designed by",
      designedWith: "Designed with",
      using: "using",
      techStack: "technical stack",
      allRightsReserved: "All rights reserved.",
      username: "Username / Operative Alias",
      password: "Password",
      email: "Email Address",
      btnLogin: "AUTHENTICATE & ENTER",
      btnRegister: "CREATE OPERATIVE ACCOUNT",
      btnGuest: "Continue as Guest / Local Session",
      googleAuth: "Sign in with Google",
      switchToRegister: "Need an account? Register here",
      switchToLogin: "Already have an account? Log in here"
    }
  },

  fr: {
    // Navigation & General UI
    nav: {
      home: "Accueil",
      dashboard: "Statut",
      live: "Direct",
      paths: "Cours",
      lessons: "Leçons",
      labs: "Labs",
      ctfs: "CTFs",
      terminal: "Console",
      assistant: "IA Nexus",
      verification: "Certificats",
      about: "À propos",
      contact: "Contact",
      admin: "Admin",
      instructor: "Instructeur"
    },
    header: {
      betaTag: "BETA v4.2.0",
      rank: "Rang",
      level: "NIV",
      themeDark: "Mode Sombre",
      themeLight: "Mode Clair",
      langToggle: "Langue / Language",
      onlineHackers: "Hacker En Ligne"
    },
    ranks: {
      apprentice: "Apprenti",
      specialist: "Spécialiste",
      pentester: "Pentesteur",
      expert: "Expert Cyber",
      elite: "Hacker d'Élite"
    },
    // Home Page
    home: {
      heroTag: "PLATEFORME DE FORMATION EN CYBERSÉCURITÉ DE NOUVELLE GÉNÉRATION",
      heroTitle: "Maîtrisez le Hacking Éthique & la Sécurité Offensives",
      heroDesc: "Entraînez-vous dans des scénarios cyber réels grâce à un terminal Kali Linux simulé, des laboratoires de vulnérabilités interactifs, des défis CTF et un tuteur guidé par IA.",
      btnStartLearning: "Démarrer un Parcours",
      btnExploreLabs: "Explorer les Labs",
      btnOpenConsole: "Ouvrir la Console Kali",
      statsTitle: "TÉLÉMÉTRIE DE LA PLATEFORME EN DIRECT",
      activeUsers: "Opérateurs Actifs",
      completedLabs: "Labs Terminés",
      solvedCtfs: "CTFs Résolus",
      certifications: "Certificats Délivrés",
      featuresTitle: "Modules de Formation Principaux",
      feature1Title: "Parcours d'Apprentissage Interactifs",
      feature1Desc: "Programmes structurés étape par étape couvrant la sécurité web, l'administration Linux, les tests d'intrusion, l'analyse SOC et la cryptographie.",
      feature2Title: "Console Kali Linux Sécurisée",
      feature2Desc: "Terminal Kali Linux complet intégré au navigateur avec Nmap, Hydra, Sqlmap, Tshark et tunneling SSH.",
      feature3Title: "Laboratoires Pratiques Vulnérables",
      feature3Desc: "Déployez des machines cibles vulnérables directement dans votre navigateur et exécutez de vrais vecteurs d'exploitation pour capturer les flags.",
      feature4Title: "Tuteur Sécurité IA (Nexus AI)",
      feature4Desc: "Assistant virtuel alimenté par Gemini pour expliquer les réseaux, analyser les journaux système et vous guider sans dévoiler les solutions."
    },
    // Status / Dashboard
    dashboard: {
      title: "PROFIL D'OPÉRATEUR & MÉTRIQUES DE PERFORMANCE",
      subtitle: "Suivez votre niveau de sécurité, badges débloqués, radar de compétences et historique de formation.",
      levelOverview: "Aperçu du Niveau & XP",
      currentLevel: "Niveau Actuel",
      totalXp: "Points d'Expérience Totaux",
      xpToNext: "XP pour le niveau suivant",
      quickStats: "Statistiques Rapides",
      coursesDone: "Cours Terminés",
      labsCompleted: "Labs Capturés",
      flagsCaptured: "Flags Récupérés",
      radarTitle: "Radar de Compétences",
      radarTactical: "Vue Tactique",
      radarClassic: "Vue Classique",
      webSecurity: "Sécurité Web",
      linuxAdmin: "Systèmes Linux",
      penetrationTesting: "Test d'Intrusion",
      blueTeamSoc: "SOC Blue Team",
      cryptography: "Cryptographie",
      achievementsTitle: "Badges & Accomplissements Débloqués",
      noAchievements: "Aucun badge débloqué pour le moment. Complétez des leçons et labs pour en obtenir !"
    },
    // Courses / Paths
    paths: {
      title: "PARCOURS D'APPRENTISSAGE STRUCTURÉS",
      subtitle: "Un programme complet conçu pour vous faire passer des bases de la cybersécurité aux tests d'intrusion avancés.",
      startPath: "Démarrer le Parcours",
      continuePath: "Continuer le Parcours",
      duration: "Durée",
      xpReward: "Récompense XP",
      modules: "Modules",
      lessonsCount: "Leçons",
      selectModule: "Sélectionnez un module pour voir les leçons :"
    },
    // Lessons & Quizzes
    lessons: {
      title: "LEÇONS INTERACTIVES & QUIZZES",
      subtitle: "Acquérez des connaissances théoriques, examinez des schémas d'architecture, testez votre savoir et validez des flags.",
      chooseLesson: "Choisir une Leçon",
      instructions: "Contenu & Concept de la Leçon",
      quizTitle: "Quiz de Validation des Connaissances",
      timeRemaining: "Temps Restant",
      submitQuiz: "Soumettre les Réponses",
      quizScore: "Score du Quiz",
      practicalTask: "Tâche Pratique",
      flagInputPlaceholder: "Format de flag à soumettre (THM{...})",
      submitFlag: "SOUMETTRE LE FLAG",
      taskSolved: "Tâche Pratique Résolue avec succès ! Flag accepté.",
      incorrectFlag: "Format ou valeur de flag incorrect. Vérifiez l'indice et réessayez.",
      takeNotes: "Notes Personnelles & Bloc-notes",
      saveNotes: "Sauvegarder les Notes"
    },
    // Hands-on Sandbox Labs
    labs: {
      title: "LABORATOIRES PRATIQUES VULNÉRABLES",
      subtitle: "Déployez des environnements cibles virtuels en direct, analysez les ports ouverts, exécutez des exploits et capturez les flags d'administration.",
      difficulty: "Difficulté",
      category: "Catégorie",
      duration: "Temps Est.",
      xp: "Récompense XP",
      targetIp: "Adresse IP Cible",
      vulnerableServices: "Services Vulnérables",
      btnDeploy: "Déployer la Cible Sandbox",
      btnDeploying: "Démarrage de la VM...",
      btnTerminated: "Cible Active",
      labInstructions: "Objectifs & Guide du Lab",
      tasksList: "Missions du Lab & Flags",
      flagPlaceholder: "Format: THM{...} ou valeur de paramètre",
      verifyFlag: "VÉRIFIER LE FLAG",
      taskSolved: "RÉSOLU",
      taskPending: "EN ATTENTE",
      terminalGuide: "Exécutez des commandes dans l'onglet Console Kali contre l'IP cible"
    },
    // CTF Challenges
    ctfs: {
      title: "ARÈNE CAPTURE THE FLAG (CTF)",
      subtitle: "Testez votre rapidité d'évaluation des vulnérabilités face à des défis réels dans plusieurs catégories.",
      allCategories: "Toutes les Catégories",
      solved: "RÉSOLU",
      points: "PTS",
      submitFlagTitle: "Soumettre un Flag pour le Défi",
      flagInputPlaceholder: "Entrer le flag (ex: THM{...})",
      submitBtn: "SOUMETTRE LE FLAG",
      unlockHintBtn: "Débloquer l'Indice (-20 XP)",
      hintUnlocked: "Indice :",
      correctFlag: "Félicitations ! Flag capturé avec succès.",
      wrongFlag: "Flag incorrect. Réessayez !"
    },
    // Terminal Simulator
    terminal: {
      title: "SIMULATEUR DE TERMINAL KALI LINUX",
      subtitle: "Environnement shell bash entièrement simulé dans le navigateur avec utilitaires réseau intégrés.",
      clearBtn: "Effacer l'Écran",
      resetBtn: "Réinitialiser l'Environnement",
      typeHelp: "Tapez 'help' pour la liste des outils disponibles.",
      placeholder: "Entrer une commande bash (ex: nmap -sV 10.10.10.88)...",
      promptPrefix: "root@nexus-kali:~#"
    },
    // Nexus AI Tutor
    assistant: {
      title: "TUTEUR & ASSISTANT IA NEXUS",
      subtitle: "Propulsé par Gemini pour vous offrir des conseils personnalisés, analyser des logs et vous guider sans révéler la solution directe.",
      placeholder: "Posez une question sur les vulnérabilités web, commandes Linux ou protocoles réseau...",
      sendBtn: "Demander à l'IA",
      suggestedQuestions: "Sujets Suggérés :",
      q1: "Quelle est la différence entre XSS Stocké et Refléchi ?",
      q2: "Explique comment trouver les fichiers SUID sous Linux.",
      q3: "Comment utiliser la détection de version de service avec Nmap (-sV) ?",
      q4: "Quelle est la différence entre les protocoles TCP et UDP ?"
    },
    // Certificates
    verification: {
      title: "ATTESTATIONS & CERTIFICATS VÉRIFIABLES",
      subtitle: "Générez des certificats vérifiables cryptographiquement après la maîtrise des parcours de formation.",
      generateTitle: "Délivrer un Certificat Officiel de Réussite",
      selectPath: "Sélectionner le Parcours Terminé",
      yourName: "Votre Nom Complet / Pseudo",
      btnGenerate: "Générer le Certificat",
      certHeader: "CERTIFICAT DE RÉUSSITE EN CYBERSÉCURITÉ",
      certSub: "Cette attestation confirme que le titulaire a satisfait avec succès à tous les critères théoriques et pratiques pour :",
      issuedTo: "Décerné À",
      dateIssued: "Date de Délivrance",
      verificationId: "ID de Vérification",
      btnDownload: "Télécharger l'Attestation JSON",
      verifySearchTitle: "Vérifier l'Authenticité d'un Certificat",
      verifyPlaceholder: "Entrer l'ID du Certificat (ex: CERT-CYBER-...) ",
      btnVerify: "Vérifier l'ID",
      validMsg: "ATTESTATION VÉRIFIÉE : Le certificat est valide et enregistré sur le registre CyberNexus."
    },
    // About & Contact
    about: {
      title: "À PROPOS DE CYBERNEXUS",
      description: "CyberNexus est une plateforme d'apprentissage de la cybersécurité interactive conçue pour les passionnés de hacking éthique, les analystes défensifs et les ingénieurs en sécurité.",
      missionTitle: "Notre Mission",
      missionDesc: "Démocratiser une éducation en cybersécurité pratique et de haute qualité en offrant des environnements de simulation réalistes et accessibles.",
      techStack: "Architecture de la Plateforme & Stack Technique",
      versionInfo: "Version 4.2.0 • Socket.io Activé • Intégration Gemini IA"
    },
    contact: {
      title: "CONTACTER L'ÉQUIPE CYBERNEXUS",
      subtitle: "Des questions, suggestions ou signalements de bugs ? Contactez-nous directement via le formulaire ci-dessous.",
      name: "Votre Nom",
      email: "Votre Adresse Email",
      subject: "Sujet",
      message: "Message",
      sendBtn: "Envoyer le Message",
      sending: "Transmission du Message...",
      successMsg: "Message transmis avec succès ! Notre équipe vous répondra sous peu.",
      errorMsg: "Échec de l'envoi du message. Veuillez réessayer."
    },
    // Auth Screen
    auth: {
      welcome: "Bienvenue sur CyberNexus",
      subTitle: "Nœud d'apprentissage et de pentest interactif",
      loginSub: "Accédez à votre portail de sécurité persistant et à votre historique.",
      registerSub: "Créez un compte d'opérateur pour suivre votre rang et vos certificats.",
      loginTab: "[ SESSION DE CONNEXION ]",
      registerTab: "[ CRÉER UN NŒUD ]",
      aliasLabel: "Pseudo Hacker / Nom d'utilisateur",
      aliasPlaceholder: "ex. root_hacker_13",
      emailLabel: "Email de communication du nœud",
      emailPlaceholder: "ex. nom@domaine.com",
      passwordLabel: "Mot de passe de chiffrement",
      verifyPasswordLabel: "Vérifier le mot de passe de chiffrement",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      initSessionBtn: "INITIALISER LA SESSION SÉCURISÉE",
      registerNodeBtn: "ENREGISTRER LE NŒUD DE PLATEFORME",
      negotiating: "NÉGOCIATION DU TUNNEL DE SÉCURITÉ...",
      emailPasswordRequired: "L'email et le mot de passe sont requis.",
      allFieldsRequired: "Tous les champs sont requis.",
      passwordsDontMatch: "Les mots de passe ne correspondent pas.",
      handshakeSuccess: "Handshake réussi ! Connecté.",
      accountCreatedSuccess: "Compte créé avec succès ! Redirection vers la connexion...",
      invalidCredentials: "Identifiants de connexion invalides.",
      registrationFailed: "L'inscription a échoué.",
      networkError: "Erreur réseau lors de la connexion au serveur d'authentification.",
      designedBy: "conçu par",
      designedWith: "Conçu avec",
      using: "utilisant la",
      techStack: "pile technique",
      allRightsReserved: "Tous droits réservés.",
      username: "Nom d'utilisateur / Pseudo d'opérateur",
      password: "Mot de passe",
      email: "Adresse Email",
      btnLogin: "SE CONNECTER & ENTRER",
      btnRegister: "CRÉER UN COMPTE D'OPÉRATEUR",
      btnGuest: "Continuer en tant qu'invité / Session locale",
      googleAuth: "Se connecter avec Google",
      switchToRegister: "Pas de compte ? Inscrivez-vous ici",
      switchToLogin: "Déjà un compte ? Connectez-vous ici"
    }
  }
};

/**
 * Helper function to retrieve nested translation keys with fallback
 * Usage: t('nav.home') -> "Home" or "Accueil"
 */
export function t(lang, keyPath, fallback = '') {
  const currentLangDict = translations[lang] || translations.en;
  const keys = keyPath.split('.');
  let current = currentLangDict;
  
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      // Fallback to English if key missing in selected language
      let enCurrent = translations.en;
      for (const enK of keys) {
        if (enCurrent && enK in enCurrent) {
          enCurrent = enCurrent[enK];
        } else {
          return fallback || keyPath;
        }
      }
      return typeof enCurrent === 'string' ? enCurrent : (fallback || keyPath);
    }
  }
  
  return typeof current === 'string' ? current : (fallback || keyPath);
}
