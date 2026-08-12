# CYBERNEXUS PLATFORM: ARCHITECTURE, SECURITY & SYSTEM MANUAL
> **Version:** 2.5.0 | **Classification:** Technical Reference & Deployment Manual  
> **Platform:** Full-Stack Gamified Cybersecurity Learning Management System & Cyber Range

---

## 📋 Executive Summary

**CyberNexus** is a next-generation, full-stack cybersecurity learning platform and interactive cyber range designed to bridge theoretical cybersecurity concepts with hands-on technical execution. Featuring an integrated web-based Kali terminal, active containerized lab environments, jeopardy-style CTF (Capture The Flag) arenas, an AI Cyber Assistant powered by Google Gemini, and a granular Role-Based Access Control (RBAC) engine, CyberNexus delivers an end-to-end educational framework for cybersecurity professionals, instructors, and students.

### Key Capabilities
- **Gamified Cyber Range**: Progressive experience point (XP) engine, levels, streaks, badges, and real-time leaderboards.
- **Interactive Kali Console**: Simulated browser-based command line interface supporting network recon (`nmap`), web scanning (`nikto`, `gobuster`), cryptography tools, and log analysis.
- **Role-Based Access Control (RBAC)**: Strict privilege enforcement separating **Admin**, **Instructor**, and **Student** operations.
- **AI Cyber Tutor ("Nexus AI")**: Context-aware AI tutor powered by Google Gemini, trained to guide learners through penetration testing concepts without giving away explicit flag answers.
- **Security Incident Telemetry**: Real-time audit logging of authentication events, authorization checks, and privilege operations.
- **Cryptographic Certificate Verification**: On-chain style verification engine for course completion certificates.

---

## 📁 System Architecture & Directory Hierarchy

The platform uses an decoupled full-stack architecture. The client application resides in `/client` (built with React 19, Vite, and Tailwind CSS), while the server application resides in `/server` (built with Node.js, Express, MongoDB/Mongoose with in-memory state fallbacks, and JWT security).

```text
cyber-nexus-platform/
├── package.json                   # Dependencies, build scripts & engine configs
├── tsconfig.json                  # TypeScript compiler options
├── vite.config.ts                 # Vite bundler configuration (client root)
├── .env.example                   # Environment variable templates
├── LEVEL_PROGRESSION.txt          # Dedicated progression system guide
├── CYBER_NEXUS_FULL_GUIDE.md      # Comprehensive platform architecture guide
│
├── client/                        # --- FRONTEND PRESENTATION LAYER ---
│   ├── index.html                 # HTML5 single-page application wrapper
│   └── src/
│       ├── main.tsx               # React DOM hydration entrypoint
│       ├── App.tsx                # Central UI state hub & route renderer
│       ├── App.css                # Custom animation & theme variables
│       ├── index.css              # Tailwind CSS directives & global resets
│       ├── types.ts               # Shared TypeScript schemas
│       ├── data.js                # Curriculum, Labs, and CTF challenge databases
│       └── components/
│           ├── Admin.jsx          # Admin Control Center (Users, Logs, System)
│           ├── Instructor.jsx     # Instructor Telemetry & Student Management
│           ├── Login.jsx          # Authentication entry & JWT handler
│           ├── Register.jsx       # Learner onboarding & account creation
│           ├── InteractiveDiagram.jsx # OSI, TCP, and SQLi interactive visualizers
│           ├── about.jsx          # Platform architecture & mission overview
│           └── contact.jsx        # Secure dispatch & support terminal
│
└── server/                        # --- BACKEND REST & SERVICE LAYER ---
    ├── server.js                  # Express HTTP application entrypoint
    ├── config/
    │   ├── ai.js                  # Google GenAI SDK client setup
    │   └── db.js                  # MongoDB Mongoose connection manager
    ├── controllers/
    │   ├── authController.js      # Authentication & JWT session handlers
    │   ├── adminController.js     # User management & audit log controllers
    │   ├── instructorController.js# Instructor telemetry & lab evaluation
    │   ├── chatController.js      # Nexus AI chat dispatch controller
    │   └── verifyController.js    # Certificate decoding & validation
    ├── middlewares/
    │   ├── authMiddleware.js      # JWT cookie & Bearer token validator
    │   ├── adminMiddleware.js     # Admin RBAC enforcement middleware
    │   ├── instructorMiddleware.js# Instructor RBAC enforcement middleware
    │   ├── logger.js              # HTTP request & audit logger
    │   └── errorHandler.js        # Centralized exception handler
    ├── models/
    │   ├── User.js                # Mongoose user schema & profile persistence
    │   ├── IncidentLog.js         # Security incident audit schema
    │   └── profileModel.js        # JSDoc profile model structures
    ├── routes/
    │   ├── api.js                 # Primary API router merger
    │   ├── authRoutes.js          # Authentication endpoint routes
    │   ├── adminRoutes.js         # Admin management routes
    │   ├── instructorRoutes.js    # Instructor portal routes
    │   ├── learningRoutes.js      # Progress & course tracking routes
    │   ├── chatRoutes.js          # AI Assistant communication routes
    │   └── verifyRoutes.js        # Certificate validation routes
    ├── services/
    │   ├── geminiService.js       # Google Gemini API interaction service
    │   └── verificationService.js # Certificate verification logic
    ├── socket/
    │   └── socketHandler.js       # WebSockets for live lab metrics & chat
    └── utils/
        └── helpers.js             # Level progression calculator & input sanitizers
```

