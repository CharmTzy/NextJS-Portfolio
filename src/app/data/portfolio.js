const GITHUB_USERNAME = "CharmTzy";

export const personalInfo = {
  name: "Wai Yan Aung",
  shortLogo: "WYA.DEV",
  role: "AI Engineer",
  location: "Singapore",
  email: "wai71308@gmail.com",
  githubUrl: `https://github.com/${GITHUB_USERNAME}`,
  githubHandle: GITHUB_USERNAME,
  linkedinUrl: "https://sg.linkedin.com/in/wai-yan-1839512a8",
  whatsappUrl: "https://wa.me/+6588779884",
  whatsappLabel: "+65 8877 9884",
  resumeUrl: "/WAI%20YAN%20AUNG%20Resume.pdf",
  buyMeACoffeeUrl: "https://www.buymeacoffee.com/redx04",
  availability: "Available",
  tagline:
    "I build <span>production-ready web applications</span> with clean UI, practical AI integrations, and engineering that holds up in the real world.",
  footerTagline:
    "Designed & built by Wai Yan Aung · AI Engineer · Singapore · Made with coffee and curiosity",
};

export const skillCards = [
  {
    icon: "🎨",
    iconBackground: "rgba(56,189,248,0.1)",
    title: "Frontend Development",
    description:
      "Responsive user interfaces with a focus on modern layouts, smooth interactions, and clean visual structure.",
    tags: [
      { label: "Next.js", variant: "default" },
      { label: "React", variant: "default" },
      { label: "JavaScript", variant: "default" },
      { label: "Tailwind", variant: "default" },
    ],
  },
  {
    icon: "⚙️",
    iconBackground: "rgba(129,140,248,0.1)",
    title: "Backend & APIs",
    description:
      "Building application logic, RESTful endpoints, and project backends with JavaScript and Python stacks.",
    tags: [
      { label: "Node.js", variant: "purple" },
      { label: "Express", variant: "purple" },
      { label: "Python", variant: "purple" },
      { label: "Flask", variant: "purple" },
    ],
  },
  {
    icon: "🗄️",
    iconBackground: "rgba(52,211,153,0.1)",
    title: "Databases & Data",
    description:
      "Working with relational and document databases to support app features, records, and internal workflows.",
    tags: [
      { label: "MySQL", variant: "green" },
      { label: "MongoDB", variant: "green" },
      { label: "PostgreSQL", variant: "green" },
      { label: "Firebase", variant: "green" },
    ],
  },
  {
    icon: "🧩",
    iconBackground: "rgba(56,189,248,0.1)",
    title: "UI Systems & Design",
    description:
      "Using design thinking, consistent styling, and component-based structure to make projects feel polished.",
    tags: [
      { label: "Figma", variant: "default" },
      { label: "Responsive UI", variant: "default" },
      { label: "Themes", variant: "default" },
      { label: "UX detail", variant: "default" },
    ],
  },
  {
    icon: "🚀",
    iconBackground: "rgba(129,140,248,0.1)",
    title: "Deployment & Tooling",
    description:
      "Shipping projects with modern workflows, code hosting, and deployment platforms that make iteration easier.",
    tags: [
      { label: "GitHub", variant: "purple" },
      { label: "Vercel", variant: "purple" },
      { label: "Render", variant: "purple" },
      { label: "AWS", variant: "purple" },
    ],
  },
  {
    icon: "🤖",
    iconBackground: "rgba(52,211,153,0.1)",
    title: "AI & Machine Learning",
    description:
      "Building practical AI systems — from rule-based detection engines and ML experiments to integrating models into real products.",
    tags: [
      { label: "Machine Learning", variant: "green" },
      { label: "Rule-based AI", variant: "green" },
      { label: "Security AI", variant: "green" },
      { label: "Python", variant: "green" },
    ],
  },
];

