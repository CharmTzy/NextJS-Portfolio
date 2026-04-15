// Edit this file anytime to add new posts to your updates page.
// Newer items should usually go at the top.

export const updatesPageContent = {
  badge: "Personal status feed",
  titleTop: "Updates",
  titleBottom: "Notes & Status",
  description:
    "A small social-style page for build logs, quick thoughts, project milestones, and anything I want to share without writing a full blog post.",
  currentStatus:
    "Currently polishing my portfolio, improving project storytelling, and building a more personal space on the web.",
  stats: [
    { value: "Editable", label: "Feed mode" },
    { value: "Now", label: "Posting style" },
    { value: "Live", label: "Feed status" },
  ],
  sidebarCards: [
    {
      title: "What this page is for",
      items: [
        "Quick status drops",
        "Build notes and experiments",
        "Project milestones",
        "Anything I want to remember publicly",
      ],
    },
    {
      title: "Current focus",
      items: [
        "Frontend polish and layout work",
        "GitHub project presentation",
        "Rule-based phishing detection ideas",
        "Sharpening product design details",
      ],
    },
  ],
};

export const updatesFeed = [
  {
    date: "2026-04-03",
    category: "Portfolio",
    title: "Added an updates page to my portfolio",
    content:
      "I wanted a place to post quick notes like a personal feed instead of hiding everything inside project cards. This page is where I can share progress, ideas, and status updates more casually.",
    mood: "shipping",
    tags: ["Next.js", "Personal site", "Design polish"],
    links: [{ label: "Main portfolio", href: "/" }],
  },
  {
    date: "2026-04-03",
    category: "Design",
    title: "Refining the portfolio visual system",
    content:
      "I have been tightening spacing, making the light and dark theme feel more balanced, and improving how the portfolio reads on desktop and mobile.",
    mood: "focused",
    tags: ["UI", "Theme", "Responsive"],
  },
  {
    date: "2026-03-29",
    category: "Learning",
    title: "Still exploring ML and practical security ideas",
    content:
      "I like mixing product work with technical experimentation, especially around machine learning labs, phishing detection, and tools that solve very practical problems.",
    mood: "curious",
    tags: ["ML", "Security", "Experiments"],
  },
  {
    date: "2026-03-27",
    category: "Project",
    title: "Phishing Email Detection is one of the projects I am most proud of right now",
    content:
      "It turns a rule-based detection approach into something people can actually try, which makes the project feel more real than a code-only assignment.",
    mood: "proud",
    tags: ["Python", "Render", "Detection"],
    links: [
      { label: "Live demo", href: "https://phishing-email-detection-s0sg.onrender.com" },
      { label: "GitHub", href: "https://github.com/CharmTzy/Phishing-Email-Detection" },
    ],
  },
  {
    date: "2025-07-31",
    category: "Workflow",
    title: "Internal tools can be just as interesting as public products",
    content:
      "Projects like Yang Bum Safety remind me that well-structured upload flows, validations, and document systems are real product work too.",
    mood: "thoughtful",
    tags: ["Express", "Workflow", "Files"],
    links: [{ label: "Repository", href: "https://github.com/CharmTzy/Yang-Bum-Safety" }],
  },
  {
    date: "2024-04-29",
    category: "Build",
    title: "Server-rendered projects still teach a lot",
    content:
      "The Flask hotel booking build helped me think through routing, forms, login flows, and how application structure holds together beyond just frontend visuals.",
    mood: "reflecting",
    tags: ["Flask", "MySQL", "System design"],
    links: [{ label: "Repository", href: "https://github.com/CharmTzy/hotel_system_flask" }],
  },
];