---

## 🔒 Security Architecture & Role-Based Access Control (RBAC)

Security is woven into every layer of CyberNexus to protect user data and maintain administrative integrity.

### 1. User Roles & Access Matrix

| Feature / Action | Student | Instructor | Admin |
| :--- | :---: | :---: | :---: |
| Access Public & Interactive Courses | ✅ | ✅ | ✅ |
| Launch Hands-on Cyber Labs | ✅ | ✅ | ✅ |
| Submit CTF Flags & Earn XP | ✅ | ✅ | ✅ |
| Access Nexus AI Cyber Tutor | ✅ | ✅ | ✅ |
| View Instructor Telemetry & Roster | ❌ | ✅ | ✅ |
| Create & Grade Lab Submissions | ❌ | ✅ | ✅ |
| Admin Panel Access | ❌ | ❌ | ✅ |
| Modify User Roles (Student / Instructor / Admin) | ❌ | ❌ | ✅ |
| Edit User Level, XP & Streaks | ❌ | ❌ | ✅ |
| Ban / Restore User Accounts | ❌ | ❌ | ✅ |
| Delete User Accounts | ❌ | ❌ | ✅ |
| View & Purge System Security Audit Logs | ❌ | ❌ | ✅ |

### 2. Privilege Protection & Self-Escalation Guards
- **Role Elevation Prevention**: Regular users (Students and Instructors) cannot modify their own roles. Endpoint `/api/instructor/toggle-self-instructor` is explicitly restricted to prevent unauthorized self-promotion. Role assignments can only be granted by an authenticated Admin through the Admin Control Panel.
- **Navigation Visibility**: Admin and Instructor navigation tabs in the application sidebar are dynamically rendered based on confirmed account credentials.

### 3. Authentication & Session Hygiene
- **Dual Token Dispatch**: Authentication cookies (`token`) are delivered with `HttpOnly`, `SameSite=Lax` (or `None` in cross-origin preview contexts). Bearer token authentication headers are supported as a fallback for embedded iframe environments.
- **Navigation On Session Change**: Logging out or logging back in automatically redirects users to the **Home** dashboard (`activeTab = 'home'`) to ensure clean state initialization.
- **Input Sanitization & Protection**: Requests are processed through `xss-clean`, `mongo-sanitize`, `express-validator`, and `hpp` to mitigate Cross-Site Scripting, SQL/NoSQL Injection, and HTTP Parameter Pollution.

---

## 🎮 Level Progression & Gamification Formula

CyberNexus implements a dynamic scaling experience system that rewards active learning while maintaining long-term engagement.

### 1. Leveling Mathematical Formula

$$\text{XP Required for Next Level} = \text{Current Level} \times 1,000 \text{ XP}$$

$$\text{Total Cumulative XP for Level } L = \sum_{k=1}^{L-1} (k \times 1,000) = \frac{(L - 1) \cdot L}{2} \times 1,000 \text{ XP}$$