export const experiences = [
  {
    role: "Freelance Developer",
    company: "Independent",
    period: "2023 – Present",
    description:
      "Delivered custom websites and full-stack interfaces for clients, taking projects from brief to deployment. Focused on fast load times, accessible design, and clean component architecture that clients can maintain.",
    techs: [
      { label: "Next.js", variant: "default" },
      { label: "React", variant: "default" },
      { label: "UI Design", variant: "green" },
      { label: "Vercel", variant: "purple" },
    ],
  },
  {
    role: "IT Application Engineer",
    company: "BitCare — Singapore",
    companyUrl: "https://bitcare.sg",
    period: "2024 – 2025",
    description:
      "Managed application lifecycle and internal tooling at a Singapore-based software company. Contributed to engineering workflows, triaged production issues, and coordinated cross-functional delivery to keep systems running reliably.",
    techs: [
      { label: "Application Ops", variant: "default" },
      { label: "Troubleshooting", variant: "purple" },
      { label: "Process Improvement", variant: "green" },
      { label: "Delivery", variant: "default" },
    ],
  },
  {
    role: "Software Engineer (Academic Projects)",
    company: "Singapore Institute of Technology",
    period: "2022 – 2025",
    description:
      "Designed and shipped over 10 software projects covering AI/ML, full-stack web systems, data structures, and cloud-deployed apps. Highlights include a live phishing detection engine and an e-commerce platform with Stripe integration.",
    techs: [
      { label: "Python", variant: "default" },
      { label: "Node.js", variant: "purple" },
      { label: "Flask", variant: "green" },
      { label: "Java", variant: "default" },
    ],
  },
];

export const contactLinks = [
  {
    label: "LinkedIn",
    value: "/in/wai-yan-1839512a8",
    href: personalInfo.linkedinUrl,
  },
  {
    label: "GitHub",
    value: `@${GITHUB_USERNAME}`,
    href: personalInfo.githubUrl,
  },
  {
    label: "WhatsApp",
    value: personalInfo.whatsappLabel,
    href: personalInfo.whatsappUrl,
  },
  {
    label: "Resume",
    value: "Download PDF",
    href: personalInfo.resumeUrl,
  },
];

