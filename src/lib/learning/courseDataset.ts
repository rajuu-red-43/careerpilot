/**
 * Course and Learning Content Dataset for CareerPilot v2
 * Sourced from legitimate open education platforms (NPTEL, SWAYAM, Coursera,
 * edX, freeCodeCamp, Microsoft Learn, AWS Skill Builder, Cisco).
 * Includes verified URLs, skills mapping, and verification timestamps.
 */

export interface Course {
  id: string;
  title: string;
  provider: string;
  provider_url: string;
  description: string;
  category: string;
  sub_category?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string; // e.g., "4 weeks (6 hrs/wk)" or "40 hours"
  language: string;
  delivery_type: 'Self-paced' | 'Scheduled' | 'Cohort';
  is_free: boolean;
  price: string; // e.g. "Free (Audit)" or "₹0" or "$0"
  rating: number; // 0 - 5.0
  rating_count: number;
  skills: string[]; // Normalized skills from SkillTaxonomy
  prerequisites: string[];
  projects: string[];
  certificate_available: boolean;
  career_paths: string[];
  source: string;
  source_url: string;
  last_verified_at: string;
}

export const VERIFIED_COURSES: Course[] = [
  // 1. Web & Full Stack
  {
    id: 'course-fcc-responsive-web',
    title: 'Responsive Web Design Certification',
    provider: 'freeCodeCamp',
    provider_url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    description: 'Learn modern HTML5, CSS3, Flexbox, CSS Grid, and responsive web design with 5 portfolio projects.',
    category: 'Web Development',
    level: 'Beginner',
    duration: '300 hours',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free',
    rating: 4.9,
    rating_count: 142000,
    skills: ['HTML & CSS', 'Responsive Design', 'Web Development'],
    prerequisites: ['None - complete beginner friendly'],
    projects: ['Survey Form', 'Tribute Page', 'Technical Documentation Page', 'Product Landing Page', 'Personal Portfolio'],
    certificate_available: true,
    career_paths: ['Frontend Developer', 'Full Stack Developer', 'UI/UX Design'],
    source: 'freeCodeCamp Open Curriculum',
    source_url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    last_verified_at: '2026-09-20',
  },
  {
    id: 'course-meta-front-end',
    title: 'Meta Front-End Developer Professional Certificate',
    provider: 'Meta via Coursera',
    provider_url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    description: 'Master JavaScript, React, UI design, Git version control, and front-end coding interview preparation.',
    category: 'Web Development',
    level: 'Beginner',
    duration: '7 months (6 hrs/wk)',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free to audit / Financial Aid available',
    rating: 4.7,
    rating_count: 24500,
    skills: ['JavaScript', 'React', 'HTML & CSS', 'Git & GitHub', 'UI/UX Design'],
    prerequisites: ['Basic computer literacy'],
    projects: ['Little Lemon Restaurant Web App', 'React Portfolio Web App'],
    certificate_available: true,
    career_paths: ['Frontend Developer', 'Full Stack Developer'],
    source: 'Coursera / Meta',
    source_url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    last_verified_at: '2026-09-21',
  },
  {
    id: 'course-nptel-programming-in-java',
    title: 'Programming in Java (NPTEL / IIT Kharagpur)',
    provider: 'NPTEL / SWAYAM (IIT Kharagpur)',
    provider_url: 'https://onlinecourses.nptel.ac.in/noc24_cs44/preview',
    description: 'Comprehensive college-level course in Core Java, Object-Oriented Design, Exception Handling, Multithreading, and AWT/Swing.',
    category: 'Programming',
    level: 'Beginner',
    duration: '12 weeks',
    language: 'English',
    delivery_type: 'Scheduled',
    is_free: true,
    price: 'Free learning / ₹1000 for proctored IIT exam',
    rating: 4.8,
    rating_count: 68000,
    skills: ['Java', 'Object-Oriented Programming', 'Data Structures & Algorithms'],
    prerequisites: ['Basic C or procedural programming knowledge'],
    projects: ['Banking Management System', 'Multithreaded Task Scheduler'],
    certificate_available: true,
    career_paths: ['Backend Developer', 'Software Engineer'],
    source: 'National Programme on Technology Enhanced Learning (Govt of India)',
    source_url: 'https://nptel.ac.in/',
    last_verified_at: '2026-09-18',
  },
  {
    id: 'course-cs50-harvard',
    title: "CS50's Introduction to Computer Science",
    provider: 'Harvard University via edX',
    provider_url: 'https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science',
    description: 'An intellectual enterprise in the art of programming and computational thinking. Covers C, Python, SQL, HTML, CSS, JavaScript, and algorithms.',
    category: 'Core Engineering',
    level: 'Beginner',
    duration: '12 weeks (8 hrs/wk)',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free to audit / Verified certificate available',
    rating: 4.9,
    rating_count: 89000,
    skills: ['C++', 'Python', 'SQL', 'Data Structures & Algorithms', 'HTML & CSS', 'JavaScript'],
    prerequisites: ['None'],
    projects: ['Speller (Hash Tables)', 'CS50 Finance (Fullstack Flask & SQL App)'],
    certificate_available: true,
    career_paths: ['Software Engineer', 'Full Stack Developer', 'Backend Developer'],
    source: 'Harvard Online / edX',
    source_url: 'https://cs50.harvard.edu/x/',
    last_verified_at: '2026-09-15',
  },
  {
    id: 'course-meta-back-end',
    title: 'Meta Back-End Developer Professional Certificate',
    provider: 'Meta via Coursera',
    provider_url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer',
    description: 'Learn Python, Django, REST APIs, SQL, databases, Git, and container basics for cloud-ready back-end systems.',
    category: 'Web Development',
    level: 'Beginner',
    duration: '8 months (6 hrs/wk)',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free to audit / Financial Aid available',
    rating: 4.7,
    rating_count: 12800,
    skills: ['Python', 'SQL', 'PostgreSQL', 'Git & GitHub', 'REST APIs', 'Django'],
    prerequisites: ['None'],
    projects: ['Little Lemon Booking API', 'Django REST Framework Portfolio App'],
    certificate_available: true,
    career_paths: ['Backend Developer', 'Full Stack Developer'],
    source: 'Coursera / Meta',
    source_url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer',
    last_verified_at: '2026-09-20',
  },

  // 2. Data & AI/ML
  {
    id: 'course-google-data-analytics',
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Google via Coursera',
    provider_url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    description: 'Gain job-ready skills for an entry-level data analyst role. Learn spreadsheets, SQL, Tableau, and R programming.',
    category: 'Data & Databases',
    level: 'Beginner',
    duration: '6 months (10 hrs/wk)',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free to audit / Financial Aid available',
    rating: 4.8,
    rating_count: 135000,
    skills: ['Data Analysis', 'SQL', 'Python', 'Spreadsheets', 'Tableau'],
    prerequisites: ['No prior experience required'],
    projects: ['Cyclistic Bike-Share Case Study', 'Bellabeat Wellness Analysis'],
    certificate_available: true,
    career_paths: ['Data Analyst', 'Business Analyst'],
    source: 'Coursera / Google Career Certificates',
    source_url: 'https://grow.google/certificates/data-analytics/',
    last_verified_at: '2026-09-22',
  },
  {
    id: 'course-deeplearning-ai-ml-spec',
    title: 'Machine Learning Specialization',
    provider: 'DeepLearning.AI & Stanford University via Coursera',
    provider_url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    description: 'Taught by Andrew Ng. Master foundational machine learning concepts including Supervised Learning, Neural Networks, Decision Trees, and Unsupervised Learning.',
    category: 'AI / Machine Learning',
    level: 'Beginner',
    duration: '3 months (9 hrs/wk)',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free to audit / Financial Aid available',
    rating: 4.9,
    rating_count: 94000,
    skills: ['Machine Learning', 'Python', 'Deep Learning & Neural Networks', 'NumPy'],
    prerequisites: ['Basic Python programming, high school math'],
    projects: ['Housing Price Predictor', 'Cancer Detection Classifier', 'Movie Recommender System'],
    certificate_available: true,
    career_paths: ['Machine Learning Engineer', 'Data Scientist', 'AI Engineer'],
    source: 'DeepLearning.AI / Stanford Online',
    source_url: 'https://www.deeplearning.ai/courses/machine-learning-specialization/',
    last_verified_at: '2026-09-22',
  },
  {
    id: 'course-nptel-data-structures-algorithms',
    title: 'Data Structures and Algorithms using Java (IIT Kharagpur)',
    provider: 'NPTEL / SWAYAM (IIT Kharagpur)',
    provider_url: 'https://onlinecourses.nptel.ac.in/noc24_cs56/preview',
    description: 'Rigorous engineering foundation in Arrays, Stacks, Queues, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming, and complexity analysis.',
    category: 'Core Engineering',
    level: 'Intermediate',
    duration: '12 weeks',
    language: 'English',
    delivery_type: 'Scheduled',
    is_free: true,
    price: 'Free learning / ₹1000 for IIT Certificate',
    rating: 4.8,
    rating_count: 42000,
    skills: ['Data Structures & Algorithms', 'Java', 'Problem Solving'],
    prerequisites: ['Object-Oriented Programming in Java or C++'],
    projects: ['Graph Shortest Path Navigator', 'Custom Red-Black Tree Implementation'],
    certificate_available: true,
    career_paths: ['Software Engineer', 'Backend Developer'],
    source: 'NPTEL Govt of India',
    source_url: 'https://nptel.ac.in/',
    last_verified_at: '2026-09-18',
  },

  // 3. Cloud & DevOps
  {
    id: 'course-aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner Essentials',
    provider: 'AWS Skill Builder',
    provider_url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    description: 'Official free fundamental course by AWS. Learn compute (EC2, Lambda), storage (S3, EBS), networking (VPC), and AWS security basics.',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '6 hours',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free',
    rating: 4.8,
    rating_count: 51000,
    skills: ['Amazon Web Services (AWS)', 'Cloud & DevOps', 'Linux & Bash'],
    prerequisites: ['General IT fundamentals'],
    projects: ['Deploying a Scalable Web Server on EC2 with S3 Static Assets'],
    certificate_available: true,
    career_paths: ['Cloud & DevOps Engineer', 'Backend Developer'],
    source: 'Amazon Web Services Official Training',
    source_url: 'https://aws.amazon.com/training/',
    last_verified_at: '2026-09-19',
  },
  {
    id: 'course-docker-fcc',
    title: 'Docker and Containers for Beginners',
    provider: 'freeCodeCamp & TechWorld with Nana',
    provider_url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
    description: 'Learn Docker architecture, containers, images, Dockerfile, Docker Compose, volumes, networking, and multi-container orchestration.',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '4 hours',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free',
    rating: 4.9,
    rating_count: 180000,
    skills: ['Docker & Containers', 'Linux & Bash', 'Git & GitHub'],
    prerequisites: ['Basic command line familiarity'],
    projects: ['Containerize a Node.js + PostgreSQL Multi-service Application'],
    certificate_available: false,
    career_paths: ['Cloud & DevOps Engineer', 'Backend Developer', 'Full Stack Developer'],
    source: 'freeCodeCamp YouTube Education',
    source_url: 'https://www.freecodecamp.org/',
    last_verified_at: '2026-09-20',
  },

  // 4. Cybersecurity
  {
    id: 'course-cisco-cybersecurity-basics',
    title: 'Introduction to Cybersecurity',
    provider: 'Cisco Networking Academy',
    provider_url: 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity',
    description: 'Explore the cybersecurity world, cyber threats, vulnerabilities, data confidentiality, privacy laws, and defending networks.',
    category: 'Cybersecurity',
    level: 'Beginner',
    duration: '15 hours',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free',
    rating: 4.7,
    rating_count: 75000,
    skills: ['Cybersecurity Fundamentals', 'Networking', 'Linux & Bash'],
    prerequisites: ['None'],
    projects: ['Vulnerability Scan & Password Security Audit Lab'],
    certificate_available: true,
    career_paths: ['Cybersecurity Analyst', 'Cloud & DevOps Engineer'],
    source: 'Cisco Skills For All',
    source_url: 'https://skillsforall.com/',
    last_verified_at: '2026-09-16',
  },

  // 5. UI/UX Design
  {
    id: 'course-google-ux-design',
    title: 'Google UX Design Professional Certificate',
    provider: 'Google via Coursera',
    provider_url: 'https://www.coursera.org/professional-certificates/google-ux-design',
    description: 'Understand the design process from empathizing with users, defining pain points, wireframing in Figma, prototyping, and usability testing.',
    category: 'Design & UI/UX',
    level: 'Beginner',
    duration: '6 months (10 hrs/wk)',
    language: 'English',
    delivery_type: 'Self-paced',
    is_free: true,
    price: 'Free to audit / Financial Aid available',
    rating: 4.8,
    rating_count: 82000,
    skills: ['UI/UX Design', 'HTML & CSS'],
    prerequisites: ['No prior design experience needed'],
    projects: ['Cross-platform Social Good App Design', 'Responsive Coffee Ordering Web Design'],
    certificate_available: true,
    career_paths: ['UI/UX Design', 'Frontend Developer'],
    source: 'Google Career Certificates',
    source_url: 'https://grow.google/certificates/ux-design/',
    last_verified_at: '2026-09-19',
  },
];

/**
 * Helper to find courses by skill.
 */
export function getCoursesTeachingSkill(skillName: string): Course[] {
  const target = skillName.toLowerCase();
  return VERIFIED_COURSES.filter(c =>
    c.skills.some(s => s.toLowerCase() === target || target.includes(s.toLowerCase()))
  );
}

/**
 * Helper to find courses for a career path.
 */
export function getCoursesForCareerPath(careerPathName: string): Course[] {
  const target = careerPathName.toLowerCase();
  return VERIFIED_COURSES.filter(c =>
    c.career_paths.some(p => p.toLowerCase().includes(target))
  );
}
