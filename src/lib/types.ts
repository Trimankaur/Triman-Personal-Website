export interface Learning {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  link?: string;
  created_at: string;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  category?: string;
  personal_note?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github_link?: string;
  live_link?: string;
  screenshots?: string[];
  lessons?: string;
  created_at: string;
}

export interface Curiosity {
  id: string;
  topic: string;
  description?: string;
  created_at: string;
}

export type Category =
  | "AI/ML"
  | "Data Engineering"
  | "Projects"
  | "Thoughts"
  | "Design"
  | "Resources";
