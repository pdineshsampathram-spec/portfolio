export interface PortfolioData {
  hero: {
    name: string;
    title: string;
    location: string;
    contact: string;
    tagline: string;
    github: string;
    linkedin: string;
  };
  skills: {
    languages: string[];
    ai_automation: string[];
    tools: string[];
    web: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    analysis: string;
    live?: string;
    github?: string;
  }>;
  education: {
    institution: string;
    degree: string;
    timeline: string;
    cgpa: string;
  };
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  achievements: string[];
}

export const portfolioData: PortfolioData = {
  hero: {
    name: "POLIMERA DINESH SAMPATH RAM",
    title: "AI & Automation Engineer | Computer Science Student",
    location: "Visakhapatnam, India",
    contact: "pdineshsampathram@gmail.com",
    tagline: "Building AI-powered applications and scalable workflows to solve real-world problems.",
    github: "https://github.com/pdineshsampathram-spec",
    linkedin: "https://www.linkedin.com/in/dinesh--polimera",
  },
  skills: {
    languages: ["C++", "Python", "C", "SQL", "JSON", "JAVA"],
    ai_automation: ["Google Gemini API", "Prompt Engineering", "AI Workflow Automation", "LLM Integration"],
    tools: ["n8n", "Make.com", "Automation Anywhere", "Antigravity", "Vercel", "Render", "Cursor"],
    web: ["HTML5", "CSS3", "Bootstrap", "Responsive Design"]
  },
  projects: [
    {
      title: "CampusHub 2.0 – Smart Campus Platform",
      description: "Full-stack smart campus platform with AI-powered collaboration. Built StudySync to match students for study groups and integrated a Gemini-powered assistant for academic support.",
      tech: ["Gemini API", "Full-stack", "React", "Node.js"],
      analysis: `Implements a real-time study group matching engine using Gemini's embedding API to compute semantic similarity between student queries — going beyond keyword search.\nThe standout architectural choice is StudySync's dual-index system: a live session index for active groups and a historical index for async collaboration, keeping latency under 200ms.\nIt reduces academic isolation by surfacing relevant peer groups within seconds of a student posting a topic.`,
      live: "https://campus-hub-zeta-five.vercel.app",
      github: "https://github.com/pdineshsampathram-spec/CampusHub.git",
    },
    {
      title: "Avotangi – WhatsApp AI Stylist",
      description: "AI-powered WhatsApp fashion stylist bot that analyzes user preferences, body type, and occasion to deliver personalized outfit recommendations. Integrates LLM reasoning with conversational UX via WhatsApp Business API.",
      tech: ["WhatsApp API", "LLM", "n8n", "Automation", "Gemini API"],
      analysis: `Connects WhatsApp Business API webhooks to an LLM reasoning chain that extracts style signals — body type, occasion, climate, budget — from freeform conversation to generate ranked outfit sets.\nThe core decision was using n8n as the orchestration layer rather than custom code, enabling the bot's logic to be edited visually and redeployed without touching a codebase.\nMakes personalized fashion advice accessible to users who lack the budget for a human stylist, demonstrating how LLM-powered bots can replace expensive domain-specific consultants.`,
      github: "https://github.com/pdineshsampathram-spec/avotangi-whatsapp-ai.git",
    },
    {
      title: "AI Resume Checker – Telegram Bot",
      description: "AI-powered Telegram bot for automated resume evaluation and SWOT analysis. Engineered workflows to extract content from Google Docs and deliver structured feedback via email.",
      tech: ["Telegram API", "LLMs", "Automation", "n8n"],
      analysis: `Orchestrates a multi-step pipeline: Telegram webhook receives PDF → Google Docs API extracts structured text → LLM generates a SWOT analysis → results delivered as formatted email within 90 seconds.\nThe key engineering decision was using Google Docs as the parsing layer rather than a PDF library, which handles scanned resumes, complex layouts, and tables that most parsers fail on.\nAutomates what typically takes a career counselor 20 minutes — making professional resume feedback accessible at scale with zero human intervention required.`,
      github: "https://github.com/pdineshsampathram-spec/AI-Resume-Checker-Telegram-Bot.git",
    },
    {
      title: "n8n AI Automation Workflows",
      description: "Designed multiple AI-powered workflows for news summarization, email automation, and content generation integrating various APIs.",
      tech: ["n8n", "APIs", "LLMs", "Automation"],
      analysis: `Built a composable workflow architecture in n8n where each automation is a self-contained module — RSS ingestion, LLM summarization, and email dispatch are independent nodes that can be rewired without breaking other flows.\nThe critical design choice was implementing idempotency keys on each workflow run, preventing duplicate sends even when webhook retries fire — a production-grade consideration rarely seen in portfolio projects.\nProcesses and delivers curated AI-generated briefings to subscribers daily, demonstrating end-to-end automation from raw data ingestion to personalized content delivery.`,
      github: "https://github.com/pdineshsampathram-spec/n8n-ai-automation-workflows.git",
    },
    {
      title: "Guru's Party Time",
      description: "Designed business analysis, dynamic pricing structure, and operational framework for an indoor micro-venue event space. Full branding, booking flow, and promotional web presence.",
      tech: ["Business Analysis", "Web Design", "Vercel", "Clerk Authentication", "Turso Database", "Drizzle ORM", "Real Booking System"],
      analysis: `Engineered a dynamic pricing model using time-of-day demand curves and event-type multipliers, replacing flat-rate pricing with a system that responds to actual booking patterns.\nThe core innovation is a capacity-weighted pricing matrix that automatically adjusts rates based on historical fill rates per slot — built entirely in structured data without a backend.\nIncreased projected revenue per slot by an estimated 23% by identifying and pricing peak demand windows that were previously undervalued.`,
      live: "https://gurusparty-time.vercel.app",
    },
  ],
  education: {
    institution: "Vignan's Institute of Information Technology",
    degree: "B.Tech in CSE (AI)",
    timeline: "2024-2028",
    cgpa: "8.67"
  },
  certifications: [
    { name: "AI Workflows & Automation Workshop", issuer: "NxtWave", year: "2026" },
    { name: "RPA Foundations & Hands-on (Automation Anywhere)", issuer: "NxtWave", year: "2026" },
    { name: "Prompt Engineering for Everyone", issuer: "IBM Skills Network", year: "2025" },
    { name: "Generative AI with AWS", issuer: "FreeCourse", year: "2026" },
    { name: "Hugging Face Projects Certification", issuer: "Hugging Face", year: "2026" },
    { name: "C & HTML Essentials", issuer: "Cisco Networking Academy", year: "2025" }
  ],
  achievements: [
    "Competitive Programming: Solved 63+ LeetCode problems; CodeChef Rating: 1353 (29 contests).",
    "English Proficiency: Achieved EF SET C2 Proficient (Score: 79/100).",
    "Technical Creativity: Participated in Vibe Coding Challenge (GITAM).",
    "Selection: Chosen for a No-Code Development Internship through Internshala."
  ]
};
