import { personalInfo } from "./portfolio";

export const siteRoutes = {
  home: "/",
  homeContact: "/#contact",
  homeProjects: "/#projects",
};

export const siteMetadata = {
  title: `${personalInfo.name} — ${personalInfo.role}`,
  description: `Portfolio of ${personalInfo.name}, a ${personalInfo.location}-based ${personalInfo.role.toLowerCase()} building modern interfaces, practical software, and GitHub-backed projects.`,
};

export const navigationContent = {
  items: [
    { label: "Skills", sectionId: "skills", href: "/#skills" },
    { label: "Experience", sectionId: "experience", href: "/#experience" },
    { label: "Projects", sectionId: "projects", href: siteRoutes.homeProjects },
    { label: "Contact", sectionId: "contact", href: siteRoutes.homeContact },
  ],
  ctaHref: "#contact",
  ctaLabel: "Hire Me",
  themeToggleLabel: "Toggle theme",
  openMenuLabel: "Open menu",
  closeMenuLabel: "Close menu",
};

export const heroContent = {
  primaryAction: {
    label: "View My Work",
    href: "#projects",
  },
  secondaryAction: {
    label: "Get in Touch →",
    href: "#contact",
  },
  stats: {
    yearsBuildingValue: "2+",
    yearsBuildingLabel: "Years Building",
    publicReposLabel: "Public Repos",
    projectsBuiltLabel: "Projects Built",
  },
};

export const homePageContent = {
  skillsSection: {
    label: "Expertise",
    title: "Skills & Technologies",
    subtitle:
      "A curated stack of tools and technologies I use to design, build, deploy, and improve modern digital products.",
  },
  experienceSection: {
    label: "Academic & Work",
    title: "Experience",
  },
  projectsSection: {
    label: "Projects",
    title: "Projects",
    subtitle:
      "A focused set of projects that best represent my full-stack delivery, practical AI work, and product-level UI polish.",
  },
  contactSection: {
    label: "Let's Connect",
    title: "Get In Touch",
    intro:
      "Whether it's a client project, a full-time opportunity, or a collaboration, if you need someone who thinks carefully about both design and engineering, reach out and let's talk.",
  },
};

export const projectsContent = {
  card: {
    badge: "Case study",
    primaryActionLabel: "Read case study →",
    caseStudyLinkLabel: "Case study",
    githubLinkLabel: "GitHub",
    videoLinkLabel: "Watch demo",
    liveFallbackLabel: "Live",
  },
  detail: {
    notFoundTitle: "Project Not Found",
    backLinkLabel: "← Back to projects",
    infoCards: {
      status: "Status",
      role: "Role",
      timeline: "Timeline",
      primaryStack: "Primary stack",
    },
    actions: {
      livePrefix: "Visit",
      githubLabel: "View GitHub →",
      videoLabel: "Watch Demo →",
      liveFallbackLabel: "Live",
    },
    meta: {
      updatedPrefix: "Updated",
    },
    overview: {
      label: "Overview",
      title: "What this project is about",
    },
    approach: {
      label: "Approach",
      title: "How I built it",
    },
    outcome: {
      label: "Outcome",
      title: "Why it matters",
    },
    highlights: {
      label: "Highlights",
      title: "What stands out",
    },
    learnings: {
      label: "Learnings",
      title: "What I learned",
    },
  },
};

export const contactFormContent = {
  headline: "Let's build something great",
  subjectPrefix: "Portfolio inquiry from",
  anonymousName: "a visitor",
  successResetDelayMs: 3000,
  apiEndpoint: "/api/contact",
  bodyLabels: {
    name: "Name",
    email: "Email",
    message: "Message",
  },
  labels: {
    name: "NAME",
    email: "EMAIL",
    message: "MESSAGE",
    emailVerificationCode: "EMAIL CODE",
  },
  placeholders: {
    name: "Your name",
    email: "your@email.com",
    message: "Tell me about your project or opportunity...",
    emailVerificationCode: "6-digit code",
  },
  buttons: {
    submit: "Send Message →",
    submitVerified: "Send Verified Message →",
    sending: "Sending...",
    success: "✓ Message Sent!",
    sendVerification: "Send Code",
    resendVerification: "Resend Code",
    sendingVerification: "Sending...",
  },
  messages: {
    emailCodeHelp: "Enter your email, request a verification code, then submit your message.",
    emailCodeRequirements: "Enter your email address before requesting a code.",
    emailCodeSent: "Code sent to",
    success: "Thanks, your message was sent successfully.",
    fallbackError: "Something went wrong. Please try again in a moment.",
  },
};

export const coffeeButtonContent = {
  ariaLabel: "Buy me a coffee",
  title: "Buy me a coffee",
  imageAlt: "Buy me a coffee",
};
