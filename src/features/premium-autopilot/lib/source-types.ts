export type SourceType =
  | "Idea Pin"
  | "Standard Pin"
  | "Board"
  | "Search"
  | "Profile"
  | "Checklist"
  /** @deprecated Legacy mixed-traffic catalog (unused by NullPing Pinterest playbook) */
  | "Forum"
  | "Social"
  | "Directory"
  | "Blog"
  | "Q&A"
  | "Classified"
  | "Video";

export type Difficulty = "Easy" | "Medium";

export interface TrafficSource {
  id: string;
  name: string;
  niche: string;
  type: SourceType;
  difficulty: Difficulty;
  traffic: string;
  time: string;
  url: string;
  description: string;
  instructions: readonly string[];
}
