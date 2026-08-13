
# 🛡️ CyberNexus — AI-Powered Cybersecurity Learning Platform

<div align="center">

<img src="https://img.shields.io/badge/CyberNexus-Cybersecurity%20Learning%20Platform-00d4ff?style=for-the-badge&logo=hackthebox&logoColor=white" alt="CyberNexus">

<br><br>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Redis-Caching-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis">
<img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.IO">
<img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini">
<img src="https://img.shields.io/badge/Google%20Cloud-4285F4?style=flat-square&logo=googlecloud&logoColor=white" alt="Google Cloud">

<br>

<img src="https://img.shields.io/badge/Security-OWASP%20Focused-critical?style=flat-square&logo=owasp" alt="Security">
<img src="https://img.shields.io/badge/Security-Defense%20%7C%20Depth-red?style=for-the-badge&logo=shield&logoColor=white" alt="Security - Defense in Depth">
<img src="https://img.shields.io/badge/Authentication-JWT%20%7C%20OAuth-orange?style=flat-square" alt="Authentication">
<img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License">

<br><br>

**An interactive, AI-powered cybersecurity education platform combining structured learning, hands-on laboratories, CTF challenges, real-time collaboration, AI assistance, gamification, and enterprise-grade security controls.**

</div>

---

## 📑 Table of Contents