const projectOverrides = {
  "Lingo-Man": {
    title: "Lingo Man",
    description:
      "A playful language-learning web app built to help users practise vocabulary and phrases through an interactive, game-inspired interface.",
    tags: [
      { label: "React", variant: "default" },
      { label: "JavaScript", variant: "purple" },
      { label: "Netlify", variant: "green" },
    ],
    emoji: "🗣️",
    gradient: "linear-gradient(135deg,#0d1426,#1e1a3a)",
    liveLabel: "Live",
    liveUrl: "https://unique-gumption-cf1f09.netlify.app/",
    priority: 0,
  },
  Web_System_Project: {
    title: "Nova Markets",
    description:
      "A full-featured e-commerce platform with product listings, cart, checkout, Stripe payment integration, and an admin dashboard for order and inventory management.",
    tags: [
      { label: "Node.js", variant: "default" },
      { label: "Express", variant: "purple" },
      { label: "MySQL", variant: "green" },
    ],
    emoji: "🛍️",
    gradient: "linear-gradient(135deg,#0d1426,#1a2540)",
    liveLabel: "Live",
    liveUrl: "https://nova-markets.org",
    priority: 1,
  },
  "Phishing-Email-Detection": {
    title: "Phishing Email Detection",
    description:
      "A rule-based phishing email detection app that analyzes keywords, suspicious URLs, and domain impersonation patterns through a simple interactive interface.",
    tags: [
      { label: "Python", variant: "default" },
      { label: "Rule-based AI", variant: "default" },
      { label: "HuggingFace", variant: "green" },
    ],
    emoji: "🛡️",
    gradient: "linear-gradient(135deg,#0d1426,#1a2540)",
    liveLabel: "Live",
    liveUrl: "https://huggingface.co/spaces/nik-fireball/phishing-email-detection",
    priority: 2,
  },
  "Yang-Bum-Safety": {
    title: "Yang Bum Safety",
    description:
      "An Express-based workflow app for file uploads, material handling, and safety-related document organization with Firebase-backed configuration.",
    tags: [
      { label: "Express", variant: "default" },
      { label: "Firebase", variant: "purple" },
      { label: "Multer", variant: "green" },
    ],
    emoji: "📁",
    gradient: "linear-gradient(135deg,#0d1a1a,#0d2010)",
    priority: 2,
  },
  hotel_system_flask: {
    title: "Hotel System Flask",
    description:
      "A hotel booking prototype using Flask, templates, and MySQL-driven city and login flows for a classic server-rendered web experience.",
    tags: [
      { label: "Flask", variant: "purple" },
      { label: "MySQL", variant: "green" },
      { label: "Python", variant: "default" },
    ],
    emoji: "🏨",
    gradient: "linear-gradient(135deg,#0d1426,#15304a)",
    priority: 3,
  },
  "SEP-Assignment-2": {
    title: "Island Furniture Workflow",
    description:
      "A larger Node.js coursework build exploring MVC architecture, uploads, email flows, authentication, and Stripe-related e-commerce features.",
    tags: [
      { label: "Node.js", variant: "default" },
      { label: "Express", variant: "purple" },
      { label: "Stripe", variant: "green" },
    ],
    emoji: "🛒",
    gradient: "linear-gradient(135deg,#0d1426,#1a1540)",
    priority: 4,
  },
  INF2008_ML_Labs: {
    title: "INF2008 ML Labs",
    description:
      "Machine learning lab coursework and references collected as part of continued experimentation and class-based learning.",
    tags: [
      { label: "ML", variant: "default" },
      { label: "Labs", variant: "purple" },
      { label: "Coursework", variant: "green" },
    ],
    emoji: "📘",
    gradient: "linear-gradient(135deg,#0d1426,#1a2540)",
    priority: 5,
  },
  "DSA-Trie-Assignment-2": {
    title: "DSA Trie Assignment 2",
    description:
      "A Python-based data structures assignment focused on trie logic and search-oriented problem solving.",
    tags: [
      { label: "Python", variant: "default" },
      { label: "DSA", variant: "purple" },
      { label: "Trie", variant: "green" },
    ],
    emoji: "🌳",
    gradient: "linear-gradient(135deg,#0d1a1a,#12351b)",
    priority: 6,
  },
  "JAD-Assignment-2": {
    title: "JAD Assignment 2",
    description:
      "An application development coursework repository focused on building and structuring software with Java-based foundations.",
    tags: [
      { label: "Java", variant: "default" },
      { label: "Coursework", variant: "purple" },
      { label: "App Dev", variant: "green" },
    ],
    emoji: "💻",
    gradient: "linear-gradient(135deg,#0d1426,#1b243f)",
    priority: 7,
  },
  "Hogwart-Library": {
    title: "Hogwart Library",
    description:
      "A Java library-management style coursework build centered on object-oriented programming practice and system structure.",
    tags: [
      { label: "Java", variant: "default" },
      { label: "OOP", variant: "purple" },
      { label: "Library", variant: "green" },
    ],
    emoji: "📚",
    gradient: "linear-gradient(135deg,#0d1426,#242047)",
    priority: 8,
  },
  "JAD-Assignment-1": {
    title: "JAD Assignment 1",
    description:
      "An earlier application development project that helped shape fundamentals in software structure and implementation.",
    tags: [
      { label: "Java", variant: "default" },
      { label: "Foundations", variant: "purple" },
      { label: "Coursework", variant: "green" },
    ],
    emoji: "⚡",
    gradient: "linear-gradient(135deg,#0d1a1a,#13323d)",
    priority: 9,
  },
  "git-practical": {
    title: "Git Practical",
    description:
      "A small repository for hands-on Git workflow exercises and version control practice.",
    tags: [
      { label: "Git", variant: "default" },
      { label: "Workflow", variant: "purple" },
      { label: "Practice", variant: "green" },
    ],
    emoji: "🔧",
    gradient: "linear-gradient(135deg,#0d1426,#1b3040)",
    priority: 10,
  },
  "portfoilio.github.io": {
    title: "Portfolio.github.io",
    description:
      "An earlier static portfolio website experiment hosted through GitHub Pages.",
    tags: [
      { label: "HTML", variant: "default" },
      { label: "Portfolio", variant: "purple" },
      { label: "GitHub Pages", variant: "green" },
    ],
    emoji: "🪄",
    gradient: "linear-gradient(135deg,#0d1426,#2b2047)",
    priority: 11,
  },
};

