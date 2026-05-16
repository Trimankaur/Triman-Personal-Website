import { Learning, Quote, Project, Curiosity } from "./types";

export const sampleLearnings: Learning[] = [
  {
    id: "1",
    title: "Understanding RAG Pipelines",
    content:
      "Spent the evening diving into Retrieval-Augmented Generation. The idea of grounding LLM responses in actual documents feels like the bridge between hallucination and reliability. Still wrapping my head around chunking strategies.",
    category: "AI/ML",
    tags: ["RAG", "LLM", "retrieval"],
    link: "https://arxiv.org/abs/2005.11401",
    created_at: "2026-05-14T22:00:00Z",
  },
  {
    id: "2",
    title: "Framer Motion Page Transitions",
    content:
      "Finally got smooth page transitions working. The key was wrapping layouts with AnimatePresence and using layout animations. Small detail, big impact on how the site feels.",
    category: "Design",
    tags: ["animation", "framer-motion", "UX"],
    created_at: "2026-05-12T18:30:00Z",
  },
  {
    id: "3",
    title: "Why Vector Databases Matter",
    content:
      "Traditional databases search by exact match. Vector databases search by meaning. This changes everything for semantic search, recommendations, and AI memory systems.",
    category: "Data Engineering",
    tags: ["vectors", "embeddings", "databases"],
    created_at: "2026-05-10T20:15:00Z",
  },
  {
    id: "4",
    title: "The Art of Learning in Public",
    content:
      "Reading about learning in public and how sharing your process — not just your results — builds trust and community. It's vulnerable but powerful. You don't need to be an expert to teach.",
    category: "Thoughts",
    tags: ["learning", "community", "growth"],
    created_at: "2026-05-08T23:00:00Z",
  },
  {
    id: "5",
    title: "Building a Pomodoro Timer with React",
    content:
      "Built a minimal pomodoro timer. Learned about useRef for intervals, the importance of cleanup functions, and how satisfying it is to hear a gentle chime after 25 minutes of focus.",
    category: "Projects",
    tags: ["react", "productivity", "hooks"],
    created_at: "2026-05-06T16:45:00Z",
  },
  {
    id: "6",
    title: "Prompt Engineering Patterns",
    content:
      "Collected a few reliable prompt patterns: chain-of-thought, few-shot examples, role assignment. The meta-skill of AI isn't coding — it's communicating clearly with machines.",
    category: "AI/ML",
    tags: ["prompts", "LLM", "patterns"],
    created_at: "2026-05-04T21:00:00Z",
  },
];

export const sampleQuotes: Quote[] = [
  {
    id: "1",
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Growth",
    personal_note: "Reminds me that starting late is still starting.",
    created_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "2",
    quote: "We do not learn from experience. We learn from reflecting on experience.",
    author: "John Dewey",
    category: "Learning",
    personal_note: "This is why I journal. The reflection is where the learning lives.",
    created_at: "2026-04-28T14:00:00Z",
  },
  {
    id: "3",
    quote: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    category: "Curiosity",
    created_at: "2026-04-25T09:00:00Z",
  },
  {
    id: "4",
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Purpose",
    created_at: "2026-04-20T11:00:00Z",
  },
  {
    id: "5",
    quote: "I have no special talents. I am only passionately curious.",
    author: "Albert Einstein",
    category: "Curiosity",
    personal_note: "Curiosity over credentials. Always.",
    created_at: "2026-04-15T08:00:00Z",
  },
  {
    id: "6",
    quote: "What I cannot create, I do not understand.",
    author: "Richard Feynman",
    category: "Learning",
    personal_note: "Building is understanding. That's why I code what I learn.",
    created_at: "2026-04-10T19:00:00Z",
  },
];

