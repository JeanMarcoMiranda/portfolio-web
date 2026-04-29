export interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  isSeries?: boolean;
  parts?: { id: string; title: string; file: string }[];
  file?: string;
}
