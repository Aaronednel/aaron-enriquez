export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_lhfd8rh',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_ytqbvte',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'r58mcNbsD-xZQuIET',
};

export const SITE = {
  name: 'Aaron Ednel M. Enriquez',
  shortName: 'Aaron Enriquez',
  role: 'Full Stack Developer',
  location: 'San Fernando, Pampanga, Philippines',
  shortLocation: 'Pampanga, PH',
  timezone: 'Asia/Manila',
  utcLabel: 'PHT · UTC+8',
  status: 'Open to Opportunities',
  email: 'aaronenriquez1900@gmail.com',
  phone: '0995 952 2288',
  github: 'https://github.com/Aaronednel',
  instagram: 'https://instagram.com/aaronednel',
  instagramHandle: '@aaronednel',
  facebookName: 'Aaron Enriquez',
  resumeUrl: '/Aaron_Ednel_Enriquez_Resume.pdf',
  portraitUrl: '/portrait.png',
  hero: {
    title: 'Software you never have to think about.',
    text: 'I design and develop fast, intuitive web applications from the ground up. Focused on clean architecture, seamless user experiences, and solving real problems.',
    cta: "Let's talk",
    secondary: 'See the work',
  },
  about: {
    lead: [
      { t: 'Most of what I build, you’ll never see: ', b: false },
      {
        t: 'the data that stays consistent, the form that validates, the request that gets answered.',
        b: true,
      },
      {
        t: ' I care about the interface too, so the part you do see looks and feels the way it should.',
        b: false,
      },
    ],
    body: '4th-year BSIT student at the University of the Assumption (Class of 2027) passionate about turning complex problems into simple, dependable digital products. I love building full-stack applications where thoughtful UI meets solid backend engineering.',
    stats: [
      { value: '4+', unit: 'projects', label: 'built end-to-end' },
      { value: '10+', unit: 'technologies', label: 'in core stack' },
      { value: '100%', unit: 'commitment', label: 'to clean, maintainable code' },
      { value: '2027', unit: 'incoming graduate', label: 'ready to ship & scale' },
    ],
  },
};

export const SERVICES = [
  {
    n: '01',
    t: 'Frontend',
    d: 'Responsive, accessible interfaces built with modern component architectures.',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    n: '02',
    t: 'Backend',
    d: 'Server-side logic, authentication, and dependable data workflows.',
    tags: ['Node.js', 'Express', 'Firebase'],
  },
  {
    n: '03',
    t: 'Full-stack',
    d: 'Frontend and backend wired together end to end from database to UI.',
    tags: ['Next.js', 'Supabase', 'Vercel'],
  },
  {
    n: '04',
    t: 'Databases',
    d: 'Structured schemas, real-time sync, and reliable data storage.',
    tags: ['MySQL', 'PostgreSQL', 'Firebase', 'Supabase'],
  },
  {
    n: '05',
    t: 'UI/UX',
    d: 'Clean layouts, responsive grids, and user-centered visual consistency.',
    tags: ['Figma', 'Responsive Design', 'Accessibility'],
  },
  {
    n: '06',
    t: 'Problem solving',
    d: 'Debugging, system analysis, and steady performance optimization.',
    tags: ['Git', 'GitHub', 'VS Code'],
  },
];

export const PROCESS = [
  { n: '01', t: 'Discover', d: 'Understand the problem and goals.' },
  { n: '02', t: 'Plan', d: 'Define structure, features and approach.' },
  { n: '03', t: 'Design', d: 'Layouts, wireframes and flows.' },
  { n: '04', t: 'Build', d: 'Frontend and backend implementation.' },
  { n: '05', t: 'Test', d: 'Debug, verify and improve performance.' },
  { n: '06', t: 'Launch', d: 'Deploy, monitor and maintain.' },
];

export interface Project {
  n: string;
  title: string;
  blurb: string;
  meta: string;
  tag: string;
  problem?: string;
  solution?: string;
  features: string[];
  tech: string[];
  role: string;
  live: string;
  repo: string;
}

