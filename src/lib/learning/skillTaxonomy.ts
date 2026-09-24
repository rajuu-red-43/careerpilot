/**
 * Skill Taxonomy and Normalization Engine for CareerPilot v2
 * Provides normalized naming, categorization, and alias resolution.
 */

export interface SkillDefinition {
  id: string;
  name: string;
  aliases: string[];
  category: SkillCategory;
  subcategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relatedSkills: string[];
}

export type SkillCategory =
  | 'Programming'
  | 'Web Development'
  | 'Mobile Development'
  | 'Data & Databases'
  | 'AI / Machine Learning'
  | 'Cloud & DevOps'
  | 'Cybersecurity'
  | 'Design & UI/UX'
  | 'Core Engineering'
  | 'Soft Skills & Leadership';

export const SKILL_TAXONOMY: SkillDefinition[] = [
  // Web Development & Programming
  {
    id: 'skill-javascript',
    name: 'JavaScript',
    aliases: ['js', 'javascript', 'ecmascript', 'es6', 'es2020', 'vanilla js'],
    category: 'Programming',
    subcategory: 'Core Language',
    difficulty: 'Beginner',
    relatedSkills: ['TypeScript', 'HTML', 'CSS', 'React', 'Node.js'],
  },
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    aliases: ['ts', 'typescript', 'types-script'],
    category: 'Programming',
    subcategory: 'Typed Language',
    difficulty: 'Intermediate',
    relatedSkills: ['JavaScript', 'React', 'Node.js', 'Next.js'],
  },
  {
    id: 'skill-html-css',
    name: 'HTML & CSS',
    aliases: ['html', 'css', 'html5', 'css3', 'web markup', 'semantic html'],
    category: 'Web Development',
    subcategory: 'Frontend Basics',
    difficulty: 'Beginner',
    relatedSkills: ['JavaScript', 'Tailwind CSS', 'Responsive Design'],
  },
  {
    id: 'skill-react',
    name: 'React',
    aliases: ['react', 'react.js', 'reactjs', 'react js'],
    category: 'Web Development',
    subcategory: 'Frontend Framework',
    difficulty: 'Intermediate',
    relatedSkills: ['JavaScript', 'TypeScript', 'Next.js', 'Redux', 'Tailwind CSS'],
  },
  {
    id: 'skill-nextjs',
    name: 'Next.js',
    aliases: ['next', 'next.js', 'nextjs', 'next js', 'next14', 'next15'],
    category: 'Web Development',
    subcategory: 'Fullstack Framework',
    difficulty: 'Intermediate',
    relatedSkills: ['React', 'TypeScript', 'Node.js', 'Server Components'],
  },
  {
    id: 'skill-nodejs',
    name: 'Node.js',
    aliases: ['node', 'node.js', 'nodejs', 'node js'],
    category: 'Web Development',
    subcategory: 'Backend Runtime',
    difficulty: 'Intermediate',
    relatedSkills: ['Express.js', 'JavaScript', 'TypeScript', 'REST APIs', 'PostgreSQL'],
  },
  {
    id: 'skill-python',
    name: 'Python',
    aliases: ['py', 'python', 'python3', 'python 3'],
    category: 'Programming',
    subcategory: 'General Purpose',
    difficulty: 'Beginner',
    relatedSkills: ['Django', 'FastAPI', 'Pandas', 'NumPy', 'Data Analysis', 'SQL'],
  },
  {
    id: 'skill-java',
    name: 'Java',
    aliases: ['java', 'core java', 'java 17', 'java 21', 'jdk'],
    category: 'Programming',
    subcategory: 'Enterprise Language',
    difficulty: 'Intermediate',
    relatedSkills: ['Spring Boot', 'Object-Oriented Programming', 'SQL', 'Hibernate'],
  },
  {
    id: 'skill-cplusplus',
    name: 'C++',
    aliases: ['cpp', 'c++', 'c plus plus', 'modern c++'],
    category: 'Programming',
    subcategory: 'Systems Programming',
    difficulty: 'Advanced',
    relatedSkills: ['Data Structures & Algorithms', 'C', 'Operating Systems'],
  },

  // Databases & Data
  {
    id: 'skill-sql',
    name: 'SQL',
    aliases: ['sql', 'relational database', 'rdbms', 'structured query language'],
    category: 'Data & Databases',
    subcategory: 'Relational Querying',
    difficulty: 'Beginner',
    relatedSkills: ['PostgreSQL', 'MySQL', 'Database Design', 'Data Analysis'],
  },
  {
    id: 'skill-postgresql',
    name: 'PostgreSQL',
    aliases: ['postgres', 'postgresql', 'pgsql'],
    category: 'Data & Databases',
    subcategory: 'Relational Database',
    difficulty: 'Intermediate',
    relatedSkills: ['SQL', 'Supabase', 'Database Indexing', 'Prisma'],
  },
  {
    id: 'skill-mongodb',
    name: 'MongoDB',
    aliases: ['mongo', 'mongodb', 'nosql', 'document db'],
    category: 'Data & Databases',
    subcategory: 'NoSQL Database',
    difficulty: 'Intermediate',
    relatedSkills: ['Node.js', 'Express.js', 'Mongoose'],
  },
  {
    id: 'skill-data-analysis',
    name: 'Data Analysis',
    aliases: ['data analysis', 'data analytics', 'eda', 'exploratory data analysis'],
    category: 'Data & Databases',
    subcategory: 'Analytics',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Pandas', 'SQL', 'Tableau', 'Power BI'],
  },

  // AI & Machine Learning
  {
    id: 'skill-machine-learning',
    name: 'Machine Learning',
    aliases: ['ml', 'machine learning', 'scikit-learn', 'statistical learning'],
    category: 'AI / Machine Learning',
    subcategory: 'Applied ML',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Deep Learning', 'Pandas', 'NumPy', 'Math & Statistics'],
  },
  {
    id: 'skill-deep-learning',
    name: 'Deep Learning & Neural Networks',
    aliases: ['deep learning', 'dl', 'neural networks', 'pytorch', 'tensorflow'],
    category: 'AI / Machine Learning',
    subcategory: 'Advanced AI',
    difficulty: 'Advanced',
    relatedSkills: ['Machine Learning', 'PyTorch', 'Computer Vision', 'NLP'],
  },
  {
    id: 'skill-generative-ai',
    name: 'Generative AI & LLMs',
    aliases: ['genai', 'generative ai', 'llm', 'llms', 'langchain', 'prompt engineering'],
    category: 'AI / Machine Learning',
    subcategory: 'Generative AI',
    difficulty: 'Intermediate',
    relatedSkills: ['Python', 'Machine Learning', 'Vector Databases', 'RAG'],
  },

  // Cloud & DevOps
  {
    id: 'skill-git',
    name: 'Git & GitHub',
    aliases: ['git', 'github', 'version control', 'git/github', 'gitlab'],
    category: 'Cloud & DevOps',
    subcategory: 'Version Control',
    difficulty: 'Beginner',
    relatedSkills: ['CI/CD', 'Linux', 'Software Engineering'],
  },
  {
    id: 'skill-docker',
    name: 'Docker & Containers',
    aliases: ['docker', 'containers', 'containerization', 'dockerfile'],
    category: 'Cloud & DevOps',
    subcategory: 'Containerization',
    difficulty: 'Intermediate',
    relatedSkills: ['Kubernetes', 'Linux', 'CI/CD', 'AWS'],
  },
  {
    id: 'skill-aws',
    name: 'Amazon Web Services (AWS)',
    aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
    category: 'Cloud & DevOps',
    subcategory: 'Cloud Infrastructure',
    difficulty: 'Intermediate',
    relatedSkills: ['Cloud Computing', 'Docker', 'Linux', 'DevOps'],
  },
  {
    id: 'skill-linux',
    name: 'Linux & Bash',
    aliases: ['linux', 'bash', 'shell scripting', 'unix', 'ubuntu'],
    category: 'Cloud & DevOps',
    subcategory: 'Operating Systems',
    difficulty: 'Beginner',
    relatedSkills: ['Git & GitHub', 'Docker & Containers', 'Networking'],
  },

  // Cybersecurity
  {
    id: 'skill-cybersecurity',
    name: 'Cybersecurity Fundamentals',
    aliases: ['cybersecurity', 'info sec', 'information security', 'network security'],
    category: 'Cybersecurity',
    subcategory: 'Security Concepts',
    difficulty: 'Intermediate',
    relatedSkills: ['Linux & Bash', 'Networking', 'Ethical Hacking', 'Cryptography'],
  },

  // UI/UX Design
  {
    id: 'skill-ui-ux',
    name: 'UI/UX Design',
    aliases: ['ui/ux', 'ui design', 'ux design', 'figma', 'product design', 'wireframing'],
    category: 'Design & UI/UX',
    subcategory: 'Product Design',
    difficulty: 'Beginner',
    relatedSkills: ['HTML & CSS', 'User Research', 'Design Systems'],
  },

  // Core Engineering
  {
    id: 'skill-dsa',
    name: 'Data Structures & Algorithms',
    aliases: ['dsa', 'data structures', 'algorithms', 'problem solving', 'leetcode'],
    category: 'Core Engineering',
    subcategory: 'Algorithms',
    difficulty: 'Intermediate',
    relatedSkills: ['C++', 'Java', 'Python', 'System Design'],
  },
];

