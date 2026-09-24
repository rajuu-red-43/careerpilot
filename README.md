# CareerPilot v2 🧭

> **Production-Grade Autonomous Job-Search, Career Intelligence & Recruitment SaaS**  
> *Built for Problem Statement AA-35: Autonomous Job-Search & Application Agent*

CareerPilot v2 upgrades the prototype into a production-grade SaaS product. Unlike existing black-box blind-application bots that flood hiring managers with generic resume spam, CareerPilot enforces **mathematically explainable matching vectors**, **ATS resume diff previews**, **n8n-style background automation**, **mandatory human approval gates**, **cryptographic portfolio verification**, and **recruiter spam filtering**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Run
```bash
# Clone the repository and install dependencies
cd ALPHA
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💎 Monetization & SaaS Pricing (`/pricing`)

CareerPilot implements a fair, value-aligned pricing model:

| Plan | Target Audience | Price | Core Privileges |
|---|---|---|---|
| **Student Starter** | University & College Students | **₹0 (Permanently Free)** | Multi-year roadmaps, skill gap detector, free course curriculum links, verified portfolio builder, internship board access |
| **Job Seeker Pro** | Active Engineers & Job Seekers | **₹499 / month** *(3-Month Free Trial with Countdown)* | PDF/DOCX real resume parser, 5-axis spider radar fit modal, 60s pitch evaluation, priority application queue, rejection memory |
| **Recruiter Suite** | Talent Leads & Hiring Agencies | **₹2,499 - ₹6,999 / month** *(Interactive Demo Toggle)* | Post jobs with duplicate/scam heuristics, anti-spam quarantine drawer, explainable candidate ranking, candidate vector audits |

---

## 🎯 15 Production-Grade SaaS Features

1. **Skill Gap Detector with Free Courses & Internships**: Actionable gap checklists with direct links to Hugging Face, FreeCodeCamp, Coursera, and one-click filtering to matching internships.
2. **Interview Readiness Score**: Composite index derived from ATS resume health, verified skills, and pitch delivery scores.
3. **Salary & Benefits Analysis**: Visual gauge comparing job compensation against verified departmental market averages.
4. **Scam & Duplicate Job Detector**: Heuristic engine flagging ghost jobs, telegram scams, and duplicate agency postings.
5. **Career Path & Employer Recommendations**: Curated employer recommendations categorized by Startups, Cloud Infrastructure, and Frontier Labs.
6. **Application Priority Queue**: Auto-sorts active applications into High, Medium, and Low priority action buckets.
7. **One-Click Job Comparison**: Compare up to 3 positions directly with persistent selection. *(Includes the intentional demo bug on `/compare` for live presentation)*.
8. **Application Deadline Tracker**: Alerts for urgent application cutoffs (e.g. "Closing in 2 days").
9. **Application Feedback Memory**: Logs rejection reasons (Skill Gap, Experience, System Design) and generates automated upskilling advice.
10. **Lockable Portfolio Templates & Cryptographic Stamp**: Create project showcases and freeze them with a tamper-proof verification hash (`CP-VERIFIED-...`).
11. **Internship & Upskilling Board (`/internships`)**: Dedicated student board with difficulty badges, mentors, and human-in-the-loop stage apply.
12. **Location & Progress Tracking Funnel**: Visual stage progression from foundational training to final accepted offer.
13. **60-Second Project Pitch Challenge**: Interactive pitch recorder with live 60-second timer and deterministic AI evaluation of Clarity, Technical Depth, and Quantifiable Impact.
14. **Graphical Multi-Vector Fit Visualization**: Interactive 5-axis spider radar modal with confidence intervals (Skills, Experience, Velocity, System Design, Communication).
15. **Recruiter Spam Filter**: Quarantines blanket resume spam (<50% fit or duplicate agency leads) into an auditable collapsible drawer.

---

## 🎭 4 Dedicated Role Portals

Authenticate seamlessly using the role gateway on `/` with quick persona presets:

1. **🎓 College Student (`/student`)**
   - Multi-year curriculum roadmaps (AI/ML, Web Dev, Cloud/DevOps, Mechanical).
   - 2024–2028 Tech Demand Projections.
   - Skill gap checklists linking to free courses and `/internships`.
   - Cryptographically lockable project portfolio.

2. **💼 Job Seeker (`/job-seeker`)**
   - Real `.pdf` and `.docx` resume file parser with ATS token extraction.
   - Composite interview readiness card.
   - Priority application queue (High / Medium / Low).
   - Multi-vector spider radar modal & 60s pitch challenge.
   - Mandatory human sign-off checkpoint before submission.

3. **🏢 Company Recruiter (`/recruiter`)**
   - Gated behind active subscription status with live 1-click demo toggle.
   - Post jobs with real-time heuristic guardrails.
   - Zero-spam ranked candidate pipeline with audit trail.
   - Quarantined spam applicant drawer.

4. **🛡️ Platform Admin (`/admin`)**
   - Supabase Row-Level Security (RLS) policies audit.
   - Spam quarantine telemetry and blocked bots monitor.
   - SaaS monetization MRR and subscription tier breakdown.

---

## 🔒 Cybersecurity & Local Enclave Architecture

- **Zero Cloud Leakage**: Sensitive resume tokens and applicant contact details process locally within the client enclave.
- **Supabase RLS Simulation**: Strict row-level isolation guarantees students, candidates, and recruiters only access authorized records.
- **Cryptographic Verification**: Hashes generated via SHA-256 for immutable portfolio records.

---

## 🐛 Intentional Demo Bug (Hackathon Presentation Feature)

To demonstrate deep edge-case stress testing and self-aware engineering during judging presentations:
- **Location**: [`/compare`](http://localhost:3000/compare)
- **Behavior**: When comparing 3 jobs side by side, the fit-score bar for **Job #3 intentionally lags on the first click** (`0% Stale State`). On the second click, it synchronizes smoothly to the correct score.
- **Judge Guide**: Use the top-bar "Judge Guide" button to view presentation notes or reset the bug state with 1 click.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, Server Actions)
- **Styling**: TailwindCSS with curated HSL color palettes and dark mode
- **Icons**: Lucide React
- **Security & Database**: Supabase Client & RLS Architecture
- **State Management**: React Context with LocalStorage persistence

---

Developed for **Problem Statement AA-35**: *Autonomous Job-Search & Application Agent*.