const projectCaseStudyOverrides = {
  "Phishing-Email-Detection": {
    headline:
      "A practical phishing-detection demo that turns a rule-based idea into something people can actually test.",
    status: "Live demo available",
    role: "AI logic, product structure, and interface shaping",
    timeline: "Personal build · 2026",
    challenge:
      "The goal was to make phishing-detection logic feel understandable and useful, instead of leaving it as a code-only experiment.",
    solution:
      "I focused on translating rule-based checks into a simple interactive flow, then packaged the result so a visitor can try suspicious content and immediately understand the decision path.",
    outcome:
      "The project became one of the strongest examples in the portfolio because it combines security thinking, AI-adjacent logic, and a shareable live experience.",
    highlights: [
      "Built an interactive workflow instead of stopping at model or notebook logic.",
      "Turned detection rules into a product-style experience with clear feedback.",
      "Connected the repository to a deployable demo so the project feels real and testable.",
    ],
    learnings: [
      "Security-related ideas land better when users can see the decision process clearly.",
      "A small but working interface often communicates more value than raw code alone.",
      "Rule-based systems are still useful when the problem space needs explainability.",
    ],
  },
  "Yang-Bum-Safety": {
    headline:
      "An internal workflow-style project centered on uploads, structure, and dependable document handling.",
    status: "Repository available",
    role: "Backend workflow design and application delivery",
    timeline: "Practical build",
    challenge:
      "Internal tools can become messy quickly when uploads, validation, and document organization are not designed carefully.",
    solution:
      "I treated the project like a real operations workflow, shaping the upload paths, data handling, and general structure so the experience stayed practical and maintainable.",
    outcome:
      "The result shows that operations-facing software can still be thoughtful product work, especially when reliability matters more than visual flash.",
    highlights: [
      "Worked with file upload flows and backend-oriented application structure.",
      "Organized safety-related information into clearer, more usable workflows.",
      "Balanced practical utility with enough polish to feel intentional.",
    ],
    learnings: [
      "Admin and internal software still deserve good information architecture.",
      "File-heavy products need careful handling around validation and structure.",
      "Workflow clarity matters just as much as visual design in operations tools.",
    ],
  },
  hotel_system_flask: {
    headline:
      "A server-rendered hotel booking prototype that helped strengthen full application thinking beyond frontend polish.",
    status: "Repository available",
    role: "Python/Flask implementation and application flow design",
    timeline: "Coursework / self-driven practice",
    challenge:
      "The project needed to cover multiple connected flows such as routing, login behavior, and booking-style interactions in a coherent way.",
    solution:
      "I used Flask templates and database-backed structure to build a more complete web-app experience, focusing on how the parts connect instead of treating each screen in isolation.",
    outcome:
      "It became a strong learning project for thinking about systems, forms, and state across a multi-page application.",
    highlights: [
      "Built around Flask templates and MySQL-backed flows.",
      "Covered routing, authentication-style patterns, and booking interactions.",
      "Strengthened backend and application-structure thinking.",
    ],
    learnings: [
      "Server-rendered projects teach a lot about application flow and structure.",
      "Forms and routing become much easier to reason about when the data model is clear.",
      "Even prototype systems benefit from clean separation between logic and presentation.",
    ],
  },
  "SEP-Assignment-2": {
    headline:
      "A larger e-commerce-style coursework build that explores architecture, uploads, auth, and transaction flows.",
    status: "Repository available",
    role: "Feature delivery, architecture work, and integration thinking",
    timeline: "Coursework build",
    challenge:
      "This project had more moving parts than a simple demo, so the real difficulty was keeping the architecture understandable while still shipping features.",
    solution:
      "I approached it as a broader product build, combining Node.js and Express patterns with file handling, authentication flows, and commerce-related functionality.",
    outcome:
      "It serves as a good example of how I handle a larger surface area: break the product into flows, keep the structure understandable, and deliver the core behaviors cleanly.",
    highlights: [
      "Worked across multiple flows instead of a single isolated feature.",
      "Combined uploads, auth, and commerce-style thinking in one codebase.",
      "Used the project as practice for structuring a larger application.",
    ],
    learnings: [
      "As scope grows, naming and file structure matter more than ever.",
      "Shipping larger coursework projects still benefits from real product thinking.",
      "Feature breadth only helps when the user journey still feels coherent.",
    ],
  },
  INF2008_ML_Labs: {
    headline:
      "A machine-learning lab space that reflects experimentation, iteration, and growing AI interest.",
    status: "Lab repository",
    role: "Experimentation, learning, and technical exploration",
    timeline: "Coursework / ongoing learning",
    challenge:
      "ML learning can stay too abstract unless experiments are organized in a way that makes patterns and progress visible.",
    solution:
      "I treated the labs as a structured learning space, using them to test ideas, reinforce concepts, and build intuition around practical AI work.",
    outcome:
      "The repository represents the exploration side of my portfolio and supports the direction I’m taking as an AI-focused builder.",
    highlights: [
      "Collects machine-learning exercises and iterative experiments.",
      "Supports practical learning rather than passive study.",
      "Connects well with security and product ideas elsewhere in the portfolio.",
    ],
    learnings: [
      "Hands-on repetition is how ML concepts actually stick.",
      "Documented experiments make technical growth much easier to track.",
      "AI work gets stronger when paired with usable product thinking.",
    ],
  },
};

const fallbackProfile = {
  public_repos: 11,
  followers: 2,
};