// Pre-computed lowercase alias lookup table
const ALIAS_LOOKUP: Map<string, SkillDefinition> = new Map();

for (const skill of SKILL_TAXONOMY) {
  ALIAS_LOOKUP.set(skill.name.toLowerCase(), skill);
  for (const alias of skill.aliases) {
    ALIAS_LOOKUP.set(alias.toLowerCase(), skill);
  }
}

/**
 * Normalizes any free-form skill string into standard canonical skill name.
 * Example: "js" -> "JavaScript", "react.js" -> "React", "postgres" -> "PostgreSQL"
 */
export function normalizeSkill(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const cleaned = raw.trim().toLowerCase();
  const matched = ALIAS_LOOKUP.get(cleaned);
  if (matched) {
    return matched.name;
  }
  // Title case fallback if unknown
  return raw.trim().replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Finds a skill definition by name or alias.
 */
export function findSkill(raw: string): SkillDefinition | undefined {
  if (!raw) return undefined;
  return ALIAS_LOOKUP.get(raw.trim().toLowerCase());
}

/**
 * Normalizes a list of skills and removes duplicates.
 */
export function normalizeSkillList(skills: string[]): string[] {
  if (!Array.isArray(skills)) return [];
  const normalizedSet = new Set<string>();
  for (const skill of skills) {
    const norm = normalizeSkill(skill);
    if (norm) normalizedSet.add(norm);
  }
  return Array.from(normalizedSet);
}
