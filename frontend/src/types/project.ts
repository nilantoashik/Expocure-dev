export interface Skill {
  id: number;
  name: string;
  slug: string;
  category: string | null;
}

export interface ProjectImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  goals: string | null;
  developmentProcess: string | null;
  challenges: string | null;
  outcomes: string | null;
  projectUrl: string | null;
  repoUrl: string | null;
  thumbnailUrl: string | null;
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  techStack?: Skill[];
  images?: ProjectImage[];
}