const fallbackRepos = [
  {
    name: "Lingo-Man",
    description: "A playful language-learning web app with an interactive, game-inspired interface.",
    language: "JavaScript",
    stargazers_count: 0,
    homepage: "https://unique-gumption-cf1f09.netlify.app/",
    html_url: `https://github.com/${GITHUB_USERNAME}/Lingo-Man`,
    updated_at: "2026-04-10T00:00:00Z",
    fork: false,
  },
  {
    name: "Web_System_Project",
    description: "Full e-commerce platform with Stripe integration and admin dashboard.",
    language: "JavaScript",
    stargazers_count: 0,
    homepage: "https://nova-markets.org",
    html_url: `https://github.com/${GITHUB_USERNAME}/Web_System_Project`,
    updated_at: "2026-04-01T00:00:00Z",
    fork: false,
  },
  {
    name: "INF2008_ML_Labs",
    description: "",
    language: "",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/INF2008_ML_Labs`,
    updated_at: "2026-03-29T09:58:53Z",
    fork: false,
  },
  {
    name: "Phishing-Email-Detection",
    description:
      "This is the phishing email detection that is based on the rule-based system.",
    language: "Jupyter Notebook",
    stargazers_count: 1,
    homepage: "https://phishing-email-detection-s0sg.onrender.com",
    html_url: `https://github.com/${GITHUB_USERNAME}/Phishing-Email-Detection`,
    updated_at: "2026-03-27T09:51:02Z",
    fork: false,
  },
  {
    name: "DSA-Trie-Assignment-2",
    description: "",
    language: "Python",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/DSA-Trie-Assignment-2`,
    updated_at: "2026-03-18T13:50:20Z",
    fork: false,
  },
  {
    name: "Yang-Bum-Safety",
    description: "",
    language: "HTML",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/Yang-Bum-Safety`,
    updated_at: "2025-07-31T18:25:01Z",
    fork: false,
  },
  {
    name: "hotel_system_flask",
    description: "",
    language: "HTML",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/hotel_system_flask`,
    updated_at: "2024-04-29T01:10:25Z",
    fork: false,
  },
  {
    name: "git-practical",
    description: "",
    language: "JavaScript",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/git-practical`,
    updated_at: "2023-10-29T14:50:14Z",
    fork: false,
  },
  {
    name: "JAD-Assignment-2",
    description: "",
    language: "CSS",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/JAD-Assignment-2`,
    updated_at: "2023-08-04T07:39:17Z",
    fork: false,
  },
  {
    name: "Hogwart-Library",
    description: "",
    language: "Java",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/Hogwart-Library`,
    updated_at: "2023-07-29T14:04:03Z",
    fork: false,
  },
  {
    name: "SEP-Assignment-2",
    description: "",
    language: "JavaScript",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/SEP-Assignment-2`,
    updated_at: "2023-06-28T19:45:50Z",
    fork: false,
  },
  {
    name: "JAD-Assignment-1",
    description: "JAD Assignment 1",
    language: "Java",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/JAD-Assignment-1`,
    updated_at: "2023-06-07T18:35:07Z",
    fork: false,
  },
  {
    name: "portfoilio.github.io",
    description: "",
    language: "HTML",
    stargazers_count: 0,
    homepage: "",
    html_url: `https://github.com/${GITHUB_USERNAME}/portfoilio.github.io`,
    updated_at: "2022-09-22T04:20:57Z",
    fork: false,
  },
];

function getGradientFromLanguage(language = "") {
  const lower = language.toLowerCase();

  if (lower.includes("python")) return "linear-gradient(135deg,#0d1426,#15304a)";
  if (lower.includes("java")) return "linear-gradient(135deg,#0d1426,#2b2047)";
  if (lower.includes("html")) return "linear-gradient(135deg,#0d1a1a,#12351b)";
  if (lower.includes("css")) return "linear-gradient(135deg,#0d1426,#1a2540)";
  if (lower.includes("javascript")) return "linear-gradient(135deg,#0d1426,#1b3040)";

  return "linear-gradient(135deg,#0d1426,#1a2540)";
}

function getEmojiFromLanguage(language = "") {
  const lower = language.toLowerCase();

  if (lower.includes("python")) return "🐍";
  if (lower.includes("java")) return "☕";
  if (lower.includes("html")) return "🌐";
  if (lower.includes("css")) return "🎨";
  if (lower.includes("javascript")) return "⚡";

  return "📦";
}

function getTagsFromLanguage(language = "") {
  if (!language) return [{ label: "GitHub", variant: "default" }];

  return [
    { label: language, variant: "default" },
    { label: "Project", variant: "purple" },
    { label: "GitHub", variant: "green" },
  ];
}

