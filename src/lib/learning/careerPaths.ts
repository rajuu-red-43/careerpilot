/**
 * Career Path Definitions for CareerPilot v2
 * Establishes skill hierarchies, prerequisites, and learning order.
 */

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  learningOrder: string[]; // Step-by-step ordered list of skills to master
  typicalFresherSalary: string;
  avgTimeToJobReady: string; // e.g. "3-6 months"
  popularJobTitles: string[];
}

export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'career-frontend',
    title: 'Frontend Developer',
    category: 'Web Development',
    description: 'Build fast, responsive, and visually appealing web interfaces that users interact with.',
    requiredSkills: ['HTML & CSS', 'JavaScript', 'React', 'Git & GitHub'],
    preferredSkills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'UI/UX Design'],
    learningOrder: ['HTML & CSS', 'JavaScript', 'Git & GitHub', 'React', 'TypeScript', 'Next.js'],
    typicalFresherSalary: '₹4.5L - ₹8.5L / year',
    avgTimeToJobReady: '3-4 months',
    popularJobTitles: ['Frontend Developer', 'React Developer', 'UI Developer', 'Web Engineer'],
  },
  {
    id: 'career-backend',
    title: 'Backend Developer',
    category: 'Web Development',
    description: 'Design robust server architectures, business logic, secure authentication, and databases.',
    requiredSkills: ['Python', 'SQL', 'PostgreSQL', 'Git & GitHub'],
    preferredSkills: ['Node.js', 'Docker & Containers', 'Amazon Web Services (AWS)', 'Data Structures & Algorithms'],
    learningOrder: ['Python', 'SQL', 'PostgreSQL', 'Git & GitHub', 'Docker & Containers', 'Node.js'],
    typicalFresherSalary: '₹5L - ₹10L / year',
    avgTimeToJobReady: '4-6 months',
    popularJobTitles: ['Backend Engineer', 'Python Developer', 'API Engineer', 'Node.js Developer'],
  },
  {
    id: 'career-fullstack',
    title: 'Full Stack Developer',
    category: 'Web Development',
    description: 'End-to-end web engineering from user interface design to cloud APIs and databases.',
    requiredSkills: ['HTML & CSS', 'JavaScript', 'React', 'SQL', 'Git & GitHub'],
    preferredSkills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker & Containers', 'Amazon Web Services (AWS)'],
    learningOrder: ['HTML & CSS', 'JavaScript', 'Git & GitHub', 'React', 'SQL', 'TypeScript', 'Next.js', 'Docker & Containers'],
    typicalFresherSalary: '₹6L - ₹12L / year',
    avgTimeToJobReady: '5-7 months',
    popularJobTitles: ['Full Stack Developer', 'Software Engineer', 'MERN Stack Developer'],
  },
  {
    id: 'career-data-analyst',
    title: 'Data Analyst',
    category: 'Data & Databases',
    description: 'Extract actionable insights from raw data using SQL queries, spreadsheets, and visual dashboards.',
    requiredSkills: ['SQL', 'Data Analysis', 'Python'],
    preferredSkills: ['Machine Learning', 'PostgreSQL', 'Tableau', 'Power BI'],
    learningOrder: ['SQL', 'Data Analysis', 'Python', 'Machine Learning'],
    typicalFresherSalary: '₹4.5L - ₹8L / year',
    avgTimeToJobReady: '3-4 months',
    popularJobTitles: ['Data Analyst', 'Business Intelligence Analyst', 'Junior Analytics Engineer'],
  },
  {
    id: 'career-ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'AI / Machine Learning',
    description: 'Build predictive statistical models, neural networks, and scalable AI algorithms.',
    requiredSkills: ['Python', 'Machine Learning', 'Data Structures & Algorithms'],
    preferredSkills: ['Deep Learning & Neural Networks', 'Generative AI & LLMs', 'SQL', 'Docker & Containers'],
    learningOrder: ['Python', 'Data Structures & Algorithms', 'Machine Learning', 'Deep Learning & Neural Networks', 'Generative AI & LLMs'],
    typicalFresherSalary: '₹7L - ₹14L / year',
    avgTimeToJobReady: '6-9 months',
    popularJobTitles: ['ML Engineer', 'AI Engineer', 'Data Scientist', 'Research Associate'],
  },
  {
    id: 'career-devops',
    title: 'Cloud & DevOps Engineer',
    category: 'Cloud & DevOps',
    description: 'Automate software deployments, configure cloud servers, monitor reliability, and manage containers.',
    requiredSkills: ['Linux & Bash', 'Git & GitHub', 'Docker & Containers', 'Amazon Web Services (AWS)'],
    preferredSkills: ['Python', 'Cybersecurity Fundamentals', 'Kubernetes', 'CI/CD Pipelines'],
    learningOrder: ['Linux & Bash', 'Git & GitHub', 'Docker & Containers', 'Amazon Web Services (AWS)', 'Python'],
    typicalFresherSalary: '₹5.5L - ₹11L / year',
    avgTimeToJobReady: '4-6 months',
    popularJobTitles: ['Cloud Engineer', 'DevOps Specialist', 'Site Reliability Engineer (SRE)'],
  },
  {
    id: 'career-cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Cybersecurity',
    description: 'Protect IT networks, audit software vulnerabilities, detect unauthorized intrusions, and enforce data security.',
    requiredSkills: ['Cybersecurity Fundamentals', 'Linux & Bash', 'Git & GitHub'],
    preferredSkills: ['Python', 'Amazon Web Services (AWS)', 'Networking', 'Ethical Hacking'],
    learningOrder: ['Linux & Bash', 'Cybersecurity Fundamentals', 'Python', 'Git & GitHub'],
    typicalFresherSalary: '₹5L - ₹9.5L / year',
    avgTimeToJobReady: '4-5 months',
    popularJobTitles: ['Security Analyst', 'SOC Analyst', 'Vulnerability Assessor'],
  },
  {
    id: 'career-ui-ux',
    title: 'UI/UX Product Designer',
    category: 'Design & UI/UX',
    description: 'Design intuitive wireframes, interactive user flows, and aesthetic prototypes for modern products.',
    requiredSkills: ['UI/UX Design', 'HTML & CSS'],
    preferredSkills: ['JavaScript', 'Design Systems', 'User Research'],
    learningOrder: ['UI/UX Design', 'HTML & CSS', 'JavaScript'],
    typicalFresherSalary: '₹4L - ₹8L / year',
    avgTimeToJobReady: '3-4 months',
    popularJobTitles: ['Product Designer', 'UI/UX Designer', 'Interaction Designer'],
  },
];

export function getCareerPath(idOrTitle: string): CareerPath {
  const target = idOrTitle.toLowerCase();
  const found = CAREER_PATHS.find(
    p => p.id === idOrTitle || p.title.toLowerCase() === target || p.title.toLowerCase().includes(target)
  );
  return found || CAREER_PATHS[0]; // Default to Frontend Developer
}