export const PROJECTS: Project[] = [
  {
    n: '01',
    title: 'ParishLink',
    blurb:
      'Digital sacramental appointment and inquiry platform designed for 8 parishes under the Vicariate of St. John Mary Vianney.',
    meta: 'BSIT Capstone Project',
    tag: 'Project Leader',
    problem:
      'Parish staff and clergy needed a unified, conflict-free way to handle sacramental bookings, walk-ins, and parishioner inquiries across multiple parishes.',
    solution:
      'Led a 3-member team after stakeholder interviews to design a simplified single-parish staff dashboard, conflict-aware scheduling workflow, and walk-in queue module.',
    features: [
      'Conflict-aware sacramental appointment scheduling',
      'Simplified single-parish staff dashboard',
      'Walk-in queue & parishioner inquiry module',
      'AI-assisted inquiry support via Google Gemini API',
    ],
    tech: ['TypeScript', 'JavaScript', 'PostgreSQL', 'Google Gemini API'],
    role: 'Project Leader & Full-Stack Developer — led a 3-member capstone team, conducted stakeholder interviews, and architected the core scheduling and inquiry workflows.',
    live: '',
    repo: '',
  },
  {
    n: '02',
    title: 'Dean Appointment System',
    blurb:
      'Appointment scheduling system built for AES to organize student and administrative appointment workflows.',
    meta: 'Academic Project · Feb 2026',
    tag: 'System Development',
    problem:
      'Manual appointment booking and scattered inquiries caused scheduling conflicts and slow responses.',
    solution:
      'Built an organized scheduling workflow and user-facing interface to streamline appointment requests and administrative review.',
    features: [
      'Structured appointment request and scheduling workflows',
      'Organized administrative review and status tracking',
      'User-facing scheduling interface',
    ],
    tech: ['React', 'JavaScript', 'REST APIs', 'Firebase'],
    role: 'Full-Stack Developer — assisted in planning system workflows, building scheduling features, and presenting the solution.',
    live: '',
    repo: '',
  },
  {
    n: '03',
    title: 'Arwee Photography and Films',
    blurb:
      'A photography and videography website for event coverage, portfolios and customer inquiries.',
    meta: 'Brand & Portfolio Website',
    tag: 'Live on Vercel',
    problem:
      'Event clients needed a credible online space to browse photography and film work and send coverage inquiries.',
    solution:
      'A responsive showcase site with curated media galleries, service packages, and a clear customer inquiry flow.',
    features: [
      'Responsive event photography and film galleries',
      'Services and coverage showcase',
      'Optimized media loading across all devices',
      'Direct customer inquiry pathway',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'],
    role: 'Frontend Developer & Designer — designed the brand layout, built a responsive media gallery, and optimized page load performance across all devices.',
    live: 'https://arwee-photography.vercel.app/',
    repo: 'https://github.com/Aaronednel/arwee-photography',
  },
  {
    n: '04',
    title: 'Aaron Enriquez',
    blurb:
      'Built this site from the ground up with a focus on clean design, smooth performance, and software that feels effortless to use.',
    meta: 'Interactive Portfolio',
    tag: 'This Website',
    features: [
      '3D WebGL particle portrait and morphing geometry',
      'Smooth dark and light theme scroll transitions',
      'Interactive motto spotlight and physics easter egg',
      'Responsive editorial layout across desktop and mobile',
    ],
    tech: ['React', 'TypeScript', 'Three.js', 'Tailwind CSS'],
    role: 'Website Owner & Creator — designed and developed the entire interactive experience from scratch.',
    live: '',
    repo: '',
  },
];

export const EXPERIENCE = [
  {
    when: '2023 – 2027',
    what: 'BS in Information Technology',
    where: 'University of the Assumption · San Fernando, Pampanga',
  },
];

export const TOOLKIT = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'Express',
  'MySQL',
  'PostgreSQL',
  'Firebase',
  'Supabase',
  'Git',
  'GitHub',
  'VS Code',
  'Figma',
  'Vercel',
];

export const FEEDBACK = [
  {
    initials: 'ED',
    who: 'Edsger W. Dijkstra',
    role: 'Computer Scientist & Turing Award Winner',
    quote: 'Simplicity is prerequisite for reliability.',
    form: 'dijkstra',
    portraitUrl: '/dijkstra.png',
  },
  {
    initials: 'DR',
    who: 'Dieter Rams',
    role: 'Industrial Designer, Braun',
    quote: 'Good design is as little design as possible.',
    form: 'rams',
    portraitUrl: '/rams.png',
  },
];

export const AFTER_HOURS = [
  {
    t: 'Photography & Films',
    d: 'Capturing candid moments and telling visual stories behind the lens.',
  },
  {
    t: 'Music',
    d: 'Always listening to a good playlist to stay in the zone while coding or to unwind after hours.',
  },
  {
    t: 'Web Tinkering',
    d: 'Creating and modifying websites for fun, experimenting with new layouts, UI details, and clean code.',
  },
];

export const FAQ = [
  {
    q: 'What do you build?',
    a: 'I design and develop fast, intuitive full-stack web applications using React, TypeScript, Tailwind CSS, Node.js, and modern databases like Firebase, Supabase, and SQL.',
  },
  {
    q: 'What projects have you worked on?',
    a: 'I built the AES Parish Appointment System (a full-stack mobile and web admin booking platform), the Arwee Photography and Films website, and this interactive 3D particle portfolio.',
  },
  {
    q: 'How does a project with you run?',
    a: 'Six clear steps: discover, plan, design, build, test, and launch — keeping the architecture clean and the interface effortless to use.',
  },
  {
    q: 'Are you available for opportunities?',
    a: 'Yes! I am an incoming 2027 IT graduate from the University of the Assumption in San Fernando, Pampanga, and I am open to developer opportunities and collaborations.',
  },
];

export const MENU = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'What I do' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'feedback', label: 'Philosophy' },
  { id: 'after-hours', label: 'After hours' },
  { id: 'ask', label: 'Ask me' },
  { id: 'contact', label: 'Contact' },
];

export const isReal = (v: string) => /^(https?:\/\/|\/|mailto:)/.test(v);
export const isEmail = (v: string) => /^[^\s@\[\]]+@[^\s@\[\]]+\.[^\s@\[\]]+$/.test(v);