function slugifyProject(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatProjectDate(dateString) {
  if (!dateString) return "Recently";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function buildProjectCaseStudy(repo, override, mappedTags, liveUrl) {
  const detail = projectCaseStudyOverrides[repo.name] || {};
  const projectName = override.title || repo.name;
  const primaryLanguage = repo.language || mappedTags[0]?.label || "Software";
  const stackLabels = mappedTags.map((tag) => tag.label);

  return {
    headline:
      detail.headline ||
      `${projectName} is a practical ${primaryLanguage} project built to show how I approach delivery, product shape, and engineering structure.`,
    status: detail.status || (liveUrl ? "Live project" : "Repository available"),
    role: detail.role || "Design, implementation, and iteration",
    timeline: detail.timeline || "Personal / academic project",
    challenge:
      detail.challenge ||
      `The main challenge was turning the idea into something structured enough to feel real while keeping the implementation understandable.`,
    solution:
      detail.solution ||
      `I focused on shaping the core workflow, choosing a stack that fit the problem, and organizing the build around ${stackLabels
        .slice(0, 3)
        .join(", ")}.`,
    outcome:
      detail.outcome ||
      (liveUrl
        ? "The result is a project that can be explored through both the live experience and the source code."
        : "The result is a working repository that captures the architecture, workflow, and implementation decisions behind the build."),
    highlights: detail.highlights || [
      `Built with ${stackLabels.slice(0, 3).join(", ")}.`,
      "Structured to communicate both the implementation and the product thinking behind it.",
      "Useful as a portfolio example because it shows practical delivery instead of isolated snippets.",
    ],
    learnings: detail.learnings || [
      "Clear project structure makes demos easier to understand and extend.",
      "Even smaller builds feel stronger when the user flow is obvious.",
      "Technical work becomes easier to present when the story is as clear as the code.",
    ],
  };
}

function mapRepository(repo) {
  const override = projectOverrides[repo.name] || {};
  const homepage = override.liveUrl || repo.homepage || null;
  const tags = override.tags || getTagsFromLanguage(repo.language);
  const caseStudy = buildProjectCaseStudy(repo, override, tags, homepage);

  return {
    slug: slugifyProject(repo.name),
    name: override.title || repo.name,
    originalName: repo.name,
    description:
      override.description ||
      repo.description ||
      "GitHub project pulled directly into this portfolio with real repository metadata.",
    tags,
    emoji: override.emoji || getEmojiFromLanguage(repo.language),
    gradient: override.gradient || getGradientFromLanguage(repo.language),
    githubUrl: repo.html_url,
    liveUrl: homepage,
    liveLabel: override.liveLabel || (homepage ? "Live" : null),
    stars: repo.stargazers_count || 0,
    priority: override.priority || 999,
    updatedAt: repo.updated_at,
    updatedLabel: formatProjectDate(repo.updated_at),
    primaryLanguage: repo.language || tags[0]?.label || "Software",
    caseStudy,
  };
}

async function fetchGitHubJson(endpoint) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${endpoint}`);
  }

  return response.json();
}

export async function getPortfolioData() {
  let profile = fallbackProfile;
  let repos = fallbackRepos;

  try {
    const [githubProfile, githubRepos] = await Promise.all([
      fetchGitHubJson(`/users/${GITHUB_USERNAME}`),
      fetchGitHubJson(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
    ]);

    profile = githubProfile;
    repos = githubRepos;
  } catch (error) {
    console.warn("Using fallback GitHub portfolio data:", error);
  }

  const publicRepos = Array.isArray(repos)
    ? repos.filter((repo) => !repo.fork).sort((a, b) => {
        const aPriority = projectOverrides[a.name]?.priority || 999;
        const bPriority = projectOverrides[b.name]?.priority || 999;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        return new Date(b.updated_at) - new Date(a.updated_at);
      })
    : fallbackRepos;

  const projects = publicRepos.map(mapRepository);

  return {
    profile: {
      publicRepos: profile.public_repos || fallbackProfile.public_repos,
      followers: profile.followers || fallbackProfile.followers,
      featuredCount: projects.length,
    },
    projects,
  };
}

export async function getProjectBySlug(slug) {
  const { projects } = await getPortfolioData();
  return projects.find((project) => project.slug === slug) || null;
}

export async function getProjectSlugs() {
  const { projects } = await getPortfolioData();
  return projects.map((project) => project.slug);
}
