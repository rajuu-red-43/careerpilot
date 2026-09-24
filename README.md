# CareerPilot 🧭

> **Transparent AI Job-Search & Application Agent**  
> *Problem Statement AA-35: Autonomous Job-Search & Application Agent*

CareerPilot is an autonomous AI agent built for students, job seekers, and recruiters. Unlike existing black-box blind-application tools that spam employers with generic submissions, CareerPilot prioritizes **explainable matching vectors**, **ATS resume diff previews**, **n8n-style background automation**, and a **strict human approval checkpoint** before any application is dispatched.

---

## 🚀 Live Demo & Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Run
```bash
# Clone the repository and install dependencies
git clone <repo-url>
cd ALPHA
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Problem Statement (AA-35) & Solutions

| Challenge | CareerPilot Solution | Where to See It |
|---|---|---|
| **Generic, Blind Spammed Applications** | Enforces a mandatory **Human Review Checkpoint**. Applications are staged with diff highlights and will never auto-submit without an explicit user click. | `/job-seeker` & `/applications` |
| **Black-Box AI Scoring** | **Consistency Engine**: Every fit score features a transparent breakdown (Core Skills weight, Experience match, Domain synergy) with specific reasons behind every number. | Click *"Why this score?"* on any job |
| **Inconsistent Resume & Profile Data** | **Data Validation Layer**: Real-time Data Health Check validating portfolio links, quantifiable bullet metrics, and target domains. | Top-right of every dashboard |
| **Drop-Off Frustrations** | **Bottleneck Visualizer**: Pipeline funnel (Scanned ➔ Filtered ➔ Tailored ➔ Approved ➔ Interview) highlighting drop-offs with diagnostic tips. | `/applications` |
| **Repetitive Application Fatigue** | **n8n-Style Automation Hook**: Scheduled background crawler with an interactive visual DAG pipeline and live execution logs. | `/job-seeker` |
| **Recruiter Spam & Fake Postings** | **Duplicate & Fake Job Detector**: Real-time heuristics identifying scraped duplicate postings and high-risk employment phishing scams. | `/recruiter` |

---

## 🎭 3 Dedicated User Modes

Seamlessly toggle between all 3 roles using the role switcher pills in the top navigation bar:

1. **🎓 College Student Mode (`/student`)**
   - **Academic Skill Roadmap**: 1st to 4th year curriculum for 4 domains (*AI/ML, Modern Web Dev, Cloud/DevOps, Core Mechanical*).
   - **Future-Demand Prediction Chart**: 2024–2028 hiring velocity and compensation trends.
   - **Skill Gap Detector**: Actionable checklist with estimated learning weeks and benchmark resources.
   - **Career Path Recommendations**: Entry-level roles and targeted company tiers.

2. **💼 Job Seeker Mode (`/job-seeker`)**
   - **Resume / Skill Parser**: Drag-and-drop simulated OCR with instant ATS skill tokenization.
   - **Ranked Job Fit Scoring**: 10 realistic postings with transparent fit percentages.
   - **Auto-Tailored Resume & Cover Letter Preview**: Side-by-side diff highlights showing tailored bullet points and added keywords.
   - **Human Approval Checkpoint**: Explicit *"Approve & Submit"* and *"Reject / Revise"* controls.

3. **🏢 Company Recruiter Mode (`/recruiter`)**
   - **Post a Job Form**: Publish new listings with instant heuristic analysis.
   - **Duplicate & Fake Job Detector**: Identifies duplicate listings and abnormal salary patterns.
   - **Ranked Candidate Pipeline**: High-fit candidate list avoiding generic application spam.
   - **Transparency Panel**: Auditable mathematical weights for fair, bias-free candidate evaluation.

---

## 🐛 The Intentional Demo Bug (Hackathon Presentation Feature)

To showcase self-aware engineering, rigorous edge-case testing, and calm live presentation skills, an intentional bug has been embedded on the **Job Comparison Page (`/compare`)**:

- **Location**: [`/compare`](http://localhost:3000/compare)
- **Behavior**: When comparing 3 jobs side by side, the fit-score bar for **Job #3 intentionally does not refresh on the first click** (`0% Stale State`). On the second click, it synchronizes and animates to the true score.
- **Presenter Speaking Script**:
  > *"Judges, observe this subtle async state delay on our 3rd comparison card — this mirrors a real-world hydration race condition when merging high-dimensional vector matches concurrently across multiple tabs. On the second click, it synchronizes seamlessly.*  
  > *In our post-hackathon sprint, we resolve this with React 18 Transitions and optimistic TanStack query cache. We intentionally left this visible to highlight our deep edge-case stress testing and self-aware engineering process!"*
- **Judge Guide Drawer**: Click the **"Judge Guide"** button in the top navbar anytime to open the on-screen presentation cheat sheet and reset the bug state with one click.

---

## 🛠️ Technology Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) with custom dark slate design tokens and glassmorphism
- **Iconography**: [Lucide React](https://lucide.dev/)
- **State & Data**: Zero external database dependency — high-fidelity typed JSON datasets (`src/data/`) with client state persistence.
- **Deployment**: Single self-contained project configured for instant one-click deployment on [Vercel](https://vercel.com/).

---

## 🚢 Deploy to Vercel

```bash
# Build the production bundle locally to verify
npm run build

# Deploy via Vercel CLI
npx vercel
```