* [Overview](#-overview)
* [Project Vision](#-project-vision)
* [Key Features](#-key-features)
* [Platform Architecture](#-platform-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Security Architecture](#-security-architecture)
* [Role-Based Access Control](#-role-based-access-control)
* [Learning System](#-learning-system)
* [Gamification & XP](#-gamification--xp)
* [AI Cybersecurity Assistant](#-ai-cybersecurity-assistant)
* [Hands-On Labs & CTFs](#-hands-on-labs--ctfs)
* [Real-Time Communication](#-real-time-communication)
* [Certificates](#-certificates)
* [Payment System](#-payment-system)
* [Internationalization](#-internationalization)
* [API Overview](#-api-overview)
* [Database Architecture](#-database-architecture)
* [Environment Variables](#-environment-variables)
* [Installation](#-installation)
* [Development](#-development)
* [Production Build](#-production-build)
* [Docker](#-docker)
* [Deployment](#-deployment)
* [Security Best Practices](#-security-best-practices)
* [Screenshots](#-screenshots)
* [Troubleshooting](#-troubleshooting)
* [Future Improvements](#-future-improvements)
* [Contributing](#-contributing)
* [Acknowledgments](#-acknowledgments)
* [License](#-license)

---

# 🌐 Overview

**CyberNexus** is a full-stack cybersecurity learning platform designed to transform traditional cybersecurity education into an interactive, practical, and gamified experience.

Instead of limiting learners to theoretical content, CyberNexus combines:

* 📚 Structured cybersecurity courses
* 🧪 Hands-on cybersecurity laboratories
* 🚩 Jeopardy-style CTF challenges
* 🖥️ Interactive cybersecurity diagrams
* 🐉 Kali Linux-style terminal experience
* 🤖 AI-powered cybersecurity assistance
* 💬 Real-time communication
* 📊 Student progress analytics
* 🏆 XP, levels, achievements, and streaks
* 🎓 Digital certificate generation
* 🔐 Secure authentication
* 👨‍🏫 Instructor management
* 👑 Administrative control
* 💳 Paid course unlocking
* 🌍 English/French localization
* 🌗 Dark/Light themes

The platform is built around a practical philosophy:

> **Learn → Practice → Attack → Defend → Analyze → Progress**

---

# 🎯 Project Vision

Cybersecurity knowledge cannot be effectively acquired through theory alone.

CyberNexus was designed to provide learners with an environment where they can progressively develop cybersecurity capabilities through:

1. **Conceptual learning**
2. **Interactive demonstrations**
3. **Hands-on laboratory exercises**
4. **CTF challenges**
5. **Real-world security scenarios**
6. **AI-assisted learning**
7. **Performance tracking**
8. **Gamified progression**

The long-term objective is to provide a centralized cybersecurity training ecosystem suitable for:

* Students
* Cybersecurity beginners
* Security enthusiasts
* Developers
* Network engineers
* SOC analysts
* Penetration testers
* Security instructors
* Training organizations

---

# ✨ Key Features

## 📚 Interactive Learning

CyberNexus provides structured learning paths covering cybersecurity fundamentals and practical security concepts.

Learners can access:

* Lessons
* Quizzes
* Learning paths
* Progress tracking
* Interactive diagrams
* Security tools
* Cybersecurity roadmaps
* Achievement systems

---

## 🧪 Hands-On Cybersecurity Labs

The platform emphasizes practical learning through cybersecurity laboratories.

Learners can work through:

* Security exercises
* Practical challenges
* Network security scenarios
* Web security concepts
* Defensive security exercises
* Offensive security exercises
* Lab progression

---

## 🚩 CTF Challenges

CyberNexus integrates Capture The Flag challenges using a difficulty-based progression system.

Supported difficulty levels include:

* 🟢 Easy
* 🟡 Medium
* 🟠 Hard
* 🔴 Insane

Successful challenge completion contributes to the learner's XP and overall progression.

---

## 🖥️ Cybersecurity Terminal

The platform includes an interactive terminal-style environment designed to provide learners with a familiar cybersecurity command-line experience.

The interface can be used for security-related exercises such as:

* Network reconnaissance
* Nmap demonstrations
* Command-line learning
* Security experimentation
* Practical laboratory exercises

---

## 🤖 Nexus AI

CyberNexus includes an AI-powered cybersecurity assistant called **Nexus AI**.

The assistant is designed to help learners:

* Understand cybersecurity concepts
* Analyze security questions
* Navigate learning modules
* Receive contextual explanations
* Learn security terminology
* Explore defensive and offensive security concepts

The backend integrates Google's Generative AI ecosystem to provide AI-powered responses.

---

## 💬 Real-Time Communication

CyberNexus uses **Socket.IO** to provide real-time functionality.

Features include:

* Live chat
* Security activity feeds
* Real-time user activity
* Live system notifications
* Connected-user monitoring
* Real-time security events

---

## 👨‍🏫 Instructor Dashboard

Instructors can monitor learner activity through a dedicated instructor interface.

Capabilities include:

* Student monitoring
* Progress analytics
* Lab submissions
* Class performance
* Learning activity
* Student roster management

---

## 👑 Administration Panel

Administrators have access to centralized platform management.

Administrative capabilities include:

* User management
* Role management
* Account banning/restoration
* User deletion
* XP modification
* Level management
* Security logs
* Platform statistics
* Audit information

---

# 🏗️ Platform Architecture

CyberNexus follows a full-stack architecture composed of a React presentation layer, Node.js/Express application server, MongoDB persistence layer, Redis caching infrastructure, Socket.IO real-time communication, and external AI/payment/email services.

```text
                         ┌─────────────────────────┐
                         │        End Users        │
                         │ Students / Instructors  │
                         │        / Admins         │
                         └────────────┬────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────┐
                    │      React Frontend         │
                    │                             │
                    │ • Learning Interface        │
                    │ • Labs / CTFs               │
                    │ • Dashboard                 │
                    │ • AI Interface              │
                    │ • Admin / Instructor        │
                    └──────────────┬──────────────┘
                                   │
                         REST API / WebSocket
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │    Node.js + Express        │
                    │                             │
                    │ • Authentication            │
                    │ • Authorization             │
                    │ • Business Logic            │
                    │ • Security Middleware       │
                    │ • API Routes                │
                    │ • Socket.IO                 │
                    └───────┬──────────┬──────────┘
                            │          │
              ┌─────────────┘          └─────────────┐
              ▼                                      ▼
     ┌─────────────────┐                    ┌─────────────────┐
     │ MongoDB Atlas   │                    │ Redis           │
     │                 │                    │                 │
     │ • Users         │                    │ • Cache         │
     │ • Courses       │                    │ • Sessions      │
     │ • Labs          │                    │ • Realtime data │
     │ • Progress      │                    └─────────────────┘
     │ • Certificates  │
     └─────────────────┘

              External Integrations
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
 Google Gemini      EmailJS        Payment System
       │
       ▼
   Nexus AI
```

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Purpose                               |
| ---------------- | ------------------------------------- |
| React 19         | User interface                        |
| Vite             | Development server and build system   |
| JavaScript / JSX | Application development               |
| Tailwind CSS     | Utility-based styling                 |
| Lucide React     | UI icons                              |
| Motion           | Animations                            |
| Socket.IO Client | Real-time communication               |
| Firebase         | Authentication / platform integration |
| jsPDF            | Certificate PDF generation            |
| QRCode           | Certificate verification              |
| EmailJS          | Contact/email functionality           |

---

## Backend

| Technology              | Purpose                             |
| ----------------------- | ----------------------------------- |
| Node.js                 | Server runtime                      |
| Express.js              | REST API framework                  |
| Mongoose                | MongoDB ODM                         |
| Socket.IO               | Real-time communication             |
| Redis                   | Caching / real-time infrastructure  |
| JWT                     | Authentication                      |
| Passport.js             | OAuth authentication                |
| bcrypt                  | Password hashing                    |
| Helmet                  | Security headers                    |
| CORS                    | Cross-origin access control         |
| Express Rate Limit      | Rate limiting                       |
| Express Validator       | Request validation                  |
| Mongo Sanitize          | NoSQL injection protection          |
| XSS Clean               | XSS protection                      |
| HPP                     | HTTP Parameter Pollution protection |
| Cookie Parser           | Cookie handling                     |
| Express Session         | Session management                  |
| Winston / custom logger | Application logging                 |

---

## AI

The platform integrates Google's Generative AI ecosystem for **Nexus AI**, the platform's cybersecurity learning assistant.

---

## Database

**MongoDB / MongoDB Atlas**

Primary persistence layer for:

* Users
* Profiles
* Lessons
* Labs
* Quizzes
* Certificates
* Learning progress
* Platform information

---

## Caching

**Redis**

Used for high-speed temporary data and platform infrastructure.

---

# 📁 Project Structure

The repository is organized around the frontend application, backend services, shared project configuration, and documentation.

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
│       │   ├── Roadmap.jsx
│       │   ├── SettingsModal.jsx
│       │   ├── Tools.jsx
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
│   └── routes/
│       ├── adminRoutes.js
│       ├── api.js
│       ├── authRoutes.js
│       ├── chatRoutes.js
│       ├── instructorRoutes.js
│       └── learningRoutes.js
│
├── Screenshots/
│   ├── Localhost-Screenshots/
│   └── After deployment/
│
├── server.js
├── package.json
├── package-lock.json
├── bun.lock
├── docker-compose.yml
├── firestore.rules
├── CYBER_NEXUS_FULL_GUIDE.md
├── dynamicstatic.txt
├── levelprogress.txt
├── metadata.json
├── .gitignore
└── .dockerignore
```

---

# 🔐 Security Architecture

Security is a core architectural requirement rather than an additional feature.

CyberNexus implements multiple layers of application security.

## Security Controls

### HTTP Security Headers

Implemented using:

* Helmet
* Content Security Policy
* X-Content-Type-Options
* X-Frame-Options
* Referrer Policy
* Cross-Origin policies
* Permissions Policy

---

### CORS Protection

The application uses explicit origin validation instead of unrestricted:

```text
Access-Control-Allow-Origin: *
```

Allowed origins can be configured through environment variables.

Cloud Run, AI Studio preview environments, localhost, and explicitly configured production origins are supported.

---

### Rate Limiting

API requests are protected with rate limiting to reduce:

* Brute-force attacks
* Request flooding
* Automated abuse
* Basic denial-of-service attempts

Default configuration:

```text
Window: 15 minutes
Maximum requests: 200 per IP
```

---

### NoSQL Injection Protection

The platform uses:

* `mongo-sanitize`
* Express Validator
* Custom NoSQL protection middleware

This helps prevent malicious MongoDB operators from being injected into request parameters.

---

### Cross-Site Scripting Protection

XSS protection is implemented through sanitization middleware and secure response policies.

---

### HTTP Parameter Pollution Protection

The application uses HPP protection to mitigate malicious parameter duplication attacks.

---

### Authentication Security

Authentication supports:

* JWT-based authentication
* HTTP-only cookies
* Bearer token fallback
* Passport.js
* Google OAuth integration
* bcrypt password hashing

---

# 🛡️ Role-Based Access Control

CyberNexus implements three principal roles.

| Capability           | Student | Instructor | Admin |
| -------------------- | :-----: | :--------: | :---: |
| Public Courses       |    ✅    |      ✅     |   ✅   |
| Interactive Lessons  |    ✅    |      ✅     |   ✅   |
| Cybersecurity Labs   |    ✅    |      ✅     |   ✅   |
| CTF Challenges       |    ✅    |      ✅     |   ✅   |
| Nexus AI             |    ✅    |      ✅     |   ✅   |
| Student Progress     |   Own   |    Class   |  All  |
| Lab Evaluation       |    ❌    |      ✅     |   ✅   |
| Instructor Dashboard |    ❌    |      ✅     |   ✅   |
| Admin Dashboard      |    ❌    |      ❌     |   ✅   |
| Change User Roles    |    ❌    |      ❌     |   ✅   |
| Modify XP / Levels   |    ❌    |      ❌     |   ✅   |
| Ban Users            |    ❌    |      ❌     |   ✅   |
| Delete Users         |    ❌    |      ❌     |   ✅   |
| Security Audit Logs  |    ❌    |      ❌     |   ✅   |

### Privilege Escalation Protection

Regular users cannot promote themselves to privileged roles.

Administrative role changes are restricted to authorized administrators.

This prevents common privilege-escalation scenarios such as:

```text
Student → Instructor
Student → Admin
Instructor → Admin
```

without administrator authorization.

---

# 🎮 Gamification & XP

CyberNexus uses a progression system designed to encourage continuous learning.

## XP Formula

The XP requirement for the next level follows:

```text
XP Required = Current Level × 1,000
```

The cumulative XP required to reach level `L` is:

```text
Total XP = ((L - 1) × L / 2) × 1,000
```

## Progression

| Level | Rank                   | XP to Next Level | Cumulative XP |
| ----: | ---------------------- | ---------------: | ------------: |
|     1 | Novice / Script Kiddie |            1,000 |             0 |
|     2 | Apprentice             |            2,000 |         1,000 |
|     3 | Junior Operator        |            3,000 |         3,000 |
|     4 | Cyber Practitioner     |            4,000 |         6,000 |
|     5 | Security Analyst       |            5,000 |        10,000 |
|     6 | Penetration Tester     |            6,000 |        15,000 |
|     7 | Senior Specialist      |            7,000 |        21,000 |
|     8 | Threat Hunter          |            8,000 |        28,000 |
|     9 | Cyber Architect        |            9,000 |        36,000 |
|   10+ | Elite                  |         Scalable |       45,000+ |

## XP Sources

Learners can earn XP through:

* Quizzes
* Lessons
* Labs
* CTF challenges
* Achievements
* Streaks
* Learning milestones

---

# 🤖 Nexus AI

Nexus AI is CyberNexus's integrated cybersecurity learning assistant.

The AI layer connects the frontend learning experience with the backend AI service.

```text
Learner
   │
   ▼
CyberNexus Chat Interface
   │
   ▼
POST /api/chat
   │
   ▼
Chat Controller
   │
   ▼
Gemini Service
   │
   ▼
Google Generative AI
   │
   ▼
Context-aware Cybersecurity Response
```

The assistant can support learning topics such as:

* Networking
* Web security
* Authentication
* Cryptography
* Linux
* Threat detection
* Vulnerability concepts
* Defensive security
* Offensive security
* Security architecture

---

# 🧪 Hands-On Labs & CTFs

CyberNexus goes beyond passive learning.

The platform provides practical cybersecurity activities including:

### Labs

* Guided exercises
* Security tasks
* Progress tracking
* Submission handling
* Practical challenges

### CTFs

Learners can solve challenges and earn XP based on difficulty.

```text
Easy       → 200 XP
Medium     → 400 XP
Hard       → 600 XP
Insane     → 800 XP
```

This creates a progression from:

```text
Theory
   ↓
Interactive Learning
   ↓
Guided Labs
   ↓
CTF Challenges
   ↓
Advanced Security Practice
```

---

# 📡 Real-Time Communication

Socket.IO provides the platform's real-time communication layer.

Real-time functionality includes:

* Live chat
* Security feed
* Active user count
* Security notifications
* Activity updates
* Live event streaming

The architecture uses:

```text
React
  │
  │ Socket.IO Client
  ▼
Node.js HTTP Server
  │
  ▼
Socket.IO Server
  │
  ├── Security Feed
  ├── Live Chat
  ├── User Activity
  └── Notifications
```

---

# 🎓 Digital Certificates

CyberNexus includes an automated certificate system.

Certificates can be:

* Generated as PDFs
* Downloaded
* Shared
* Verified through QR codes
* Validated through the backend

The frontend uses `jsPDF` and QR-code generation functionality.

Certificate validation is exposed through:

```text
GET /api/verify-certificate/:id
```

---

# 💳 Payment System

The platform supports paid learning content through a payment-unlock workflow.

Paid courses can remain locked until the required payment condition is satisfied.

Administrative accounts can also be configured with privileged access to paid content.

---

# 🌍 Internationalization

CyberNexus supports multiple languages.

Currently supported:

* 🇬🇧 English
* 🇫🇷 French

Language selection is persisted locally so the learner's preference remains available between sessions.

---

# 🌗 User Experience

The interface supports:

* Dark mode
* Light mode
* Responsive layouts
* Interactive animations
* Real-time notifications
* Persistent navigation state
* Responsive dashboards
* Interactive cybersecurity visualizations

User preferences such as theme and language are persisted using browser storage.

---

# 🔌 API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

## Administration

```http
GET    /api/admin/overview
GET    /api/admin/users
PUT    /api/admin/users/:id/role
PUT    /api/admin/users/:id/stats
POST   /api/admin/users/:id/toggle-ban
DELETE /api/admin/users/:id
GET    /api/admin/logs
POST   /api/admin/logs/clear
```

---

## Instructor

```http
GET /api/instructor/stats
GET /api/instructor/students
GET /api/instructor/submissions
```

---

## AI

```http
POST /api/chat
```

---

## Certificate Verification

```http
GET /api/verify-certificate/:id
```

---

## Infrastructure Status

```http
GET /api/db-status
GET /api/redis-status
GET /api/security-status
GET /api/csrf-token
```

---

# 🗄️ Database Architecture

MongoDB is used as the primary application database.

Major models include:

```text
User
 ├── Authentication
 ├── Role
 ├── XP
 ├── Level
 ├── Streak
 └── Profile

Lesson
 ├── Course content
 ├── Learning modules
 └── Progress

Labs
 ├── Lab content
 ├── Tasks
 └── Submissions

Quiz
 ├── Questions
 ├── Answers
 └── Scores

Certificate
 ├── Certificate ID
 ├── Learner information
 ├── Verification information
 └── QR data
```

MongoDB Atlas can be used as the production database.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
NODE_ENV=development

PORT=Localhost

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

SESSION_SECRET=your_secure_session_secret

REDIS_URL=your_redis_connection_string

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

API_KEY=your_api_key

CLIENT_URL=http://localhost:port

ALLOWED_ORIGINS=http://localhost:port

EMAILJS_SERVICE_ID=your_emailjs_service_id

EMAILJS_TEMPLATE_ID=your_emailjs_template_id

EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

> **Important:** Never commit `.env` or production credentials to GitHub.

Generate strong secrets instead of using example values.

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Yassiinneee/Cybersecurity-learning-platform.git
```

Navigate into the project:

```bash
cd Cybersecurity-learning-platform
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
.env
```

Add the required configuration values.

---

## 4. Configure MongoDB

Create a MongoDB Atlas database or use a local MongoDB instance.

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/projectname
```

For MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/projectname
```

---

## 5. Configure Redis

If Redis is enabled:

```env
REDIS_URL=redis://localhost:port
```

or use a managed Redis provider.

---

# 💻 Development

Start the application:

```bash
npm run dev
```

The development server runs on:

```text
http://localhost:port
```

The application uses Vite middleware through the Express server, allowing the frontend and backend to operate together during development.

---

# 🏗️ Production Build

Build the React frontend:

```bash
npm run build
```

Then start the application:

```bash
npm start
```

The Express server serves the generated production frontend.

---

# 🐳 Docker

The project includes:

```text
docker-compose.yml
```

Docker can be used to standardize the development and deployment environment.

Typical workflow:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

---

# ☁️ Deployment

CyberNexus is designed to support cloud deployment environments such as Google Cloud Run.

A typical production architecture is:

```text
                   Internet
                      │
                      ▼
               Google Cloud Run
                      │
              ┌───────┴────────┐
              │                │
              ▼                ▼
         CyberNexus API    React SPA
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
   MongoDB Atlas   Redis
        │
        ▼
   Persistent Data

External Services
        │
        ├── Google Gemini
        ├── Google OAuth
        ├── EmailJS
        └── Payment Provider
```

Production deployment should use:

* HTTPS
* Secure environment variables
* Production MongoDB credentials
* Restricted CORS origins
* Strong JWT secrets
* Strong session secrets
* Redis authentication
* Production logging
* Monitoring
* Backup policies

---

# 🔒 Security Best Practices

Before deploying CyberNexus publicly:

### Environment Security

* [ ] Never commit `.env`
* [ ] Rotate exposed API keys
* [ ] Use strong JWT secrets
* [ ] Use strong session secrets
* [ ] Restrict database network access
* [ ] Use HTTPS

### Authentication

* [ ] Use secure HTTP-only cookies
* [ ] Configure appropriate SameSite policies
* [ ] Enable OAuth only with trusted redirect URLs
* [ ] Enforce strong password policies
* [ ] Implement account lockout/rate limiting

### API Security

* [ ] Keep rate limiting enabled
* [ ] Validate request payloads
* [ ] Sanitize MongoDB inputs
* [ ] Protect privileged routes
* [ ] Restrict CORS
* [ ] Monitor security logs

### Infrastructure

* [ ] Secure MongoDB Atlas
* [ ] Secure Redis
* [ ] Configure Cloud Run environment variables
* [ ] Monitor application errors
* [ ] Maintain database backups
* [ ] Regularly update dependencies

---

# 🖼️ Screenshots

The repository includes dedicated screenshots documenting both local development and production deployment.

## Home

![CyberNexus Home](Screenshots/After%20deployment/Home%20page.png)

## Dashboard

![CyberNexus Dashboard](Screenshots/After%20deployment/Dashboard%20page.png)

## Courses / Lessons

![Lessons](Screenshots/After%20deployment/Lessons%20page.png)

## Cybersecurity Labs

![Labs](Screenshots/After%20deployment/Labs%20page.png)

## CTF Challenges

![CTFs](Screenshots/After%20deployment/CTFs%20page.png)

## Kali Linux Console

![Kali Linux Console](Screenshots/After%20deployment/Kali%20linux%20console.png)

## Nexus AI

![Nexus AI](Screenshots/After%20deployment/Nexus%20AI.png)

## Admin Panel

![Admin Panel](Screenshots/After%20deployment/Admin%20panel.png)

## Instructor Panel

![Instructor Panel](Screenshots/After%20deployment/Instractor%20Panel.png)

## Live Chat

![Live Chat](Screenshots/After%20deployment/Live%20chat%20page.png)

## Certificate

![Certificate](Screenshots/After%20deployment/Certificate%20Model.png)

## Roadmap

![Roadmap](Screenshots/After%20deployment/Roadmap-Red%20team.png)

---

# 📊 Platform Capabilities

| Category              | Capability                           |
| --------------------- | ------------------------------------ |
| 🎓 Education          | Lessons, quizzes, paths              |
| 🧪 Practical Training | Labs and hands-on exercises          |
| 🚩 CTF                | Difficulty-based security challenges |
| 🤖 AI                 | Nexus AI cybersecurity assistant     |
| 🔐 Security           | Multi-layer application security     |
| 👤 Authentication     | JWT, sessions, OAuth                 |
| 👨‍🏫 Teaching        | Instructor dashboard                 |
| 👑 Administration     | Complete platform administration     |
| 💬 Communication      | Real-time Socket.IO chat             |
| 🏆 Gamification       | XP, levels, achievements, streaks    |
| 🎓 Certification      | PDF certificates + verification      |
| 💳 Payments           | Paid course unlocking                |
| 🌍 Localization       | English / French                     |
| 🌗 UI                 | Dark / Light mode                    |
| 📡 Monitoring         | Security feeds and activity logs     |
| 🗄️ Database          | MongoDB Atlas                        |
| ⚡ Cache               | Redis                                |
| ☁️ Deployment         | Cloud-ready architecture             |

---

# 🧪 Testing & Verification

Before production deployment, verify the following:

### Application

* [ ] Application starts successfully
* [ ] Frontend loads correctly
* [ ] API endpoints respond correctly
* [ ] MongoDB connection is established
* [ ] Redis connection is established
* [ ] Socket.IO connects successfully

### Authentication

* [ ] Registration works
* [ ] Login works
* [ ] Logout works
* [ ] Session persistence works
* [ ] OAuth works if enabled
* [ ] Unauthorized routes are blocked

### Authorization

* [ ] Student permissions work
* [ ] Instructor permissions work
* [ ] Admin permissions work
* [ ] Privilege escalation is prevented

### Learning

* [ ] Lessons load
* [ ] Quizzes work
* [ ] Labs work
* [ ] CTF challenges work
* [ ] XP updates correctly
* [ ] Progress persists

### AI

* [ ] Gemini API key is configured
* [ ] Nexus AI responds
* [ ] API errors are handled gracefully
* [ ] Rate limits are respected

### Production

* [ ] HTTPS enabled
* [ ] CORS restricted
* [ ] Environment variables configured
* [ ] Database secured
* [ ] Logs monitored
* [ ] Backups configured

---

# 🐛 Troubleshooting

## MongoDB Connection Error

Check:

```env
MONGO_URI=...
```

Make sure:

* MongoDB Atlas credentials are correct
* The database user exists
* The IP address is allowed
* The connection string is valid

---

## Redis Connection Error

Verify:

```env
REDIS_URL=...
```

Ensure Redis is running and reachable.

---

## Gemini API Error

Verify:

```env
GEMINI_API_KEY=...
```

Check that:

* The API key is valid
* The selected model is available
* API quotas have not been exceeded

---

## CORS Error

Check:

```env
ALLOWED_ORIGINS=http://localhost:port
```

For production, explicitly add the production frontend URL.

Avoid unrestricted CORS in production.

---

## Authentication Problems

Check:

```env
JWT_SECRET=...
SESSION_SECRET=...
```

Make sure the frontend and backend are using the correct origin and cookie configuration.

---

# 🔮 Future Improvements

Potential future development directions include:

* [ ] Advanced SOC simulation environment
* [ ] More realistic attack/defense laboratories
* [ ] Automated lab grading
* [ ] Advanced threat intelligence modules
* [ ] SIEM simulation
* [ ] Dockerized vulnerable environments
* [ ] Kubernetes security laboratories
* [ ] Cloud security training
* [ ] AWS security modules
* [ ] Azure security modules
* [ ] GCP security modules
* [ ] Advanced cryptography laboratories
* [ ] Web application penetration-testing labs
* [ ] Network traffic analysis laboratories
* [ ] Malware analysis sandbox
* [ ] Security certification preparation paths
* [ ] Advanced instructor analytics
* [ ] Leaderboards
* [ ] Team-based CTF competitions
* [ ] More AI-powered tutoring capabilities
* [ ] Automated learning recommendations

---

# 📚 Educational Scope

CyberNexus can be extended to cover a broad cybersecurity curriculum.

### Foundations

* Computer hardware
* Operating systems
* Networking
* TCP/IP
* OSI Model
* DNS
* DHCP
* HTTP/HTTPS

### Defensive Security

* SOC operations
* SIEM
* Log analysis
* Incident response
* Threat detection
* Digital forensics
* Security monitoring

### Offensive Security

* Reconnaissance
* Network scanning
* Vulnerability assessment
* Web penetration testing
* Exploitation fundamentals
* Privilege escalation
* Post-exploitation

### Application Security

* OWASP Top 10
* Authentication vulnerabilities
* Authorization
* SQL injection
* XSS
* CSRF
* SSRF
* API security

### Cryptography

* Hashing
* Symmetric encryption
* Asymmetric encryption
* Digital signatures
* Certificates
* PKI

### Cloud Security

* IAM
* Network security
* Container security
* Cloud logging
* Cloud incident response

---

# 🤝 Contributing

Contributions are welcome.

## Contribution Workflow

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Implement your changes.
4. Test the application.
5. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

6. Push your branch.

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

# 📌 Development Principles

CyberNexus follows several engineering principles:

### Security First

Security controls should be considered throughout development rather than added after implementation.

### Separation of Concerns

Frontend presentation, backend services, database operations, authentication, and security middleware are separated into dedicated modules.

### Scalability

Redis, Socket.IO, MongoDB Atlas, and container/cloud deployment provide a foundation for scaling the platform.

### User-Centered Learning

Technical complexity should remain behind an accessible and intuitive learning interface.

### Practical Education

The platform prioritizes hands-on cybersecurity experience over passive theoretical content.

---

# 🏆 Project Highlights

CyberNexus brings together several disciplines into one platform:

```text
Software Engineering
        +
Cybersecurity
        +
Network Engineering
        +
Artificial Intelligence
        +
Cloud Computing
        +
Database Engineering
        +
Real-Time Systems
        +
UX/UI Design
        =
        CyberNexus
```

The result is a cybersecurity education platform that combines **learning, experimentation, collaboration, automation, and security engineering** within a single full-stack application.

---

# 🙏 Acknowledgments

Special thanks to the organizations, educators, communities, and technologies that contributed to the learning and development journey behind this project.

### 🎓 GOMYCODE

For providing practical technical education, project-based learning, and a development environment that encourages experimentation and continuous improvement.

### 🎓 Woolf University

For contributing to the academic and software engineering foundation supporting this project.

### 👨‍🏫 Instructors & Mentors

Special appreciation to the instructors and mentors who provided guidance, technical feedback, and project direction throughout the development process.

### 🌐 Open Source Community

CyberNexus also benefits from the broader open-source ecosystem and the developers who maintain the libraries and frameworks used throughout the project.

---

# 👨‍💻 Author

**Yassine Kaltoum**

Software & Network Engineering
Cybersecurity • Software Engineering • Network Infrastructure • AI-Powered Applications

### Areas of Interest

* Cybersecurity
* Software Engineering
* Network Engineering
* Full-Stack Development
* System Architecture
* Artificial Intelligence
* Cloud Computing
* UI/UX Engineering

---

# 📄 License

This project is distributed under the **ISC License**.

See the project configuration and repository for the complete licensing information.

---

# ⭐ Support the Project

If you find CyberNexus useful or interesting:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements
🤝 Contribute to the project

---

<div align="center">

## 🛡️ CyberNexus

### **Learn. Practice. Attack. Defend. Evolve.**

**An interactive cybersecurity learning ecosystem built for the next generation of security professionals.**

<br>

`Cybersecurity × AI × Software Engineering × Practical Learning`

<br>

**© 2026 CyberNexus — Built with passion for cybersecurity education.**

</div>