export const sampleProjects: Project[] = [
  {
    id: "1",
    title: "Learning Journal",
    description:
      "This very website — a cozy digital space to document my learning journey. Built with Next.js, Tailwind, and Supabase. The goal was to create something that feels personal and alive, not corporate.",
    stack: ["Next.js", "Tailwind CSS", "Supabase", "Framer Motion"],
    github_link: "https://github.com/triman/learning-journal",
    live_link: "https://triman-journal.vercel.app",
    lessons:
      "Learned that design is about feeling, not just aesthetics. Every color choice, every animation speed, every spacing decision communicates something.",
    created_at: "2026-05-01T00:00:00Z",
  },
  {
    id: "2",
    title: "RAG Document Assistant",
    description:
      "A simple retrieval-augmented generation system that lets you chat with your own documents. Uses embeddings to find relevant chunks and feeds them to an LLM for grounded answers.",
    stack: ["Python", "LangChain", "ChromaDB", "OpenAI API"],
    github_link: "https://github.com/triman/rag-assistant",
    lessons:
      "Chunking strategy matters more than model choice. Garbage in, garbage out — even with GPT-4.",
    created_at: "2026-04-15T00:00:00Z",
  },
];

export const sampleCuriosities: Curiosity[] = [
  {
    id: "1",
    topic: "Retrieval Systems",
    description: "How do you build search that understands meaning, not just keywords?",
    created_at: "2026-05-10T00:00:00Z",
  },
  {
    id: "2",
    topic: "Why Comforting Products Feel Memorable",
    description: "What makes certain digital experiences feel warm and human?",
    created_at: "2026-05-08T00:00:00Z",
  },
  {
    id: "3",
    topic: "RAG Pipelines",
    description: "The architecture of grounding AI in real documents.",
    created_at: "2026-05-06T00:00:00Z",
  },
  {
    id: "4",
    topic: "Beautiful UI Motion",
    description: "How subtle animation transforms a static page into a living space.",
    created_at: "2026-05-04T00:00:00Z",
  },
  {
    id: "5",
    topic: "Long-term Learning Systems",
    description: "Spaced repetition, active recall, and building knowledge that lasts.",
    created_at: "2026-05-02T00:00:00Z",
  },
];

// Deterministic seeded random to avoid hydration mismatches
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Sample titles for tooltip previews
const sampleTitles: Record<string, string[]> = {
  "AI/ML": [
    "Explored RAG pipeline architectures",
    "Read about attention mechanisms",
    "Watched: How embeddings work",
    "Built a mini classifier",
    "Prompt engineering patterns",
  ],
  "Data Engineering": [
    "Learned about data lakehouse",
    "Explored Apache Spark basics",
    "ETL pipeline design notes",
    "Vector database comparison",
    "Streaming vs batch processing",
  ],
  Projects: [
    "Built: Mini RAG experiment",
    "Shipped: Learning journal v2",
    "Prototyped: Study timer",
    "Refactored: Portfolio site",
    "Started: CLI tool project",
  ],
  Thoughts: [
    "Reflected on learning pace",
    "Why consistency beats intensity",
    "Notes on creative confidence",
    "Journaled about AI anxiety",
    "Thoughts on building in public",
  ],
  Design: [
    "Explored cozy UI patterns",
    "Color palette experiments",
    "Studied micro-interactions",
    "Typography pairing notes",
    "Sketched new layout ideas",
  ],
  Quotes: [
    "Saved a Feynman quote",
    "Found words that resonated",
    "Collected learning wisdom",
    "Bookmarked a reflection",
    "Added to quote collection",
  ],
};

// Static activity data for the heatmap (last 90 days from a fixed reference)
export const sampleActivityData: {
  date: string;
  category: string;
  count: number;
  title: string;
}[] = generateActivityData();

function generateActivityData() {
  const categories = [
    "AI/ML",
    "Data Engineering",
    "Projects",
    "Thoughts",
    "Design",
    "Quotes",
  ];
  const data: { date: string; category: string; count: number; title: string }[] = [];

  // Use a fixed reference date so output is deterministic
  const reference = new Date("2026-05-16T00:00:00Z");

  for (let i = 0; i < 90; i++) {
    const date = new Date(reference);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Seeded random based on day index
    const r1 = seededRandom(i * 13 + 7);
    const r2 = seededRandom(i * 17 + 3);
    const r3 = seededRandom(i * 23 + 11);
    const r4 = seededRandom(i * 31 + 5);

    const activityCount = r1 > 0.3 ? Math.floor(r2 * 3) + 1 : 0;
    if (activityCount > 0) {
      const category = categories[Math.floor(r3 * categories.length)];
      const titles = sampleTitles[category];
      const title = titles[Math.floor(r4 * titles.length)];
      data.push({ date: dateStr, category, count: activityCount, title });
    }
  }

  return data;
}