### 2. Level Progression Thresholds

| Level Tier | Title / Rank | XP Required for Level | Total Cumulative XP |
| :---: | :--- | :---: | :---: |
| **Level 1** | Novice / Script Kiddie | 0 XP | 0 XP |
| **Level 2** | Apprentice | 1,000 XP | 1,000 XP |
| **Level 3** | Junior Operator | 2,000 XP | 3,000 XP |
| **Level 4** | Cyber Practitioner | 3,000 XP | 6,000 XP |
| **Level 5** | Security Analyst | 4,000 XP | 10,000 XP |
| **Level 6** | Penetration Tester | 5,000 XP | 15,000 XP |
| **Level 7** | Senior Specialist | 6,000 XP | 21,000 XP |
| **Level 8** | Threat Hunter | 7,000 XP | 28,000 XP |
| **Level 9** | Cyber Architect | 8,000 XP | 36,000 XP |
| **Level 10+** | Hax0r Master / Elite | 9,000 XP+ | 45,000 XP+ |

### 3. XP Earning Activities
- **Interactive Lessons**: +150 XP to +350 XP upon scoring $\ge 70\%$ on module quizzes.
- **Hands-on Cyber Labs**: +50 XP to +150 XP per sub-task; +300 XP to +600 XP for full lab module completion.
- **Jeopardy CTFs**: +200 XP (Easy), +400 XP (Medium), +600 XP (Hard), +800 XP (Insane).
- **Streak Multipliers**: Daily streak bonuses encourage consistent daily training.

---

## 🛠️ API Endpoint Specification

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student account.
- `POST /api/auth/login` — Authenticate credentials and receive JWT session.
- `POST /api/auth/logout` — Terminate active session and clear HTTP cookies.
- `GET  /api/auth/me` — Retrieve current authenticated profile & metrics.

### Admin Operations (`/api/admin`)
- `GET  /api/admin/overview` — System health metrics, user counts, incident tallies.
- `GET  /api/admin/users` — Fetch full roster of registered users.
- `PUT  /api/admin/users/:id/role` — Update target user role (`Student`, `Instructor`, `Admin`).
- `PUT  /api/admin/users/:id/stats` — Adjust target user level, XP, and streak metrics.
- `POST /api/admin/users/:id/toggle-ban` — Toggle account lock state (`Active` / `Banned`).
- `DELETE /api/admin/users/:id` — Permanently delete user account.
- `GET  /api/admin/logs` — Audit security incident and HTTP traffic logs.
- `POST /api/admin/logs/clear` — Purge security incident log history.

### Instructor Operations (`/api/instructor`)
- `GET  /api/instructor/stats` — Aggregated class performance & lab completion metrics.
- `GET  /api/instructor/students` — Retrieve student activity roster & progress.
- `GET  /api/instructor/submissions` — Inspect active lab flag submissions.

### Nexus AI Assistant (`/api/chat`)
- `POST /api/chat` — Dispatch query to Google Gemini 3.5 Flash with active module context.

### Verification (`/api/verify-certificate`)
- `GET  /api/verify-certificate/:id` — Cryptographically decode and validate certificate authenticity.

---

## 🚀 Setup & Installation Manual

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **MongoDB** (Optional): Local instance or MongoDB Atlas connection string (`MONGODB_URI`). If omitted, the platform automatically switches to an in-memory high-performance data state.

### 1. Environment Configuration
Copy `.env.example` and supply required variables:
```bash
cp .env.example .env
```

Example `.env` configuration:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=cybernexus_super_secret_jwt_key_2026
GEMINI_API_KEY=your_google_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/cybernexus
```

### 2. Dependency Installation
```bash
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### 4. Compiling & Running Production Build
```bash
npm run build
npm run start
```

---

## 📄 Exporting Documentation to PDF

To export this documentation into an official PDF document:
1. Open this file (`CYBER_NEXUS_FULL_GUIDE.md`) in any Markdown viewer or browser.
2. Press **Ctrl + P** (Windows/Linux) or **Cmd + P** (macOS).
3. Select **Save as PDF** as the print destination.
4. Enable **Background Graphics** in options to preserve dark-theme styling, then click **Save**.

