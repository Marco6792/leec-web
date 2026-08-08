export type SearchType =
  | "publication"
  | "project"
  | "news"
  | "event"
  | "person"
  | "equipment"
  | "training"
  | "page"
  | "research"
  | "partner";

export interface SearchDocument {
  id: string;
  type: SearchType;
  title: string;
  description: string;
  href: string;
  category?: string;
  tags?: string[];
  date?: string;
}
