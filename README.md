# 🛡️ CyberNexus — Cybersecurity Learning Platform

<div align="center">

**An interactive, AI-powered cybersecurity education and hands-on training platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io\&logoColor=white)](https://socket.io/)
[![Google%20Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google\&logoColor=white)](https://ai.google.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?logo=javascript\&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Security](https://img.shields.io/badge/Security-Defense--in--Depth-red)](#-security-architecture)
[![License](https://img.shields.io/badge/License-ISC-blue)](#-license)

</div>

---

## 📌 Overview

**CyberNexus** is a full-stack cybersecurity learning platform designed to combine structured security education, interactive simulations, hands-on labs, CTF-style challenges, AI-assisted learning, real-time security telemetry, and learner progression into a single application.

The platform is built as a modern JavaScript application with a React/Vite frontend and a modular Node.js/Express backend. It includes authentication, role-based administration, instructor dashboards, learning paths, quizzes, practical laboratories, certificate generation and verification, payments, real-time Socket.IO events, Redis integration, MongoDB persistence, and a Google Gemini-powered cyber tutor.

> **Educational purpose:** The platform is intended for authorized cybersecurity education, defensive security training, controlled laboratories, and security awareness. Practical exercises should only be executed against systems you own or are explicitly authorized to test.

---

## 🎯 Project Objectives

CyberNexus is designed around five core objectives:

1. **Learn** — Provide structured cybersecurity lessons with progressive difficulty.
2. **Practice** — Transform theoretical concepts into controlled, interactive exercises.
3. **Challenge** — Use quizzes, labs, CTF-style tasks, XP, achievements, and levels to reinforce learning.
4. **Assist** — Provide an AI cybersecurity tutor capable of explaining security concepts and assisting with learning workflows.
5. **Measure** — Track progress, performance, activity, certificates, leaderboards, and instructor/admin metrics.

---

## ✨ Core Features

### 🎓 Learning Management

* Structured cybersecurity learning paths
* Modular lessons with objectives and reading material
* Difficulty levels and estimated lesson duration
* Interactive security diagrams
* Lesson quizzes with multiple question formats
* Progress tracking
* XP-based progression system
* Achievements and leaderboard mechanics
* Expert/advanced course unlocking

### 🧪 Practical Cybersecurity Labs

The platform includes controlled security-learning exercises covering areas such as:

* SQL Injection
* Cross-Site Scripting (XSS)
* NoSQL Injection
* CSRF and session defense
* Web application security
* Defensive security concepts
* Security telemetry and incident-oriented exercises

Labs can include:

* Instructions
* Hints
* Target information
* Flags
* Task validation
* Completion rewards

### 🚩 CTF-Style Training

CyberNexus supports challenge-based learning through CTF-style activities, including:

* Difficulty tiers
* Flag submission
* Hints
* Challenge completion
* XP rewards
* Progress tracking

### 💻 Kali-Style Terminal Simulator

The frontend includes a simulated cybersecurity terminal designed for educational interaction.

It provides:

* Command-style navigation
* Simulated cyber utilities
* Terminal history
* Working-directory state
* Nested-session simulation
* Learning-oriented command responses

> The terminal is a controlled simulator and should not be interpreted as a real privileged Kali Linux environment.

### 🤖 Nexus AI Cyber Tutor

The platform integrates Google Gemini through the Google GenAI SDK.

The AI assistant is designed to help learners:

* Understand cybersecurity concepts
* Interpret security logs
* Learn security tooling concepts
* Explain attack and defense flows
* Analyze educational packet/log examples
* Navigate learning content
* Receive contextual explanations

The server-side AI integration is implemented through a dedicated service/configuration layer rather than exposing the API key to the browser.

### 🔐 Authentication & Authorization

The backend includes authentication infrastructure using:

* Express sessions
* Passport.js
* Passport Google OAuth support
* JWT support
* HTTP-only cookies
* bcrypt password hashing
* Role-aware application flows

Supported application roles include:

* **Student**
* **Instructor**
* **Admin**

### 👨‍🏫 Instructor Dashboard

Instructor functionality includes:

* Class-level statistics
* Student activity
* Learning progress
* Lab completion metrics
* Submission inspection

### 🛡️ Admin Dashboard

Administrative capabilities include:

* Platform overview
* User management
* Role management
* XP/level/streak management
* Account banning/unbanning
* User deletion
* Security/HTTP log inspection
* Security log maintenance

### 📡 Real-Time Security Intelligence

Socket.IO powers real-time platform events such as:

* Active-user/node counts
* Security feed updates
* Live event notifications
* Real-time activity feed
* Toast notifications
* Optional notification sounds

### 🏆 Gamification

The platform includes a progression model based on XP, levels, achievements, and streaks.

Example progression:

| Level | Title                  | XP Required |
| :---: | ---------------------- | ----------: |
|   1   | Novice / Script Kiddie |           0 |
|   2   | Apprentice             |       1,000 |
|   3   | Junior Operator        |       2,000 |
|   4   | Cyber Practitioner     |       3,000 |
|   5   | Security Analyst       |       4,000 |
|   6   | Penetration Tester     |       5,000 |
|   7   | Senior Specialist      |       6,000 |
|   8   | Threat Hunter          |       7,000 |
|   9   | Cyber Architect        |       8,000 |
|  10+  | Elite                  |      9,000+ |

XP can be earned through:

* Lessons and quizzes
* Practical labs
* CTF challenges
* Completion milestones
* Streak activity

### 📜 Certificates

The application includes certificate functionality with:

* PDF certificate generation
* Certificate identifiers
* QR-code support
* Certificate verification endpoint
* Verification service
* Learner achievement records

### 🌍 Internationalization & UX

The frontend includes:

* English/French language support
* Dark/light theme support
* Responsive interface
* Persistent user preferences
* Interactive dashboards
* Modern iconography
* Motion/animation support
* Accessible state feedback

---

# 🏗️ Architecture

CyberNexus follows a modular full-stack architecture:

```text
┌─────────────────────────────────────────────────────────────┐
│                        CYBERNEXUS                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  React + Vite Frontend                                      │
│  ├── Learning UI                                            │
│  ├── Authentication                                         │
│  ├── Labs / CTFs                                            │
│  ├── Terminal Simulator                                     │
│  ├── AI Chat                                                │
│  ├── Admin / Instructor Dashboards                          │
│  └── Real-Time Client                                       │
│                     │                                       │
│                     ▼                                       │
│  Node.js + Express API                                      │
│  ├── Authentication / Authorization                         │
│  ├── Learning APIs                                          │
│  ├── Admin APIs                                             │
│  ├── Instructor APIs                                        │
│  ├── Chat / AI APIs                                         │
│  ├── Payment APIs                                           │
│  ├── Certificate Verification                               │
│  └── Health / Status APIs                                   │
│                     │                                       │
│          ┌──────────┼───────────┐                           │
│          ▼          ▼           ▼                           │
│      MongoDB      Redis     Google Gemini                   │
│      Database     Cache       AI Service                    │
│                                                             │
│                 Socket.IO                                   │
│              Real-Time Events                               │
└─────────────────────────────────────────────────────────────┘
```

---

# 🧰 Technology Stack

## Frontend

| Technology            | Purpose                   |
| --------------------- | ------------------------- |
| React 19              | UI architecture           |
| Vite 6                | Development/build tooling |
| JavaScript ES Modules | Application language      |
| Lucide React          | UI icons                  |
| Socket.IO Client      | Real-time communication   |
| Firebase SDK          | Firebase integration      |
| jsPDF                 | PDF generation            |
| QRCode                | QR generation             |
| Motion                | UI animation              |
| EmailJS               | Contact/email workflow    |

## Backend

| Technology                  | Purpose                             |
| --------------------------- | ----------------------------------- |
| Node.js                     | Runtime                             |
| Express.js                  | HTTP/API server                     |
| Mongoose                    | MongoDB ODM                         |
| Socket.IO                   | Real-time communication             |
| Redis                       | Caching/service integration         |
| Passport.js                 | Authentication                      |
| Passport Google OAuth       | OAuth authentication                |
| JSON Web Token              | Token-based authentication          |
| bcrypt                      | Password hashing                    |
| Express Validator           | Request validation                  |
| Helmet                      | HTTP security headers               |
| CORS                        | Cross-origin policy                 |
| Express Rate Limit          | Request throttling                  |
| mongo-sanitize              | NoSQL injection protection          |
| xss-clean                   | XSS-oriented request sanitization   |
| HPP                         | HTTP parameter pollution protection |
| Cookie Parser               | Cookie handling                     |
| Express Session             | Session management                  |
| Winston/custom logger layer | Application/security logging        |

## AI

* Google GenAI SDK
* Google Gemini
* Server-side API key handling
* Context-aware cybersecurity assistance

## Database & Infrastructure

* MongoDB / MongoDB Atlas
* Redis
* Vite development middleware
* Express production static serving
* Socket.IO over HTTP
* Container-friendly `0.0.0.0` binding

---

# 📂 Project Structure

```text
Cybersecurity-learning-platform-main/
│
├── client/
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── main.jsx
│       ├── data.js
│       ├── firebase.js
│       ├── translations.js
│       │
│       ├── components/
│       │   ├── Admin.jsx
│       │   ├── Instructor.jsx
│       │   ├── InteractiveDiagram.jsx
│       │   ├── Live.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── PaymentModal.jsx
│       │   ├── SettingsModal.jsx
│       │   ├── about.jsx
│       │   └── contact.jsx
│       │
│       └── utils/
│           └── pdfGenerator.js
│
├── server/
│   ├── config/
│   │   ├── ai.js
│   │   ├── db.js
│   │   └── passport.js
│   │
│   ├── controllers/
│   │   ├── chatController.js
│   │   └── verifyController.js
│   │
│   ├── middlewares/
│   │   ├── cacheMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── securityMiddleware.js
│   │
│   ├── models/
│   │   ├── Certificate.js
│   │   ├── User.js
│   │   ├── labs.js
│   │   ├── lesson.js
│   │   ├── profileModel.js
│   │   └── quizz.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── api.js
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── instructorRoutes.js
│   │   ├── learningRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── verifyRoutes.js
│   │
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── redisService.js
│   │   └── verificationService.js
│   │
│   ├── socket/
│   │   └── socketHandler.js
│   │
│   ├── types/
│   │   └── typesDoc.js
│   │
│   └── utils/
│       ├── autoSeeder.js
│       ├── helpers.js
│       └── seedData.js
│
├── server.js
├── vite.config.js
├── package.json
├── package-lock.json
├── bun.lock
├── docker-compose.yml
├── firestore.rules
├── firebase-applet-config.json
├── firebase-blueprint.json
├── CYBER_NEXUS_FULL_GUIDE.md
├── dynamicstatic.txt
├── levelprogress.txt
├── metadata.json
└── .gitignore
```

---

# 🔌 API Overview

All application APIs are mounted under `/api`.

## Health & Status

| Method | Endpoint               | Purpose                                |
| ------ | ---------------------- | -------------------------------------- |
| GET    | `/api/health`          | API health check                       |
| GET    | `/api/db-status`       | MongoDB connection state               |
| GET    | `/api/redis-status`    | Redis service status                   |
| GET    | `/api/security-status` | Security middleware/status information |
| GET    | `/api/csrf-token`      | CSRF token status endpoint             |

## Authentication

| Method | Endpoint             | Purpose                     |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register user               |
| POST   | `/api/auth/login`    | Authenticate user           |
| POST   | `/api/auth/logout`   | End active session          |
| GET    | `/api/auth/me`       | Retrieve authenticated user |

## Learning

The learning router handles platform learning workflows, including course/path content, lessons, quizzes, progress, and practical activities.

## Administration

| Method | Endpoint                          | Purpose                |
| ------ | --------------------------------- | ---------------------- |
| GET    | `/api/admin/overview`             | Platform/admin metrics |
| GET    | `/api/admin/users`                | User roster            |
| PUT    | `/api/admin/users/:id/role`       | Change user role       |
| PUT    | `/api/admin/users/:id/stats`      | Update XP/level/streak |
| POST   | `/api/admin/users/:id/toggle-ban` | Toggle account status  |
| DELETE | `/api/admin/users/:id`            | Delete user            |
| GET    | `/api/admin/logs`                 | Retrieve logs          |
| POST   | `/api/admin/logs/clear`           | Clear logs             |

## Instructor

| Method | Endpoint                      | Purpose               |
| ------ | ----------------------------- | --------------------- |
| GET    | `/api/instructor/stats`       | Instructor statistics |
| GET    | `/api/instructor/students`    | Student activity      |
| GET    | `/api/instructor/submissions` | Lab submissions       |

## AI Assistant

| Method | Endpoint    | Purpose                                         |
| ------ | ----------- | ----------------------------------------------- |
| POST   | `/api/chat` | Send cybersecurity learning query to AI service |

## Certificate Verification

| Method | Endpoint                      | Purpose              |
| ------ | ----------------------------- | -------------------- |
| GET    | `/api/verify-certificate/:id` | Validate certificate |

## Payments

Payment workflows are exposed through the `/api/payments` route group.

---

# 🔐 Security Architecture

Security is a first-class concern in CyberNexus.

The backend implements a defense-in-depth model that includes:

### HTTP Security

* Helmet
* Content Security Policy
* `X-Content-Type-Options`
* `X-Frame-Options`
* Referrer Policy
* Cross-Origin Resource Policy
* Cross-Origin Embedder Policy
* Cross-Origin Opener Policy
* Permissions Policy
* Sensitive API cache-control headers
* Hidden Express fingerprinting headers

### Network & API Security

* Strict CORS allowlisting
* Credentials-aware CORS
* API rate limiting
* Reverse-proxy awareness
* HTTP method restrictions
* Real-time Socket.IO origin validation

### Input Security

* MongoDB operator sanitization
* NoSQL injection guards
* XSS-oriented sanitization
* HTTP Parameter Pollution protection
* Express Validator integration
* Malformed JSON handling

### Authentication Security

* bcrypt password hashing
* Session cookies
* HTTP-only cookies
* Passport authentication
* OAuth support
* JWT infrastructure
* Role-based application flows

### Security Monitoring

* Request logging
* Security event logging
* Real-time security feed
* Admin security log inspection
* Security status endpoint

> **Important implementation note:** The current source exposes a CSRF status endpoint indicating that CSRF protection is disabled in the active configuration. Before production deployment, implement and verify a complete CSRF strategy appropriate to the authentication model.

---

# 🔑 Environment Variables

Create a local environment configuration file and never commit real credentials.

Example:

```env
NODE_ENV=development
PORT=3000

MONGODB_URI=mongodb://localhost:27017/cybernexus

JWT_SECRET=replace_with_a_long_random_secret
SESSION_SECRET=replace_with_a_long_random_secret

GEMINI_API_KEY=your_google_gemini_api_key

CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

REDIS_URL=redis://localhost:6379
```

Additional OAuth, Firebase, EmailJS, payment, or deployment-specific variables may be required depending on the enabled features.

### Secret Management Rules

Never commit:

* API keys
* JWT secrets
* Session secrets
* Database credentials
* OAuth client secrets
* Payment credentials
* Private Firebase credentials

Use environment variables or the secret-management system provided by your deployment platform.

---

# 🚀 Installation

## Prerequisites

Recommended environment:

* Node.js 20+
* npm 10+
* MongoDB or MongoDB Atlas
* Redis, if Redis-backed features are enabled
* Google Gemini API key for AI functionality

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Cybersecurity-learning-platform-main
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create `.env` in the project root.

On Windows PowerShell:

```powershell
New-Item .env
```

Populate it with the required values described above.

## 4. Start the Development Server

```bash
npm run dev
```

The application is configured to run on:

```text
http://localhost:3000
```

The Express server mounts Vite middleware during development, allowing the frontend and backend to operate through the same development server.

---

# 🏭 Production Build

Build the React frontend:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

In production, Express serves the generated frontend from the `dist` directory.

The server binds to:

```text
0.0.0.0:3000
```

This is suitable for containerized and managed-cloud environments that inject the public port through infrastructure configuration.

---

# 🐳 Docker

A `docker-compose.yml` file is included in the repository.

Before using Docker in production, verify:

* Environment variable injection
* MongoDB connectivity
* Redis connectivity
* Port mapping
* Persistent volumes
* CORS origins
* Secure cookies
* Reverse proxy configuration
* Health checks
* Production logging

---

# 🧪 Development Workflow

A recommended development workflow is:

```text
1. Start MongoDB / Atlas
        │
        ▼
2. Start Redis when required
        │
        ▼
3. Configure .env
        │
        ▼
4. npm install
        │
        ▼
5. npm run dev
        │
        ▼
6. Test authentication
        │
        ▼
7. Test learning modules
        │
        ▼
8. Test labs / CTFs
        │
        ▼
9. Test AI assistant
        │
        ▼
10. Test real-time feed
        │
        ▼
11. Run production build
        │
        ▼
12. Security review before deployment
```

---

# 🧭 Learning Experience

A typical learner journey is:

```text
Register / Login
      │
      ▼
Dashboard
      │
      ▼
Choose Learning Path
      │
      ▼
Study Lesson
      │
      ▼
Interactive Diagram
      │
      ▼
Complete Quiz
      │
      ▼
Earn XP
      │
      ▼
Deploy / Enter Practical Lab
      │
      ▼
Complete Task / Submit Flag
      │
      ▼
Unlock Progress / Achievements
      │
      ▼
Complete CTF Challenges
      │
      ▼
Earn Certificate
      │
      ▼
Verify Certificate
```

---

# 🧑‍💻 Example Learning Topics

The project data layer currently contains cybersecurity learning material such as:

* SQL Injection Fundamentals
* Cross-Site Scripting
* NoSQL Injection Prevention
* CSRF Tokens & Session Defense
* Web application security
* Secure coding concepts
* Security monitoring
* Practical attack/defense workflows

The architecture is extensible, allowing additional learning paths, modules, lessons, quizzes, labs, CTFs, and achievements to be added through the platform's data/model layer.

---

# 🧱 Design Principles

CyberNexus follows several engineering principles:

### Separation of Concerns

Frontend components, backend controllers, services, routes, models, middleware, configuration, and real-time logic are separated into dedicated modules.

### Security by Design

Security controls are integrated into the HTTP pipeline instead of being treated as an afterthought.

### Progressive Learning

Educational content moves from foundational concepts toward practical and advanced exercises.

### Real-Time Feedback

Socket.IO enables immediate activity and security telemetry updates.

### Extensibility

Learning paths, roles, APIs, services, and data models are structured to support future expansion.

### Environment-Based Configuration

Secrets and environment-dependent settings should be provided through environment variables rather than hard-coded configuration.

---

# 📊 Current Project Capabilities

| Area                          | Status |
| ----------------------------- | :----: |
| React frontend                |    ✅   |
| Vite integration              |    ✅   |
| Express backend               |    ✅   |
| MongoDB/Mongoose integration  |    ✅   |
| Redis integration             |    ✅   |
| Authentication infrastructure |    ✅   |
| Google OAuth infrastructure   |    ✅   |
| Admin dashboard               |    ✅   |
| Instructor dashboard          |    ✅   |
| Learning paths                |    ✅   |
| Quizzes                       |    ✅   |
| Cybersecurity labs            |    ✅   |
| CTF-style challenges          |    ✅   |
| Terminal simulator            |    ✅   |
| AI cybersecurity tutor        |    ✅   |
| Socket.IO real-time feed      |    ✅   |
| Certificate generation        |    ✅   |
| Certificate verification      |    ✅   |
| PDF export                    |    ✅   |
| QR-code support               |    ✅   |
| English/French UI             |    ✅   |
| Dark/light theme              |    ✅   |
| API rate limiting             |    ✅   |
| Helmet security headers       |    ✅   |
| NoSQL sanitization            |    ✅   |
| XSS sanitization layer        |    ✅   |
| HPP protection                |    ✅   |
| Centralized error handling    |    ✅   |
| Production static serving     |    ✅   |

---

# ⚠️ Production Readiness Checklist

Before deploying CyberNexus publicly, complete the following security hardening tasks:

* [ ] Remove every hard-coded credential or secret from source code.
* [ ] Rotate any credential that has previously appeared in source/history.
* [ ] Use a strong randomly generated `JWT_SECRET`.
* [ ] Use a strong randomly generated `SESSION_SECRET`.
* [ ] Configure production `NODE_ENV`.
* [ ] Restrict `ALLOWED_ORIGINS` to trusted production domains.
* [ ] Verify secure cookie behavior behind the production proxy.
* [ ] Implement and test CSRF protection.
* [ ] Review authentication/session expiration.
* [ ] Review authorization checks for every admin/instructor endpoint.
* [ ] Validate all payment flows server-side.
* [ ] Validate certificate verification server-side.
* [ ] Remove test/demo credentials and privileged username checks.
* [ ] Review seeded accounts before production deployment.
* [ ] Review all CTF/lab flags and ensure they are not exposed unnecessarily to clients.
* [ ] Apply MongoDB least-privilege database credentials.
* [ ] Enable production MongoDB network restrictions.
* [ ] Configure Redis authentication/TLS when required.
* [ ] Configure centralized production logging.
* [ ] Add monitoring and alerting.
* [ ] Run dependency vulnerability scans.
* [ ] Run OWASP ZAP or an equivalent authorized security assessment.
* [ ] Perform manual authorization testing.
* [ ] Verify CSP compatibility in the production environment.
* [ ] Confirm backups and recovery procedures.
* [ ] Configure HTTPS/TLS at the deployment layer.
* [ ] Review rate limits according to real traffic requirements.

---

# 🔍 Security Testing Recommendations

For an authorized staging deployment, consider testing:

### Authentication

* Brute-force resistance
* Session fixation
* Session expiration
* Cookie attributes
* OAuth redirect validation
* Password policy
* Account enumeration

### Authorization

* Student → Instructor privilege escalation
* Instructor → Admin privilege escalation
* Object-level authorization
* Administrative endpoint access
* Certificate ownership checks

### Input Validation

* NoSQL operator injection
* XSS payloads
* HTTP parameter pollution
* Malformed JSON
* Oversized requests
* Unexpected content types

### API Security

* Rate-limit behavior
* CORS enforcement
* CSRF controls
* Security headers
* Error information disclosure
* Cache-control behavior

### Real-Time Security

* Socket.IO origin restrictions
* Event authorization
* Unauthorized room/event subscription
* Event payload validation
* Rate limiting for real-time actions

---

# 🧠 Educational Security Scope

CyberNexus can serve as a foundation for training in:

```text
Cybersecurity Fundamentals
        │
        ├── Networking
        ├── Web Security
        ├── Secure Coding
        ├── Authentication
        ├── Authorization
        ├── Database Security
        ├── Defensive Security
        ├── Security Monitoring
        ├── Vulnerability Analysis
        ├── CTF Methodology
        └── Incident Awareness
```

The platform can be extended with:

* Network security labs
* Linux security
* Windows security
* Active Directory
* SOC/SIEM simulations
* Digital forensics
* Threat intelligence
* Malware-analysis theory
* Cloud security
* DevSecOps
* Secure software development
* Incident response
* Zero Trust architecture

---

# 🤝 Contributing

Contributions are welcome.

A recommended contribution workflow:

```bash
git checkout -b feature/your-feature
```

Implement and test the change, then:

```bash
git add .
git commit -m "feat: describe the change"
git push origin feature/your-feature
```

Open a pull request describing:

* What changed
* Why it changed
* How it was tested
* Security implications
* Any required environment variables
* Any database/schema changes

---

# 🐛 Troubleshooting

## Application does not start

Check:

```bash
node --version
npm --version
```

Then reinstall dependencies:

```bash
npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

## MongoDB connection problems

Verify:

```env
MONGODB_URI=...
```

Then confirm:

* MongoDB is running
* Atlas IP/network access is configured
* Database credentials are valid
* The user has the required permissions

## Gemini AI is unavailable

Verify:

```env
GEMINI_API_KEY=...
```

Also check:

* The API key is active
* The selected Google AI service/model is available
* API quotas have not been exceeded
* The server can reach the Google AI API

## Redis is unavailable

Check:

```env
REDIS_URL=redis://localhost:6379
```

If Redis is optional for the feature being tested, verify the application's fallback behavior before assuming the entire platform is unavailable.

## Port 3000 already in use

Find the process using port 3000 and stop it, or adjust the server configuration and deployment environment consistently.

---

# 📚 Documentation

The repository includes:

* `CYBER_NEXUS_FULL_GUIDE.md` — extended platform documentation
* `levelprogress.txt` — progression/XP reference
* `dynamicstatic.txt` — project-specific reference information
* `metadata.json` — project metadata
* Firebase configuration and rules files

---

# 🗺️ Future Roadmap

Potential future enhancements include:

* [ ] Dedicated LMS administration portal
* [ ] Advanced SOC simulation
* [ ] Real Linux container-based labs
* [ ] Isolated browser-based lab environments
* [ ] Docker/Kubernetes security labs
* [ ] Network packet-analysis laboratories
* [ ] SIEM integration
* [ ] Threat-intelligence feeds
* [ ] Advanced analytics dashboard
* [ ] Instructor-created courses
* [ ] Automated assessment engine
* [ ] Secure lab orchestration
* [ ] Multi-tenant classroom support
* [ ] More OAuth providers
* [ ] Automated security regression testing
* [ ] CI/CD security gates
* [ ] SAST/DAST integration
* [ ] Comprehensive accessibility audit
* [ ] Production observability stack

---

# 👨‍💻 Project Identity

**Project:** CyberNexus
**Category:** Cybersecurity Education / EdTech / Security Training
**Architecture:** Full-stack JavaScript
**Frontend:** React + Vite
**Backend:** Node.js + Express
**Database:** MongoDB / MongoDB Atlas
**Cache/Service Layer:** Redis
**Real-Time Layer:** Socket.IO
**AI Layer:** Google Gemini
**Security Model:** Defense in Depth
**Primary Purpose:** Cybersecurity education, simulation, and controlled practical training

---

# 📄 License

This project currently declares the **ISC License** in its package metadata.

Review and update the license section if the project is redistributed under a different institutional, academic, commercial, or open-source license.

---


#  Author

Yassine Kaltoum

Software & Network Engineering

Focus Areas
Software Engineering
Front-End Development
Web Performance
UI/UX Engineering
System Architecture
Network Engineering
Cybersecurity

---

# ⭐ Final Note

CyberNexus is more than a conventional course website: it is designed as an integrated cybersecurity learning environment that combines **education, simulation, practical exercises, AI assistance, gamification, real-time telemetry, administration, and assessment**.

Its modular architecture provides a strong foundation for evolving the project into a broader cybersecurity training ecosystem while maintaining a clear separation between the learner experience, backend services, security controls, data layer, and real-time infrastructure.

> **Build securely. Learn responsibly. Practice only with authorization. Defend by design.**
